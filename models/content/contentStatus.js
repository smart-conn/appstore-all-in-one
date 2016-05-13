'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('appPkgStatus', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    status: Sequelize.STRING
  });
  sequelize.define('voicePkgStatus', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    status: Sequelize.STRING
  });
};
