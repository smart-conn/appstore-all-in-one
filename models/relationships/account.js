'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const MappingAccountRole = sequelize.define('mappingAccountRole', {});
  const MappingPermissionRole = sequelize.define('mappingPermissionRole', {});
  const MappingThirdPartyRole = sequelize.define('MappingThirdPartyRole', {});
  const AuditorTask = sequelize.define('auditorTask', {});

  const Role = sequelize.models['role'];
  const Account = sequelize.models['account'];
  const Permission = sequelize.models['permission'];
  const Custmer = sequelize.models['profileCustmer'];
  const Operator = sequelize.models['profileOperator'];
  const Manufacturer = sequelize.models['profileManufacturer'];
  const Developer = sequelize.models['profileDeveloper'];
  const Auditor = sequelize.models['profileAuditor'];
  const ThirdParty = sequelize.models['thirdParty'];

  Custmer.belongsTo(ThirdParty, {
    foreignKey: 'thirdPartyId'
  });
  ThirdParty.hasOne(Custmer, {
    foreignKey: 'thirdPartyId'
  });

  Developer.belongsTo(ThirdParty, {
    foreignKey: 'thirdPartyId'
  });
  ThirdParty.hasOne(Developer, {
    foreignKey: 'thirdPartyId'
  });

  //ThirdParty and Role
  ThirdParty.belongsToMany(Role, {
    through: MappingThirdPartyRole,
    foreignKey: 'thirdPartyId'
  });
  Role.belongsToMany(ThirdParty, {
    through: MappingThirdPartyRole,
    foreignKey: 'thirdPartyId'
  });

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

  //Manufacturer
  Manufacturer.belongsTo(Account, {
    foreignKey: 'accountId'
  });
  Account.hasOne(Manufacturer, {
    foreignKey: 'accountId'
  });

  //Operator
  Operator.belongsTo(Account, {
    foreignKey: 'accountId'
  });
  Account.hasOne(Operator, {
    foreignKey: 'accountId'
  });

  //Custmer
  Custmer.belongsTo(Account, {
    foreignKey: 'accountId'
  });
  Account.hasOne(Custmer, {
    foreignKey: 'accountId'
  });

  //Developer
  Developer.belongsTo(Account, {
    foreignKey: 'accountId'
  });
  Account.hasOne(Developer, {
    foreignKey: 'accountId'
  });

  //Auditor
  Auditor.belongsTo(Account, {
    foreignKey: 'accountId'
  });
  Account.hasOne(Auditor, {
    foreignKey: 'accountId'
  });

  //Auditor and AuditorTask
  Auditor.hasMany(AuditorTask, {
    foreignKey: 'auditorId'
  });
  AuditorTask.belongsTo(Auditor, {
    foreignKey: 'auditorId'
  });
}
