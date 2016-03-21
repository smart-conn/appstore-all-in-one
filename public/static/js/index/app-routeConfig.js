angular.module('app').config(routeConfig);

function routeConfig($stateProvider, $urlRouterProvider) {

    // $stateProvider.state('appInstallation', {
    //     url: '/app/install',
    //     templateUrl: '_include/app-installation.html'
    // });

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
}
