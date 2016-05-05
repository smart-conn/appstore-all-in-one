'use strict';
const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  sequelize.define('orderItem', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    type: Sequelize.STRING, //app,voice
    status: Sequelize.STRING
  });
};
