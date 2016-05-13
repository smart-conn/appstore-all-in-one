'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('accountContent', {
    type: Sequelize.STRING,
    accessToken: Sequelize.TEXT
  });  
};
