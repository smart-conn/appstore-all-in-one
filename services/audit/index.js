"use strict";
module.exports = (app) => {
  const amqp = app.getContext("amqp");

  const Application = app.getModel("app");
  const Auditor = app.getModel("auditor");
  const Developer = app.getModel("developer");
  const AuditorBucket = app.getModel("auditorBucket");
  const ApplicationPackage = app.getModel("appPackage");
  const AppPackageStatus = app.getModel('appPackageStatus');
  const AuditorLatestVersion = app.getModel('auditorLatestVersion');
  const AppPackageLatestStatus = app.getModel('appPackageLatestStatus');

  //找出所有待审查的应用
  amqp.on("auditor.apps", function* () {
    return Application.findAll({
      attributes: ['id', 'description', 'name'],
      include: [{
        model: AuditorLatestVersion,
        attributes: ['id'],
        include: [{
          model: ApplicationPackage,
          attributes: ['id', 'description', 'version', 'updatedAt'],
          include: [{
            model: AppPackageLatestStatus,
            attributes: ['id'],
            include: [{
              model: AppPackageStatus,
              attributes: ['id', 'status'],
              where: {
                status: 'waitReview'
              }
            }]
          }]
        }]
      }, {
        model: Developer,
        attributes: ['id', 'name']
      }]
    });
  });

  //auditor添加任务到自己的列表
  amqp.on("auditor.addTask", function* (msg) {
    const auditorID = msg.auditorID;
    let msgReturn = [];

    for (let id of msg.IDs) {
      let auditor = yield Auditor.findById(auditorID);
      let appPackageStatus = yield AppPackageStatus.create({
        status: "reviewing"
      });
      let app = yield Application.findById(id, {
        include: [{
          model: AuditorLatestVersion,
          attributes: ['id'],
          include: [{
            model: ApplicationPackage,
            attributes: ['id', 'description', 'version', 'updatedAt'],
            include: [{
              model: AppPackageStatus,
              attributes: ['id', 'status']
            }]
          }]
        }]
      });
      let appPackageID = app.auditorLatestVersion.appPackage.id;
      let appPackage = yield ApplicationPackage.findById(appPackageID);
      let auditorBucket = yield AuditorBucket.create();
      let appPackageLatestStatus = yield AppPackageLatestStatus.find({
        where: {
          appPackageID
        }
      });
      msgReturn.push([
        yield appPackageStatus.setAppPackage(appPackage), //给某个历史版本添加一个状态
        yield auditorBucket.setAuditor(auditor), //把任务分配给某个审核人员
        yield auditorBucket.setApp(app), //分配审核对象
        yield appPackageLatestStatus.setAppPackageStatus(appPackageStatus) //修改某个版本的最新状态
      ]);
    }
    return msgReturn
  });

  //获取某APP最新审核版本
  amqp.on('auditor.latestVersion', function* (msg) {
    const appID = msg.id;

    //TODO
    return;
  });

  //获取任务列表
  amqp.on("auditor.taskList", function* (msg) {
    const auditorID = msg.auditorID; //开发人员的ID

    return AuditorBucket.findAll({
      where: {
        auditorID
      },
      attributes: ['id', 'updatedAt'],
      include: [{
        model: Application,
        attributes: ['id', 'name'],
        include: [{
          model: AuditorLatestVersion,
          attributes: ['id'],
          include: [{
            model: ApplicationPackage,
            attributes: ['id', 'version'],
            include: [{
              model: AppPackageLatestStatus,
              attributes: ['id'],
              include: [{
                model: AppPackageStatus,
                attributes: ['id', 'status'],
                where: {
                  status: 'reviewing'
                }
              }]
            }]
          }]
        }, {
          model: Developer,
          attributes: ['id', 'name']
        }]
      }]
    });
  });

  //获取某个任务的app的详细信息
  amqp.on("auditor.task", function* (msg) {
    return AuditorBucket.findById(msg.id, {
      include: [{
        model: Application,
        attributes: ['id', 'name', 'icon'],
        include: [{
          model: AuditorLatestVersion,
          attributes: ['id'],
          include: [{
            model: ApplicationPackage,
            attributes: ['id', 'version', 'flow']
          }]
        }, {
          model: Developer,
          attributes: ['id', 'name']
        }]
      }]
    });
  });

  //查询开发人员信息
  amqp.on("auditor.developer", function* (msg) {
    return Developer.findById(msg.id);
  });

  //提交某个APP的状态
  amqp.on("auditor.status", function* (msg) {
    const auditorBucketID = msg.id; //审核任务ID
    const status = msg.msg; //审核人员提交的审核状态
    console.log(status);
    let auditorBucket = yield AuditorBucket.findById(auditorBucketID, {
      attributes: ['id'],
      include: [{
        model: Application,
        attributes: ['id'],
        include: [{
          model: AuditorLatestVersion,
          attributes: ['id'],
          include: [{
            model: ApplicationPackage,
            attributes: ['id']
          }]
        }]
      }]
    });
    let appPackageID = auditorBucket.app.auditorLatestVersion.appPackage.id;
    console.log(appPackageID);
    let appPackage = yield ApplicationPackage.findById(appPackageID);
    let appPackageStatus = yield AppPackageStatus.create({
      status
    });
    let appPackageLatestStatus = yield AppPackageLatestStatus.find({
      where: {
        appPackageID
      }
    });
    return [
      yield appPackageStatus.setAppPackage(appPackage), //给某个历史版本添加一个状态
      yield appPackageLatestStatus.setAppPackageStatus(appPackageStatus) //修改某个版本的最新状态
    ];
  })
}
