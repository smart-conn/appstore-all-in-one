'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const Account = sequelize.models['account'];
  const Purse = sequelize.models['purse'];

  //Account and Purse
  Account.hasOne(Purse, {
    foreignKey: 'AccountID'
  });
  Purse.belongsTo(User, {
    foreignKey: 'userID'
  });
}
