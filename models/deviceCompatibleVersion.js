'use strict';
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  sequelize.define('deviceCompatibleVersion', {
    name: Sequelize.STRING
  });
};