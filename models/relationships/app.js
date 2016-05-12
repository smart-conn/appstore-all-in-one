'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const App = sequelize.models['app'];
  const Developer = sequelize.models['developer'];
  const AuditorTask = sequelize.define('auditorTask', {});
  const AppPkg = sequelize.models['appPkg'];
  const AppPkgLatestStatus = sequelize.define('appPkgLatestStatus', {});
  const AppPkgStatus = sequelize.define('appPkgStatus', {
    status: Sequelize.STRING
  });

  AuditorTask.belongsTo(App, {
    foreignKey: 'appId'
  });
  App.hasOne(AuditorTask, {
    foreignKey: 'appId'
  });

  Developer.hasMany(App, {
    foreignKey: 'developerId'
  });
  App.belongsTo(Developer, {
    foreignKey: 'developerId'
  });

  //APP历史版本的最新状态
  AppPkg.hasOne(AppPkgLatestStatus, {
    foreignKey: 'appPkgId'
  });
  AppPkgLatestStatus.belongsTo(AppPkg, {
    foreignKey: 'appPkgId'
  });
  AppPkgLatestStatus.belongsTo(AppPackageStatus, {
    foreignKey: 'statusId'
  });
  AppPackageStatus.hasOne(AppPkgLatestStatus, {
    foreignKey: 'statusId'
  });
}
