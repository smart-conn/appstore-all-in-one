"use strict";
const router = require('koa-router')();

router.get("/apps", function*() {
    const amqp = this.app.context.amqp;
    this.body = yield amqp.call('app.findAllApps');
});
router.get("/apps/:id", function*() {
    var appID = this.params.id;
    const amqp = this.app.context.amqp;
    this.body = yield amqp.call('app.findAppByID', {
        appID: appID
    });
});

module.exports = router.routes();
