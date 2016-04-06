"use strict";
module.exports = (app) => {
  const amqp = app.getContext("amqp");
  const Application = app.getModel("app");
  const DeviceModel = app.getModel("deviceModel");
  const ApplicationPackage = app.getModel("appPackage");
  const ApplicationPackageStatus = app.getModel("appPackageStatus");

  amqp.on("developer.newApp", function* (msg) {
    let app = yield Application.create({
      id: msg.appID,
      name: msg.name,
      description: msg.app.description,
      author: msg.name,
    });
    let appPackage = yield ApplicationPackage.create({
      id: msg.id,
      version: msg.version,
      flow: msg.flow,
      description: msg.description
    });
    appPackage.setApp(app);
    let deviceModelID = [];
    msg.deviceModels.forEach(function (deviceModel) {
      deviceModelID.push(deviceModel.id);
    });
    yield appPackage.removeDeviceModels(yield DeviceModel.findAll()); //移除所有的APP版本和型号之间的关系
    yield appPackage.addDeviceModels(yield DeviceModel.findAll({
      where: {
        id: deviceModelID
      }
    }));
    yield appPackage.setAppPackageStatus(yield ApplicationPackageStatus.create({
      status: "waitReview"
    }));
    return true;
  });
  amqp.on("developer.editApp", function* (msg) {
    yield Application.upsert({
      id: msg.appID,
      name: msg.name,
      description: msg.app.description,
      author: msg.name
    });
    yield ApplicationPackage.upsert({
      id: msg.id,
      version: msg.version,
      flow: msg.flow,
      description: msg.description
    });
    let deviceModelID = [];
    msg.deviceModels.forEach(function (deviceModel) {
      deviceModelID.push(deviceModel.id);
    });
    let appPackage = yield ApplicationPackage.findOne({
      where: {
        id: msg.id
      }
    });
    yield appPackage.removeDeviceModels(yield DeviceModel.findAll()); //移除所有的APP版本和型号之间的关系
    yield appPackage.addDeviceModels(yield DeviceModel.findAll({
      where: {
        id: deviceModelID
      }
    }));
    yield appPackage.setAppPackageStatus(yield ApplicationPackageStatus.create({
      status: "edit"
    }));
    return true;
  });
  amqp.on("developer.upgradeApp", function* (msg) {
    yield Application.upsert({
      id: msg.appID,
      name: msg.name,
      description: msg.app.description,
      author: msg.name
    });
    let appPackage = yield ApplicationPackage.create({
      version: msg.version,
      flow: msg.flow,
      description: msg.description
    });
    appPackage.setApp(yield Application.findOne({
      where: {
        id: msg.appID
      }
    }));
    let deviceModelID = [];
    msg.deviceModels.forEach(function (deviceModel) {
      deviceModelID.push(deviceModel.id);
    });
    yield appPackage.removeDeviceModels(yield DeviceModel.findAll()); //移除所有的APP版本和型号之间的关系
    yield appPackage.addDeviceModels(yield DeviceModel.findAll({
      where: {
        id: deviceModelID
      }
    }));
    yield appPackage.setAppPackageStatus(yield ApplicationPackageStatus.create({
      status: "waitReview"
    }));
    return true;
  });
  //检查某个应用是否可以被升级或者提交审核即检查是否存在等待审核，审核中的版本
  //edit:可以发新版
  //waitReview:不可以发新版
  //reviewing:不可以发新版
  amqp.on("developer.versionStatus", function* (msg) {
    return Application.find({
      where: {
        id: msg.id
      },
      attributes: ["id"],
      include: [{
        model: ApplicationPackage,
        attributes: ["id", "updatedAt"],
        order: [
          ['updatedAt', 'DESC']
        ],
        include: [{
          model: ApplicationPackageStatus,
          attributes: ["id", "status"]
        }]
      }]
    }).then((data) => {
      return data ? data.appPackages[0].appPackageStatus.status : null;
    });
  })
}
