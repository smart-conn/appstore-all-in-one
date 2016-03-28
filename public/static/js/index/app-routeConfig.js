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
  $stateProvider.state('appUpload', {
    url: '/developer/appUpload',
    templateUrl: '_include/developer/appUpload.html'
  })
}
