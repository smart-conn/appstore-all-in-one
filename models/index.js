module.exports = (sequelize) => {
  [
    require('./user'),
    require('./userDevice'),
    require('./app'),
    require('./appPackage'),
    require('./deviceModel'),
    require('./developer'),
    require('./appPackageStatus'),
    require('./auditor'),
    require('./auditorBucket'),
    require('./thirdParty'),
    require('./order'),
    require('./orderItem'),
    require('./purse'),
    require('./purseLog'),
    require('./account'),
    require('./relationships')
  ].forEach((model) => {
    model(sequelize);
  });
}
