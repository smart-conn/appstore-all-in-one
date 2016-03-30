'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  let Application = sequelize.models['app'];
  let AppPackage = sequelize.models['appPackage'];
  AppPackage.belongsTo(Application, {
    foreignKey: "appID"
  });
  Application.hasMany(AppPackage, {
    foreignKey: "appID"
  });

  let User = sequelize.models['user'];
  let UserDevice = sequelize.models['userDevice'];
  UserDevice.belongsTo(User, {
    foreignKey: "userID"
  });
  User.hasMany(UserDevice, {
    foreignKey: "userID"
  });

  let DeviceModelMap = sequelize.define('deviceModelToAppVersion', {});
  let DeviceModel = sequelize.models['deviceModel'];
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

  let Developer = sequelize.models['developer'];
  Developer.hasMany(AppPackage, {
    foreignKey: "developerID"
  });
}
