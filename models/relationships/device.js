'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const CustmerDevice = sequelize.models['custmerDevice'];
  const DeviceModel = sequelize.models['deviceModel'];
  const Custmer = sequelize.models['profileCustmer'];

  Custmer.hasMany(CustmerDevice, {
    foreignKey: 'custmerId'
  });
  CustmerDevice.belongsTo(Custmer, {
    foreignKey: 'custmerId'
  });

  DeviceModel.hasMany(CustmerDevice, {
    foreignKey: 'deviceModelId'
  });
  CustmerDevice.belongsTo(DeviceModel, {
    foreignKey: 'deviceModelId'
  });
}
