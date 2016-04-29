angular.module('app', [
  'ui.router',
  'appStore',
  'developer',
  'audit',
  'userCenter',
  'ngWebUser'
]).config(function ($authProvider) {
  $authProvider.github({
    clientId: "3d032602cc3318f720bf"
  })
})

angular.module('appStore', []);
angular.module('developer', []);
angular.module('audit', []);
angular.module('userCenter', []);
