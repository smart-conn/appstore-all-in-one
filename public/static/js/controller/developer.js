var developer = angular.module("developer");
developer.controller("AppEditor", function (AppService, $http, $state) {
  this.appPackage = {}; //应用的详细信息
  this.compatible = []; //应用兼容设备的情况
  this.deviceModels = []; //所有设备
  $http.get("/deviceModel").success((data) => {
    this.deviceModels = data;
    if ($state.params.id) {
      $http.get("/developer/app/" + $state.params.id).success((data) => {
        this.appPackage = data;
        for (let deviceModel of this.deviceModels) {
          let length = this.compatible.length;
          for (let i in this.appPackage.deviceModels) {
            if (deviceModel.id == this.appPackage.deviceModels[i].id) {
              this.compatible.push(true);
              continue;
            }
          }
          if (this.compatible.length == length)
            this.compatible.push(false);
        }
      });
    }
  });

  this.commit = function (appPackage, compatibles, action) {
    appPackage.deviceModels = [];
    for (let i in compatibles) {
      if (compatibles[i]) {
        appPackage.deviceModels.push(this.deviceModels[i]);
      }
    }
    let resMsg = null;
    if (action && action == "edit") {
      resMsg = AppService.editApp(appPackage);
    } else if ($state.params.action == "new") {
      resMsg = AppService.newApp(appPackage);
    } else if ($state.params.action == "edit") {
      resMsg = AppService.editApp(appPackage);
    } else if ($state.params.action == "upgrade") {
      resMsg = AppService.upgradeApp(appPackage);
    }
    resMsg.success(function (data) {
      if (data.code == 200) {
        console.log("succ");
        $state.go("developerAppList");
      } else {
        console.log("error");
      }
    });
  }
});

developer.controller("WaitForCheck", function () {

});
developer.controller("AppHistoryVersion", function ($http, $state) {
  $http.get("/developer/appVersions/" + $state.params.id).success((data) => {
    this.appPackages = data;
  });
});

developer.controller("CheckResultSucc", function () {

});
developer.controller("CheckResultError", function () {

});
developer.controller("DeveloperAppList", function ($http) {
  $http.get("/developer/apps").success((data) => {
    console.log(data);
    this.apps = data;
  });
});
developer.controller("DeveloperAppInfo", function ($state, $http) {
  this.appPackage = {};
  $http.get("/developer/app/" + $state.params.id + "/version/" + $state.params.version).success((data) => {
    this.appPackage = data;
  });
  $http.get("/developer/appVersions/" + $state.params.id).success((data) => {
    this.historys = data;
  });
  this.edit = () => {
    $http.get("/developer/status/" + this.appPackage.app.id).success((data) => {
      if (data.status != "edit") {
        $("#developerAppInfoModal .content").html("已经提交审核，不可以再更改，请耐心等待审核结果。")
        $("#developerAppInfoModal").modal("show");
      } else {
        $state.go("appEditor", {
          action: 'edit',
          id: this.appPackage.app.id
        });
      }
    });
  }
  this.update = () => {
    $http.get("/developer/status/" + this.appPackage.app.id).success((data) => {
      console.log(data.status == "reviewPass");
      if (data.status == "edit" || data.status == "waitReview" || data.status == "reviewing") {
        $("#developerAppInfoModal .content").html("已经提交审核，不可以再更改，请耐心等待审核结果。")
        $("#developerAppInfoModal").modal("show");
      } else {
        $state.go(`appEditor`, {
          action: 'upgrade',
          id: this.appPackage.app.id
        });
      }
    })
  }
});
developer.controller("DeveloperAppGround", function () {})
