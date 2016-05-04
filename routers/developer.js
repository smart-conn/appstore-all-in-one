'use strict';
const router = require('koa-router')();

module.exports = (application) => {
  const amqp = application.getContext('amqp');
  const passport = application.getContext('passport');

  // 获取开发者的所有app
  router.get('/developer/apps', passport.authenticate('local'), function* () {
    this.body = yield amqp.call('developer.apps', {
      developerID: 5
    });
  });

  //获取某个ID的APP某个版本的详细信息
  router.get('/developer/app/:appID/version/:versionID', function* () {
    const appID = this.params.appID;
    const versionID = this.params.versionID;

    this.body = yield amqp.call('developer.appByVersion', {
      appID,
      versionID
    });
  });

  //添加新的APP
  router.post('/developer/newApp', function* () {
    let result = yield amqp.call('developer.newApp', this.request.body);
    this.body = {
      code: 200
    }
  });

  //保存新的APP
  router.post('/developer/saveApp', function* () {
    let result = yield amqp.call('developer.saveApp', this.request.body);
    this.body = {
      code: 200
    }
  });

  //修改APP的信息
  router.post('/developer/editApp', function* () {
    let result = yield amqp.call('developer.editApp', this.request.body);
    this.body = {
      code: result ? 200 : 500
    }
  });

  //升级APP
  router.post('/developer/upgradeApp', function* () {
    let result = yield amqp.call('developer.upgradeApp', this.request.body);
    this.body = {
      code: result ? 200 : 500
    }
  });

  //获取某个ID的APP详细信息
  router.get('/developer/app/:id', function* () {
    this.body = yield amqp.call('developer.getAppByID', {
      appID: this.params.id
    });
  });

  //获取某个ID的APP所有版本的详细信息
  router.get('/developer/appVersions/:id', function* () {
    this.body = yield amqp.call('developer.getHistoryVersionsByID', {
      appID: this.params.id
    });
  });

  //获取某个app最新版本的状态，以确定是否可以被升级修改
  router.get('/developer/status/:id', function* () {
    let status = yield amqp.call('developer.latestStatus', {
      id: this.params.id
    });
    this.body = {
      status: status
    };
  });

  //获取可以上架的所有APP
  router.get('/developer/onboardList', function* () {
    this.body = yield amqp.call('app.apps', {
      developerID: this.session.id,
      status: 'reviewPass'
    });
  });

  //某个可以上架的APP的信息
  router.get('/developer/appID/:appID/versionID/:versionID', function* () {
    const appID = this.params.appID;
    const versionID = this.params.versionID;

    this.body = yield amqp.call('app.appByVersion', {
      appID: appID,
      versionID: versionID
    });
  });

  router.post('/developer/onboard', function* () {
    const body = this.request.body;
    this.body = yield amqp.call('appState.onboard', body);
  });
  application.app.use(router.routes());
};
