"use strict";
module.exports = (app) => {
  const amqp = app.getContext("amqp");
  let Application = app.getModel("app");
  let Auditor = app.getModel("auditor");
  let Developer = app.getModel("developer");
  let ApplicationPackage = app.getModel("appPackage");
  let ApplicationPackageStatus = app.getModel("appPackageStatus");
  let AuditorBucket = app.getModel("auditorBucket");

  amqp.on("audit.apps", function* () {
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

  amqp.on("audit.auditBucket", function* (msg) {
    //添加应用的状态信息
    //存入audit的Bucket
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

  amqp.on("audit.bucketList", function* (msg) {
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

  amqp.on("audit.bucket", function* (msg) {
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

  amqp.on("audit.developer", function* (msg) {
    return Developer.findById(msg.id);
  });

  amqp.on("audit.status", function* (msg) {
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
