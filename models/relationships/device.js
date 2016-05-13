'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const AccountDevice = sequelize.models['accountDevice'];
  const DeviceModel = sequelize.models['deviceModel'];
  const Custmer = sequelize.models['profileCustmer'];
  const Account = sequelize.models['account'];

  Account.hasMany(AccountDevice);
  AccountDevice.belongsTo(Account);

  DeviceModel.hasMany(AccountDevice);
  AccountDevice.belongsTo(DeviceModel);
}
