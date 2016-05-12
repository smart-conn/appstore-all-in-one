'use strict';
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  sequelize.define('order', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    status: Sequelize.STRING, //open,close
    type: Sequelize.STRING //app voice
  });
};
