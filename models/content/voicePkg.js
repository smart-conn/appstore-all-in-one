'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('voicePkg', {
  	id: {
      type: Sequelize.STRING,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    name: Sequelize.STRING
  });
};
