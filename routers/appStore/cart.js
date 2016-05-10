"use strict";
const router = require('koa-router')();

module.exports = (application) => {
  let amqp = application.getContext('amqp');

  //添加购物车内的内容
  router.post('/appStore/addCart', application.authCheck('user'), function* () {
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
  router.post('/appStore/delCart', application.authCheck('user'), function* () {
    let id = this.req.user.sub;
    let body = this.request.body;
    this.body = yield amqp.call('order.delCart', {
      id: id,
      product: {
        type: body.type,
        id: body.id
      }
    });
  });

  //获取购物车的内容
  router.get('/appStore/cart', application.authCheck('user'), function* () {
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
  router.get('/appStore/deal', application.authCheck('user'), function* () {
    let id = this.req.user.sub;

    this.body = yield amqp.call('settlement.deal', {
      id
    });
  });

  // 已经购买过的
  router.get('/appStore/bought', application.authCheck('user'), function* () {
    let id = this.req.user.sub;
    // yield amqp.call('appStore.isBought', {
    //   id
    // });
    this.body = yield amqp.call('order.bought', {
      id
    });
  });

  router.post('/appStore/fastBuy', application.authCheck('user'), function* () {
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
