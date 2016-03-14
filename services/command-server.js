module.exports = function(app) {

  const amqp = app.getContext('amqp');
  const io = app.getContext('io');

  amqp.on('notify.app.install', (msg, callback) => {
    const id = msg.id;
    const alias = msg.alias;
    const version = msg.version;

    io.to(alias).emit('app.install', {id, version});
    return callback();
  });

  amqp.on('notify.app.uninstall', (msg, callback) => {
    const id = msg.id;
    const alias = msg.alias;

    io.to(alias).emit('app.uninstall', {id});
    return callback();
  });


};
