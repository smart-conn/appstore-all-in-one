'use strict';
const router = require('koa-router')();

router.post('/login/:type', function* () {
  const amqp = this.app.context.amqp;
  let name = this.request.body.name;
  let type = this.params.type;
  let developer = yield amqp.call('user.login', {
    name: name,
    type: type
  });
  this.body = {
    code: developer ? 200 : 500
  };
  this.session.name = developer ? developer.name : null;
  this.session.type = developer ? type : null;
  this.session.id = developer ? developer.id : null;
});

router.get('/logout', function* () {
  this.session = null;
  this.body = {
    code: 200
  };
});

//当前用户是否登录
router.get('/islogin/:type', function* () {
  this.body = this.session.type == this.params.type ? {
    code: 200
  } : {
    code: 500
  }
})
module.exports = router.routes();
