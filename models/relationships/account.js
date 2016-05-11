'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const MappingAccountRole = sequelize.define('mappingAccountRole', {});
  const MappingPermissionRole = sequelize.define('mappingPermissionRole', {});

  const Role = sequelize.models['role'];
  const Account = sequelize.models['account'];
  const Permission = sequelize.models['permission'];
  const ProfileCustmer = sequelize.models['profileCustmer'];
  const ProfileOperator = sequelize.models['profileOperator'];
  const ProfileManufacturer = sequelize.models['profileManufacturer'];

  //Account and Role
  Account.belongsToMany(Role, {
    through: MappingAccountRole,
    foreignKey: 'accountId'
  });
  Role.belongsToMany(Account, {
    through: MappingAccountRole,
    foreignKey: 'roleId'
  });

  //Role and Permission
  Role.belongsToMany(Permission, {
    through: MappingPermissionRole,
    foreignKey: 'roleId'
  });
  Permission.belongsToMany(Role, {
    through: MappingPermissionRole,
    foreignKey: 'permissionId'
  });

  //manufacturer
  ProfileManufacturer.belongsTo(Account, {
    foreignKey: 'accountId'
  });
  Account.hasOne(ProfileManufacturer, {
    foreignKey: 'accountId'
  });

  //operatorProfile
  ProfileOperator.belongsTo(Account, {
    foreignKey: 'accountId'
  });
  Account.hasOne(ProfileOperator, {
    foreignKey: 'accountId'
  });

  //custmerProfile
  ProfileCustmer.belongsTo(Account, {
    foreignKey: 'accountId'
  });
  Account.hasOne(ProfileCustmer, {
    foreignKey: 'accountId'
  });
}
