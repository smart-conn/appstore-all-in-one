'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  [
    require('./voice'),
    require('./voicePkg'),
    require('./app'),
    require('./appPkg')
  ].forEach((relationships) => {
    relationships(sequelize);
  });
}
