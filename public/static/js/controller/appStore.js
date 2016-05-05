var appStore = angular.module("appStore");

appStore.controller("AppStore", function ($http) {
  $http.get("/appStore/apps").success((data) => {
    this.lists = data;
  });

  this.addCart = (id, $event) => {
    $http.post('/appStore/addCart', {
      type: 'app',
      id: id
    }).success((data) => {
      console.log(data);
    });
    $event.stopPropagation();
  };

  this.buy = (id, $event) => {
    $http.get('/appStore/cart').success((data) => {
      console.log(data);
    });
    $event.stopPropagation();
  }
});

appStore.controller('Cart', function ($http) {
  $http.get('/appStore/cart').success((data) => {
    this.products = data;
  });

  this.del = (type, id, $event) => {
    $http.post('/appStore/delCart', {
      type: type,
      id: id
    }).success((data) => {
      console.log(data);
    })
    console.log("del" + id);
    $event.stopPropagation();
  }
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
