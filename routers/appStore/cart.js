"use strict";
const router = require('koa-router')();

module.exports = (application) => {
  let amqp = application.getContext('amqp');

  //添加购物车内的内容
  router.post('/appStore/addCart', application.authCheck('user'), function* () {
    let id = this.req.user.sub;
    let body = this.request.body;

    this.body = yield amqp.call('appStore.addCart', {
      id: id,
      products: [{
        type: body.type,
        id: body.id
      }]
    });
  });

  //删除购物车内的内容
  router.post('/appStore/delCart', application.authCheck('user'), function* () {
    let id = this.req.user.sub;
    let body = this.request.body;
    this.body = amqp.call('appStore.delCart', {
      id: id,
      products: [{
        type: body.type,
        id: body.id
      }]
    });
  });

  //获取购物车的内容
  router.get('/appStore/cart', application.authCheck('user'), function* () {
    let id = this.req.user.sub;

    let cart = yield amqp.call('appStore.cart', {
      id
    });

    this.body = cart == null ? {
      code: 6001,
      msg: '购物车为空'
    } : cart;
  });

  application.app.use(router.routes());
};
