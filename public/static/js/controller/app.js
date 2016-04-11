angular.module('app').controller('AppController', AppController);

function AppController(AppService, $http, $state) {
  this.AppService = AppService;
  this.$http = $http;
  this.$state = $state;
}

AppController.prototype.logout = function () {
  this.$http.get("/logout").success((data) => {
    console.log("logout")
    console.log(this.$state);
    console.log(this.$state.get());
  })
}
