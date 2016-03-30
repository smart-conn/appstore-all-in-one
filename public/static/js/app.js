'use strict';
var app = angular.module("app", []);
app.config(($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('deviceManagement', {
    url: '/device/management',
    templateUrl: '_include/device-management.html'
  });
  $stateProvider.state('appInformation', {
    url: '/device/information/:appID',
    templateUrl: '_include/app-information.html'
  });
  $stateProvider.state('appList', {
    url: '/device/list',
    templateUrl: '_include/app-list.html'
  });
  $stateProvider.state('appUpload', {
    url: '/developer/appUpload',
    templateUrl: '_include/developer/appUpload.html'
  });
  $stateProvider.state('waitForCheck', {
    url: '/developer/waitForCheck/',
    templateUrl: '_include/developer/waitForCheck.html'
  });
  $stateProvider.state('checkResult', {
    url: '/developer/checkResult/:result',
    templateUrl: '_include/developer/checkResult.html'
  });
  $stateProvider.state('developerAppList', {
    url: '/developer/appList',
    templateUrl: '_include/developer/appList.html'
  });
  $stateProvider.state('developerAppInfo', {
    url: '/developer/appInfo',
    templateUrl: '_include/developer/appInfo.html'
  });
});
