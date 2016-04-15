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
  const AppStoreLatestVersion = app.getModel('appStoreLatestVersion');

  //查询AppStore的APP列表
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
}
