angular.module('app').config(routeConfig);

function routeConfig($stateProvider, $urlRouterProvider, $webUserProvider) {

  $webUserProvider.scopes([
    'auditor',
    'custmer',
    'developer',
    'admin'
  ]);

  //设备绑定
  $stateProvider.state('deviceManagement', {
    url: '/device/management',
    templateUrl: '_include/deviceManagement.html',
    data: {
      permissions: {
        only: ['custmer'],
        redirectTo: function () {
          return {
            state: 'login',
            params: {
              redirectTo: '/device/management'
            }
          };
        }
      }
    }
  });
  //商店 应用信息
  $stateProvider.state('appInformation', {
    url: '/appStore/app/:appID',
    templateUrl: '_include/appStore/info.html',
    data: {
      permissions: {
        only: ['custmer'],
        redirectTo: function () {
          return {
            state: 'login',
            params: {
              redirectTo: '/appStore/list'
            }
          };
        }
      }
    }
  });
  //商店 应用列表
  $stateProvider.state('appList', {
    url: '/appStore/list',
    templateUrl: '_include/appStore/list.html',
    data: {
      permissions: {
        only: ['custmer'],
        redirectTo: function () {
          return {
            state: 'login',
            params: {
              redirectTo: '/appStore/list'
            }
          };
        }
      }
    }
  });

  //购物车
  $stateProvider.state('cart', {
    url: '/appStore/cart',
    templateUrl: '_include/appStore/cart.html',
    data: {
      permissions: {
        only: ['custmer'],
        redirectTo: function () {
          return {
            state: 'login',
            params: {
              redirectTo: '/appStore/list'
            }
          };
        }
      }
    }
  });

  // 已经购买的商品
  $stateProvider.state('bought', {
    url: '/appStore/bought',
    templateUrl: '_include/appStore/bought.html',
    data: {
      permissions: {
        only: ['custmer'],
        redirectTo: function () {
          return {
            state: 'login',
            params: {
              redirectTo: '/appStore/list'
            }
          };
        }
      }
    }
  });


  //开发者 等待审核页
  $stateProvider.state('waitForCheck', {
    url: '/developer/waitForCheck',
    templateUrl: '_include/developer/waitForCheck.html',
    data: {
      permissions: {
        only: ['developer'],
        redirectTo: function () {
          return {
            state: 'login',
            params: {
              redirectTo: '/developer/appList'
            }
          };
        }
      }
    }
  });
  //开发者 审核通过页
  $stateProvider.state('checkResultSucc', {
    url: '/developer/checkResultSucc',
    templateUrl: '_include/developer/checkResultSucc.html',
    data: {
      permissions: {
        only: ['developer'],
        redirectTo: function () {
          return {
            state: 'login',
            params: {
              redirectTo: '/developer/appList'
            }
          };
        }
      }
    }
  });
  //开发者 审核未通过页
  $stateProvider.state('checkResultError', {
    url: '/developer/checkResultError',
    templateUrl: '_include/developer/checkResultError.html',
    data: {
      permissions: {
        only: ['developer'],
        redirectTo: function () {
          return {
            state: 'login',
            params: {
              redirectTo: '/developer/appList'
            }
          };
        }
      }
    }
  });
  //开发者 应用列表
  $stateProvider.state('developerAppList', {
    url: '/developer/appList',
    templateUrl: '_include/developer/appList.html',
    data: {
      permissions: {
        only: ['developer'],
        redirectTo: function () {
          return {
            state: 'login',
            params: {
              redirectTo: '/developer/appList'
            }
          };
        }
      }
    }
  });
  //开发者 某应用信息
  $stateProvider.state('developerAppInfo', {
    url: '/developer/app/:id/version/:version',
    templateUrl: '_include/developer/appInfo.html',
    data: {
      permissions: {
        only: ['developer'],
        redirectTo: function () {
          return {
            state: 'login',
            params: {
              redirectTo: '/developer/appList'
            }
          };
        }
      }
    }
  });
  //开发者 上架信息
  $stateProvider.state('developerOnboardList', {
    url: '/developer/onboardList',
    templateUrl: '_include/developer/onboardList.html',
    data: {
      permissions: {
        only: ['developer'],
        redirectTo: function () {
          return {
            state: 'login',
            params: {
              redirectTo: '/developer/appList'
            }
          };
        }
      }
    }
  });
  //开发者 某个上架应用信息
  $stateProvider.state('developerOnboard', {
    url: '/developer/onboard/:appID/versionID/:versionID',
    templateUrl: '_include/developer/onboard.html',
    data: {
      permissions: {
        only: ['developer'],
        redirectTo: function () {
          return {
            state: 'login',
            params: {
              redirectTo: '/developer/appList'
            }
          };
        }
      }
    }
  });
  //开发者 应用编辑
  $stateProvider.state('appEditor', {
    url: '/developer/appEditor/:action/appid/:id/versionID/:versionID', //action:[new,edit]
    templateUrl: '_include/developer/appEditor.html',
    data: {
      permissions: {
        only: ['developer'],
        redirectTo: function () {
          return {
            state: 'login',
            params: {
              redirectTo: '/developer/appList'
            }
          };
        }
      }
    }
  });
  //开发者 历史版本
  $stateProvider.state('appHistoryVersion', {
    url: '/developer/appHistoryVersion/:id',
    templateUrl: '_include/developer/history.html',
    data: {
      permissions: {
        only: ['developer'],
        redirectTo: function () {
          return {
            state: 'login',
            params: {
              redirectTo: '/developer/appList'
            }
          };
        }
      }
    }
  });
  //审核 审核中心 所有待审核应用
  $stateProvider.state('auditorCenter', {
    url: '/auditor/appCenter',
    templateUrl: '_include/auditor/center.html',
    data: {
      permissions: {
        only: ['auditor'],
        redirectTo: function () {
          return {
            state: 'login',
            params: {
              redirectTo: '/auditor/appCenter'
            }
          };
        }
      }
    }
  });
  //审核 某个审核人员的所有待审核应用
  $stateProvider.state('auditorTaskList', {
    url: '/auditor/bucketList',
    templateUrl: '_include/auditor/taskList.html',
    data: {
      permissions: {
        only: ['auditor'],
        redirectTo: function () {
          return {
            state: 'login',
            params: {
              redirectTo: '/auditor/appCenter'
            }
          };
        }
      }
    }
  });
  //审核 某个审核应用的信息
  $stateProvider.state('auditorAppInfo', {
    url: '/auditor/appInfo/:id',
    templateUrl: '_include/auditor/appInfo.html',
    data: {
      permissions: {
        only: ['auditor'],
        redirectTo: function () {
          return {
            state: 'login',
            params: {
              redirectTo: '/auditor/appCenter'
            }
          };
        }
      }
    }
  });
  //审核 某个审核应用的某个有历史版本
  $stateProvider.state('auditorHistoryVersion', {
    url: '/auditor/history/:id/version/:version',
    templateUrl: '_include/auditor/history.html',
    data: {
      permissions: {
        only: ['auditor'],
        redirectTo: function () {
          return {
            state: 'login',
            params: {
              redirectTo: '/auditor/appCenter'
            }
          };
        }
      }
    }
  });
  //审核人员查看开发人员信息
  $stateProvider.state('auditorDeveloper', {
    url: '/auditor/developer/:id',
    templateUrl: '_include/auditor/developer.html',
    data: {
      permissions: {
        only: ['auditor'],
        redirectTo: function () {
          return {
            state: 'login',
            params: {
              redirectTo: '/auditor/appCenter'
            }
          };
        }
      }
    }
  });
  //登录
  $stateProvider.state('login', {
    url: '/login?redirectTo',
    templateUrl: '_include/userCenter.html'
  });
}
