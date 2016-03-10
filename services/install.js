module.exports = function(app) {

  console.log('loaded service');

  var amqp = app.getContext('amqp');

  amqp.on('get.package', function(msg, callback) {
    callback(null, {
      message: 'ok'
    });
  });

};
