"use strict";
module.exports = (app) => {
  const amqp = app.getContext("amqp");
  const Application = app.getModel("app");
  const DeviceModel = app.getModel("deviceModel");
  const ApplicationPackage = app.getModel("appPackage");
  const ApplicationPackageStatus = app.getModel("appPackageStatus");
  const LatestVersion = app.getModel("latestVersion");
  const Developer = app.getModel("developer");
  //添加新的APP提交审核
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
  //编辑原有的APP信息
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
  // 发布一个新版本并提交审核
  amqp.on("developer.upgradeApp", function* (msg) {
    let latestStatus = yield amqp.call("developer.latestStatus", {
      id: msg.appID
    });
    if (latestStatus == "reviewPass" || latestStatus == "reviewFail" || latestStatus == "onboard" || latestStatus == "edit") {
      yield Application.upsert({
        id: msg.appID,
        name: msg.name,
        description: msg.app.description,
        author: msg.name
      });
      let appPackage = null;
      if (latestStatus == "edit") { //如果最新版本处于编辑状态，不建立新的版本，只是更改原有信息
        yield ApplicationPackage.upsert({
          id: msg.id,
          version: msg.version,
          flow: msg.flow,
          description: msg.description
        });
        appPackage = yield ApplicationPackage.findById(msg.id);
      } else {
        appPackage = yield ApplicationPackage.create({
          version: msg.version,
          flow: msg.flow,
          description: msg.description
        });
      }
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
  //保存一个新的APP
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
