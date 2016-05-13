'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('appPkg', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    version: Sequelize.STRING,
    flow: Sequelize.TEXT,    
    description: Sequelize.TEXT
  });
};
