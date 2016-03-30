"use strict";
module.exports = (app) => {
  const amqp = app.getContext("amqp");
  const Application = app.getModel("app");
  const ApplicationPackage = app.getModel("appPackage");

  let appAdminHelper = function (data) {
    let Database = app.getModel(data.database);
    let AssociationDatabase = data.association ? app.getModel(data.association) : null;
    let amqpPrefix = data.database;

    amqp.on(amqpPrefix + ".create", function* (msg) {
      return Database.create(msg);
    });

    amqp.on(amqpPrefix + ".findAll", function* () {
      return AssociationDatabase ? Database.findAll({
        include: [AssociationDatabase]
      }) : Database.findAll();
    });

    amqp.on(amqpPrefix + ".findByID", function* (msg) {
      return Database.findById(msg.appID);
    });

    amqp.on(amqpPrefix + ".edit", function* (msg) {
      return Database.update(msg, {
        where: {
          id: msg.id
        }
      })
    });

    amqp.on(amqpPrefix + ".delete", function* (msg) {
      return Database.destroy({
        where: {
          id: msg.appID
        }
      });
    });
  }

  let amqpPres = [{
    database: "app",
    association: "appPackage"
  }, {
    database: "appPackage"
  }, {
    database: "deviceModel"
  }, {
    database: "user",
    association: "userDevice"
  }, {
    database: "userDevice",
    association: "deviceModel"
  }];

  amqpPres.forEach((amqpPre) => {
    appAdminHelper(amqpPre);
  });
};
