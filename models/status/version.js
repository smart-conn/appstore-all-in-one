'use strict';
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  sequelize.define('developerLatestVersion', {});
  sequelize.define('auditorLaterstVersion',{});
  sequelize.define('appStoreLaterVersion',{});
};
