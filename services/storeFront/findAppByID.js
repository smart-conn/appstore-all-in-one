"use strict";
module.exports = (app) => {
  const amqp = app.getContext('amqp');
  const Application = app.getModel('app');

  amqp.on("app.findAppByID", function* (msg) {
    return Application.findById(msg.appID);
  });
};
