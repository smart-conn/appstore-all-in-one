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

  amqp.on('settlement.fastOrder', function* (msg) {
    let id = msg.id;
    let type = msg.type;
    let productID = msg.productID;

    //首先修改该用户下所有的fastOpen为fastCancel
    //当用户支付失败时状态就会变成fastCancel
    //一旦状态变成fastConcel，订单就会被取消，状态将永远不变
    yield Order.update({
      status: "fastCancel"
    }, {
      where: {
        status: "fastOpen",
        userID: id
      }
    });
    console.log(productID);
    //TODO:用户是不是已经购买过，是不是已经拥有
    let isBought = yield amqp.call('order.isBought', {
      id: id,
      productID: productID
    });
    console.log(isBought);
    if (!isBought) {
      //创建新的fastOpen订单
      let order = yield Order.create({
        status: "fastOpen"
      });

      let orderItem = yield OrderItem.create({
        type: type,
        status: "on"
      });
      let app = yield Application.findById(productID);
      let user = yield User.findById(id);
      yield order.setUser(user);
      yield orderItem.setApp(app);
      yield orderItem.setOrder(order);

      // yield amqp.call("settlement.fastBuy", {
      //   id
      // });
      return {
        code: 200,
        msg: "success"
      }
    } else {
      return {
        code: 4005,
        msg: "已经购买过"
      }
    }
  });
  //快速购买，付款
  amqp.on("settlement.fastBuy", function* (msg) {
    let id = msg.id;

    //获取fastOpen的快速购买订单单号
    let cartID = yield Order.find({
      where: {
        status: "fastOpen"
      },
      limit: 1
    }).then((data) => {
      return data.id;
    });
    //获取用户有多少钱
    let purseNum = yield amqp.call("settlement.purseNum", {
      id
    });
    //获取订单价格
    let totalPrice = 0;
    let appID = "";
    yield Order.find({
      where: {
        status: "fastOpen"
      },
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
    }).then((data) => {
      totalPrice = _.head(data.orderItems).app.appStoreLatestVersion.appPackage.price;
      appID = _.head(data.orderItems).app.id;
    });

    if (purseNum >= totalPrice) {
      //修改订单状态为fastClose
      //建立用户关系
      //写日志
      //修改用户钱包
      yield Order.update({
        status: 'fastClose'
      }, {
        where: {
          id: cartID
        }
      });
      let user = yield User.findById(id);
      let app = yield Application.findById(appID);
      let userApp = yield UserApp.create({});
      yield userApp.setUser(user);
      yield userApp.setApp(app);
    } else {
      return {
        code: 4002,
        msg: "钱包内的钱不充足！";
      }
    }
  });
}

//TODO: 对于商品有不同的类型，对类型进行处理，或者构建更好的模型
