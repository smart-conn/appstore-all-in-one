module.exports = (app) => {
  const amqp = app.getContext('amqp');
  const ApplicationPackage = app.getModel('appPackage');
  const UserDevice = app.getModel('userDevice');
  const DeviceModel = app.getModel('deviceModel');

  amqp.on("app.findUserDevices", function* (msg) {
    let appID = msg.appID;
    let userID = msg.userID;
    //获得用户所有的设备
    let user = yield User.findOne({
      where: {
        id: userID
      },
      include: [UserDevice]
    });
    //获得用户所有的设备型号ID
    let deviceModels = user.userDevices.map(function (device) {
      return {
        id: device.deviceModelID,
        name: device.name
      };
    });
    for (let deviceModel of deviceModels) {
      yield DeviceModel.findById(deviceModel.id, {
        include: [{
          model: ApplicationPackage,
          where: {
            appID: appID
          }
        }]
      }).then(function (availablePackage) {
        if (availablePackage) {
          if (availablePackage.appPackages && availablePackage.appPackages.length >= 1) {
            deviceModel.canInstall = true;
          } else {
            deviceModel.canInstall = false;
          }
        } else {
          deviceModel.canInstall = false;
        }
      }).catch((err) => {
        console.log(err);
      });
    }
    return deviceModels;
  });
};
