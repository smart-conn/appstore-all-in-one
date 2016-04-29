"use strict";

const router = require('koa-router')();
const passport = require('../passport/passport');
const https = require('https');
const qs = require('querystring');
const thirdParty = require('../lib/thirdParty');
const jwt = require('jsonwebtoken');

router.post('/login', function* () {
  this.app.getContext("passport");
});
// router.post("/auth/:type", function* () {
//   let body = this.request.body;
//   let type = this.params.type;
//
//   this.body = {
//     token: jwt.sign(yield thirdParty(type,
//       body.clientId,
//       "c64449debfe67c086f279a43be222aa819c59421",
//       body.code, body.redirectUri,
//       this.app.context.amqp), 'tosone')
//   };
// });

router.get('/auth/github/callback', passport.authenticate('github', {
  failureRedirect: '/login'
}, function* (next) {
  console.log(next);
  // console.log(this);
  // yield next;
}), function* () {
  // console.log(this.app.context.passport);
  console.log(this.req.user);

  console.log(this.app.context.passport);
  this.body = {
    code: 200
  }
});

module.exports = router.routes();
