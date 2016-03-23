"use strict";
const _ = require('underscore');
module.exports = function(app) {

  const amqp = app.getContext('amqp');
  const Application = app.getModel('app');
  const ApplicationVersion = app.getModel('app_version');
  const UserDevice = app.getModel('user_device');
  const User = app.getModel('user');
  const deviceCompatibleVersion = app.getModel('deviceCompatibleVersion');
  amqp.on("app.findAllApps", (msg, callback) => {
    Application.findAll().then(function(apps) {
      return callback(null, apps);
    });
  });

  amqp.on("app.findAppByID", function*(msg) {
    return Application.findOne({
      where: {
        appid: msg.appID
      },
      include: [ApplicationVersion]
    });
  });
  //查找某用户所有的设备
  amqp.on("app.findAllDeviceByID", function*(msg) {
    let appID = msg.appID;
    let user = yield User.findOne({
      where: {
        id: "852741"
      },
      include: [UserDevice]
    });
    let deviceModels = user.userDevices.map(function(device) {
      return device.deviceCompatibleVersionId;
    });
    return yield Promise.all(deviceModels.map(function(deviceModel) {
      return amqp.call("app.findLatestVersionByDeviceModel", {
        deviceModel: deviceModel,
        appID: appID
      });
    }));
    // user.allDevices.forEach((device) => {

    // });
    // return allDevices;
  });

  /**
   * deviceModel: 
   * appID: 
   */
  amqp.on("app.findLatestVersionByDeviceModel", function*(msg) {
    let deviceModel = msg.deviceModel;
    let appID = msg.appID;
    let data = yield deviceCompatibleVersion.findOne({
      where: {
        id: deviceModel
      },
      include: [{
        model: ApplicationVersion,
        where: {
          appid: appID
        }
      }]
    });
    console.log(data);
    return data.appVersions.map(function(item) {
      return item.id;
    }).sort()[0];
  })
};