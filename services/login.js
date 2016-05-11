'use strict';
const nconf = require('nconf');
const jwt = require('jsonwebtoken');

module.exports = (app) => {
  const amqp = app.getContext('amqp');

  const Account = app.getModel('account');
  const UserAuth = app.getModel('userAuth');
  const secret = nconf.get('secret');
  const Role = app.getModel('role');
  //登录
  amqp.on("login.generateToken", function* (msg) {
    const id = msg.id;

    const scope = yield Account.findById(id, {
      include: [{
        model: Role
      }]
    }).then((account) => {
      let scope = [];
      for (let role of account.roles) {
        scope.push(role.name);
      }
      return scope.join(',');
    });
    return jwt.sign({
      scope: scope
    }, secret, {
      subject: id
    });
  });
}
