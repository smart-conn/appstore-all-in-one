angular.module('app').config(routeConfig);

function routeConfig($stateProvider, $urlRouterProvider) {
  $stateProvider.state('deviceManagement', {
    url: '/device/management',
    templateUrl: '_include/device-management.html'
  });
  $stateProvider.state('appInformation', {
    url: '/appStore/app/:appID',
    templateUrl: '_include/appStore/info.html'
  });
  $stateProvider.state('appList', {
    url: '/appStore/list',
    templateUrl: '_include/appStore/list.html'
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
  $stateProvider.state('developerOnboardList', {
    url: '/developer/onboardList',
    templateUrl: '_include/developer/onboardList.html'
  });
  $stateProvider.state('developerOnboard', {
    url: '/developer/onboard/:appID',
    templateUrl: '_include/developer/onboard.html'
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
    url: '/auditor/appCenter',
    templateUrl: '_include/auditor/center.html'
  });
  $stateProvider.state('auditorTaskList', {
    url: '/auditor/bucketList',
    templateUrl: '_include/auditor/taskList.html'
  });
  $stateProvider.state('auditorAppInfo', {
    url: '/auditor/appInfo/:id',
    templateUrl: '_include/auditor/appInfo.html'
  });
  $stateProvider.state('auditorHistoryVersion', {
    url: '/auditor/history/:id/version/:version',
    templateUrl: '_include/auditor/history.html'
  });
  $stateProvider.state('auditorDeveloper', {
    url: '/auditor/developer/:id',
    templateUrl: '_include/auditor/developer.html'
  });
  $stateProvider.state('login', {
    url: '/login/:type',
    templateUrl: '_include/userCenter.html'
  });
}
