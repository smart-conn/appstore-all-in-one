'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const AuditorLatestVersion = sequelize.define('auditorLatestVersion', {}); //由开发人员给审核人员提交的最新审核版本
  const AppStoreLatestVersion = sequelize.define('appStoreLatestVersion', {}); //应用商店中的最新版本
  const DeveloperLatestVersion = sequelize.define('developerLatestVersion', {}); //开发人员最新版本
  const MappingDeviceModelAppVersion = sequelize.define('mappingDeviceModelAppVersion', {}); //APP版本和型号之间的兼容双向关系表

  const App = sequelize.models['app'];
  const AppPkg = sequelize.models['appPkg'];
  const DeviceModel = sequelize.models['deviceModel'];

  DeviceModel.belongsToMany(AppPkg, {
    through: MappingDeviceModelAppVersion,
    foreignKey: 'deviceModelId'
  });
  AppPkg.belongsToMany(DeviceModel, {
    through: MappingDeviceModelAppVersion,
    foreignKey: 'deviceModelId'
  });

  App.hasOne(DeveloperLatestVersion, {
    foreignKey: 'appId'
  });
  DeveloperLatestVersion.belongsTo(App, {
    foreignKey: 'appId'
  });
  DeveloperLatestVersion.belongsTo(AppPkg, {
    foreignKey: 'appPkgId'
  });
  AppPkg.hasOne(DeveloperLatestVersion, {
    foreignKey: 'appPkgId'
  });

  App.hasOne(AuditorLatestVersion, {
    foreignKey: 'appId'
  });
  AuditorLatestVersion.belongsTo(App, {
    foreignKey: 'appId'
  });
  AuditorLatestVersion.belongsTo(AppPkg, {
    foreignKey: 'appPkgId'
  });
  AppPkg.hasOne(AuditorLatestVersion, {
    foreignKey: 'appPkgId'
  });

  App.hasOne(AppStoreLatestVersion, {
    foreignKey: 'appId'
  });
  AppStoreLatestVersion.belongsTo(App, {
    foreignKey: 'appId'
  });
  AppStoreLatestVersion.belongsTo(AppPkg, {
    foreignKey: 'qppPkgId'
  });
  AppPkg.hasOne(AppStoreLatestVersion, {
    foreignKey: 'appPkgId'
  });


};
