'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('voice', {
    name: Sequelize.STRING
  });
};
