"use strict";
const router = require('koa-router')();
//获取所有的待审差的应用
router.get("/auditor/apps", function* () {
  const amqp = this.app.context.amqp;
  this.body = yield amqp.call("auditor.apps");
});
//添加任务到自己的列表
router.post('/auditor/auditorTask', function* () {
  const amqp = this.app.context.amqp;
  console.log(this.request.body.IDs);
  this.body = yield amqp.call("auditor.auditTask", {
    IDs: this.request.body.IDs,
    auditorID: "5"
  });
});
//获取某个auditot的任务列表
router.get('/auditor/taskList', function* () {
  const amqp = this.app.context.amqp;
  this.body = yield amqp.call("auditor.tasktList", {
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
  this.body = yield amqp.call("auditor.developer", {
    id: this.params.id
  })
});
//对某个应用审查的结果
router.post('/audit/status', function* () {
  const amqp = this.app.context.amqp;
  if (this.request.body.msg !== "reviewPass") this.request.body.msg = "reviewFail";
  this.body = yield amqp.call("auditor.status", this.request.body);
})
module.exports = router.routes();
