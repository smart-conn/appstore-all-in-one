"use strict";
module.exports = (app) => {
  const amqp = app.getContext("amqp");

  const Application = app.getModel("app");
  const Developer = app.getModel("developer");
  const DeviceModel = app.getModel("deviceModel");
  const ApplicationPackage = app.getModel("appPackage");
  const ApplicationPackageStatus = app.getModel("appPackageStatus");
  const DeveloperLatestVersion = app.getModel("developerLatestVersion");
  const AppPackageLatestStatus = app.getModel('appPackageLatestStatus');

  amqp.on("developer.apps", function* (msg) {
    const developer = msg.developerID ? {
      id: msg.developerID
    } : {};

    return Application.findAll({
      attributes: ["id", "name"],
      include: [{
        model: DeveloperLatestVersion,
        attributes: ["id"],
        include: [{
          model: ApplicationPackage,
          attributes: ["id", "version"],
          include: [{
            model: AppPackageLatestStatus,
            attributes: ['id'],
            include: [{
              model: ApplicationPackageStatus,
              attributes: ["id", "status"]
            }]
          }]
        }]
      }, {
        model: Developer,
        attributes: ["id", "name"],
        where: developer
      }]
    });
  });

  //返回指定ID的APP的最新版本的详细信息，和兼容设备情况
  amqp.on("developer.latestApp", function* (msg) {
    const appID = msg.appID;

    return Application.findById(appID, {
      attributes: ["id", "name", "description"],
      include: [{
        model: DeveloperLatestVersion,
        attributes: ["id"],
        include: [{
          model: ApplicationPackage,
          attributes: ["id", "version", "description", 'flow'],
          include: [{
            model: DeviceModel,
            attributes: ["id", "name"]
          }]
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
  amqp.on("developer.appByVersion", function* (msg) {
    const versionID = msg.versionID;
    const appID = msg.appID;

    return ApplicationPackage.findOne({
      attributes: ["id", "version", "flow", "appID", "updatedAt", "description"],
      where: {
        id: versionID,
        appID: appID
      },
      include: [{
        model: Application,
        attributes: ["id", "name", "description", "icon"]
      }, {
        model: DeviceModel,
        attributes: ["id", "name"]
      }]
    });
  });
  //检查某个应用最新版本的最新状态
  amqp.on("developer.latestStatus", function* (msg) {
    const appID = msg.appID;

    return Application.findById(appID, {
      attributes: ["id"],
      include: [{
        model: DeveloperLatestVersion,
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
      return data.developerLatestVersion.appPackage.appPackageStatus.status;
    })
  });
}
