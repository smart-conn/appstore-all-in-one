'use strict';
const _ = require('lodash');

module.exports = function (app) {
  const amqp = app.getContext('amqp');
  const Order = app.getModel('order');
  const Application = app.getModel('app');
  const OrderItem = app.getModel('orderItem');
  const ApplicationPackage = app.getModel('appPackage');
  const AppStoreLatestVersion = app.getModel('appStoreLatestVersion');
  const Purse = app.getModel('purse');
  const User = app.getModel('user');
  const UserApp = app.getModel('userApp');

  /**
   * 交易某个订单：
   * 查看订单的内容
   * 计算订单的总价
   * 获取用户账户的钱数，是否足够
   * 修改订单的状态
   * 分配钱到相应的开发者
   */
  amqp.on('settlement.deal', function* (msg) {
    let id = msg.id;
    // 获取用户当前的购物车
    let cartID = yield amqp.call('appStore.newCart', {
      id
    });
    let appIDs = [];
    //TODO：其他类型的商品
    let items = yield Order.findById(cartID, {
      include: [{
        model: OrderItem,
        include: [{
          model: Application,
          include: [{
            model: AppStoreLatestVersion,
            include: [{
              model: ApplicationPackage
            }]
          }]
        }]
      }]
    });
    if (_.size(items.orderItems) === 0) {
      return {
        code: 4001,
        msg: "购物车内为空！"
      }
    }
    let totalPrice = 0; //计算购物车中所有的商品总价
    for (let item of items.orderItems) {
      totalPrice += item.app.appStoreLatestVersion.appPackage.price;
      appIDs.push(item.app.id);
    }
    //获取用户有多少钱
    let purseNum = yield amqp.call("settlement.purseNum", {
      id
    });
    if (totalPrice <= purseNum) {
      // 在用户账户内扣钱，写日志，为应用、用户添加购买记录
      // 为用户和所购买的商品之间建立所属关系
      let purseID = yield amqp.call("settlement.purse", {
        id
      });
      console.log(purseNum - totalPrice);
      yield Purse.upsert({
        id: purseID,
        num: purseNum - totalPrice
      });
      for (let appID of appIDs) {
        let userApp = yield UserApp.create({});
        let user = yield User.findById(id);
        let app = yield Application.findById(appID)
        userApp.setUser(user);
        userApp.setApp(app);
      }
      Order.upsert({
        id: cartID,
        status: 'close'
      });
      return {
        code: 200,
        msg: '购买成功'
      }
    } else {
      return {
        code: 4002,
        msg: "钱包内的钱不充足！"
      }
    }
  });
}

//TODO: 对于商品有不同的类型，对类型进行处理，或者构建更好的模型
