'use strict';
module.exports = (app) => {
  const amqp = app.getContext('amqp');

  const User = app.getModel('user');
  const Application = app.getModel('app');
  const UserDevice = app.getModel('userDevice');
  const DeviceModel = app.getModel('deviceModel');
  const LatestVersion = app.getModel('latestVersion');
  const ApplicationPackage = app.getModel('appPackage');
  const ApplicationPackageStatus = app.getModel("appPackageStatus");

  //获取某个型号兼容的app的最新版本
  amqp.on("latestAppByDeviceModel", function* (msg) {
    const deviceModel = msg.deviceModel;
    const appID = msg.appID;

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
    if (data) {
      return data.appPackages.map(function (item) {
        return {
          id: item.id,
          version: item.version
        };
      }).sort()[0]; //可能最新版本并不支持此型号设备，需要对appPackage进行排序，取出最新版本
    }
  });

}
