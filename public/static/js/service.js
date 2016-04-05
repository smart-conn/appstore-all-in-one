angular.module('app').service('AppService', AppService);

function AppService($http) {
  this.$http = $http;
}

AppService.prototype.install = function (id, alias, version) {
  var $http = this.$http;
  return $http.post(`/device/${alias}/install/${id}`, {
    version
  });
};

AppService.prototype.uninstall = function (id, alias) {
  var $http = this.$http;
  return $http.post(`/device/${alias}/uninstall/${id}`);
};

AppService.prototype.update = function (id, version) {
  var $http = this.$http;
  return $http.post(`/app/${id}/update`, {
    version
  });
};

AppService.prototype.newApp = function (appPackage) {
  var $http = this.$http;
  return $http.post("/developer/upgradeApp", appPackage);
}
AppService.prototype.editApp = function (appPackage) {
  var $http = this.$http;
  return $http.post("/developer/editApp", appPackage);
}
AppService.prototype.upgradeApp = function (appPackage) {
  var $http = this.$http;
  return $http.post("/developer/upgradeApp", appPackage);
}
