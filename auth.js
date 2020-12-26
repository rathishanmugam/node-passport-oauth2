// auth.js

/**
 * Required External Modules
 */
const express = require("express");
const router = express.Router();
const passport = require("passport");
const util = require("util");
const url = require("url");
const querystring = require("querystring");
const request = require("request")
const refresh = require('passport-oauth2-refresh');

require("dotenv").config();
/**
 * Routes Definitions
 */

router.get("/login", passport.authenticate("auth0", {
        scope: "openid offline_access email profile"
    }),
    (req, res) => {
        res.redirect("/");
    }
);

router.get("/renew", (req, res, next) => {
        refresh.requestNewAccessToken('auth0', process.env.REFRESH_TOKEN,function (err, accessToken, refreshToken,extraParams) {
            console.log('access token', accessToken);
            console.log('refresh token', refreshToken);
            process.env.ACCESS_TOKEN = accessToken;
            process.env.REFRESH_TOKEN = refreshToken;
            process.env.EXPIRES_IN = extraParams.expires_in * 1000 + new Date().getTime();

            if (err) {
                console.log('iam in error', err);
                next(err);
            }
             // res.redirect("/login");
        })
    }, (req, res, next) => {
        res.redirect("/");
    }
);


router.get("/callback", (req, res, next) => {
    passport.authenticate("auth0", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect("/login");
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            const returnTo = req.session.returnTo;
            delete req.session.returnTo;

            res.redirect(returnTo || "/");
        });
    })(req, res, next);
});


router.get("/logout", (req, res) => {
    req.logOut();

    let returnTo = req.protocol + "://" + req.hostname;
    const port = req.connection.localPort;

    if (port !== undefined && port !== 80 && port !== 443) {
        returnTo =
            process.env.NODE_ENV === "production"
                ? `${returnTo}/`
                : `${returnTo}:${port}/`;
    }

    const logoutURL = new URL(
        util.format("https://%s/logout", process.env.AUTH0_DOMAIN)
    );
    const searchString = querystring.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        returnTo: returnTo
    });
    logoutURL.search = searchString;

    res.redirect(logoutURL);
});


/**
 * Module Exports
 */
module.exports = router;


//google-oauth2|103789031743090654768
//"email": "rathiprethi@gmail.com","email_verified": true,
//


//auth0|5f504bd6e9ef5f0067b61c01  whatabyte@node.com
