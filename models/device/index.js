'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  [
    require('./deviceModel'),
    require('./account')
  ].forEach((model) => {
    model(sequelize);
  });
}
