"use strict";
module.exports = (app) => {

  const jwt = require('jsonwebtoken');
  const nconf = require('nconf');
  // const thirdParty = require('../lib/thirdParty');

  const router = require('koa-router')();
  const amqp = app.getContext('amqp');
  const passport = app.getContext('passport');
  const koa = app.getContext('koa');
  const User = app.getModel('user');
  const UserAuth = app.getModel('userAuth');

  const clientSecret = nconf.get('clientSecret');
  const secret = nconf.get('secret');

  koa.use(router.routes());

  function* generateToken(next) {
    const user = this.req.user;
    const scope = yield User.findById(user.id, {
      include: [{
        model: UserAuth
      }]
    }).then((user) => {
      let scope = [];
      for (let auth of user.userAuths) {
        scope.push(auth.auth);
      }
      return scope.join(',');
    });
    this.req.token = jwt.sign({
      scope: scope
    }, secret, {
      subject: user.id
    });
    yield next;
  }

  function* respond() {
    this.body = {
      user: this.req.user,
      token: this.req.token
    };
  }

  router.post('/auth/login', passport.authenticate('local', {
    session: false
  }), generateToken, respond);

  router.post('/signup', function* (next) {
    const username = this.request.body.username;
    const password = this.request.body.password;
    yield new Promise(function (resolve, reject) {
      User.register(username, password, function (err) {
        if (err) return reject();
        resolve(true);
      });
    });
    this.body = {
      msg: 'ok'
    };
  });

  router.post("/auth/:type", function* () {
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

  router.get('/api/test', app.authCheck("developer"), function* () {
    this.body = {
      msg: 'ok'
    };
  });

}
