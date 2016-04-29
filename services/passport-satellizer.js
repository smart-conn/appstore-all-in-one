module.exports = function (app) {

  // const jwt = require('jsonwebtoken');
  // const nconf = require('nconf');
  //
  // const router = require('koa-router')();
  // const amqp = app.getContext('amqp');
  // const passport = app.getContext('passport');
  // const koa = app.getContext('koa');
  // const User = app.getModel('user');
  //
  // const secret = nconf.get('secret');
  //
  // koa.use(router.routes());
  //
  // // token may issue by another service (third party login)
  // // function* serialize(next) {
  // //   const user = yield User.upsert(this.req.user);
  // //   this.req.user = {id: user.id};
  // //   yield next;
  // // }
  //
  // function* generateToken(next) {
  //   const user = this.req.user;
  //   this.req.token = jwt.sign({
  //     scope: 'consumer,developer' // TODO: for real
  //   }, secret, {
  //     subject: user.id
  //   });
  //   yield next;
  // }
  //
  // function* respond() {
  //   this.body = {
  //     user: this.req.user,
  //     token: this.req.token
  //   };
  // }
  //
  // router.post('/auth/login', passport.authenticate('local', {session: false}), generateToken, respond);
  // router.post('/auth/signup', function* (next) {
  //   const username = this.request.body.username;
  //   const password = this.request.body.password;
  //   yield new Promise(function (resolve, reject) {
  //     User.register(username, password, function (err) {
  //       if (err) return reject();
  //       resolve();
  //     });
  //   });
  //   this.body = {
  //     msg: 'ok'
  //   };
  // });
  //
  // router.get('/api/test', app.loginCheck(), function* () {
  //   this.body = {
  //     msg: 'ok'
  //   };
  // });

};
