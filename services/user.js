"use strict";

const promise = require('bluebird');
const request = promise.promisifyAll(require('request'));

module.exports = (app) => {
  const amqp = app.getContext('amqp');

  const ThirdParty = app.getModel('thirdParty');
  const UserAuth = app.getModel("userAuth");

  amqp.on("user.exist", function*(msg) {
    let accessToken = msg.accessToken;
    let type = msg.type;

    let user = yield ThirdParty.findOne({
      where: {
        type: type,
        accessToken: accessToken
      }
    });
    if (user) {
      return user;
    } else {
      let url, method = "get";
      switch (type) {
        case 'github':
          method = "get";
          url = "https://api.github.com/user?access_token=";
          break;
        case 'wechat':
          method: "post";
          url = "https://qyapi.weixin.qq.com/cgi-bin/service/get_login_info?access_token=";
          break;
      }
      let detailOptions = {
        url: url + accessToken,
        method: method,
        headers: {
          'User-Agent': 'request'
        }
      }

      let user = yield new Promise((resolve, reject) => {
        request(detailOptions, (err, res, body) => {
          if (!err && res.statusCode == 200) {
            let profile = JSON.parse(body);
            let user = {};
            user.name = profile.name;
            user.accessToken = accessToken;
            user.avatar = profile.avatar_url;
            user.type = 'github';
            user.scope = 'user'; //默认第三方账户的权限
            resolve(user)
          } else {
            console.log(res.statusCode); //未获取到信息
          }
        });
      });
      let userData = yield ThirdParty.create({
        accessToken: accessToken,
        type: type,
        name: user.name,
        avatar: user.avatar
      });
      let userAuth = yield UserAuth.findAll({
        where: {
          auth: user.scope.split(',')
        }
      });
      yield userData.addUserAuth(userAuth);
      return userData;
    }
  });
};
