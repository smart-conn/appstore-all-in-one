angular.module('app').controller('AppController', AppController);

function AppController(AppService, $http, $state) {
  this.AppService = AppService;
  this.$http = $http;
  this.$state = $state;
}

function AppList($http) {
  var _this = this;
  $http.get("/apps").then(function (data) {
    _this.lists = data.data;
  });
}
AppController.prototype.logout = function () {
  this.$http.get("/logout").success((data) => {
    console.log("logout")
    console.log(this.$state);
    console.log(this.$state.get());
  })
}

function AppInfo(AppService, $state, $http) {
  this.http = $http;
  this.appInfoService = AppService;
  var _this = this;
  this.id = $state.params.appID;
  $http.get("/apps/" + $state.params.appID).then(function (data) {
    var data = data.data;
    _this.name = data.name;
    _this.description = data.description;
  });
}
AppInfo.prototype.selectDevice = function (id) {
  this.http.get("/findAllDevice", {
    params: {
      appID: id
    }
  }).then((data) => {
    var data = data.data;
    this.devices = data;
    this.appID = id;
  });
}
AppInfo.prototype.install = function (id, alias) {
  this.appInfoService.install(id, alias);
}
