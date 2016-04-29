'use strict';
const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  sequelize.define('thirdParty', {
    accessToken: Sequelize.STRING,
    type: Sequelize.STRING, //github wechat weibo qq
    avatar: Sequelize.STRING, //头像
    name: Sequelize.STRING //用户在第三方的名字
  });
};
