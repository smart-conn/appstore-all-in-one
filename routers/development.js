'use strict';
const router = require('koa-router')();
const Promise = require('bluebird');
const request = Promise.promisify(require('request'), {
  multiArgs: true
});

module.exports = (application) => {
  router.post('device', function* () {

  });

  function getAlias() {
    const baseUri = 'http://192.168.1.31/admin/alias';
    return request({
      uri: baseUri,
      json: true
    }).spread((response, body) => {
      return body.id;
    });
  }

  function bindDevice(userId, alias) {
    const baseUri = `http://localhost:3000/device/${alias}/bind`;
    return request({
      method: 'POST',
      uri: baseUri,
      json: true,
      body: {
        userId
      }
    }).spread((response, body) => {
      return body.accessToken;
    });
  }

  function setAccessToken(accessToken) {
    const baseUri = 'http://192.168.1.31/admin/accessToken';
    return request({
      method: 'PUT',
      uri: baseUri,
      json: true,
      body: {
        accessToken
      }
    }).spread((response, body) => {
      console.log(body);
    });
  }
  application.app.use(router.routes());
};
