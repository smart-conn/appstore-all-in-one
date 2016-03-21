"use strict";
const router = require('koa-router')();

router.get("/findAllDevice", function*() {
    const amqp = this.app.context.amqp;
    this.body = yield amqp.call('app.findAllDeviceByID', {
        id: 123456
    });
});
module.exports = router.routes();
