"use strict";
module.exports = (app) => {
  let Application = app.getModel("app");
  let ApplicationPackage = app.getModel("appPackage");
  let DeviceModel = app.getModel("deviceModel");

  const amqp = app.getContext("amqp");

  amqp.on("developer.getAppByID", function* (msg) {
    //返回指定ID的APP的最新版本的详细信息，和兼容设备情况
    return ApplicationPackage.findOne({
      attributes: ["id", "version", "flow", "description", "appID", "updatedAt"],
      where: {
        appID: msg.appID
      },
      order: [
        ['updatedAt', 'DESC']
      ],
      include: [{
        model: Application,
        attributes: ["id", "name", "description", "icon"]
      }, {
        model: DeviceModel,
        attributes: ["id", "name"]
      }]
    });
  });
  amqp.on("developer.getHistoryVersionsByID", function* (msg) {
    return ApplicationPackage.findAll({
      attributes: ["id", "version", "appID", "updatedAt"],
      where: {
        appID: msg.appID
      },
      order: [
        ['updatedAt', 'DESC']
      ],
      include: [{
        model: Application,
        attributes: ["id", "name", "description", "icon"]
      }, {
        model: DeviceModel,
        attributes: ["id", "name"]
      }]
    });
  });
  amqp.on("developer.getAppByVersion", function* (msg) {
    return ApplicationPackage.findOne({
      attributes: ["id", "version", "appID", "updatedAt", "description"],
      where: {
        id: msg.version,
        appID: msg.id
      },
      include: [{
        model: Application,
        attributes: ["id", "name", "description", "icon"]
      }, {
        model: DeviceModel,
        attributes: ["id", "name"]
      }]
    })
  });
}
