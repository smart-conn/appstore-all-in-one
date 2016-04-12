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
      //后续需要添加status是真对于哪个APP哪个版本的状态
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
      //   status: "reviewCancel",
      //   content: "取消审核"
      // }, {
      //   status: "reviewPass",
      //   content: "审核通过"
      // }, {
      //   status: "onboard",
      //   content: "上架"
      // }]
  });
};
//历史版本的定义为：已经成功上架的应用而且不是最新版本
//应用商店中最新版本和应用的最新版本不是同一概念，可能审核通过但是开发者并不上架

//后续需要添加针对于应用商店的最新版本的数据库，维护时机在开发者上架或者下架应用时或者开发者怒删应用

//用户只能安装应用商店中存在的最新版本，用户安装应用的时候只会检查最新版本对安装设备的兼容性

//当开发者上架一个新的应用之后，向用户设备推送最新的APP，如果最新的APP不兼容设备时，不进行更新，当用户手动更新会提示失败，删除后应用将永远消失
//删除应用的逻辑为：首先检查当前应用是否为最新应用并且最新应用是否兼容当前设备：
//如果不是最新版本且最新版本兼容当前设备提示用户是否更新应用，如果不是最新版本也不兼容当前设备那么提示用户警告，删除后应用不可恢复。
//如果是最新版本则提示用户，应用将会被删除
