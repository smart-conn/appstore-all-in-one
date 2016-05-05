'use strict';
const _ = require('lodash');

module.exports = function (app) {
  const amqp = app.getContext('amqp');

  const User = app.getModel('user');
  const Application = app.getModel('app');
  const UserDevice = app.getModel('userDevice');
  const DeviceModel = app.getModel('deviceModel');
  const LatestVersion = app.getModel('latestVersion');
  const ApplicationPackage = app.getModel('appPackage');
  const ApplicationPackageStatus = app.getModel("appPackageStatus");
  const Order = app.getModel('order');
  const OrderItem = app.getModel('orderItem');

  //创建新的购物车
  amqp.on('appStore.newCart', function* (msg) {
    let id = msg.id;

    let cart = yield User.findById(id, {
      include: [{
        model: Order,
        where: {
          status: 'open'
        },
        limit: 1
      }]
    });

    if (_.size(cart.orders) == 0) {
      let order = yield Order.create({
        status: 'open'
      });
      yield order.setUser(yield User.findById(id));
      return order.id;
    } else {
      return _.head(cart.orders).id;
    }
  });

  //获取所有的购物车内容
  amqp.on('appStore.cart', function* (msg) {
    let id = msg.id;

    let cartID = yield amqp.call('appStore.newCart', {
      id
    });

    return yield Order.findById(cartID, {
      include: [{
        model: OrderItem,
        where: {
          status: 'on'
        },
        include: [{
          model: Application
        }]
      }]
    });
  });

  //添加多个购物车内容
  amqp.on('appStore.addCart', function* (msg) {
    let id = msg.id;
    let products = msg.products; //[{type:'app',id:id}]
    let cartID = yield amqp.call('appStore.newCart', {
      id
    });
    let retMsg = [];
    for (let product of products) {
      switch (product.type) {
      case 'app':
        let item = yield Application.findById(product.id);
        let orderItem = yield OrderItem.create({
          type: product.type,
          status: 'on'
        });
        orderItem.setOrder(yield Order.findById(cartID));
        orderItem.setApp(item);
        retMsg.push(orderItem);
        break;
      }
      //其他类型的商店内容类型
    }
    return retMsg;
  });

  // 删除多个购物车内容
  amqp.on('appStore.delCart', function* (msg) {
    let id = msg.id;
    let orderItems = msg.products;
    console.log(orderItems);
    let retMsg = [];
    for (let orderItem of orderItems) {
      let item = OrderItem.upsert({
        id: orderItem.id,
        type: orderItem.type,
        status: 'off'
      });
    }
    return retMsg;
  });

  // 处理订单状态为已购买
  amqp.on('appStore.buy', function* (msg) {
    let id = msg.id;
    let orderItems = msg.IDs;



  });

}
