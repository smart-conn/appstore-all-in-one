'use strict'
const GitHubStrategy = require('passport-github2').Strategy;

module.exports = (passport) => {
  passport.use(new GitHubStrategy({
    clientID: "3d032602cc3318f720bf",
    clientSecret: "c64449debfe67c086f279a43be222aa819c59421",
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
  }, function (accessToken, refreshToken, profile, done) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
  }));
};
