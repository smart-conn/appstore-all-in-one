'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  [
    require('./role'),
    require('./account'),
    require('./permission'),
    require('./profileCustmer'),
    require('./profileOperator'),
    require('./profileManufacturer'),
    require('./profileDeveloper'),
    require('./profileAuditor'),
    require('./custmer')
  ].forEach((model) => {
    model(sequelize);
  });
}
