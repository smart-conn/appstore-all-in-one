'use strict';

const amqp = require('amqplib');
const uuid = require('node-uuid');

class RPC {

  constructor(address) {
    this.ready = amqp.connect().then((connection) => {
      this.connection = connection;
      return connection.createChannel();
    }).then((channel) => {
      this.channel = channel;
    }).catch(function(err) {
      console.error('cant connect rabbitmq', err);
      process.exit(1);
    });
  }

  on(routingKey, handler) {
    this.ready.then(() => {
      console.log('registerd', routingKey);
      var ch = this.channel;
      ch.assertQueue(routingKey, {durable: false});
      ch.prefetch(1);

      ch.consume(routingKey, function(msg) {
        var requestText = msg.content.toString();
        var requestParams = JSON.parse(requestText);
        handler(requestParams, function(err, responseParams) {
          var responseText = JSON.stringify(responseParams) || '';
          // console.log('responsed', responseText);
          ch.sendToQueue(msg.properties.replyTo, new Buffer(responseText), {
            correlationId: msg.properties.correlationId
          });
        });
        ch.ack(msg);
      });
    });
  }

  call(routingKey, msg) {
    return this.ready.then(() => {
      var ch = this.channel;

      // generate a queue for response
      return ch
        .assertQueue('', {exclusive: true})
        .then(function(q) {
          var corr = uuid.v4();

          // console.log('response queue', q.queue);

          // register response
          var response = new Promise(function(resolve) {
            ch.consume(q.queue, function(msg) {
              if (msg.properties.correlationId === corr) {
                ch.cancel(msg.fields.consumerTag);
                ch.deleteQueue(q.queue);
                var responseText = msg.content.toString();
                responseText = responseText.length === 0? '{}': responseText;
                var responseParams;
                try {
                  responseParams = JSON.parse(responseText);
                } catch(err) {
                  console.warn(err);
                  responseParams = {};
                }
                return resolve(responseParams);
              }
            }, {noAck: true});
          });

          // console.log('requesting', routingKey);
          msg = msg || {};
          // send message to broker
          ch.sendToQueue(routingKey, new Buffer(JSON.stringify(msg)), {
            correlationId: corr,
            replyTo: q.queue
          });
          
          return response;
        });
    });
  }

}

module.exports = function factory() {
  return new RPC();
};
