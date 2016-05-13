'use strict';
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  sequelize.define('thirdParty', {
    name: Sequelize.STRING, //用户在第三方的名字
    type: Sequelize.STRING, //github wechat weibo qq
    avatar: Sequelize.STRING, //头像
    accessToken: Sequelize.STRING
  });
};
