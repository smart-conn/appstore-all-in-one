angular.module('app', [
  'ui.router',
  'ct.ui.router.extras',
  'satellizer',
  'permission'
]);

angular.module('app').config(routeConfig);
angular.module('app').run(permissionDefinition);

function hasScope($auth, scope) {
  try {
    const scopes = $auth.getPayload().scope.split(',');
    const result = scopes.indexOf(scope) !== -1;
    return result;
  } catch (err) {
    return false;
  }
}

const scopes = [
  'consumer',
  'developer',
  'admin',
];

function permissionDefinition(PermissionStore, $auth) {
  PermissionStore.definePermission('anonymous', function (stateParams) {
    return !$auth.isAuthenticated();
  });
  scopes.forEach(function (scope) {
    PermissionStore.definePermission(scope, function (stateParams) {
      return hasScope($auth, scope);
    });
  });
}

function routeConfig($urlRouterProvider, $stateProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider.state('login', {
    url: '/login?redirectTo',
    templateUrl: 'login.html',
    controller: AuthenticationController,
    controllerAs: 'authCtrl'
  });

  $stateProvider.state('signup', {
    url: '/signup?redirectTo',
    templateUrl: '/token-based-authentication/signup.html',
    controller: AuthenticationController,
    controllerAs: 'authCtrl'
  });

  $stateProvider.state('root', {
    url: '/',
    templateUrl: '/token-based-authentication/root.html',
    controller: AuthenticationController,
    controllerAs: 'authCtrl'
  });

  $stateProvider.state('dashboard', {
    url: '/dashboard',
    templateUrl: '/token-based-authentication/dashboard.html',
    data: {
      permissions: {
        only: ['consumer'],
        redirectTo: function () {
          return {
            state: 'login',
            params: {
              redirectTo: 'dashboard'
            }
          };
        }
      }
    }
  });

}

function AuthenticationController($auth, $http, $state, $location, $scope) {
  this.$auth = $auth;
  this.$http = $http;
  this.$state = $state;
  this.$location = $location;
  this.$scope = $scope;
}

AuthenticationController.prototype.logout = function () {
  const $auth = this.$auth;
  const $state = this.$state;
  $auth.logout();
  $state.reload(); // ugly hack for refresh permission directive
}

AuthenticationController.prototype.signup = function (credential) {
  const $auth = this.$auth;
  const $state = this.$state;
  const $scope = this.$scope;

  $scope.mask = true;

  $auth.signup(credential).then(() => {
    const redirectTo = $state.params.redirectTo || 'aftersignup';
    $location.url(redirectTo).replace();
  }).catch(() => {
    console.log('not ok');
  }).finally(() => {
    $scope.mask = false;
  });
};

AuthenticationController.prototype.login = function (credential) {
  const $auth = this.$auth;
  const $state = this.$state;
  const $scope = this.$scope;
  const $location = this.$location;

  $scope.mask = true;

  $auth.login(credential).then(() => {
    const redirectTo = $state.params.redirectTo || 'afterlogin';
    $location.url(redirectTo).replace();
  }).catch(() => {
    console.log('not ok');
  }).finally(() => {
    $scope.mask = false;
  });
};

AuthenticationController.prototype.test = function () {
  const $auth = this.$auth;
  const $http = this.$http;

  console.log('test');
  $http.get('/api/test').success(() => {
    console.log('ok');

  }).error(() => {
    console.log('not ok');

  });
};
