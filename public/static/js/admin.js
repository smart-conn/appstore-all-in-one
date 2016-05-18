var angularApp = angular.module('App', ['ng-admin']);

angularApp.config(['NgAdminConfigurationProvider', function (NgAdminConfigurationProvider) {
  var nga = NgAdminConfigurationProvider;
  var admin = nga.application('App Admin').baseApiUrl('http://127.0.0.1:3000/');

  nga.configure(admin);

  var permission = nga.entity('admin.permission').label('权限');
  permission.listView().title('权限').fields([
    nga.field("id", 'template').template('<span>{{entry.values.id.split("-").join("").slice(0,6)}}</span>').label("ID"),
    nga.field('name')
  ]).listActions([
    '<ma-filtered-list-button entity-name="admin.role" filter="{ permissionId: entry.values.id }" size="xs" label="Related role"></ma-filtered-list-button>',
    'edit',
    'delete'
  ]);
  permission.editionView().fields([
    nga.field('name')
  ]);
  permission.creationView().fields([
    nga.field('name')
  ]);
  admin.addEntity(permission);

  var role = nga.entity('admin.role').label('角色');
  role.listView().title('角色').fields([
    nga.field("id", 'template').template('<span>{{entry.values.id.split("-").join("").slice(0,6)}}</span>').label("ID"),
    nga.field('name'),
    nga.field('permissions', 'template').template('<a ng-repeat="group in entry.values.permissions" class="label label-default"  href="#/userDevice/edit/{{group.id}}">{{ group.name }}</a>')
  ]).listActions(['edit', 'delete'])
  role.editionView().fields([
    nga.field('name'),
    nga.field('permission', 'reference_many').targetEntity(permission).targetField(nga.field('name'))
  ]);
  role.creationView().fields([
    nga.field('name')
  ]);
  admin.addEntity(role);

  //用户相关
  var user = nga.entity("admin.user").label('账户列表');
  user.listView().fields([
    nga.field("id", 'template').template('<span>{{entry.values.id.split("-").join("").slice(0,6)}}</span>').label("ID"),
    nga.field("username").label("用户名"),
    nga.field("accountDevices", "template").template(
      '<a ng-repeat="group in entry.values.accountDevices" class="label label-default"  href="#/userDevice/edit/{{group.id}}">{{ group.name }}</a>'
    ).label("用户设备"),
    nga.field('role', 'template').template('<a ng-repeat="group in entry.values.roles" class="label label-default"  href="#/userDevice/edit/{{group.id}}">{{ group.name }}</a>').label('用户角色')
  ]);
  user.creationView().fields([
    nga.field("username"),
    nga.field('roles', 'reference_many').targetEntity(role).targetField(nga.field('name')).label('用户角色')
  ]);
  user.editionView().fields([
    nga.field("username"),
    nga.field('roles', 'reference_many').targetEntity(role).targetField(nga.field('name')).label('用户角色')
  ]);
  admin.addEntity(user);

  var deviceModel = nga.entity("admin.deviceModel").label('设备型号');
  deviceModel.listView().title('设备型号').fields([
    nga.field("id"),
    nga.field("name")
  ]);
  deviceModel.editionView().fields([
    nga.field('id'),
    nga.field('name')
  ]);
  admin.addEntity(deviceModel);
  
  //用户设备
  var userDevice = nga.entity("admin.accountDevice").label('用户设备');
  userDevice.listView().title("用户设备").fields([
    nga.field("id").label("ID"),
    nga.field("name").label("玩具昵称"),
    nga.field("alias").label("Alias"),
    nga.field('accessToken'),
    nga.field('appManifest'),
    nga.field('aliyunDeviceId'),
    nga.field('wechatDeviceId'),
    nga.field('activated'),
    nga.field('accountId', 'reference').targetEntity(user).targetField(nga.field("username")).label("拥有者"),
    nga.field('deviceModel', 'template').template('<a class="label label-default">{{entry.values.name}}</a>').label('设备型号')
  ]);
  userDevice.editionView().fields([
    nga.field("name").label("玩具昵称"),
    nga.field("alias").label("Alias"),
    nga.field("deviceModelId", "reference").targetEntity(deviceModel).targetField(nga.field("name")).label("设备型号"),
    nga.field("accountId", "reference").targetEntity(user).targetField(nga.field("username")).label("拥有者")
  ]);
  userDevice.creationView().fields([
    nga.field("name").label("玩具昵称"),
    nga.field("alias").label("Alias"),
    nga.field("deviceModelId", "reference").targetEntity(deviceModel).targetField(nga.field("name")).label("设备型号"),
    nga.field("accountId", "reference").targetEntity(user).targetField(nga.field("username")).label("拥有者")
  ]);
  admin.addEntity(userDevice);

  //应用部分
  var app = nga.entity("admin.app").label('应用');
  app.listView().fields([
    nga.field("id", 'template').template('<span>{{entry.values.id.split("-").join("").slice(0,6)}}</span>'),
    nga.field("name").label('应用名称'),
    nga.field("description").label('描述'),
    nga.field('price', 'number').label('价格'),
    nga.field("icon").label('应用图标'),
    nga.field('appPkg', 'template').template('<span>{{entry.values.appPkgs.length}}</span>').label('版本数量'),
    nga.field("accountId", 'reference').targetEntity(user).targetField(nga.field("username")).label('开发者')
  ]);
  app.editionView().fields([
    nga.field('name'),
    nga.field('price'),
    nga.field("name").label('应用名称'),
    nga.field("description").label('描述'),
    nga.field('price').label('价格'),
    nga.field("icon").label('应用图标')
  ]);
  admin.addEntity(app);

  var appPkg = nga.entity("admin.appPkg").label('应用程序包');
  appPkg.listView().fields([
    nga.field("id"),
    nga.field("version"),
    nga.field("description"),
    nga.field("appId", "reference").targetEntity(app).targetField(nga.field("name")).label('应用名称')
  ]);
  admin.addEntity(appPkg);



}]);
