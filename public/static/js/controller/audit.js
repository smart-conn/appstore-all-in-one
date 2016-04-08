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
