'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const MappingAccountRole = sequelize.define('mappingAccountRole', {});
  const MappingPermissionRole = sequelize.define('mappingPermissionRole', {});
  const MappingThirdPartyRole = sequelize.define('mappingThirdPartyRole', {});
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
  const App = sequelize.models['app'];

  Custmer.belongsTo(ThirdParty);
  ThirdParty.hasOne(Custmer);

  Developer.belongsTo(ThirdParty);
  ThirdParty.hasOne(Developer);

  //ThirdParty and Role
  ThirdParty.belongsToMany(Role, {
    through: MappingThirdPartyRole
  });
  Role.belongsToMany(ThirdParty, {
    through: MappingThirdPartyRole
  });

  //Account and Role
  Account.belongsToMany(Role, {
    through: MappingAccountRole
  });
  Role.belongsToMany(Account, {
    through: MappingAccountRole
  });

  //Role and Permission
  Role.belongsToMany(Permission, {
    through: MappingPermissionRole
  });
  Permission.belongsToMany(Role, {
    through: MappingPermissionRole
  });

  //Manufacturer
  Manufacturer.belongsTo(Account);
  Account.hasOne(Manufacturer);

  //Operator
  Operator.belongsTo(Account);
  Account.hasOne(Operator);

  //Custmer
  Custmer.belongsTo(Account);
  Account.hasOne(Custmer);

  //Developer
  Developer.belongsTo(Account);
  Account.hasOne(Developer);

  //Auditor
  Auditor.belongsTo(Account);
  Account.hasOne(Auditor);

  //Auditor and AuditorTask
  Account.hasMany(AuditorTask);
  AuditorTask.belongsTo(Account);
  AuditorTask.belongsTo(App);
  App.hasOne(AuditorTask);
}
