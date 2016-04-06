"use strict";
module.exports = (app) => {
  const amqp = app.getContext("amqp");
  const Application = app.getModel("app");
  const DeviceModel = app.getModel("deviceModel");
  const ApplicationPackage = app.getModel("appPackage");
  const ApplicationPackageStatus = app.getModel("appPackageStatus");
  const LatestVersion = app.getModel("latestVersion");
  const Developer = app.getModel("developer");

  amqp.on("developer.newApp", function* (msg) {
    let developer = yield Developer.findById(5);
    let latestVersion = yield LatestVersion.create({});
    let app = yield Application.create({
      name: msg.app.name,
      description: msg.app.description,
      icon: "1.jpg"
    });
    let appPackage = yield ApplicationPackage.create({
      version: msg.version,
      flow: msg.flow,
      description: msg.description
    });
    //app和开发者之间的关系
    app.setDeveloper(developer);
    //app和各个版本之间的关系
    appPackage.setApp(app);
    let deviceModelID = [];
    msg.deviceModels.forEach(function (deviceModel) {
      deviceModelID.push(deviceModel.id);
    });
    //版本和型号的关系
    yield appPackage.removeDeviceModels(yield DeviceModel.findAll()); //移除所有的APP版本和型号之间的关系
    yield appPackage.addDeviceModels(yield DeviceModel.findAll({
      where: {
        id: deviceModelID
      }
    }));
    //版本和其状态之间的关系
    yield appPackage.setAppPackageStatus(yield ApplicationPackageStatus.create({
      status: "waitReview"
    }));
    //app和最新版本之间的关系
    app.setLatestVersion(latestVersion);
    latestVersion.setAppPackage(appPackage);
    return true;
  });
  amqp.on("developer.editApp", function* (msg) {
    let latestStatus = yield amqp.call("developer.latestStatus", {
      id: msg.appID
    });
    if (latestStatus == "edit") {
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
      //版本和型号的关系
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
    } else {
      return false;
    }
  });
  amqp.on("developer.upgradeApp", function* (msg) {
    let latestStatus = yield amqp.call("developer.latestStatus", {
      id: msg.appID
    });
    console.log(msg);
    if (latestStatus == "reviewPass" || latestStatus == "reviewFail" || latestStatus == "onboard" || latestStatus == "edit") {
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
      let latestVersion = yield LatestVersion.find({
        where: {
          appID: msg.appID
        }
      });
      let app = yield Application.find({
        where: {
          id: msg.appID
        }
      });
      console.log(msg.appID);
      let deviceModelID = [];
      msg.deviceModels.forEach(function (deviceModel) {
        deviceModelID.push(deviceModel.id);
      });
      //版本和型号的关系
      yield appPackage.removeDeviceModels(yield DeviceModel.findAll());
      yield appPackage.addDeviceModels(yield DeviceModel.findAll({
        where: {
          id: deviceModelID
        }
      }));
      //app和各个版本之间的关系
      yield appPackage.setApp(app);
      //版本和其状态之间的关系
      yield appPackage.setAppPackageStatus(yield ApplicationPackageStatus.create({
        status: "waitReview"
      }));
      //最新版本的关系
      // yield app.setLatestVersion(latestVersion);
      yield latestVersion.setAppPackage(appPackage);
      return true;
    } else {
      return false;
    }
  });
  amqp.on("developer.saveApp", function* (msg) {
    let developer = yield Developer.findById(5);
    let latestVersion = yield LatestVersion.create({});
    let app = yield Application.create({
      name: msg.app.name,
      description: msg.app.description,
      icon: "1.jpg"
    });
    let appPackage = yield ApplicationPackage.create({
      version: msg.version,
      flow: msg.flow,
      description: msg.description
    });
    //app和开发者之间的关系
    app.setDeveloper(developer);
    //app和各个版本之间的关系
    appPackage.setApp(app);
    let deviceModelID = [];
    msg.deviceModels.forEach(function (deviceModel) {
      deviceModelID.push(deviceModel.id);
    });
    //版本和型号的关系
    yield appPackage.removeDeviceModels(yield DeviceModel.findAll()); //移除所有的APP版本和型号之间的关系
    yield appPackage.addDeviceModels(yield DeviceModel.findAll({
      where: {
        id: deviceModelID
      }
    }));
    //版本和其状态之间的关系
    yield appPackage.setAppPackageStatus(yield ApplicationPackageStatus.create({
      status: "edit"
    }));
    //app和最新版本之间的关系
    app.setLatestVersion(latestVersion);
    latestVersion.setAppPackage(appPackage);
    return true;
  });
}
