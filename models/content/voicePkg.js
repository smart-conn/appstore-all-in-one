'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('voicePkg', {
    name: Sequelize.STRING
  });
};
