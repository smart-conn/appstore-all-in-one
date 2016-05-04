"use strict";
const router = require('koa-router')();

module.exports = (application) => {
  let appAdminHelper = function (routerPrefix) {
    let amqpPrefix = routerPrefix;

    router.get("/" + routerPrefix, function* () {
      const amqp = this.app.context.amqp;
      this.body = yield amqp.call(amqpPrefix + ".findAll");
    });

    router.post("/" + routerPrefix, function* () {
      const amqp = this.app.context.amqp;
      this.body = yield amqp.call(amqpPrefix + ".create", this.request.body);
    });

    router.get("/" + routerPrefix + "/:id", function* () {
      const amqp = this.app.context.amqp;
      this.body = yield amqp.call(amqpPrefix + ".findByID", {
        appID: this.params.id
      });
    });

    router.put("/" + routerPrefix + "/:id", function* () {
      const amqp = this.app.context.amqp;
      this.body = yield amqp.call(amqpPrefix + ".edit", this.request.body);
    });

    router.delete("/" + routerPrefix + "/:id", function* () {
      const amqp = this.app.context.amqp;
      this.body = yield amqp.call(amqpPrefix + ".delete", {
        appID: this.params.id
      });
    });
  }

  var adminRouters = ["app", "appPackage", "deviceModel", "user", "userDevice"];
  adminRouters.forEach((adminRouter) => {
    appAdminHelper(adminRouter);
  });

  application.app.use(router.routes());
};
