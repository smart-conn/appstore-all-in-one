'use strict';
const Sequelize = require('sequelize');

module.export = (sequelize) => {
  sequelize.define('developerLatestStatus', {});
  sequelize.define('auditorLaterstStatus', {});
  sequelize.define('appStoreLaterStatus', {});
  
  
}