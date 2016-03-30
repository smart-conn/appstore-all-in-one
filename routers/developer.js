"use strict";
const router = require('koa-router')()

router.post("/developer/newApp", function* () {
  const amqp = this.app.context.amqp;
  let result = yield amqp.call("developer.newApp", this.request.body);
  this.body = {
    code: 200
  }
});
router.post("/developer/editApp", function* () {
  const amqp = this.app.context.amqp;
  let result = yield amqp.call("developer.editApp", this.request.body);
  this.body = {
    code: 200
  }
});
router.post("/developer/upgradeApp", function* () {
  const amqp = this.app.context.amqp;
  let result = yield amqp.call("developer.upgradeApp", this.request.body);
  this.body = {
    code: 200
  }
});


//获取某个ID的APP详细信息
router.get("/developer/app/:id", function* () {
  const amqp = this.app.context.amqp;
  this.body = yield amqp.call("developer.getAppByID", {
    appID: this.params.id
  });
});
//获取某个ID的APP所有版本的详细信息
router.get("/developer/appVersions/:id", function* () {
  const amqp = this.app.context.amqp;
  this.body = yield amqp.call("developer.getHistoryVersionsByID", {
    appID: this.params.id
  });
});
//获取某个ID的APP某个版本的详细信息
router.get("/developer/app/:id/version/:version", function* () {
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