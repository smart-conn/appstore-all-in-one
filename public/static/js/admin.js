var angularApp = angular.module('App', ['ng-admin']);
angularApp.config(['NgAdminConfigurationProvider', function (NgAdminConfigurationProvider) {
  var nga = NgAdminConfigurationProvider;
  var admin = nga.application('My First Admin').baseApiUrl('http://127.0.0.1:3000/');
  var databases = [{
    name: "app",
    fields: [{
      name: "id",
      type: "string"
    }, {
      name: "name",
      type: "string"
    }, {
      name: "description",
      type: "wysiwyg"
    }, {
      name: "author",
      type: "string"
    }, {
      name: "icon",
      type: "string"
    }]
  }, {
    name: "appPackage",
    fields: [{
      name: "id",
      type: "string"
    }, {
      name: "version",
      type: "string"
    }, {
      name: "flow",
      type: "json"
    }, {
      name: "description",
      type: "string"
    }]
  }, {
    name: "deviceModel",
    fields: [{
      name: "id",
      type: "string"
    }, {
      name: "name",
      type: "string"
    }]
  }, {
    name: "user",
    fields: [{
      name: "id",
      type: "string"
    }, {
      name: "name",
      type: "string"
    }]
  }, {
    name: "userDevice",
    fields: [{
      name: "id",
      type: "string"
    }, {
      name: "name",
      type: "string"
    }, {
      name: "alias",
      type: "string"
    }, {
      name: "accessToken",
      type: "string"
    }, {
      name: "appManifest",
      type: "string"
    }]
  }];

  // databases.forEach(function (database) {
  //   adminHelper(admin, nga, database.fields, database.name);
  // });

  nga.configure(admin);

  var user = nga.entity("user");
  var userDevice = nga.entity("userDevice");
  var app = nga.entity("app");
  var appPackage = nga.entity("appPackage");
  var deviceModel = nga.entity("deviceModel");

  user.listView().fields([
    nga.field("id").label("ID"),
    nga.field("name").label("用户名"),
    nga.field("userDevices", "template").template(
      '{{ entry }}<span ng-repeat="group in entry.values.groups track by $index" class="label label-default">{{ group }}</span>')
  ]);
  user.creationView().fields([
    nga.field("name"),

  ]);
  user.editionView().fields([
    nga.field("name")
  ]);

  userDevice.listView().fields([
    nga.field("id").label("ID"),
    nga.field("name").label("玩具昵称"),
    nga.field("alias").label("Alias"),
    nga.field("deviceModelID", "reference").targetEntity(deviceModel).targetField(nga.field("name")).label("设备型号"),
    nga.field("userID", "reference").targetEntity(user).targetField(nga.field("name")).label("拥有者")
  ]);
  userDevice.editionView().fields([
    nga.field("name").label("玩具昵称"),
    nga.field("alias").label("Alias"),
    nga.field("deviceModelID", "reference").targetEntity(deviceModel).targetField(nga.field("name")).label("设备型号"),
    nga.field("userID", "reference").targetEntity(user).targetField(nga.field("name")).label("拥有者")
  ]);
  userDevice.creationView().fields([
    nga.field("name").label("玩具昵称"),
    nga.field("alias").label("Alias"),
    nga.field("deviceModelID", "reference").targetEntity(deviceModel).targetField(nga.field("name")).label("设备型号"),
    nga.field("userID", "reference").targetEntity(user).targetField(nga.field("name")).label("拥有者")
  ]);

  app.listView().fields([
    nga.field("id"),
    nga.field("name"),
    nga.field("description"),
    nga.field("icon"),
    nga.field("author")
  ]);

  appPackage.listView().fields([
    nga.field("id"),
    nga.field("version"),
    nga.field("description"),
    nga.field("appID", "reference").targetEntity(app).targetField(nga.field("name"))
  ]);

  deviceModel.listView().fields([
    nga.field("id"),
    nga.field("name")
    // nga.field("deviceModelID", "reference_many").targetEntity(userDevice).targetField(nga.field("name"))
  ]);
  admin.addEntity(user);
  admin.addEntity(userDevice);
  admin.addEntity(app);
  admin.addEntity(appPackage);
  admin.addEntity(deviceModel);
}]);

// var adminHelper = function (ngaAdmin, nga, fields, database) {
//   var Application = nga.entity(database);
//   var ngaFields = [];
//   var ngaOtherFields = [];
//   fields.forEach(function (field) {
//     if (field.type == "json") {
//       ngaOtherFields.push(nga.field(field.name, field.type).map(function (val, entity) {
//         return JSON.parse(val);
//       }));
//       return;
//     }
//     if (field.name != "id") ngaOtherFields.push(nga.field(field.name, field.type));
//     ngaFields.push(nga.field(field.name, field.type));
//   });
//   Application.listView().fields(ngaFields);
//   Application.creationView().fields(ngaOtherFields);
//   Application.editionView().fields(ngaOtherFields);
//   ngaAdmin.addEntity(Application);
// }
