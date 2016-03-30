'use strict';

const _ = require('underscore');
const jwt = require('jsonwebtoken');

module.exports = function (app) {

  const amqp = app.getContext('amqp');

  amqp.on('app.install', (msg, callback) => {
    console.log(msg);
    amqp.call('notify.app.install', msg);
    return callback();
  });

  amqp.on('app.uninstall', (msg, callback) => {
    amqp.call('notify.app.uninstall', msg);
    return callback();
  });

  amqp.on('app.update', (msg, callback) => {
    const id = msg.id;
    const version = msg.version;

    findAllAliasWithId(id).then((alias) => {
      amqp.call('notify.app.install', {
        id, alias, version
      });
    });
    return callback();
  });

  /**
   * get package from repo
   *
   * request format:
   * ```
   * {
   *   "packageAtVersion": "string"
   * }
   * ```
   *
   * response format:
   * ```
   * {
   *   "id": "string",
   *   "name": "string",
   *   "version": "string",
   *   "flow": "json"
   * }
   * ```
   */
  amqp.on('get.package', (msg, callback) => {
    const packageAtVersion = msg.packageAtVersion;
    console.log(packageAtVersion);

    const packageInfo = packageAtVersion.split('@');
    const id = packageInfo[0];
    const version = packageInfo[1];

    getPackage(id, version).then((appInfo) => {
      callback(null, appInfo);
    });
  });

  amqp.on('get.manifest', (msg, callback) => {
    const alias = msg.alias;

    getManifest().then((manifest) => {
      callback(null, manifest);
    });
  });

  amqp.on('device.bind', (msg, callback) => {
    const alias = msg.alias;
    const userId = msg.userId;

    issueAccessToken(userId, alias).then((accessToken) => {
      callback(null, {
        accessToken
      });
    });

  });

  function findAllAliasWithId(id) {
    return Promise.resolve(['54321']);
  }

  function getManifest() {
    return Promise.resolve(manifest);
  }

  function getPackage(id, version) {
    if (!version) {
      var packages = _.sortBy(_.filter(repo, (item) => {
        return item.id === id;
      }), 'version');
      return Promise.resolve(packages[0]);
    }
    return Promise.resolve(_.find(repo, function (item) {
      return item.id === id && item.version === version;
    }));
  }

  function issueAccessToken(userId, alias) {
    return Promise.resolve(jwt.sign({
      alias
    }, 'secret', {
      subject: userId,
    }));
  }

};
