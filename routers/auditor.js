"use strict";
const router = require('koa-router')();

//获取所有的待审查的应用
router.get("/auditor/apps", function* () {
  const amqp = this.app.context.amqp;
  this.body = yield amqp.call("auditor.apps");
});

//添加任务到自己的列表
router.post('/auditor/addTask', function* () {
  const amqp = this.app.context.amqp;
  console.log(this.request.body.IDs);
  this.body = yield amqp.call("auditor.addTask", {
    IDs: this.request.body.IDs,
    auditorID: "5"
  });
});

//获取某个auditot的任务列表
router.get('/auditor/taskList', function* () {
  const amqp = this.app.context.amqp;
  this.body = yield amqp.call("auditor.taskList", {
    auditorID: "5"
  });
});

//获取某个任务的详细信息
router.get('/auditor/task/:id', function* () {
  const amqp = this.app.context.amqp;
  this.body = yield amqp.call("auditor.task", {
    id: this.params.id
  });
});

//获取某个开发人员的详细信息
router.get('/auditor/developer/:id', function* () {
  const amqp = this.app.context.amqp;
  const id = this.params.id;

  this.body = yield amqp.call("auditor.developer", {
    id
  })
});

//对某个应用审查的结果
router.post('/auditor/status', function* () {
  //TODO:验证重复提交
  const amqp = this.app.context.amqp;

  if (this.request.body.msg !== "reviewPass") this.request.body.msg = "reviewFail";
  this.body = yield amqp.call("auditor.status", this.request.body);
});

//获取某个ID的APP所有版本的详细信息
router.get("/auditor/appVersions/:id", function* () {
  const amqp = this.app.context.amqp;
  this.body = yield amqp.call("developer.getHistoryVersionsByID", {
    appID: this.params.id
  });
});

//获取某个ID的APP某个版本的详细信息
router.get("/auditor/app/:id/version/:version", function* () {
  const amqp = this.app.context.amqp;
  if (this.params.version == "newest") {
    this.body = yield amqp.call("developer.getAppByID", {
      appID: this.params.id
    });
  } else {
    this.body = yield amqp.call("developer.getAppByVersion", {
      id: this.params.id,
      version: this.params.version
    });
  }
});

module.exports = router.routes();
