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

  //上架某个应用
  amqp.on('appState.onboard', function* (msg) {
    const appID = msg.appID;
    const versionID = msg.versionID;

    if (yield amqp.call('app.isLatest', msg)) {
      let applicationPackage = yield ApplicationPackage.findOne({
        where: {
          appID: appID,
          id: versionID
        }
      });
      let applicationPackageStatus = yield ApplicationPackageStatus.create({
        status: "onboard"
      });
      return yield applicationPackage.setAppPackageStatus(applicationPackageStatus);
    }
  });

}
