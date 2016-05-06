'use strict';
const _ = require('lodash');

module.exports = function (app) {

  const amqp = app.getContext('amqp');

  const User = app.getModel('user');
  const Application = app.getModel('app');
  const UserApp = app.getModel('userApp');
  const Developer = app.getModel('developer');
  const UserDevice = app.getModel('userDevice');
  const DeviceModel = app.getModel('deviceModel');
  const LatestVersion = app.getModel('latestVersion');
  const ApplicationPackage = app.getModel('appPackage');
  const ApplicationPackageStatus = app.getModel("appPackageStatus");
  const AppStoreLatestVersion = app.getModel('appStoreLatestVersion');

  // 查询AppStore的APP列表
  amqp.on('appStore.apps', function* (msg) {
    return Application.findAll({
      attributes: ['id', 'name', 'description'],
      include: [{
        model: AppStoreLatestVersion,
        attributes: ['id'],
        include: [{
          model: ApplicationPackage,
          attributes: ['id', 'version', 'description']
        }]
      }, {
        model: Developer,
        attributes: ['id', 'name']
      }]
    });
  });

  //某个指定ID的APP
  amqp.on("appStore.app", function* (msg) {
    const appID = msg.appID;

    return Application.findById(appID);
  });

  //应用商店最新版本APP
  amqp.on("appStore.latestVersion", function* (msg) {
    const appID = msg.appID;

    return Application.findById(appID, {
      attributes: ['id', 'name', 'description'],
      include: [{
        model: AppStoreLatestVersion,
        attributes: ['id'],
        include: [{
          model: ApplicationPackage,
          attributes: ['id', 'version', 'description']
        }]
      }]
    });
  });

  amqp.on("app.findAllApps", (msg, callback) => {
    Application.findAll({
      include: [{
        model: LatestVersion,
        include: [{
          model: ApplicationPackage,
          include: [{
            model: ApplicationPackageStatus,
            where: {
              status: "reviewPass"
            }
          }]
        }]
      }]
    }).then(function (apps) {
      return callback(null, apps);
    });
  });

  amqp.on("app.findAppByID", function* (msg) {
    return Application.findById(msg.appID);
  });
  //查找某用户所有的设备
  amqp.on("app.findAllDeviceByID", function* (msg) {
    let appID = msg.appID;
    let userID = msg.userID;
    //获得用户所有的设备
    let user = yield User.findOne({
      where: {
        id: userID
      },
      include: [UserDevice]
    });
    //获得用户所有的设备型号ID
    let deviceModels = user.userDevices.map(function (device) {
      return {
        id: device.deviceModelID,
        name: device.name
      };
    });
    for (let deviceModel of deviceModels) {
      let availablePackage = yield DeviceModel.findById(deviceModel.id, {
        include: [{
          model: ApplicationPackage,
          where: {
            appID: appID
          }
        }]
      });
      if (availablePackage) {
        if (availablePackage.appPackages && availablePackage.appPackages.length >= 1) {
          deviceModel.canInstall = true;
        } else {
          deviceModel.canInstall = false;
        }
      } else {
        deviceModel.canInstall = false;
      }
    }
    return deviceModels;
  });

  /**
   * msg.deviceModel:设备型号
   * msg.appID:应用ID
   */
  amqp.on("app.findLatestVersionByDeviceModel", function* (msg) {
    let deviceModel = msg.deviceModel;
    let appID = msg.appID;
    let data = yield DeviceModel.findOne({
      where: {
        id: deviceModel
      },
      include: [{
        model: ApplicationPackage,
        where: {
          appID: appID
        }
      }]
    });
    console.log(data);
    if (data) {
      return data.appPackages.map(function (item) {
        return {
          id: item.id,
          version: item.version
        };
      }).sort()[0];
    }
  });

  amqp.on('appStore.bought', function* (msg) {
    let id = msg.id;

    return yield User.findById(id, {
      include: [{
        model: UserApp,
        include: [{
          model: Application
        }]
      }]
    }).then((data) => {
      return data.userApps
    });
  })
};
