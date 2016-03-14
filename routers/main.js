const router = require('koa-router')();

router.post('/device/:alias/install/:id', function*() {
  const amqp = this.app.context.amqp;

  const id = this.params.id;
  const alias = this.params.alias;
  const version = this.request.body.version;

  amqp.call('app.install', {id, alias, version});
  this.body = 'ok';
});

router.post('/device/:alias/uninstall/:id', function*() {
  const amqp = this.app.context.amqp;

  const id = this.params.id;
  const alias = this.params.alias;

  amqp.call('app.uninstall', {id, alias});
  this.body = 'ok';
});

router.post('/app/:id/update', function*() {
  const amqp = this.app.context.amqp;

  const id = this.params.id;
  const version = this.request.body.version;

  amqp.call('app.update', {id, version});
  this.body = 'ok';
});

router.get('/repo/:packageAtVersion', function*() {
  const amqp = this.app.context.amqp;
  const packageAtVersion = this.params.packageAtVersion;
  this.body = yield amqp.call('get.package', {packageAtVersion});
});

module.exports = router.routes();
