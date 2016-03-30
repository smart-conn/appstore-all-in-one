'use strict';
const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  sequelize.define('appPackage', {
    version: Sequelize.STRING,
    flow: Sequelize.TEXT,
    description: Sequelize.TEXT
  });
};
