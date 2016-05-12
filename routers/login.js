"use strict";
const jwt = require('jsonwebtoken');
const nconf = require('nconf');
const router = require('koa-router')();

module.exports = (app) => {

  const amqp = app.getContext('amqp');
  const passport = app.getContext('passport');
  const koa = app.getContext('koa');
  const User = app.getModel('user');
  const UserAuth = app.getModel('userAuth');
  const clientSecret = nconf.get('clientSecret');
  const secret = nconf.get('secret');

  router.post('/auth/login', passport.authenticate('local', {
    session: false
  }), function*() {
    const user = this.req.user;

    let token = yield amqp.call('login.generateToken', {
      id: user.id
    });
    this.body = {
      user: user,
      token: token
    };
  });

  router.post('/signup', function*(next) {
    const username = this.request.body.username;
    const password = this.request.body.password;
    yield new Promise(function(resolve, reject) {
      User.register(username, password, function(err) {
        if (err) return reject();
        resolve(true);
      });
    });
    this.body = {
      msg: 'ok'
    };
  });

  router.post("/auth/:type", function*() {
    let body = this.request.body;
    let type = this.params.type;
    console.log(body);
    let user = yield amqp.call("thirdParty.userInfo", {
      secret: clientSecret,
      redirectUri: body.redirectUri,
      code: body.code,
      clientID: body.clientId,
      type: type
    });
    this.body = {
      user: user,
      token: jwt.sign({
        scope: 'user'
      }, secret, {
        subject: user.id
      })
    };
  });

  router.get('/api/test', app.authCheck("developer"), function*() {
    this.body = {
      msg: 'ok'
    };
  });

  app.app.use(router.routes());
}
