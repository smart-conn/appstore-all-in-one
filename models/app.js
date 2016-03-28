"use strict";

const Sequelize = require('sequelize');
module.exports = function (sequelize) {
  sequelize.define('app', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    name: Sequelize.STRING,
    description: Sequelize.TEXT,
    icon: Sequelize.STRING,
    author: Sequelize.STRING
  });
};
