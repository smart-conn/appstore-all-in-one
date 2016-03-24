"use strict";

const Sequelize = require('sequelize');
module.exports = function(sequelize) {

  sequelize.define('userDevice', {
    name: Sequelize.STRING,
    alias: Sequelize.STRING,
    accessToken: Sequelize.TEXT,
    appManifest: Sequelize.TEXT
  });

};