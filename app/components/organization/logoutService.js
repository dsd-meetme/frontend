(function(){
  /**
  A service that manages the logout of a plunner's organization
  **/
  var service = function($location,$cookies){
    return {
      logout : function(){
        $cookies.remove('auth_token');
        $location.path('/osignin');
      }
    }
  }

  var app = angular.module('Plunner');
  app.factory('logoutService',service);
}())
