'use strict';

// const sequelize = app.getContext('sequelize');
const Promise = require('bluebird');
const fs = require('fs');
const nconf = require('nconf');
const Sequelize = require('sequelize');

const NODE_ENV = process.env.NODE_ENV || 'development';
nconf.argv().env();
nconf.file(`config.${NODE_ENV}.json`);

const database = nconf.get('database');
const username = nconf.get('username');
const password = nconf.get('password');
const host = nconf.get('host');
const dialect = nconf.get('dialect');
const storage = nconf.get('storage');

if (fs.existsSync('./application.db')) fs.unlinkSync('./application.db');

const appPkgExample = require('./package.example');

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  storage
});

require('./models')(sequelize);

const App = sequelize.models['app'];
const AppPkg = sequelize.models['appPkg'];
const Voice = sequelize.models['voice'];
const VoicePkg = sequelize.models['voicePkg'];
const Custmer = sequelize.models['profileCustmer'];
const Auditor = sequelize.models['profileAuditor'];
const Operator = sequelize.models['profileOperator'];
const Developer = sequelize.models['profileDeveloper'];
const Manufacturer = sequelize.models['profileManufacturer'];
const Account = sequelize.models['account'];
const Permission = sequelize.models['permission'];
const Role = sequelize.models['role'];
const AppPkgStatus = sequelize.models['appPkgStatus'];
const AppPkgLatestStatus = sequelize.models['appPkgLatestStatus'];
const VoicePkgStatus = sequelize.models['voicePkgStatus'];
const VoicePkgLatestStatus = sequelize.models['voicePkgLatestStatus'];
const DeviceModel = sequelize.models['deviceModel'];
const AccountContent = sequelize.models['accountContent'];
const AccountDevice = sequelize.models['accountDevice'];

Promise.coroutine(function*() {
  yield sequelize.sync();

  let developer = yield Developer.create({
    name: 'developer'
  });

  let custmer = yield Custmer.create({
    name: 'custmer'
  });

  let auditor = yield Auditor.create({
    name: 'auditor'
  });

  let manufacturer = yield Manufacturer.create({
    name: 'manufacturer'
  });

  let operator = yield Operator.create({
    name: "operator"
  });

  let developerAccount = yield Account.create({
    username: "developer"
  });
  yield new Promise((resolve, reject) => {
    developerAccount.setPassword('developer', (err, user) => {
      if (err) reject(err);
      resolve(user.save());
    });
  });

  let auditorAccount = yield Account.create({
    username: 'auditor'
  });
  yield new Promise((resolve, reject) => {
    auditorAccount.setPassword('auditor', (err, user) => {
      if (err) reject(err);
      resolve(user.save());
    });
  });

  let operatorAccount = yield Account.create({
    username: 'operator'
  });
  yield new Promise((resolve, reject) => {
    operatorAccount.setPassword('operator', (err, user) => {
      if (err) reject(err);
      resolve(user.save());
    });
  });

  let manufacturerAccount = yield Account.create({
    username: 'manufacturer'
  });
  yield new Promise((resolve, reject) => {
    manufacturerAccount.setPassword('manufacturer', (err, user) => {
      if (err) reject(err);
      resolve(user.save());
    });
  });

  let custmerAccount = yield Account.create({
    username: 'custmer'
  });
  yield new Promise((resolve, reject) => {
    custmerAccount.setPassword('custmer', (err, user) => {
      if (err) reject(err);
      resolve(user.save());
    });
  });

  yield developer.setAccount(developerAccount);
  yield custmer.setAccount(custmerAccount);
  yield auditor.setAccount(auditorAccount);
  yield manufacturer.setAccount(manufacturerAccount);
  yield operator.setAccount(operatorAccount);

  let auditorPermission = yield Permission.create({
    name: 'auditor'
  });
  let custmerPermission = yield Permission.create({
    name: 'custmer'
  });
  let operatorPermission = yield Permission.create({
    name: 'operator'
  });
  let manufacturerPermission = yield Permission.create({
    name: 'manufacturer'
  });
  let developerPermission = yield Permission.create({
    name: 'developer'
  });

  let auditorRole = yield Role.create({
    name: 'auditor'
  });
  let custmerRole = yield Role.create({
    name: 'custmer'
  });
  let manufacturerRole = yield Role.create({
    name: 'manufacturer'
  });
  let developerRole = yield Role.create({
    name: 'developer'
  });
  let operatorRole = yield Role.create({
    name: 'operator'
  });

  yield developerAccount.addRole(developerRole);
  yield auditorAccount.addRole(auditorRole);
  yield manufacturerAccount.addRole(manufacturerRole);
  yield operatorAccount.addRole(operatorRole);
  yield custmerAccount.addRole(custmerRole);

  yield custmerRole.addPermission(custmerPermission);
  yield auditorRole.addPermission(auditorPermission);
  yield developerRole.addPermission(developerPermission);
  yield manufacturerRole.addPermission(manufacturerPermission);
  yield operatorRole.addPermission(operatorPermission);

  let app1 = yield App.create({
    name: '变声',
    description: '好玩儿到爱不释手1',
    price: 3,
    icon: '1.jpg'
  });
  let app2 = yield App.create({
    name: '电话本',
    description: '好玩儿到爱不释手2',
    price: 4,
    icon: '1.jpg'
  });
  let app3 = yield App.create({
    name: 'UUID 生成器',
    description: '好玩儿到爱不释手3',
    price: 6,
    icon: '1.jpg'
  });
  yield app1.setAccount(developerAccount);
  yield app2.setAccount(developerAccount);
  yield app3.setAccount(developerAccount);

  let appPkg1 = yield AppPkg.create({
    version: '1.0.1',
    flow: appPkgExample.flow1,
    description: '升级信息'
  });
  let appPkg2 = yield AppPkg.create({
    version: '2.0.1',
    flow: appPkgExample.flow1,
    description: '升级信息'
  });
  let appPkg3 = yield AppPkg.create({
    version: '1.1.1',
    flow: appPkgExample.flow2,
    description: '升级信息'
  });
  let appPkg4 = yield AppPkg.create({
    version: '1.0.2',
    flow: appPkgExample.flow3,
    description: '升级信息'
  });

  yield appPkg1.setApp(app1);
  yield appPkg2.setApp(app1);
  yield appPkg3.setApp(app2);
  yield appPkg4.setApp(app3);

  let appPkgStatus1 = yield AppPkgStatus.create({
    status: 'reviewPass'
  });
  let appPkgStatus2 = yield AppPkgStatus.create({
    status: 'waitReview'
  });
  let appPkgStatus3 = yield AppPkgStatus.create({
    status: 'waitReview'
  });
  let appPkgStatus4 = yield AppPkgStatus.create({
    status: 'waitReview'
  });

  let appPkgLatestStatus1 = yield AppPkgLatestStatus.create({});
  let appPkgLatestStatus2 = yield AppPkgLatestStatus.create({});
  let appPkgLatestStatus3 = yield AppPkgLatestStatus.create({});
  let appPkgLatestStatus4 = yield AppPkgLatestStatus.create({});

  yield appPkgLatestStatus1.setAppPkgStatus(appPkgStatus1);
  yield appPkgLatestStatus1.setAppPkg(appPkg1);
  yield appPkgLatestStatus2.setAppPkgStatus(appPkgStatus2);
  yield appPkgLatestStatus2.setAppPkg(appPkg2);
  yield appPkgLatestStatus3.setAppPkgStatus(appPkgStatus3);
  yield appPkgLatestStatus3.setAppPkg(appPkg3);
  yield appPkgLatestStatus4.setAppPkgStatus(appPkgStatus4);
  yield appPkgLatestStatus4.setAppPkg(appPkg4);

  let voice = yield Voice.create({
    name: 'English Speech'
  });
  let voicePkg = yield VoicePkg.create({
    name: 'Unit One'
  });
  yield voicePkg.setVoice(voice);

  let voicePkgStatus = yield VoicePkgStatus.create({
    status: 'waitReview'
  });
  let voicePkgLatestStatus = yield VoicePkgLatestStatus.create({});
  yield voicePkgLatestStatus.setVoicePkg(voicePkg);
  yield voicePkgLatestStatus.setVoicePkgStatus(voicePkgStatus);

  let deviceModel = yield DeviceModel.create({
    name: 'toy'
  });
  let accountDevice = AccountDevice.create({
    name: 'Toy Tom',
    alias: '1234456sd',
    accessToken: '123456789',
    appManifest: '{}',
    aliyunDeviceId: '123456789',
    wechatDeviceId: '123456789',
    activated: true
  });
  // yield accountDevice.setDeviceModel(deviceModel);
  // yield accountDevice.setAccount(custmerAccount);

  let accountContent = yield AccountContent.create({
    type: 'app',
    accessToken: '123456789'
  });

  yield accountContent.setAccount(custmerAccount);
  yield accountContent.setAppPkg(appPkg1);

  //   yield app.getModel('developerLatestVersion').create({
  //     appID: 'NGYxNTg2ODMtY2U2NS00Y2FiLTljYmQtZDI1ZGY3YWMwMDdj',
  //     appPackageID: 1
  //   });

  //   yield app.getModel('developerLatestVersion').create({
  //     appID: 'MzFiY2YxZGItMGQ0Mi00NDY5LTlkYjAtYWZlYjlhYTg0MTQ1',
  //     appPackageID: 2
  //   });

  //   yield app.getModel('developerLatestVersion').create({
  //     appID: 'ZTZkYWE5NzUtYzU4MC00MGY2LTgwNTAtYzBkYTkyN2Q4ZjFk',
  //     appPackageID: 8
  //   });

  //   const account = yield app.getModel('account').create({
  //     username: 'tosone'
  //   });
  //   yield new Promise(function(resolve, reject) {
  //     account.setPassword('tosone', function(err, user) {
  //       if (err) reject(err);
  //       resolve(user);
  //     })
  //   });
  //   yield account.save();

  //   const roleUser = yield app.getModel('role').create({
  //     name: 'user'
  //   });
  //   const roleAudotor = yield app.getModel('role').create({
  //     name: 'auditor'
  //   });
  //   const roleAdmin = yield app.getModel('role').create({
  //     name: 'admin'
  //   });
  //   const roleDeveloper = yield app.getModel('role').create({
  //     name: 'developer'
  //   });

  //   account.addRole(roleUser);
  //   account.addRole(roleAudotor);
  //   account.addRole(roleAdmin);
  //   account.addRole(roleDeveloper);

  //   const permissionUser = yield app.getModel('permission').create({
  //     name: 'user'
  //   });
  //   const permissionAuditor = yield app.getModel('permission').create({
  //     name: 'auditor'
  //   });
  //   const permissionAdmin = yield app.getModel('permission').create({
  //     name: 'admin'
  //   });
  //   const permissionDeveloper = yield app.getModel('permission').create({
  //     name: 'developer'
  //   });

  //   roleUser.addPermission(permissionUser);
  //   roleAdmin.addPermission(permissionAdmin);
  //   roleAudotor.addPermission(permissionAuditor);
  //   roleDeveloper.addPermission(permissionDeveloper);


  //   const user = yield app.getModel('user').create({
  //     id: 1,
  //     username: 'tosone'
  //   });

  //   yield new Promise(function(resolve, reject) {
  //     user.setPassword('tosone', function(err, user) {
  //       if (err) reject(err);
  //       resolve(user);
  //     });
  //   });

  //   yield user.save();

  //   const userDeveloper = yield app.getModel('user').create({
  //     id: 2,
  //     username: 'developer'
  //   });

  //   yield new Promise(function(resolve, reject) {
  //     userDeveloper.setPassword('developer', function(err, userDeveloper) {
  //       if (err) console.log(err);
  //       resolve(userDeveloper);
  //     });
  //   });

  //   yield userDeveloper.save();

  //   const userAdmin = yield app.getModel('user').create({
  //     id: 3,
  //     username: 'admin'
  //   });

  //   yield new Promise(function(resolve, reject) {
  //     userAdmin.setPassword('admin', function(err, userAdmin) {
  //       if (err) console.log(err);
  //       resolve(userAdmin);
  //     });
  //   });

  //   yield userAdmin.save();

  //   const userAuditor = yield app.getModel('user').create({
  //     id: 4,
  //     username: 'auditor'
  //   });

  //   yield new Promise(function(resolve, reject) {
  //     userAuditor.setPassword('auditor', function(err, userAuditor) {
  //       if (err) console.log(err);
  //       resolve(userAuditor);
  //     });
  //   });

  //   yield userAuditor.save();

  //   yield app.getModel('userAuth').create({
  //     id: 1,
  //     auth: "admin"
  //   });
  //   yield app.getModel('userAuth').create({
  //     id: 2,
  //     auth: "developer"
  //   });
  //   yield app.getModel('userAuth').create({
  //     id: 3,
  //     auth: "user"
  //   });
  //   yield app.getModel('userAuth').create({
  //     id: 4,
  //     auth: "auditor"
  //   });
  //   yield app.getModel('userAuthMap').create({
  //     userID: 1,
  //     AuthID: 3
  //   });
  //   yield app.getModel('userAuthMap').create({
  //     userID: 2,
  //     AuthID: 2
  //   });
  //   yield app.getModel('userAuthMap').create({
  //     userID: 3,
  //     AuthID: 1
  //   });
  //   yield app.getModel('userAuthMap').create({
  //     userID: 4,
  //     AuthID: 4
  //   });
  //   yield app.getModel('deviceModel').create({
  //     id: 1,
  //     name: 'doll456'
  //   });

  //   yield app.getModel('deviceModel').create({
  //     id: 2,
  //     name: 'doll123'
  //   });

  //   yield app.getModel('userDevice').create({
  //     name: 'doll789',
  //     userID: 1,
  //     alias: '123123',
  //     accessToken: 'ertvdfd%d@as&dfg',
  //     deviceModelID: 1
  //   });

  //   yield app.getModel('userDevice').create({
  //     name: 'doll123',
  //     userID: 1,
  //     alias: '123123',
  //     accessToken: 'ertvdfd%d@as&dfg',
  //     deviceModelID: 2
  //   });

  //   yield app.getModel('deviceModelToAppVersion').create({
  //     deviceModelID: 1,
  //     appPackageID: 5
  //   });

  //   yield app.getModel('deviceModelToAppVersion').create({
  //     deviceModelID: 1,
  //     appPackageID: 8
  //   });

  //   yield app.getModel('auditor').create({
  //     id: 5,
  //     name: 'tosone'
  //   });

  //   yield app.getModel('appStoreLatestVersion').create({
  //     appID: 'NGYxNTg2ODMtY2U2NS00Y2FiLTljYmQtZDI1ZGY3YWMwMDdj',
  //     appPackageID: 1
  //   });

  //   yield app.getModel('appStoreLatestVersion').create({
  //     appID: "MzFiY2YxZGItMGQ0Mi00NDY5LTlkYjAtYWZlYjlhYTg0MTQ1",
  //     appPackageID: 2
  //   });

  //   yield app.getModel('appStoreLatestVersion').create({
  //     appID: 'ZTZkYWE5NzUtYzU4MC00MGY2LTgwNTAtYzBkYTkyN2Q4ZjFk',
  //     appPackageID: 8
  //   });

  //   yield app.getModel('auditorLatestVersion').create({
  //     appID: 'NGYxNTg2ODMtY2U2NS00Y2FiLTljYmQtZDI1ZGY3YWMwMDdj',
  //     appPackageID: 1
  //   });

  //   yield app.getModel('auditorLatestVersion').create({
  //     appID: 'MzFiY2YxZGItMGQ0Mi00NDY5LTlkYjAtYWZlYjlhYTg0MTQ1',
  //     appPackageID: 2
  //   });

  //   yield app.getModel('auditorLatestVersion').create({
  //     appID: 'ZTZkYWE5NzUtYzU4MC00MGY2LTgwNTAtYzBkYTkyN2Q4ZjFk',
  //     appPackageID: 8
  //   });

  //   yield app.getModel('appPackageLatestStatus').create({
  //     appPackageID: 1,
  //     statusID: 1
  //   });

  //   yield app.getModel('appPackageLatestStatus').create({
  //     appPackageID: 2,
  //     statusID: 2
  //   });

  //   yield app.getModel('appPackageLatestStatus').create({
  //     appPackageID: 8,
  //     statusID: 8
  //   });

})().then(function() {
  process.exit(0);
}).catch(function(err) {
  console.error(err);
  process.exit(-1);
});
