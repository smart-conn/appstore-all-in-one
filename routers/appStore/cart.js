"use strict";
const router = require('koa-router')();

module.exports = (application) => {
  let amqp = application.getContext('amqp');

  //添加购物车内的内容
  router.post('/appStore/carts', application.authCheck('user'), function*() {
    let id = this.req.user.sub;
    let body = this.request.body;

    this.body = yield amqp.call('order.addCart', {
      id: id,
      product: {
        type: body.type,
        id: body.id
      }
    });
  });

  //删除购物车内的内容
  router.delete('/appStore/carts/:id/:type', application.authCheck('user'), function*() {
    let id = this.req.user.sub;
    let productId = this.params.id;
    let type = this.params.type;
    let msg = yield amqp.call('order.delCart', {
      id: id,
      product: {
        type: productId,
        id: type
      }
    });
    console.log(msg);
    this.body = { code: 200, msg: msg };
  });

  //获取购物车的内容
  router.get('/appStore/carts', application.authCheck('user'), function*() {
    let id = this.req.user.sub;

    let cart = yield amqp.call('order.cart', {
      id
    });

    this.body = cart == null ? {
      code: 6001,
      msg: '购物车为空'
    } : cart;
  });

  // 购买
  router.get('/appStore/deal', application.authCheck('user'), function*() {
    let id = this.req.user.sub;

    this.body = yield amqp.call('settlement.deal', {
      id
    });
  });

  // 已经购买过的
  router.get('/appStore/bought', application.authCheck('user'), function*() {
    let id = this.req.user.sub;

    this.body = yield amqp.call('order.bought', {
      id
    });
  });

  router.post('/appStore/fastOrder', application.authCheck('user'), function*() {
    let id = this.req.user.sub;
    let body = this.request.body;

    this.body = yield amqp.call('settlement.fastOrder', {
      id: id,
      productID: body.id,
      type: body.type
    });
  });

  application.app.use(router.routes());
};
