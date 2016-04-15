var developer = angular.module("developer");
developer.controller("AppEditor", function (AppService, $http, $state) {
  this.appPackage = {}; //应用的详细信息
  this.compatible = []; //应用兼容设备的情况
  this.deviceModels = []; //所有设备
  $http.get("/deviceModel").success((data) => {
    this.deviceModels = data;
    if ($state.params.action == "edit") {
      $http.get("/developer/app/" + $state.params.id + "/version/" + $state.params.versionID).success((data) => {
        console.log(data);
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

  this.commit = function (appPackage, compatibles) {
    appPackage.deviceModels = [];
    for (let i in compatibles) {
      if (compatibles[i]) {
        appPackage.deviceModels.push(this.deviceModels[i]);
      }
    }
    let resMsg = null;
    if ($state.params.action == "new") {
      resMsg = AppService.newApp(appPackage);
    } else if ($state.params.action == "edit") {
      resMsg = AppService.upgradeApp(appPackage);
    }
    console.log(appPackage);
    resMsg.success(function (data) {
      if (data.code == 200) {
        console.log("succ");
        $state.go("developerAppList");
      } else {
        console.log("error");
        alert("请耐心等待审核结果。");
      }
    });
  }
  this.save = function (appPackage, compatibles) {
    console.log($state.params.action);
    appPackage.deviceModels = [];
    for (let i in compatibles) {
      if (compatibles[i]) {
        appPackage.deviceModels.push(this.deviceModels[i]);
      }
    }
    let resMsg = null;
    if ($state.params.action == "new") {
      resMsg = AppService.saveApp(appPackage);
    } else if ($state.params.action == "edit") {
      resMsg = AppService.editApp(appPackage);
    }
    resMsg.success(function (data) {
      if (data.code == 200) {
        console.log("succ");
        $state.go("developerAppList");
      } else {
        console.log("error");
        alert("请耐心等待审核结果。");
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
    this.apps = data;
  });
});

developer.controller("DeveloperAppInfo", function ($state, $http) {
  this.appPackage = {};
  this.appID = $state.params.id;
  this.appVersion = $state.params.version;
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

developer.controller("DeveloperOnboardList", function ($http, $state) {
  $http.get("/developer/onboardList").success((data) => {
    this.apps = data;
  });
});

developer.controller("DeveloperOnboard", function ($http, $state) {
  var appID = $state.params.appID;
  var versionID = $state.params.versionID;

  $http.get("/developer/appID/" + appID + "/versionID/" + versionID).success((data) => {
    this.app = data;
  });
  $("#sell").change(function () {
    if ($(this).val() == "free") {
      $("#price").hide();
    } else {
      $("#price").show();
    }
  });

  this.onboard = () => {
    var params = {
      appID: appID,
      versionID: versionID
    };
    if ($("#sell").val() !== "free") {
      params.price = $("#price").val();
    }
    $http.post("/developer/onboard", params).success((data) => {
      console.log(data);
    });
  }
});
