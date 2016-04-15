var audit = angular.module("audit");
//开发人员详细信息
audit.controller("AuditDeveloper", function ($http, $state) {
  $http.get("/auditor/developer/" + $state.params.id).success((data) => {
    this.developer = data;
  });
});

// 历史版本
audit.controller("AuditorHistoryVersion", function ($http, $state) {
  $http.get("/auditor/app/" + $state.params.id + "/version/" + $state.params.version).success((data) => {
    this.appPackage = data;
  });
});

// 应用详细信息 提交审核结果
audit.controller("AuditorAppInfo", function ($http, $state) {
  this.app = {};
  this.appPackages = [];
  var taskID = $state.params.id;
  $http.get("/auditor/task/" + $state.params.id).success((data) => {
    if (data == "") $state.go("auditorTaskList");
    else {
      this.app = data;
      $http.get("/auditor/appVersions/" + data.appPackage.app.id).success((versions) => {
        this.appPackages = versions;
      });
    }
  });

  this.commit = (data) => {
    $http.post("/auditor/status", {
      id: taskID,
      msg: data
    }).success((data) => {
      $state.go("auditorTaskList");
    });
  }
});

//审查中心
audit.controller("AuditorCenter", function ($http, $state) {
  this.apps = [];
  this.selected = [];
  $http.get("/auditor/apps").success((data) => {
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
      console.log(selectedAppID);
      $http.post('/auditor/addTask', {
        IDs: selectedAppID
      }).success(function (data) {
        console.log(data);
        $state.go("auditorTaskList");
      });
    }
  }
  this.selectAll = (data) => {
    for (let i in this.selected) {
      this.selected[i] = data;
    }
  }
});
audit.controller("AuditorTaskList", function ($http) {
  this.apps = [];
  $http.get("/auditor/taskList").success((data) => {
    this.apps = data;
  });
});
