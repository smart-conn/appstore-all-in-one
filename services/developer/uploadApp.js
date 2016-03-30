"use strict";
module.exports = (app) => {
  const amqp = app.getContext("amqp");
  const Application = app.getModel("app");
  const DeviceModel = app.getModel("deviceModel");
  const ApplicationPackage = app.getModel("appPackage");

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
    return true;
  });
}
