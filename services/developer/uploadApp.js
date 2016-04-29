"use strict";
module.exports = (app) => {
  const amqp = app.getContext("amqp");
  const Application = app.getModel("app");
  const DeviceModel = app.getModel("deviceModel");
  const ApplicationPackage = app.getModel("appPackage");
  const ApplicationPackageStatus = app.getModel("appPackageStatus");
  const Developer = app.getModel("developer");
  const AppPackageLatestStatus = app.getModel('appPackageLatestStatus');
  const DeveloperLatestVersion = app.getModel('developerLatestVersion');
  const AuditorLatestVersion = app.getModel('auditorLatestVersion');

  //以下四个逻辑很相似但是在建立关系的时候略有不同，暂时决定不进行拆分合并，以便于后边的修改维护

  //添加新的APP提交审核
  amqp.on("developer.newApp", function* (msg) {
    const name = msg.app.name;
    const description = msg.app.description;
    const version = msg.version;
    const flow = msg.flow;
    const descriptionUpgrade = msg.description;

    let developer = yield Developer.findById(5);
    let app = yield Application.create({
      name,
      description,
      icon: "1.jpg"
    });
    let appPackage = yield ApplicationPackage.create({
      version,
      flow,
      description: descriptionUpgrade
    });
    let deviceModelID = [];
    msg.deviceModels.forEach(function (deviceModel) {
      deviceModelID.push(deviceModel.id);
    });
    let appPackageStatus = yield ApplicationPackageStatus.create({
      status: "waitReview"
    });
    let appPackageLatestStatus = yield AppPackageLatestStatus.create();
    let developerLatestVersion = yield DeveloperLatestVersion.create();
    let auditorLatestVersion = yield AuditorLatestVersion.create();
    return [
      yield app.setDeveloper(developer), //设置开发者
      yield appPackage.setApp(app), //添加历史版本
      yield appPackageLatestStatus.setAppPackage(appPackage), //APP的最新历史版本状态
      yield appPackageLatestStatus.setAppPackageStatus(appPackageStatus), //APP的最新历史版本状态
      yield appPackageStatus.setAppPackage(appPackage), //为APP添加一个历史状态
      yield developerLatestVersion.setApp(app), //添加开发者应用
      yield developerLatestVersion.setAppPackage(appPackage), //添加开发者最新历史版本
      yield auditorLatestVersion.setApp(app),//添加审核APP
      yield auditorLatestVersion.setAppPackage(appPackage),//添加审核版本
      yield appPackage.addDeviceModels(yield DeviceModel.findAll({
        where: {
          id: deviceModelID
        }
      })) //添加兼容性关系
    ];
  });

  //编辑原有的APP信息
  amqp.on("developer.editApp", function* (msg) {
    const appPackageID = msg.id;
    const appID = msg.appID;//
    const name = msg.app.name;
    const description = msg.app.description;
    const version = msg.version;
    const flow = msg.flow;
    const descriptionUpgrade = msg.description;
    const status = yield amqp.on("developer.latestStatus", {
      appID
    });

    let msgRet = [];//返回值

    let app = yield Application.findById(appID);
    //修改APP信息
    yield Application.upsert({
      id: appID,
      name,
      description
    });
    let appPackage = null;
    //确定是否需要创建一个新的状态版本
    if (status == "waitReview") {
      //创建新的状态版本，修改开发人员最新版本指向
      appPackage = yield ApplicationPackage.create({
        version,
        flow,
        description
      });
      let appPackageStatus = yield ApplicationPackageStatus.create({
        status: "edit"
      });
      msgRet.push(yield appPackageStatus.setAppPackage(appPackage));//为一个版本添加一个状态
      let developerLatestVersion = yield DeveloperLatestVersion.findById(appID);
      msgRet.push(yield developerLatestVersion.setAppPackage(appPackage));//更新开发者最新版本指向
    } else if (status == "edit") {
      //修改状态版本内容，所有关系原封不动
      msgRet.push(yield ApplicationPackage.upsert({
        id: appPackageID,
        version,
        flow,
        description
      }));
      appPackage = yield ApplicationPackage.findById(appPackageID);
    }
    //重建APP版本和型号之间的兼容关系
    let deviceModelID = [];
    msg.deviceModels.forEach(function (deviceModel) {
      deviceModelID.push(deviceModel.id);
    });
    msgRet.push(yield appPackage.removeDeviceModels(yield DeviceModel.findAll()));
    msgRet.push(yield appPackage.addDeviceModels(yield DeviceModel.findAll({
      where: {
        id: deviceModelID
      }
    })));
  });

  // 发布一个新版本并提交审核
  amqp.on("developer.upgradeApp", function* (msg) {
    const appPackageID = msg.id;
    const appID = msg.appID;//
    const name = msg.app.name;
    const description = msg.app.description;
    const version = msg.version;
    const flow = msg.flow;
    const descriptionUpgrade = msg.description;
    const developerStatus = yield amqp.on("developer.latestStatus", {
      appID
    });
    const auditorStatus = yield amqp.on("auditor.latestStatus", {
      appID
    });

    //开发者审核者最新版本为[reviewing、waitReview]时，不能提交审核
    if (developerStatus == "reviewing" ||
      developerStatus == "waitReview" ||
      auditorStatus == "reviewing" ||
      auditorStatus == "waitReview") {
      return false;
    } else {
      if (developerStatus == 'edit'||developerStatus == 'reviewCancel') {
        //开发者最新版本为edit：直接将edit的版本修改后提交审核
        let app = Application.findById(appID, {
          attributes: ['id'],
          include: [{
            model: DeveloperLatestVersion,
            attributes: ['id'],
            include: [{
              model: ApplicationPackage,
              attributes: ['id']
            }]
          }]
        });
        let appID = app.id;
        let appPackageID = app.developerLatestVersion.appPackageID.id;
        Application.upsert({
          id: appID,
          name,
          description
        });
        ApplicationPackage.upsert({
          id: appPackageID,
          description: descriptionUpgrade,
          flow,
          version
        });
      } else if (developerStatus == "reviewFail" || developerStatus == "reviewPass") {
        //开发者最新版本为reviewPass或者reviewFail：创建新的版本，并提交审核
      }
    }

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
    const name = msg.app.name;
    const description = msg.app.description;
    const version = msg.version;
    const flow = msg.flow;
    const descriptionUpgrade = msg.description;

    let developer = yield Developer.findById(5);
    let app = yield Application.create({
      name,
      description,
      icon: "1.jpg"
    });
    let appPackage = yield ApplicationPackage.create({
      version,
      flow,
      description: descriptionUpgrade
    });
    let deviceModelID = [];
    msg.deviceModels.forEach(function (deviceModel) {
      deviceModelID.push(deviceModel.id);
    });
    let appPackageStatus = yield ApplicationPackageStatus.create({
      status: "edit"
    });
    let appPackageLatestStatus = yield AppPackageLatestStatus.create();
    let developerLatestVersion = yield DeveloperLatestVersion.create();
    return [
      yield app.setDeveloper(developer), //设置开发者
      yield appPackage.setApp(app), //添加历史版本
      yield appPackageLatestStatus.setAppPackage(appPackage), //APP的最新历史版本状态
      yield appPackageLatestStatus.setAppPackageStatus(appPackageStatus), //APP的最新历史版本状态
      yield appPackageStatus.setAppPackage(appPackage), //为APP添加一个历史状态
      yield developerLatestVersion.setApp(app), //添加开发者应用
      yield developerLatestVersion.setAppPackage(appPackage), //添加开发者最新历史版本
      yield appPackage.addDeviceModels(yield DeviceModel.findAll({
        where: {
          id: deviceModelID
        }
      })) //添加兼容性关系
    ];
  });
}
