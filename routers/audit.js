"use strict";
const router = require('koa-router')();

router.get("/audit/apps", function* () {
  const amqp = this.app.context.amqp;
  this.body = yield amqp.call("audit.apps");
});

router.post('/audit/auditorBucket', function* () {
  const amqp = this.app.context.amqp;
  console.log(this.request.body.IDs);
  this.body = yield amqp.call("audit.auditBucket", {
    IDs: this.request.body.IDs,
    auditorID: "5"
  });
});

router.get('/audit/bucketList', function* () {
  const amqp = this.app.context.amqp;
  this.body = yield amqp.call("audit.bucketList", {
    auditorID: "5"
  });
});

router.get('/audit/bucket/:id', function* () {
  const amqp = this.app.context.amqp;
  this.body = yield amqp.call("audit.bucket", {
    id: this.params.id
  });
});

router.get('/audit/developer/:id', function* () {
  const amqp = this.app.context.amqp;
  this.body = yield amqp.call("audit.developer", {
    id: this.params.id
  })
});

router.post('/audit/status', function* () {
  const amqp = this.app.context.amqp;
  if (this.request.body.msg !== "reviewPass") this.request.body.msg = "reviewFail";
  console.log(this.request.body);
  this.body = yield amqp.call("audit.status", this.request.body);
})
module.exports = router.routes();
