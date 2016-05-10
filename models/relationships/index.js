'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  [
    require('./account'),
    require('./device'),
    require('./other')
  ].forEach((relationships) => {
    relationships(sequelize);
  });
}
