angular.module('app').controller('AppController', function (AppService, $http, $state) {
  this.AppService = AppService;
  var auditor = new RegExp(/^\/auditor\/[\w\W]*$/);
  var developer = new RegExp(/^\/developer\/[\w\W]*$/);
  var appStore = new RegExp(/^\/appStore\/[\w\W]*$/);
  this.logout = function () {
    $http.get("/logout").success((data) => {
      console.log("logout");
      if (appStore.test($state.current.url)) {
        $state.go("login", {
          type: "user"
        });
      } else if (developer.test($state.current.url)) {
        $state.go("login", {
          type: "developer"
        });
      } else if (auditor.test($state.current.url)) {
        $state.go("login", {
          type: "auditor"
        });
      }
    });
  }
});
