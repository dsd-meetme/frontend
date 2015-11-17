(function(){
  var service = function($rootScope, $q, AUTH_EVENTS){
    return {
      responseError: function (response) {
        $rootScope.$broadcast({
          401: AUTH_EVENTS.notAuthenticated,
          403: AUTH_EVENTS.notAuthorized,
          419: AUTH_EVENTS.sessionTimeout,
          440: AUTH_EVENTS.sessionTimeout
        }[response.status], response);
        return $q.reject(response);
      }
    };
  }
  var app = angular.module('Plunner');
  app.factory('authInterceptor', service);
  app.config(function($httpProvider){
    $httpProvider.interceptors.push('authInterceptor');
    //$httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  });
})
