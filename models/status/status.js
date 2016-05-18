'use strict';
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  sequelize.define('developerLatestStatus', {});
  sequelize.define('auditorLaterstStatus',{});
  sequelize.define('appStoreLaterStatus',{});
};
