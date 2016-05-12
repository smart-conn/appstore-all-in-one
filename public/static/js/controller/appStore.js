var appStore = angular.module("appStore");

appStore.factory('App', function($resource) {
  return $resource('/appStore/apps');
});

appStore.factory('Cart', function($resource) {
  return $resource('/appStore/carts/:id/:type');
});

appStore.service('AppStore', function($http, $resource) {
  this.cartREST = () => {
    return $resource('/appStore/cart');
  };

  this.get = () => {
    $http.get('/appStore/cart').success((data) => {
      this.products = data;
    });
  };

  this.add = (id, type) => {
    return $http.post('/appStore/addCart', {
      type,
      id
    }).then((reply) => {
      return reply.data;
    });
  };

  this.del = () => {
    $http.post('/appStore/delCart', {
      type: type,
      id: id
    }).then((reply) => {
      return reply.data;
    });
  };

  this.purse = () => {
    return $http.get('/').then((reply) => {
      return reply.data;
    });
  };

  this.findAll = () => {
    return $http.get('/');
  };

  this.fastOrder = (id, type) => {
    $http.post('/appStore/fastOrder', {
      id,
      type
    }).then((reply) => {
      return reply.data;
    });
  };

  this.fastBuy = () => {
    $http.get('/appStore/fastBuy').then((reply) => {
      return reply.data;
    });
  };
});

appStore.controller("AppStore", function(Cart, App) {
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
    Cart.fastOrder(id, 'app').then((data) => {
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

appStore.controller('Cart', function(Cart) {
  Cart.query().$promise.then((reply) => {
    this.products = reply;
  });

  this.del = (type, id, $event) => {
    Cart.delete({ id: 2, type: type }).$promise.then((reply) => {
      console.log(reply);
    });
    // $http.post('/appStore/delCart', {
    //   type: type,
    //   id: id
    // }).success((data) => {
    //   console.log(data);
    // })

    console.log("del" + id);
    $event.stopPropagation();
  }
  this.buy = () => {
    $http.get('/appStore/deal').success((data) => {
      console.log(data);
    });
  }
});

appStore.controller('Bought', function($http) {
  $http.get('/appStore/bought').success((data) => {
    this.products = data;
  });
})

appStore.controller("AppInfo", function(AppService, $state, $http) {
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

  this.install = function(id, alias) {
    AppService.install(id, alias);
  }
});
