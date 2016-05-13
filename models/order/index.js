'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  [
    require('./order')
  ].forEach((model) => {
    model(sequelize);
  });
}
