"use strict";

const Sequelize = require('sequelize');
const passportLocalSequelize = require('passport-local-sequelize');

module.exports = function (sequelize) {

  const User = sequelize.define('user', {
    name: Sequelize.STRING
  });

  passportLocalSequelize.attachToUser(User, {
    usernameField: 'name'
  });

};
