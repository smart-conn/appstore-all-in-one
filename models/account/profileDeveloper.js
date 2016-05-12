'use strict';
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  sequelize.define('profileDeveloper', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    name: Sequelize.STRING
  });
};
