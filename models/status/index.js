'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  [
    require('./status'),
    require('./version')
  ].forEach((status) => {
    status(sequelize);
  });
}
