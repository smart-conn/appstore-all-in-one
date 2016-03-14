'use strict';

var flow = [{"id":"3367e45f.cc981c","type":"function","name":"++","func":"if ( (msg.i += 1) < msg.items.length ) return msg;\n","outputs":1,"x":376,"y":268,"z":"886b17b1.7794e8","wires":[["116d5bb3.ee92a4"]]},{"id":"116d5bb3.ee92a4","type":"function","name":"for each item","func":"if( msg.i     == undefined ) msg.i = 0;\nif( msg.items == undefined ) msg.items = msg.payload;\n\nmsg.payload = msg.items[ msg.i ];\n\nreturn msg;","outputs":1,"x":378,"y":240,"z":"886b17b1.7794e8","wires":[["3367e45f.cc981c","92f7e57c.6d0818"]]}];
var appInfo = {
  id: 'NGYxNTg2ODMtY2U2NS00Y2FiLTljYmQtZDI1ZGY3YWMwMDdj',
  name: '变声',
  version: '0.0.1'
};

module.exports = function(app) {

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
      amqp.call('notify.app.install', {id, alias, version});
    });
    return callback();
  });

  amqp.on('get.package', (msg, callback) => {
    const packageAtVersion = msg.packageAtVersion;
    console.log(packageAtVersion);

    const packageInfo = packageAtVersion.split('@');
    const packageName = packageInfo[0];
    const version = packageInfo[1] || '0.0.2';

    const appPackage = Object.assign({flow}, appInfo, {version});
    console.log(appPackage);
    callback(null, appPackage);
  });

  function findAllAliasWithId(id) {
    return Promise.resolve(['54321']);
  }

};
