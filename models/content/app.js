'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('app', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    price: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    name: Sequelize.STRING,
    description: Sequelize.TEXT,
    icon: Sequelize.STRING
  });
};
