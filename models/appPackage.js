'use strict';
const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  sequelize.define('appPackage', { //TODO:fix name to appHistory
    version: Sequelize.STRING,
    flow: Sequelize.TEXT,
    price: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    description: Sequelize.TEXT
  });
};
