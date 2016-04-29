var userCenter = angular.module("userCenter");
userCenter.controller("UserCenter", function($http, $state, $auth, $location) {

  this.authenticate = function(provider) {
    $auth.authenticate(provider).then(() => {
      $state.go("deviceManagement")
    }).catch(() => {
      console.log("error");
    })
  };

  this.localLogin = function(credential) {
    $auth.login(credential).then(() => {
      console.log($auth.getPayload());
      const redirectTo = $state.params.redirectTo || 'afterlogin';
      $location.url(redirectTo).replace();
    }).catch(() => {
      console.log('not ok');
    }).finally(() => {
      $scope.mask = false;
    });
  }

});

