"use strict";
module.exports = (app) => {
  const amqp = app.getContext("amqp");
  const Application = app.getModel("app");
  const ApplicationPackage = app.getModel("appPackage");

  let appAdminHelper = function (data) {
    let Database = app.getModel(data.database);
    let AssociationDatabase = () => {
      if (data.association) {
        let models = [];
        data.association.split(',').forEach((model) => {
          models.push(app.getModel(model));
        });
        return models;        
      } else {
        return null;
      }
    }
    let amqpPrefix = data.prefix;

    amqp.on(amqpPrefix + ".create", function* (msg) {
      return Database.create(msg);
    });

    amqp.on(amqpPrefix + ".findAll", function* () {
      return AssociationDatabase() ? Database.findAll({
        include: AssociationDatabase()
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
  };

  let amqpPres = [
    {
      database: "app",
      association: "appPkg",
      prefix: 'admin.app'
    }, {
      database: "appPkg",
      prefix: 'admin.appPkg'
    }, {
      database: "deviceModel",
      prefix: 'admin.deviceModel'
    }, {
      database: "account",
      association: "accountDevice,role",
      prefix: 'admin.user'
    }, {
      database: "accountDevice",
      association: "deviceModel",
      prefix: 'admin.accountDevice'
    }, {
      database: 'role',
      prefix: "admin.role",
      association: 'permission'
    }, {
      database: 'permission',
      prefix: "admin.permission",
    }
  ];

  amqpPres.forEach((amqpPre) => {
    appAdminHelper(amqpPre);
  });
};
