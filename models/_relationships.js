'use strict';

module.exports = (sequelize) => {
  const User = sequelize.models['user'];
  const Auditor = sequelize.models['auditor'];
  const Application = sequelize.models['app'];
  const Developer = sequelize.models['developer'];
  const UserDevice = sequelize.models['userDevice'];
  const AppPackage = sequelize.models['appPackage'];
  const DeviceModel = sequelize.models['deviceModel'];
  const AuditorBucket = sequelize.models['auditorBucket'];
  const AppPackageStatus = sequelize.models['appPackageStatus'];

  const DeviceModelMap = sequelize.define('deviceModelToAppVersion', {}); //

  const LatestVersion = sequelize.define('latestVersion', {}); //TODO:fix name to developerLatestVersion
  const AppStoreLatestVersion = sequelize.define('appStoreLatestVersion', {}); //Appstore中最新版本
  const AppHistoryLatestStatus = sequelize.define('appHistoryLatestStatus', {}); //APP历史版本的最新最新状态

  Application.hasOne(LatestVersion, {
    foreignKey: "appID"
  });
  LatestVersion.belongsTo(AppPackage, {
    foreignKey: "appPackageID"
  });

  AppPackage.belongsTo(Application, {
    foreignKey: "appID"
  });
  Application.hasMany(AppPackage, {
    foreignKey: "appID"
  });
  AppPackage.hasMany(AppPackageStatus, {
    foreignKey: "statusID"
  });
  AppPackageStatus.belongsTo(AppPackage, {
    foreignKey: "statusID"
  })

  UserDevice.belongsTo(User, {
    foreignKey: "userID"
  });
  User.hasMany(UserDevice, {
    foreignKey: "userID"
  });

  DeviceModel.hasMany(UserDevice, {
    foreignKey: "deviceModelID"
  });
  UserDevice.belongsTo(DeviceModel, {
    foreignKey: "deviceModelID"
  });
  AppPackage.belongsToMany(DeviceModel, {
    through: DeviceModelMap,
    foreignKey: "appPackageID"
  });
  DeviceModel.belongsToMany(AppPackage, {
    through: DeviceModelMap,
    foreignKey: "deviceModelID"
  });

  Developer.hasMany(Application, {
    foreignKey: "developerID"
  });
  Application.belongsTo(Developer, {
    foreignKey: "developerID"
  });

  //AuditorBucket与Auditor和AppPackage
  AuditorBucket.belongsTo(AppPackage, {
    foreignKey: "appPackageID"
  });
  AuditorBucket.belongsTo(Auditor, {
    foreignKey: "auditorID"
  });
  AuditorBucket.belongsTo(AppPackageStatus, {
    foreignKey: "statusID"
  });
  AppPackage.hasMany(AuditorBucket, {
    foreignKey: "appPackageID"
  });
  Auditor.hasMany(AuditorBucket, {
    foreignKey: "auditorID"
  });
}
