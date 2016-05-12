'use strict';
const Sequelize = require('sequelize');
const passportLocalSequelize = require('passport-local-sequelize');

module.exports = function(sequelize) {
  const Account = sequelize.define('account', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    passowrd: Sequelize.STRING,
    salt: Sequelize.STRING
  });

  passportLocalSequelize.attachToUser(Account, {
    usernameField: 'username',
    hashField: 'passowrd',
    saltField: 'salt'
  });
};
