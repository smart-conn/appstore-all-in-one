'use strict';
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  sequelize.define('appVversion', {
    appid: Sequelize.STRING,
    version: Sequelize.STRING,
    flow: Sequelize.TEXT
  });
};