'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {

  let Application = sequelize.models['app'];
  let ApplicationVersion = sequelize.models['appVersion'];
  ApplicationVersion.belongsTo(Application, { foreignKey: "appid" });
  Application.hasMany(ApplicationVersion, { foreignKey: "appid" });

  let User = sequelize.models['user'];
  let UserDevice = sequelize.models['userDevice'];
  UserDevice.belongsTo(User);
  User.hasMany(UserDevice);

  let deviceCompatibleVersion = sequelize.models['deviceCompatibleVersion'];
  let deviceCompatibleVersionMap = sequelize.models['deviceCompatibleVersionMap'];
  deviceCompatibleVersion.hasMany(ApplicationVersion);
  UserDevice.belongsTo(deviceCompatibleVersion);
  ApplicationVersion.belongsToMany(deviceCompatibleVersion, {
    through: deviceCompatibleVersionMap
  });
  deviceCompatibleVersion.belongsToMany(ApplicationVersion, {
    through: deviceCompatibleVersionMap
  });
}