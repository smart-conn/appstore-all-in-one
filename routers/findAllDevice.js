"use strict";
const router = require('koa-router')();

router.get("/findAllDevice", function*() {
  let appID = this.query.appID;
  const amqp = this.app.context.amqp;
  this.body = yield amqp.call('app.findAllDeviceByID', {
    appID
  });
});
router.get("/findLatestVersionByDeviceModel", function*() {
  const amqp = this.app.context.amqp;
  this.body = yield amqp.call('app.findLatestVersionByDeviceModel', {
    deviceModel: 1,
    appID: "MzFiY2YxZGItMGQ0Mi00NDY5LTlkYjAtYWZlYjlhYTg0MTQ1"
  });
});
module.exports = router.routes();