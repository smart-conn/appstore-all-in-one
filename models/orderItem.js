'use strict';
const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  sequelize.define('orderItem', {
    type: Sequelize.STRING //app,voice
  });
};
