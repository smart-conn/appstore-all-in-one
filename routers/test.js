'use strict';
const router = require('koa-router')();

module.exports = (app) => {
  router.get('/test', function* () {
    this.body = {
      code: 200
    };
  });
  app.use(router.routes());
};
