angular.module('app').config(routeConfig);

function routeConfig($stateProvider, $urlRouterProvider) {
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
  $stateProvider.state('waitForCheck', {
    url: '/developer/waitForCheck/',
    templateUrl: '_include/developer/waitForCheck.html'
  });
  $stateProvider.state('checkResultSucc', {
    url: '/developer/checkResultSucc',
    templateUrl: '_include/developer/checkResultSucc.html'
  });
  $stateProvider.state('checkResultError', {
    url: '/developer/checkResultError',
    templateUrl: '_include/developer/checkResultError.html'
  });
  $stateProvider.state('developerAppList', {
    url: '/developer/appList',
    templateUrl: '_include/developer/appList.html'
  });
  $stateProvider.state('developerAppInfo', {
    url: '/developer/app/:id/version/:version',
    templateUrl: '_include/developer/appInfo.html'
  });
  $stateProvider.state('developerAppGround', {
    url: '/developer/appGround',
    templateUrl: '_include/developer/appGround.html'
  });
  $stateProvider.state('appEditor', {
    url: '/developer/appEditor/:action/appid/:id/version/:version', //action:[new,edit]
    templateUrl: '_include/developer/appEditor.html'
  });
  $stateProvider.state('appHistoryVersion', {
    url: '/developer/appHistoryVersion/:id',
    templateUrl: '_include/developer/history.html'
  });
  $stateProvider.state('auditorCenter', {
    url: '/audit/appCenter',
    templateUrl: '_include/audit/auditCenter.html'
  });
  $stateProvider.state('auditorBucketList', {
    url: '/audit/bucketList',
    templateUrl: '_include/audit/bucketList.html'
  });
  $stateProvider.state('auditorAppInfo', {
    url: '/audit/appInfo/:id',
    templateUrl: '_include/audit/appInfo.html'
  });
  $stateProvider.state('auditorHistoryVersion', {
    url: '/audit/history/:id/version/:version',
    templateUrl: '_include/audit/history.html'
  });
  $stateProvider.state('auditorDeveloper', {
    url: '/audit/developer/:id',
    templateUrl: '_include/audit/developer.html'
  });
  $stateProvider.state('userCenter', {
    url: '/userCenter/login',
    templateUrl: '_include/userCenter.html'
  })
}
