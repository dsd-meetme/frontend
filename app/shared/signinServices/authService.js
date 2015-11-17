(function(){
  var service = function($http,$cookies,sessionService){
    var thisService = {};


    thisService.login = function (credentials) {
      console.log($cookies.getAll());
      $http({
        method : 'POST',
        url : '//api.plunner.com/auth/login',
        data : 'email='+credentials.email + '&password='+credentials.pwd,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
      })
      .then(function(response){
        console.log(response);
      }, function(response){
        console.log(response);
      });
    };

    thisService.isAuthenticated = function () {
      return !!Session.userId;
    };

    thisService.isAuthorized = function (authorizedRoles) {
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      return (thisService.isAuthenticated() &&
      authorizedRoles.indexOf(Session.userRole) !== -1);
    };

    return thisService;
  }

  var app = angular.module('Plunner');
  app.factory('authService',service);
}())
