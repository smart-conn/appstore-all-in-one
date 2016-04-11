'use strict';
module.exports = (app) => {
  const amqp = app.getContext("amqp");
  let Application = app.getModel("app");
  let Auditor = app.getModel("auditor");
  let Developer = app.getModel("developer");
  let ApplicationPackage = app.getModel("appPackage");
  let ApplicationPackageStatus = app.getModel("appPackageStatus");
  let AuditorBucket = app.getModel("auditorBucket");
  let LatestVersion = app.getModel("latestVersion");
  //获取某个状态的APP
  amqp.on("apps", function* (msg) {
    const status = msg.status ? {
      status: msg.status
    } : {};
    return Application.findAll({
      attributes: ['id', 'name', 'description'],
      include: [{
        model: LatestVersion,
        attributes: ["id"],
        include: [{
          model: ApplicationPackage,
          attributes: ['id', 'version', 'updatedAt', 'description'],
          include: [{
            model: ApplicationPackageStatus,
            attributes: ["id", "status"],
            where: status
          }]
        }]
      }]
    });
  });

  //获取某个APP的最新版本号
  amqp.on('latestPackageVersion', function* () {
    let id = msg.id;
    return Application.findById(id, {
      include: [{
        model: LatestVersion,
        attributes: ['id'],
        include: [{
          model: ApplicationPackage,
          attributes: ['id', 'version']
        }]
      }]
    }).then((data) => {
      return data.latestVersion.appPackage.version;
    });
  });

  //获取最新版本的状态
  amqp.on('latestPackageStatus', function* (msg) {
    return Application.findById(msg.id, {
      attributes: ['id'],
      include: [{
        model: LatestVersion,
        attributes: ['id'],
        include: [{
          model: ApplicationPackage,
          attributes: ['id'],
          include: [{
            model: ApplicationPackageStatus,
            attributes: ['id', 'status']
          }]
        }]
      }]
    }).then((data) => {
      return data.latestVersion.appPackage.appPackageStatus.status;
    });
  });

  //获取某个版本的APP
  amqp.on('appByVersion', function* (msg) {
    return ApplicationPackage.findOne({
      attributes: ['id', 'version', 'flow', 'appID', 'updatedAt', 'description'],
      where: {
        id: msg.version,
        appID: msg.id
      },
      include: [{
        model: Application,
        attributes: ['id', 'name', 'description', 'icon']
      }, {
        model: DeviceModel,
        attributes: ['id', 'name']
      }]
    });
  });
}
