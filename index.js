// index.js

/**
 * Required External Modules
 */


const express = require("express");
const path = require("path");

const expressSession = require("express-session");
const passport = require("passport");
const refresh = require('passport-oauth2-refresh');
const Auth0Strategy = require("passport-auth0");
const cors = require('cors');
require("dotenv").config();
const authRouter = require("./auth");
/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "8000";

/**
 * Session Configuration
 */
const session = {
  secret: "LoxodontaElephasMammuthusPalaeoloxodonPrimelephas",
  cookie: {},
  resave: false,
  saveUninitialized: false
};

if (app.get("env") === "production") {
  // Serve secure cookies, requires HTTPS
  session.cookie.secure = true;
}
if (app.get("env") === "production") {
  // Serve secure cookies, requires HTTPS
  session.cookie.secure = true;
}
/**
 * Passport Configuration
 */
const strategy = new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL:
          process.env.AUTH0_CALLBACK_URL || "http://localhost:8000/callback"
    },
    function(accessToken, refreshToken,extraParams, profile, done) {
        process.env.EXPIRES_IN = extraParams.expires_in * 1000 + new Date().getTime();
        process.env.ACCESS_TOKEN = accessToken;
        process.env.REFRESH_TOKEN = refreshToken;
        console.log('user details' , profile);
        console.log('access token' , process.env.ACCESS_TOKEN);
         console.log('refresh token',process.env.REFRESH_TOKEN);
        console.log(' expire in' , process.env.EXPIRES_IN);
      return done(null, profile);
    }
);


/**
 *  App Configuration
 */
app.use(cors());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use(expressSession(session));
passport.use(strategy);
refresh.use(strategy);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
// Router mounting
app.use("/", authRouter);

// Creating custom middleware with Express
app.use((req, res, next) => {
   res.locals.isAuthenticated = req.isAuthenticated();
     // res.locals.isAuthenticated = new Date().getTime() <  process.env.EXPIRES_IN
    next();
});


/**
 * Routes Definitions
 */

const secured = (req, res, next) => {
    if (req.user) {
        return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
}

const renew = (req, res, next) => {
    console.log('current time', new Date().getTime());
    console.log('till time' , (process.env.EXPIRES_IN - new Date().getTime()) / (1000 * 60 * 60 ).toFixed(1));

    if (new Date().getTime() < process.env.EXPIRES_IN) {
        return next();
    }
     req.session.returnTo = req.originalUrl;
     res.redirect("/renew")
}

app.get("/",  (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/user", secured,renew, (req, res, next) => {
  const { _raw, _json, ...userProfile } = req.user;
    if (_json['https://localhost:8000/roles'].includes('user')) {
        res.render("user", {
            title: "Profile",
            userProfile: userProfile,
            role: 'has user role'
        });
    }else {
        res.render("user", {
            title: "Profile",
            userProfile: userProfile,
            role: 'has admin role'
        });
    }
});




/**
 * Server Activation
 */

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});




// var GoogleStrategy = require('passport-google-oauth20').Strategy;
//
// passport.use(new GoogleStrategy({
//         clientID: GOOGLE_CLIENT_ID,
//         clientSecret: GOOGLE_CLIENT_SECRET,
//         callbackURL: "http://www.example.com/auth/google/callback"
//     },
//     function(accessToken, refreshToken, profile, cb) {
//         User.findOrCreate({ googleId: profile.id }, function (err, user) {
//             return cb(err, user);
//         });
//     }
// ));
// app.get('/auth/google',
//     passport.authenticate('google', { scope: ['profile'] }));
//
// app.get('/auth/google/callback',
//     passport.authenticate('google', { failureRedirect: '/login' }),
//     function(req, res) {
//         // Successful authentication, redirect home.
//         res.redirect('/');
//     });


// var corsOptions = {
//     origin: "http://localhost:8081"
// };
//
// app.use(cors(corsOptions));


// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const mongoose = require('mongoose');
// const keys = require('./config/keys');
// const User = require("your_user_model_file_path");

// passport.use(
//     new GoogleStrategy({
//         clientID: keys.google.clientID,
//         clientSecret: keys.google.clientSecret,
//         callbackURL: '/auth/google/redirect'
//     }, (accessToken, refreshToken, profile, done) => {
//         // passport callback function
//         //check if user already exists in our db with the given profile ID
//         User.findOne({googleId: profile.id}).then((currentUser)=>{
//             if(currentUser){
//                 //if we already have a record with the given profile ID
//                 done(null, currentUser);
//             } else{
//                 //if not, create a new user
//                 new User({
//                     googleId: profile.id,
//                 }).save().then((newUser) =>{
//                     done(null, newUser);
//                 });
//             }
//         })
//     })
// );
// passport.deserializeUser((id, done) => {
//     User.findById(id).then(user => {
//         done(null, user);
//     });
// });
// app.use(cookieSession({
//     // milliseconds of a day
//     maxAge: 24*60*60*1000,
//     keys:[keys.session.cookieKey]
// }));
//
// app.use(passport.initialize());
// app.use(passport.session());
