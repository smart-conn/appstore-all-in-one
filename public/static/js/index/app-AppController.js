angular.module('app').controller('AppController', AppController);
angular.module("appList")
  .controller("AppList", AppList)
  .controller("AppInfo", AppInfo);

var audit = angular.module("audit");
audit.controller("AuditDeveloper", function ($http, $state) {
  $http.get("/audit/developer/" + $state.params.id).success((data) => {
    this.developer = data;
  });
})
audit.controller("AuditorHistoryVersion", function ($http, $state) {
  $http.get("/developer/app/" + $state.params.id + "/version/" + $state.params.version).success((data) => {
    this.appPackage = data;
    console.log(data);
  });
});
audit.controller("AuditorAppInfo", function ($http, $state) {
  this.app = {};
  this.appPackages = [];
  console.log($state.params.id);
  $http.get("/audit/bucket/" + $state.params.id).success((data) => {
    if (data == "") $state.go("auditorBucketList");
    else {
      this.app = data;
      $http.get("/developer/appVersions/" + data.appPackage.app.id).success((versions) => {
        this.appPackages = versions;
      });
    }
  });
  this.commit = (data) => {
    console.log(this.app);
    console.log(data);
    $http.post("/audit/status", {
      id: this.app.appPackage.id,
      msg: data
    }).success((data) => {
      $state.go("auditorBucketList");
    });
  }
});
audit.controller("AuditCenter", function ($http, $state) {
  this.apps = [];
  this.selected = [];
  $http.get("/audit/apps").success((data) => {
    this.apps = data;
    for (let i in data) {
      this.selected.push(false);
    }
  });
  this.commit = (data) => {
    var selectedAppID = [];
    for (let i in data) {
      if (data[i]) {
        selectedAppID.push(this.apps[i].id);
      }
    }
    if (selectedAppID.length != 0) {
      $http.post('/audit/auditorBucket', {
        IDs: selectedAppID
      }).success(function (data) {
        console.log(data);
        $state.go("auditorBucketList");
      });
    }
  }
  this.selectAll = (data) => {
    for (let i in this.selected) {
      this.selected[i] = data;
    }
  }
});
audit.controller("AuditorBucketList", function ($http) {
  this.apps = [];
  $http.get("/audit/bucketList").success((data) => {
    this.apps = data;
  });
});

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
  $http.get("/apps").success((data) => {
    this.apps = data;
  });
});
developer.controller("DeveloperAppInfo", function ($state, $http) {
  $http.get("/developer/app/" + $state.params.id + "/version/" + $state.params.version).success((data) => {
    this.appPackage = data;
  });
  $http.get("/developer/appVersions/" + $state.params.id).success((data) => {
    this.appPackages = data;
  });
});
developer.controller("DeveloperAppGround", function () {})

function AppController(AppService) {
  this.AppService = AppService;
}

function AppList($http) {
  var _this = this;
  $http.get("/apps").then(function (data) {
    _this.lists = data.data;
  });
}

function AppInfo(AppService, $state, $http) {
  this.http = $http;
  this.appInfoService = AppService;
  var _this = this;
  this.id = $state.params.appID;
  $http.get("/apps/" + $state.params.appID).then(function (data) {
    var data = data.data;
    _this.name = data.name;
    _this.description = data.description;
  });
}
AppInfo.prototype.selectDevice = function (id) {
  this.http.get("/findAllDevice", {
    params: {
      appID: id
    }
  }).then((data) => {
    var data = data.data;
    this.devices = data;
    this.appID = id;
  });
}
AppInfo.prototype.install = function (id, alias) {
  this.appInfoService.install(id, alias);
}
