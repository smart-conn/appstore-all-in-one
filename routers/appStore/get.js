"use strict";
const router = require('koa-router')();

module.exports = (application) => {
  let amqp = application.getContext('amqp');

  //应用商店所有APP
  router.get("/appStore/apps", application.authCheck('user'), function* () {
    console.log(this.req.user);
    this.body = yield amqp.call('appStore.apps');
  });

  router.get("/appStore/app/:id", application.authCheck('user'), function* () {
    const appID = this.params.id;

    this.body = yield amqp.call('appStore.app', {
      appID
    });
  });

  router.get("/findAllDevice", application.authCheck('user'), function* () {
    let appID = this.query.appID || "ZTZkYWE5NzUtYzU4MC00MGY2LTgwNTAtYzBkYTkyN2Q4ZjFk";
    let userID = "852741";

    this.body = yield amqp.call('app.findAllDeviceByID', {
      appID,
      userID
    });
  });

  router.get("/findLatestVersionByDeviceModel", application.authCheck('user'), function* () {
    this.body = yield amqp.call('app.findLatestVersionByDeviceModel', {
      deviceModel: 1,
      appID: "MzFiY2YxZGItMGQ0Mi00NDY5LTlkYjAtYWZlYjlhYTg0MTQ1"
    });
  });

  application.app.use(router.routes());
};
