'use strict';
const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  sequelize.define('purseLog', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    type: Sequelize.STRING, //buy,charge
    log: Sequelize.STRING
  });
};
