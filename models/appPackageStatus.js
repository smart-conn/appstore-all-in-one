'use strict';
const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  sequelize.define('appPackageStatus', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    status: Sequelize.STRING

    // [{
    //   status: "edit",
    //   content: "编辑状态"
    // }, {
    //   status: "waitReview",
    //   content: "待审核"
    // }， {
    //   status: "reviewing",
    //   content: "审核中"
    // }, {
    //   status: "reviewFail",
    //   content: "审核失败"
    // }, {
    //   status: "reviewPass",
    //   content: "审核通过"
    // }, {
    //   status: "onboard",
    //   content: "上架"
    // }]
  });
};
