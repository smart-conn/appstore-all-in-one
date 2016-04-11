var appStore = angular.module("appList");

appStore.controller("AppList", function ($http) {
  $http.get("/apps").success((data) => {
    this.lists = data;
  });
});

appStore.controller("AppInfo", function (AppService, $state, $http) {
  this.id = $state.params.appID;
  $http.get("/apps/" + $state.params.appID).success((data) => {
    this.name = data.name;
    this.description = data.description;
  });

  this.selectDevice = (id) => {
    $http.get("/findAllDevice", {
      params: {
        appID: id
      }
    }).success((data) => {
      this.devices = data;
      this.appID = id;
    });
  }

  this.install = function (id, alias) {
    AppService.install(id, alias);
  }
});
