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
  const UserApp = app.getModel('userApp');

  //创建新的购物车
  amqp.on('order.newCart', function* (msg) {
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
  amqp.on('order.cart', function* (msg) {
    let id = msg.id;

    let cartID = yield amqp.call('order.newCart', {
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

  // 购物车中是否存在某商品
  amqp.on('order.hasProduct', function* (msg) {
    let id = msg.id;
    let productID = msg.productID;

    let cartID = yield amqp.call('order.newCart', {
      id
    });
    return yield Order.findById(cartID, {
      include: [{
        model: OrderItem,
        where: {
          status: 'on'
        }
      }]
    }).then((data) => {
      if (data == null) return false;
      for (let orderItem of data.orderItems) {
        if (orderItem.appID == productID) return true;
      }
      return false;
    });
  });

  //用户是否购买过某应用
  amqp.on('order.isBought', function* (msg) {
    let id = msg.id;
    let productID = msg.productID;

    return yield User.findById(id, {
      include: [{
        model: UserApp,
        include: [{
          model: Application
        }]
      }]
    }).then((user) => {
      for (let userApp of user.userApps) {
        if (userApp.app.id == productID) {
          return true;
        }
      }
      return false;
    })
  });

  //添加多个购物车内容
  amqp.on('order.addCart', function* (msg) {
    let id = msg.id;
    let product = msg.product; //{type:'app',id:id}
    let cartID = yield amqp.call('order.newCart', {
      id
    });
    switch (product.type) {
    case 'app':
      let hasProduct = yield amqp.call('order.hasProduct', {
        id,
        productID: product.id
      });
      let isBought = yield amqp.call('order.isBought', {
        id,
        productID: product.id
      });
      if (!isBought) {
        if (!hasProduct) {
          let item = yield Application.findById(product.id);
          let orderItem = yield OrderItem.create({
            type: product.type,
            status: 'on'
          });
          yield orderItem.setOrder(yield Order.findById(cartID));
          yield orderItem.setApp(item);
          return true;
        } else {
          return {
            code: 4004,
            msg: "购物车中已经存在的商品！"
          };
        }
      } else {
        return {
          code: 4005,
          msg: "已经购买过了！"
        }
      }

      break;
    }
    //其他类型的商店内容类型
    return false;
  });

  // 删除多个购物车内容
  amqp.on('order.delCart', function* (msg) {
    let id = msg.id;
    let orderItem = msg.product;

    let item = yield OrderItem.upsert({
      id: orderItem.id,
      type: orderItem.type,
      status: 'off'
    });
    return true;
  });
}
