'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('appPkg', {
    version: Sequelize.STRING,
    flow: Sequelize.TEXT,
    price: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    description: Sequelize.TEXT
  });
};
