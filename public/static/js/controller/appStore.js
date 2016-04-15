var appStore = angular.module("appStore");

appStore.controller("AppStore", function ($http) {
  $http.get("/appStore/apps").success((data) => {
    this.lists = data;
  });
});

appStore.controller("AppInfo", function (AppService, $state, $http) {
  this.id = $state.params.appID;
  $http.get("/appStore/app/" + $state.params.appID).success((data) => {
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
