'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  [
    require('./purse'),
    require('./purseLog')
  ].forEach((purse) => {
    purse(sequelize);
  });
}
