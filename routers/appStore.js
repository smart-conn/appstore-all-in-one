"use strict";
const router = require('koa-router')();

router.get("/apps", function* () {
  const amqp = this.app.context.amqp;
  this.body = yield amqp.call('apps', {
    status: 'waitReview'
  });
});

router.get("/apps/:id", function* () {
  var appID = this.params.id;
  const amqp = this.app.context.amqp;
  this.body = yield amqp.call('app.findAppByID', {
    appID: appID
  });
});

router.get("/findAllDevice", function* () {
  let appID = this.query.appID || "ZTZkYWE5NzUtYzU4MC00MGY2LTgwNTAtYzBkYTkyN2Q4ZjFk";
  let userID = "852741";
  const amqp = this.app.context.amqp;
  this.body = yield amqp.call('app.findAllDeviceByID', {
    appID,
    userID
  });
});

router.get("/findLatestVersionByDeviceModel", function* () {
  const amqp = this.app.context.amqp;
  this.body = yield amqp.call('app.findLatestVersionByDeviceModel', {
    deviceModel: 1,
    appID: "MzFiY2YxZGItMGQ0Mi00NDY5LTlkYjAtYWZlYjlhYTg0MTQ1"
  });
});

module.exports = router.routes();
