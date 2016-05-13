'use strict';
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  sequelize.define('accountDevice', {
    name: Sequelize.STRING,
    alias: Sequelize.STRING,
    accessToken: Sequelize.STRING,
    appManifest: Sequelize.TEXT,
    aliyunDeviceId: Sequelize.STRING,
    wechatDeviceId: Sequelize.STRING,
    activated: Sequelize.BOOLEAN
  });
};
