'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const App = sequelize.models['app'];
  const AppPkg = sequelize.models['appPkg'];
  const Voice = sequelize.models['voice'];
  const VoicePkg = sequelize.models['voicePkg'];
  const Custmer = sequelize.models['profileCustmer'];
  const AccountContent = sequelize.models['accountContent'];
  const AppPkgStatus = sequelize.models['appPkgStatus'];
  const AppPkgLatestStatus = sequelize.define('appPkgLatestStatus', {});
  const VoicePkgStatus = sequelize.models['voicePkgStatus'];
  const VoicePkgLatestStatus = sequelize.define('voicePkgLatestStatus');
  const Account = sequelize.models['account'];

  //Account and App
  Account.hasMany(App);
  App.belongsTo(Account);

  //App and AppPkg
  App.hasMany(AppPkg);
  AppPkg.belongsTo(App);

  //Voice and VoicePkg
  Voice.hasMany(VoicePkg);
  VoicePkg.belongsTo(Voice);

  //Custmer and CustmerContent
  Account.hasMany(AccountContent);
  AccountContent.belongsTo(Account);

  //AppPkg and CustmerContent
  AppPkg.hasOne(AccountContent);
  AccountContent.belongsTo(AppPkg);

  //VoicePkg and CustmerContent
  VoicePkg.hasOne(AccountContent);
  AccountContent.belongsTo(VoicePkg);

  //AppPkg and Status
  AppPkg.hasOne(AppPkgLatestStatus);
  AppPkgLatestStatus.belongsTo(AppPkg);
  AppPkgLatestStatus.belongsTo(AppPkgStatus);
  AppPkgStatus.hasOne(AppPkgLatestStatus);

  //VoicePkg and Status
  VoicePkg.hasOne(VoicePkgLatestStatus);
  VoicePkgLatestStatus.belongsTo(VoicePkg);
  VoicePkgLatestStatus.belongsTo(VoicePkgStatus);
  VoicePkgStatus.hasOne(VoicePkgLatestStatus);

  //
}
