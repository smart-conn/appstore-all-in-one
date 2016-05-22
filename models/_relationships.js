'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  let User = sequelize.models['user'];
  let Auditor = sequelize.models['auditor'];
  let Application = sequelize.models['app'];
  let Developer = sequelize.models['developer'];
  let UserDevice = sequelize.models['userDevice'];
  let AppPackage = sequelize.models['appPackage'];
  let DeviceModel = sequelize.models['deviceModel'];
  let AuditorBucket = sequelize.models['auditorBucket'];
  let AppPackageStatus = sequelize.models['appPackageStatus'];
  let DeviceModelMap = sequelize.define('deviceModelToAppVersion', {});
  let LatestVersion = sequelize.define('latestVersion', {});

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
  AppPackage.belongsTo(AppPackageStatus, {
    foreignKey: "statusID"
  });

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
