'use strict';
module.exports = (app) => {
  const amqp = app.getContext('amqp');

  const Application = app.getModel('app');
  const Auditor = app.getModel('auditor');
  const Developer = app.getModel('developer');
  const DeviceModel = app.getModel('deviceModel');
  const AuditorBucket = app.getModel('auditorBucket');
  const LatestVersion = app.getModel('latestVersion');
  const ApplicationPackage = app.getModel('appPackage');
  const ApplicationPackageStatus = app.getModel('appPackageStatus');


  //获取某种条件下APP的集合
  amqp.on('app.apps', function* (msg) {
    const status = msg.status ? {
      status: msg.status
    } : {};
    const developerID = msg.developerID ? {
      id: msg.developerID
    } : {};

    return Application.findAll({
      attributes: ['id', 'name', 'description'],
      include: [{
        model: LatestVersion,
        attributes: ['id'],
        include: [{
          model: ApplicationPackage,
          attributes: ['id', 'version', 'updatedAt', 'description'],
          include: [{
            model: ApplicationPackageStatus,
            attributes: ['id', 'status'],
            where: status
          }]
        }]
      }, {
        model: Developer,
        attributes: ['id', 'name'],
        where: developerID
      }]
    });
  });

  //获取某个APP的最新版本号
  amqp.on('app.latestPackageVersion', function* (msg) {
    const id = msg.id; //APP的ID

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

  //获取某个应用某个版本的状态
  amqp.on('app.packageStatus', function* (msg) {
    const appID = msg.appID; //APP的ID
    const version = msg.version; //应用的版本ID

    return Application.findById(id, {
      attributes: ['id'],
      include: [{
        model: ApplicationPackage,
        attributes: ['id'],
        where: {
          id: version
        },
        include: [{
          model: ApplicationPackageStatus,
          attributes: ['id', 'status']
        }]
      }]
    }).then((data) => {
      return data.appPackage.appPackageStatus.status;
    });
  });

  //获取最新版本的状态
  amqp.on('app.latestPackageStatus', function* (msg) {
    const id = msg.id; //APP的ID

    return Application.findById(id, {
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
  amqp.on('app.appByVersion', function* (msg) {
    const versionID = msg.versionID; //APP的版本ID
    const appID = msg.appID; //APP的ID

    return ApplicationPackage.findOne({
      attributes: ['id', 'version', 'flow', 'appID', 'updatedAt', 'description'],
      where: {
        id: versionID,
        appID: appID
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

  //获取某个版本是否为最新版本
  amqp.on('app.isLatest', function* (msg) {
    const versionID = msg.versionID; //APP的版本ID
    const appID = msg.appID; //APP的ID

    return Application.findById(appID, {
      attributes: ['id'],
      include: [{
        model: LatestVersion,
        attributes: ['id'],
        include: [{
          model: ApplicationPackage,
          attributes: ['id']
        }]
      }]
    }).then((data) => {
      return data.latestVersion.appPackage.id.toString() === versionID;
    });
  });
}
