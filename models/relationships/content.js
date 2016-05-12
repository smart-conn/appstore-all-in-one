'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const App = sequelize.models['app'];
  const AppPkg = sequelize.models['appPkg'];
  const Voice = sequelize.models['voice'];
  const VoicePkg = sequelize.models['voicePkg'];
  const Custmer = sequelize.models['profileCustmer'];
  const CustmerContent = sequelize.models['custmerContent'];
  
  App.hasMany(AppPkg, {
    foreignKey: 'appId'
  });
  AppPkg.belongsTo(App, {
    foreignKey: 'appId'
  });

  Voice.hasMany(VoicePkg, {
    foreignKey: 'voiceId'
  });
  VoicePkg.belongsTo(Voice, {
    foreignKey: 'voiceId'
  });

  //Custmer and CustmerContent
  Custmer.hasMany(CustmerContent, {
    foreignKey: 'custmerId'
  });
  CustmerContent.belongsTo(Custmer, {
    foreignKey: 'custmerId'
  });

  //AppPkg and CustmerContent
  AppPkg.hasOne(CustmerContent, {
    foreignKey: 'appPkgId'
  });
  CustmerContent.belongsTo(AppPkg, {
    foreignKey: 'appPkgId'
  });

  //VoicePkg and CustmerContent
  VoicePkg.hasOne(CustmerContent, {
    foreignKey: 'voicePkg'
  });
  CustmerContent.belongsTo(VoicePkg, {
    foreignKey: 'voicePkg'
  });
}
