"use strict";
module.exports = (app, userID) => {
  const UserDevice = app.getModel('userDevice');
  const User = app.getModel('user');

  return User.findById(userID, {
    include: [UserDevice]
  }).then((user) => {
    return user.userDevices;
  });
};
