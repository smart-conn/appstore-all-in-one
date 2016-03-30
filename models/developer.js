'use strict';
const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  sequelize.define('developer', {
    name: Sequelize.STRING
  });
};
