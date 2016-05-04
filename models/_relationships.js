'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.models['user'];
  const Auditor = sequelize.models['auditor'];
  const Application = sequelize.models['app'];
  const Developer = sequelize.models['developer'];
  const UserDevice = sequelize.models['userDevice'];
  const AppPackage = sequelize.models['appPackage'];
  const DeviceModel = sequelize.models['deviceModel'];
  const AuditorBucket = sequelize.models['auditorBucket'];
  const AppPackageStatus = sequelize.models['appPackageStatus'];
  const ThirdParty = sequelize.models['thirdParty'];
  const Order = sequelize.models['order'];
  const OrderItem = sequelize.models['orderItem'];
  const Purse = sequelize.models['purse'];
  const PurseLog = sequelize.models['purseLog'];

  const DeviceModelMap = sequelize.define('deviceModelToAppVersion', {}); //APP版本和型号之间的兼容双向关系表

  const DeveloperLatestVersion = sequelize.define('developerLatestVersion', {}); //开发人员最新版本
  const AuditorLatestVersion = sequelize.define('auditorLatestVersion', {}); //由开发人员给审核人员提交的最新审核版本
  const AppStoreLatestVersion = sequelize.define('appStoreLatestVersion', {}); //应用商店中的最新版本

  const AppPackageLatestStatus = sequelize.define('appPackageLatestStatus', {}); //APP历史版本的最新状态

  const UserAuthMap = sequelize.define('userAuthMap', {}); //用户权限关系表
  const UserAuth = sequelize.define('userAuth', { //权限表
    auth: Sequelize.STRING //developer admin auditor user
  });
  const ThirdPartyAuthMap = sequelize.define('thirdPartyAuthMap', {}); //第三方登录权限对应关系

  //订单和订单对象
  Order.hasMany(OrderItem, {
    foreignKey: 'orderID'
  });
  OrderItem.belongsTo(Order, {
    foreignKey: 'orderID'
  });

  //用户和订单
  User.hasMany(Order, {
    foreignKey: 'userID'
  });
  Order.belongsTo(User, {
    foreignKey: 'userID'
  });

  //用户和钱包
  User.hasOne(Purse, {
    foreignKey: 'userID'
  });
  Purse.belongsTo(User, {
    foreignKey: 'userID'
  });

  //用户和钱包日志
  User.hasMany(PurseLog, {
    foreignKey: 'userID'
  });
  PurseLog.belongsTo(User, {
    foreignKey: 'userID'
  });

  //应用和订单对象
  Application.hasOne(OrderItem, {
    foreignKey: 'appID'
  });
  OrderItem.belongsTo(Application, {
    foreignKey: 'appID'
  });

  //声音和订单对象
  // Voice.hasOne(OrderItem, {
  //   foreignKey: 'voiceID'
  // });
  // OrderItem.belongsTo(Voice, {
  //   foreignKey: 'voiceID'
  // });

  //用户和商品
  // User.hasMany(Product, {
  //   foreignKey: 'userID'
  // });
  // Product.hasOne(User, {
  //   foreignKey: 'userID'
  // });

  //开发者最新版本
  Application.hasOne(DeveloperLatestVersion, {
    foreignKey: 'appID'
  });
  DeveloperLatestVersion.belongsTo(Application, {
    foreignKey: 'appID'
  });
  DeveloperLatestVersion.belongsTo(AppPackage, {
    foreignKey: 'appPackageID'
  });
  AppPackage.hasOne(DeveloperLatestVersion, {
    foreignKey: 'appPackageID'
  });

  //最新的审核版本
  Application.hasOne(AuditorLatestVersion, {
    foreignKey: 'appID'
  });
  AuditorLatestVersion.belongsTo(Application, {
    foreignKey: 'appID'
  })
  AuditorLatestVersion.belongsTo(AppPackage, {
    foreignKey: 'appPackageID'
  });
  AppPackage.hasOne(AuditorLatestVersion, {
    foreignKey: 'appPackageID'
  })

  //应用商店的最新版本
  Application.hasOne(AppStoreLatestVersion, {
    foreignKey: 'appID'
  });
  AppStoreLatestVersion.belongsTo(Application, {
    foreignKey: 'appID'
  });
  AppStoreLatestVersion.belongsTo(AppPackage, {
    foreignKey: 'appPackageID'
  });
  AppPackage.hasOne(AppStoreLatestVersion, {
    foreignKey: 'appPackageID'
  });

  //APP历史版本的最新状态
  AppPackage.hasOne(AppPackageLatestStatus, {
    foreignKey: 'appPackageID'
  });
  AppPackageLatestStatus.belongsTo(AppPackage, {
    foreignKey: 'appPackageID'
  });
  AppPackageLatestStatus.belongsTo(AppPackageStatus, {
    foreignKey: 'statusID'
  });
  AppPackageStatus.hasOne(AppPackageLatestStatus, {
    foreignKey: 'statusID'
  });

  //APP有多个版本
  AppPackage.belongsTo(Application, {
    foreignKey: 'appID'
  });
  Application.hasMany(AppPackage, {
    foreignKey: 'appID'
  });

  //每个版本有多个状态
  AppPackage.hasMany(AppPackageStatus, {
    foreignKey: 'appPackageID'
  });
  AppPackageStatus.belongsTo(AppPackage, {
    foreignKey: 'appPackageID'
  });

  //每个用户有多个设备
  UserDevice.belongsTo(User, {
    foreignKey: 'userID'
  });
  User.hasMany(UserDevice, {
    foreignKey: 'userID'
  });

  //用户权限
  User.belongsToMany(UserAuth, {
    through: UserAuthMap,
    foreignKey: 'userID'
  });
  UserAuth.belongsToMany(User, {
    through: UserAuthMap,
    foreignKey: 'AuthID'
  });

  //第三方帐号权限
  ThirdParty.belongsToMany(UserAuth, {
    through: ThirdPartyAuthMap,
    foreignKey: 'thirdPartyID'
  });
  UserAuth.belongsToMany(ThirdParty, {
    through: ThirdPartyAuthMap,
    foreignKey: 'AuthID'
  });

  //第三方登录
  ThirdParty.belongsTo(User, {
    foreignKey: 'userID'
  });
  User.hasMany(ThirdParty, {
    foreignKey: 'userID'
  });

  //用户设备属于某种型号
  DeviceModel.hasMany(UserDevice, {
    foreignKey: 'deviceModelID'
  });
  UserDevice.belongsTo(DeviceModel, {
    foreignKey: 'deviceModelID'
  });

  //每个版本与设备信号之间的兼容性
  AppPackage.belongsToMany(DeviceModel, {
    through: DeviceModelMap,
    foreignKey: 'appPackageID'
  });
  DeviceModel.belongsToMany(AppPackage, {
    through: DeviceModelMap,
    foreignKey: 'deviceModelID'
  });

  //开发者可以拥有很多应用
  Developer.hasMany(Application, {
    foreignKey: 'developerID'
  });
  Application.belongsTo(Developer, {
    foreignKey: 'developerID'
  });

  //AuditorBucket与Auditor和App
  AuditorBucket.belongsTo(Application, {
    foreignKey: 'appID'
  });
  Application.hasMany(AuditorBucket, {
    foreignKey: 'appID'
  });
  AuditorBucket.belongsTo(Auditor, {
    foreignKey: 'auditorID'
  });
  Auditor.hasMany(AuditorBucket, {
    foreignKey: 'auditorID'
  });
}
