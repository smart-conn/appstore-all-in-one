"use strict";
const router = require('koa-router')();

//获取开发者的所有app
router.get('/developer/apps', function* () {
  const amqp = this.app.context.amqp;
  this.body = yield amqp.call("developer.apps");
});

//添加新的APP
router.post("/developer/newApp", function* () {
  const amqp = this.app.context.amqp;
  let result = yield amqp.call("developer.newApp", this.request.body);
  this.body = {
    code: 200
  }
});

//保存新的APP
router.post("/developer/saveApp", function* () {
  const amqp = this.app.context.amqp;
  let result = yield amqp.call("developer.saveApp", this.request.body);
  this.body = {
    code: 200
  }
})

//修改APP的信息
router.post("/developer/editApp", function* () {
  const amqp = this.app.context.amqp;
  let result = yield amqp.call("developer.editApp", this.request.body);
  this.body = {
    code: result ? 200 : 500
  }
});

//升级APP
router.post("/developer/upgradeApp", function* () {
  const amqp = this.app.context.amqp;
  let result = yield amqp.call("developer.upgradeApp", this.request.body);
  this.body = {
    code: result ? 200 : 500
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

//获取某个app最新版本的状态，以确定是否可以被升级修改
router.get("/developer/status/:id", function* () {
  const amqp = this.app.context.amqp;
  let status = yield amqp.call("developer.latestStatus", {
    id: this.params.id
  });
  this.body = {
    status: status
  };
});

//获取可以上架的app
router.get('/developer/onboardList', function* () {
  const amqp = this.app.context.amqp;
  console.log(this.session.id);
  this.body = yield amqp.call("apps", {
    developerID: this.session.id,
    status: "reviewPass"
  });
})
module.exports = router.routes();
