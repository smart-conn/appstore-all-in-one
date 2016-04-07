"use strict";
module.exports = (app) => {
  let Developer = app.getModel("developer");
  let Auditor = app.getModel("auditor");
  let User = app.getModel("user");
  const amqp = app.getContext("amqp");
  amqp.on("user.login", function* (msg) {
    let Model = null;
    switch (msg.type) {
    case "developer":
      Model = Developer;
      break;
    case "auditor":
      Model = Auditor;
      break;
    case "user":
      Model = User;
      break;
    default:
      return null;
    }
    return Model.find({
      where: {
        name: msg.name
      }
    });
  });
}
