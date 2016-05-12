'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const Account = sequelize.models['account'];
  const Order = sequelize.models['order'];
  const Application = sequelize.models['app'];
  const voice = sequelize.models['voice'];

  //Account and Order
  Account.hasMany(Order, {
    foreignKey: 'accountId'
  });
  Order.belongsTo(Account, {
    foreignKey: 'accountId'
  });

  //Application and Order
  Application.hasOne(Order, {
    foreignKey: 'productId'
  });
  Order.belongsTo(Application, {
    foreignKey: 'productId'
  });

  //


}
