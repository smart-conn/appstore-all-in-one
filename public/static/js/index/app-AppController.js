angular.module('app').controller('AppController', AppController);
angular.module("appList")
    .controller("AppList", AppList)
    .controller("AppInfo", AppInfo);

function AppController(AppService) {
    this.AppService = AppService;
}

function AppList($http) {
    var _this = this;
    $http.get("/apps").then(function(data) {
        _this.lists = data.data;
    });
}

function AppInfo(AppService, $state, $http, $scope, AppService) {
    this.http = $http;
    this.appInfoService = AppService;
    var _this = this;
    this.id = $state.params.appID;
    $http.get("/apps/" + $state.params.appID).then(function(data) {
        var data = data.data;
        console.log(data.name)
        _this.name = data.name;
    });
}
AppInfo.prototype.selectDevice = function(id) {
    this.http.get("/findAllDevice").then((data) => {
        var data = data.data;
        this.devices = data;
        this.appID = id;
    });
}
AppInfo.prototype.install = function(id, alias) {
    this.appInfoService.install(id, alias);
}