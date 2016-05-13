'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  [
    require('./voice'),
    require('./voicePkg'),
    require('./app'),
    require('./appPkg'),
    require('./contentStatus'),
    require('./account')
  ].forEach((relationships) => {
    relationships(sequelize);
  });
}
