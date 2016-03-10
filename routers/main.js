const router = require('koa-router')();

router.put('/package/:id', function*() {
  var amqp = this.app.context.amqp;
  var id = this.params.id;
  var assetToken = this.request.body.assetToken;
  var content = yield amqp.call('get.package', {id, assetToken});
  this.body = content;
});

module.exports = router.routes();
