## Create Simple, Secure, and Stylish Node Apps with Express

This project is connected with two blog posts from Auth0 where you learn how to create a simple yet stylish app using Node and Express and how to secure it using Passport.js and Auth0.

[Create a Simple and Stylish Node Express App](https://auth0.com/blog/create-a-simple-and-stylish-node-express-app/)

Learn how to build the foundation of a simple Node.js and Express app by creating a user interface and API.

[Create a Simple and Secure Node Express App](https://auth0.com/blog/create-a-simple-and-secure-node-express-app/)

Learn how to secure a simple Node.js and Express app by adding user authentication with Passport.js and Auth0.

If you want to start from here with the app already built, follow these steps:



Then implement the following in your JS app:

```js
const auth0 = new auth0.WebAuth({
  clientID: "YOUR-AUTH0-CLIENT-ID", // E.g., you.auth0.com
  domain: "YOUR-AUTH0-DOMAIN",
  scope: "openid email profile YOUR-ADDITIONAL-SCOPES",
  audience: "YOUR-API-AUDIENCES", // See https://auth0.com/docs/api-auth
  responseType: "token id_token",
  redirectUri: "http://localhost:9000" //YOUR-REDIRECT-URL
});

function logout() {
  localStorage.removeItem("id_token");
  localStorage.removeItem("access_token");
  window.location.href = "/";
}

function showProfileInfo(profile) {
  var btnLogin = document.getElementById("btn-login");
  var btnLogout = document.getElementById("btn-logout");
  var avatar = document.getElementById("avatar");
  document.getElementById("nickname").textContent = profile.nickname;
  btnLogin.style.display = "none";
  avatar.src = profile.picture;
  avatar.style.display = "block";
  btnLogout.style.display = "block";
}

function retrieveProfile() {
  var idToken = localStorage.getItem("id_token");
  if (idToken) {
    try {
      const profile = jwt_decode(idToken);
      showProfileInfo(profile);
    } catch (err) {
      alert("There was an error getting the profile: " + err.message);
    }
  }
}

auth0.parseHash(window.location.hash, (err, result) => {
  if (err || !result) {
    // Handle error
    return;
  }

  // You can use the ID token to get user information in the frontend.
  localStorage.setItem("id_token", result.idToken);
  // You can use this token to interact with server-side APIs.
  localStorage.setItem("access_token", result.accessToken);
  retrieveProfile();
});

function afterLoad() {
  // buttons
  var btnLogin = document.getElementById("btn-login");
  var btnLogout = document.getElementById("btn-logout");

  btnLogin.addEventListener("click", function() {
    auth0.authorize();
  });

  btnLogout.addEventListener("click", function() {
    logout();
  });

  retrieveProfile();
}

window.addEventListener("load", afterLoad);
```

