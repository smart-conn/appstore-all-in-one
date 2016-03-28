"use strict";

const Sequelize = require('sequelize');
module.exports = function (sequelize) {

  sequelize.define('user', {
    name: Sequelize.STRING
  });

};
