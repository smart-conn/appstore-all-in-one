'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  [
    require('./account'),
    // require('./app'),
    require('./content'),
    require('./device'),
    // require('./version')
    // require('./device'),
    // require('./other'),
    // require('./order')
  ].forEach((relationships) => {
    relationships(sequelize);
  });
}
