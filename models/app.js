"use strict";

const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  sequelize.define('app', {
    appid: { type: Sequelize.STRING, primaryKey: true },
    name: Sequelize.STRING,
    decription: Sequelize.TEXT,
    icon: Sequelize.STRING,
    author: Sequelize.STRING
  });
};