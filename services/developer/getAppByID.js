"use strict";
module.exports = (app) => {
  let Application = app.getModel("app");
  let DeviceModel = app.getModel("deviceModel");
  let ApplicationPackage = app.getModel("appPackage");
  let ApplicationPackageStatus = app.getModel("appPackageStatus");
  let Developer = app.getModel("developer");
  let LatestVersion = app.getModel("latestVersion");
  const amqp = app.getContext("amqp");

  amqp.on("developer.apps", function* () {
    return Application.findAll({
      attributes: ["id", "name"],
      include: [{
        model: LatestVersion,
        attributes: ["id"],
        include: [{
          model: ApplicationPackage,
          attributes: ["id", "version"],
          include: [{
            model: ApplicationPackageStatus,
            attributes: ["id", "status"]
          }]
        }]
      }, {
        model: Developer,
        attributes: ["id", "name"],
        where: {
          id: 5
        }
      }]
    });
  });

  amqp.on("developer.getAppByID", function* (msg) {
    //返回指定ID的APP的最新版本的详细信息，和兼容设备情况
    return Application.findById(msg.appID, {
      attributes: ["id", "name", "description"],
      include: [{
        model: LatestVersion,
        attributes: ["id"],
        include: [{
          model: ApplicationPackage,
          attributes: ["id", "version", "flow", "description", "appID", "updatedAt"]
        }]
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
      }, {
        model: ApplicationPackageStatus,
        attributes: ["id", "status"]
      }]
    });
  });
  amqp.on("developer.getAppByVersion", function* (msg) {
    return ApplicationPackage.findOne({
      attributes: ["id", "version", "flow", "appID", "updatedAt", "description"],
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
  //检查某个应用最新版本的最新状态
  amqp.on("developer.latestStatus", function* (msg) {
    return Application.findById(msg.id, {
      attributes: ["id"],
      include: [{
        model: LatestVersion,
        attributes: ["id"],
        include: [{
          model: ApplicationPackage,
          attributes: ["id"],
          include: [{
            model: ApplicationPackageStatus,
            attributes: ["id", "status"]
          }]
        }]
      }]
    }).then((data) => {
      return data.latestVersion.appPackage.appPackageStatus.status;
    })
  });
}
