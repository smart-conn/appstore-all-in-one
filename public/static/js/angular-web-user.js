(function() {

  angular.module('ngWebUser', [
    'satellizer',
    'ui.router',
    'permission'
  ]).config(function($authProvider) {
    $authProvider.oauth2({
      name: 'wechat',
      url: '/auth/wechat',
      corpId: 'wx2336f1012fd9d73b',
      redirectUri: window.location.origin,
      authorizationEndpoint: 'https://qy.weixin.qq.com/cgi-bin/loginpage',
      requiredUrlParams: ['corp_id'],
      scope: ['snsapi_userinfo'],
      scopeDelimiter: ',',
      display: 'popup',
      type: '2.0',
      popupOptions: { width: 500, height: 560 }
    });
  });

  angular.module('ngWebUser').run(permissionDefinition);
  angular.module('ngWebUser').provider('$webUser', WebUserProvider);
  angular.module('ngWebUser').directive('login', LoginDirective);
  angular.module('ngWebUser').directive('logout', LogoutDirective);
  angular.module('ngWebUser').directive('signup', SignupDirective);
  angular.module('ngWebUser').directive('mask', MaskDirective);

  function WebUserProvider() {
    var _scopes = [];
    var _allowAnonymous = true;
    var _defaultLoginRedirectTo = '/';

    this.scopes = function(scopes) {
      if (!scopes) return _scopes;
      _scopes = scopes;
      return this;
    };

    this.defaultLoginRedirectTo = function(redirectTo) {
      if (!redirectTo) return _defaultLoginRedirectTo;
      _defaultLoginRedirectTo = redirectTo;
      return this;
    };

    this.allowAnonymous = function(allow) {
      if (!allow) return _allowAnonymous;
      _allowAnonymous = allow;
      return this;
    };

    this.$get = function($auth) {
      return {
        defaultLoginRedirectTo: function() {
          return _defaultLoginRedirectTo;
        },
        allowAnonymous: function() {
          return _allowAnonymous;
        },
        scopes: function() {
          return _scopes;
        },
        isAnonymous: function() {
          return !$auth.isAuthenticated();
        },
        hasScope: function(scope) {
          try {
            const scopes = $auth.getPayload().scope.split(',');
            const result = scopes.indexOf(scope) !== -1;
            return result;
          } catch (err) {
            return false;
          }
        }
      };
    };
  }

  function MaskDirective() {
    return {
      link: function(scope, element) {
        scope.$on('maskOn', function() {
          console.log('mask on');
          element.attr('disabled', true);
        });
        scope.$on('maskOff', function() {
          console.log('mask off');
          element.attr('disabled', false);
        });
      }
    }
  }

  function LoginDirective() {
    return {
      scope: {
        credential: '=login'
      },
      link: function(scope, element) {
        element.on('click', scope.login);
      },
      controller: function($scope, $auth, $state, $location, $webUser) {
        $scope.login = function() {
          var credential = $scope.credential;
          $scope.$emit('maskon');
          $auth.login(credential).then(function() {
            $scope.$emit('loginsucces');
            var redirectTo = $state.params.redirectTo || $webUser.defaultLoginRedirectTo();
            $location.url(redirectTo).replace();
          }).catch(function() {
            $scope.$emit('loginfail');
          }).finally(function() {
            $scope.$emit('maskoff');
          });
        };
      }
    };
  }

  function SignupDirective() {
    return {
      scope: {
        credential: '=signup'
      },
      link: function(scope, element) {
        element.on('click', scope.signup);
      },
      controller: function($scope) {
        $scope.signup = function() {};
      }
    };
  }

  function LogoutDirective() {
    return {
      link: function(scope, element) {
        element.on('click', scope.logout);
      },
      controller: function($scope, $auth, $state) {
        $scope.logout = function() {
          $auth.logout();
          $state.reload();
        };
      }
    };
  }

  function permissionDefinition($webUser, PermissionStore) {
    if ($webUser.allowAnonymous()) {
      PermissionStore.definePermission('anonymous', function(stateParams) {
        return $webUser.isAnonymous();
      });
    }
    $webUser.scopes().forEach(function(scope) {
      PermissionStore.definePermission(scope, function(stateParams) {
        return $webUser.hasScope(scope);
      });
    });
  }

})();
