'use strict';

const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  //角色
  // [admin,user,auditor,developer]
  sequelize.define('role', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    name: Sequelize.STRING
  });

};
