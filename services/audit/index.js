"use strict";
module.exports = (app) => {
  const amqp = app.getContext("amqp");
  let Application = app.getModel("app");
  let Auditor = app.getModel("auditor");
  let Developer = app.getModel("developer");
  let ApplicationPackage = app.getModel("appPackage");
  let ApplicationPackageStatus = app.getModel("appPackageStatus");
  let AuditorBucket = app.getModel("auditorBucket");
  //找出所有待审查的应用
  amqp.on("auditor.apps", function* () {
    return ApplicationPackage.findAll({
      attributes: ['id', 'version', 'updatedAt'],
      order: [
        ['updatedAt', 'DESC']
      ],
      include: [{
        model: ApplicationPackageStatus,
        where: {
          status: "waitReview"
        }
      }, {
        model: Application,
        attributes: ['id', 'name'],
        include: [{
          model: Developer,
          attributes: ['id', 'name']
        }]
      }]
    });
  });
  //auditor添加任务到自己的列表
  amqp.on("auditor.addTask", function* (msg) {
    let msgReturn = [];
    for (let id of msg.IDs) {
      let appPackage = yield ApplicationPackage.findOne({
        where: {
          id: id
        }
      });
      let auditor = yield Auditor.findOne({
        where: {
          id: msg.auditorID
        }
      });
      let applicationPackageStatus = yield ApplicationPackageStatus.create({
        status: "reviewing"
      });
      let auditorBucket = yield AuditorBucket.create();
      msgReturn.push([
        yield appPackage.setAppPackageStatus(applicationPackageStatus),
        yield auditorBucket.setAuditor(auditor),
        yield auditorBucket.setAppPackage(appPackage),
        yield auditorBucket.setAppPackageStatus(applicationPackageStatus)
      ]);
    }
    return msgReturn
  });
  //获取任务列表
  amqp.on("auditor.taskList", function* (msg) {
    return AuditorBucket.findAll({
      where: {
        auditorID: msg.auditorID
      },
      include: [{
        model: ApplicationPackageStatus,
        where: {
          status: "reviewing"
        }
      }, {
        model: ApplicationPackage,
        attributes: ["id", "version"],
        include: [{
          model: Application,
          attributes: ["id", "name", "icon"],
          include: [{
            model: Developer,
            attributes: ['id', "name"]
          }]
        }]
      }]
    });
  });
  //获取某个任务的app的详细信息
  amqp.on("auditor.task", function* (msg) {
    return AuditorBucket.findById(msg.id, {
      include: [{
        model: ApplicationPackageStatus,
        where: {
          status: "reviewing"
        }
      }, {
        model: ApplicationPackage,
        attributes: ["id", "version", "flow"],
        include: [{
          model: Application,
          attributes: ["id", "name", "icon"],
          include: [{
            model: Developer,
            attributes: ["name"]
          }]
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
    let auditorBucket = yield AuditorBucket.findOne({
      where: {
        appPackageID: msg.id
      }
    });
    let applicationPackage = yield ApplicationPackage.findById(msg.id);
    let applicationPackageStatus = yield ApplicationPackageStatus.create({
      status: msg.msg
    });
    return [
      yield applicationPackage.setAppPackageStatus(applicationPackageStatus),
      yield auditorBucket.setAppPackageStatus(applicationPackageStatus)
    ];
  })
}
