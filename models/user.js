'use strict';

const Sequelize = require('sequelize');
const passportLocalSequelize = require('passport-local-sequelize');
const jwt = require('koa-jwt');
const nconf = require('nconf');

module.exports = function(sequelize) {

  const User = sequelize.define('user', {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: Sequelize.STRING,
    salt: Sequelize.STRING
  });

  passportLocalSequelize.attachToUser(User, {
    usernameField: 'username',
    hashField: 'password',
    saltField: 'salt'
  });

};
