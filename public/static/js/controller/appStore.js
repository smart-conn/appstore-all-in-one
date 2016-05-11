var appStore = angular.module("appStore");



appStore.factory('App', function ($resource) {
  return $resource('/appStore/apps');
});

appStore.service('Cart', function ($http) {

  this.add = (id, type) => {
    return $http.post('/appStore/addCart', {
      type, id
    }).then((data) => {
      return data.data;
    });
  };
  this.purse = () => {
    return $http.get('/').then((data) => {
      return data.data;
    });
  };
  this.findAll = () => {
    return $http.get('/');
  };
});

appStore.controller("AppStore", function (Cart, App) {

  App.query().$promise.then((apps) => {
    this.lists = apps;
  });

  this.addCart = (id, $event) => {
    $event.stopPropagation();
    Cart.add(id, 'app').then((data) => {
      console.log(data);
    });
  };

  this.buy = (id, $event) => {
    $http.post('/appStore/fastBuy', {
      id,
      type: 'app'
    }).success((data) => {
      console.log(data);
    });
    $event.stopPropagation();
  }

  this.purse = () => {
    Order.purse();
  }

  this.zhifubao = () => {
    console.log("zhifubao");
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
  this.buy = () => {
    $http.get('/appStore/deal').success((data) => {
      console.log(data);
    });
  }
});

appStore.controller('Bought', function ($http) {
  $http.get('/appStore/bought').success((data) => {
    this.products = data;
  });
})

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
