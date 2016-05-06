'use strict';
const _ = require('lodash');

module.exports = function (app) {
  const amqp = app.getContext('amqp');

  const User = app.getModel('user');
  const Purse = app.getModel('purse');

  // 查看某人是否有钱包数据，没有则新建钱包
  amqp.on('settlement.purse', function* (msg) {
    let id = msg.id; //用户ID

    let user = yield User.findById(id, {
      include: [{
        model: Purse
      }]
    });
    if (user.purse == null) {
      let purse = yield Purse.create({
        num: 0
      });
      yield purse.setUser(user);
      return purse.id;
    } else {
      return user.purse.id;
    }
  });

  // 返回某人钱包内的钱数
  amqp.on('settlement.purseNum', function* (msg) {
    let id = msg.id;

    yield amqp.call('settlement.purse', {
      id
    });

    return yield User.findById(id, {
      include: [{
        model: Purse
      }]
    }).then((user) => {
      return user.purse.num;
    });
  });
}
