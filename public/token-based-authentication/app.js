angular.module('app', [
  'satellizer',
  'ui.router'
]);

angular.module('app').config(routeConfig);

function routeConfig($urlRouterProvider, $stateProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'login.html',
    controller: AuthenticationController,
    controllerAs: 'authCtrl'
  });

  $stateProvider.state('signup', {
    url: '/signup',
    templateUrl: 'signup.html',
    controller: AuthenticationController,
    controllerAs: 'authCtrl'
  });

  $stateProvider.state('root', {
    url: '/',
    templateUrl: 'root.html',
    controller: AuthenticationController,
    controllerAs: 'authCtrl'
  });

}

function AuthenticationController($auth, $http) {
  this.$auth = $auth;
  this.$http = $http;
}

AuthenticationController.prototype.signup = function(credential) {
  const $auth = this.$auth;
  console.log('signup');

  $auth.signup(credential).then(() => {
    console.log('ok');

  }).catch(() => {
    console.log('not ok');

  });
};

AuthenticationController.prototype.login = function(credential) {
  const $auth = this.$auth;
  console.log('login');

  $auth.login(credential).then(() => {
    console.log('ok');

  }).catch(() => {
    console.log('not ok');

  });
};

AuthenticationController.prototype.test = function() {
  const $auth = this.$auth;
  const $http = this.$http;

  console.log('test');
  $http.get('/api/test').success(() => {
    console.log('ok');

  }).catch(() => {
    console.log('not ok');

  });
};
