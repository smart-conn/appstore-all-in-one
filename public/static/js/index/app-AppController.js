angular.module('app').controller('AppController', AppController);
angular.module("appList")
  .controller("AppList", AppList)
  .controller("AppInfo", AppInfo);
angular.module("appUpload")
  .controller("AppUpload", AppUpload)
  .controller("WaitForCheck", WaitForCheck)
  .controller("CheckResult", CheckResult)
  .controller("DeveloperAppList", DeveloperAppList)
  .controller("DeveloperAppInfo", DeveloperAppInfo)


function CheckResult($state) {
  this.result = $state.params.result == "succ" ? "truthy" : "falsy";
}

function DeveloperAppInfo() {

}

function DeveloperAppList() {

}

function WaitForCheck($state) {
  // console.log($state.params.result);
  // this.result = $state.params.result;
}

function AppUpload($http) {
  var _this = this;
  $http.get("/deviceModel").then(function (data) {
    console.log(data);
    _this.deviceModels = data.data;
  });
}

function AppController(AppService) {
  this.AppService = AppService;
}

function AppList($http) {
  var _this = this;
  $http.get("/apps").then(function (data) {
    _this.lists = data.data;
  });
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
