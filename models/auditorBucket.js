'use strict';
const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  sequelize.define('auditorBucket', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    }
  });
};
