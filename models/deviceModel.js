'use strict';
const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  sequelize.define('deviceModel', {
    name: Sequelize.STRING
  });
};
