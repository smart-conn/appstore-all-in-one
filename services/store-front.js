"use strict";
const _ = require('underscore');
module.exports = function (app) {

  const amqp = app.getContext('amqp');
  const Application = app.getModel('app');
  const ApplicationPackage = app.getModel('appPackage');
  const UserDevice = app.getModel('userDevice');
  const User = app.getModel('user');
  const DeviceModel = app.getModel('deviceModel');

  amqp.on("app.findAllApps", (msg, callback) => {
    Application.findAll().then(function (apps) {
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

  })
};
