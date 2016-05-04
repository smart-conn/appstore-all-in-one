"use strict";

const promise = require('bluebird');
const request = require('request');
const qs = require('querystring');
const https = require('https');

module.exports = (app) => {
  const amqp = app.getContext('amqp');

  const ThirdParty = app.getModel('thirdParty');
  const UserAuth = app.getModel("userAuth");

  /**
   * 获取用户信息
   * @param  {json}  msg        {type, clientID, secret, code, redirectUri}
   * @return {json}  userInfo   {user: {accessToken, type, name, avatar, scope}, token}
   */
  amqp.on("thirdParty.userInfo", function* (msg) {
    console.log(msg);
    let type = msg.type;
    let clientID = msg.clientID;
    let secret = msg.secret;
    let code = msg.code;
    let redirectUri = msg.redirectUri;
    let url, method = "GET";
    switch (type) {
    case 'github':
      url = "https://github.com/login/oauth/access_token?client_id=" + clientID +
        "&client_secret=" + secret + "&code=" + code + "&redirect_uri=" + redirectUri;
      method = "GET";
      break;
    case 'wechat':
      url = ""
      break;
    }
    return new Promise((resolve, reject) => {
      let accessTokenOptions = {
        url: url,
        method: method,
        headers: {
          'User-Agent': 'request'
        }
      }
      request(accessTokenOptions, (err, res, body) => {
        console.log(err);
        if (!err && res.statusCode == 200) {
          let token = qs.parse(body.toString()).access_token;
          let temp = amqp.call('thirdParty.userExist', {
            accessToken: token,
            type: type
          });
          console.log(temp);
          resolve(temp);
        }
      });
    });
  });

  /**
   * 判断第三方用户是否存在，不存在将第三方账户加入数据库，返回用户的基本信息
   * @param  {json} msg           {accessToken, type}
   * @return {json}               {name, avatar, type, scope}
   */
  amqp.on("thirdParty.userExist", function* (msg) {
    let accessToken = msg.accessToken;
    let type = msg.type;
    console.log();
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
      console.log(userData);
      return userData;
    }
  });
};
