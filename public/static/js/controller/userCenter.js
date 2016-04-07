var userCenter = angular.module("userCenter");
userCenter.controller("UserCenter", function ($http, $state) {
  $http.get("/islogin/" + $state.params.type).success(function (data) {
    if (data.code == 200) {
      if (type == "developer") {
        $state.go("developerAppList");
      } else if (type == "auditor") {
        $state.go("auditorCenter");
      } else if (type == "user") {
        $state.go("appList");
      }
    }
  })
  var type = $state.params.type;
  this.login = () => {
    $http.post("/login/" + $state.params.type, {
      name: $("#login-ipt").val()
    }).success((data) => {
      if (data.code == 200) {
        if (type == "developer") {
          $state.go("developerAppList");
        } else if (type == "auditor") {
          $state.go("auditorCenter");
        } else if (type == "user") {
          $state.go("appList");
        }
      } else {
        console.log("error");
      }
    });
  }
});
userCenter.run(function ($rootScope) {
  $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
    // console.log(event, toState, toParams, fromState, fromParams);
  })
})
