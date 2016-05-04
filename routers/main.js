'use strict';
const router = require('koa-router')();

module.exports = (application) => {
  router.post('/device/:alias/install/:id', function* () {
    const amqp = this.app.context.amqp;

    const id = this.params.id;
    const alias = this.params.alias;
    const version = this.request.body.version;

    amqp.call('app.install', {
      id, alias, version
    });
    this.body = 'ok';
  });

  router.post('/device/:alias/uninstall/:id', function* () {
    const amqp = this.app.context.amqp;

    const id = this.params.id;
    const alias = this.params.alias;

    amqp.call('app.uninstall', {
      id, alias
    });
    this.body = 'ok';
  });

  router.post('/device/:alias/bind', function* () {
    const amqp = this.app.context.amqp;

    const alias = this.params.alias;
    const userId = this.request.body.userId;

    const accessToken = yield amqp.call('device.bind', {
      alias, userId
    });
    this.body = {
      accessToken
    };
  });

  router.post('/app/:id/update', function* () {
    const amqp = this.app.context.amqp;

    const id = this.params.id;
    const version = this.request.body.version;

    amqp.call('app.update', {
      id, version
    });
    this.body = 'ok';
  });

  router.get('/repo/:packageAtVersion', function* () {
    const amqp = this.app.context.amqp;
    const packageAtVersion = this.params.packageAtVersion;
    this.body = yield amqp.call('get.package', {
      packageAtVersion
    });
  });

  router.get('/device/:alias/manifest', function* () {
    const amqp = this.app.context.amqp;
    const alias = this.params.manifest;
    this.body = yield amqp.call('get.manifest', {
      alias
    });
  });

  application.app.use(router.routes());
};
