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

  /**
   * 上架应用：
   * @param  {[type]} 'appState.onboard' [description]
   * @param  {[type]} function*          (msg          [description]
   * @return {[type]}                    [description]
   */
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
    } else {
      return {
        code: 501,
        msg: "不是最新版本"
      }
    }
  });
}
