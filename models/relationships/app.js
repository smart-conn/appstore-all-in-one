'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const App = sequelize.models['app'];
  const Account = sequelize.models['account'];
  const AuditorTask = sequelize.define('auditorTask', {});
  const AppPkg = sequelize.models['appPkg'];
  const AppPkgLatestStatus = sequelize.define('appPkgLatestStatus', {});
  const AppPkgStatus = sequelize.define('appPkgStatus', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    status: Sequelize.STRING
  });

  AuditorTask.belongsTo(App);
  App.hasOne(AuditorTask);

  Account.hasMany(App);
  App.belongsTo(Account);

  //APP历史版本的最新状态
  AppPkg.hasOne(AppPkgLatestStatus);
  AppPkgLatestStatus.belongsTo(AppPkg);
  AppPkgLatestStatus.belongsTo(AppPkgStatus);
  AppPkgStatus.hasOne(AppPkgLatestStatus);

  // App.hasMany(AppPkg);
  // AppPkg.belongsTo(App);
}
