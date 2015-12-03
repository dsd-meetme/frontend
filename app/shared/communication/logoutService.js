(function(){
  //A service that manages the logout of an organization or an employee
  var service = function($location,$cookies){
    return {
      logout : function(url){
        $cookies.remove('auth_token');
        $location.path(url);
      }
    }
  }

  var app = angular.module('Plunner');
  app.factory('logoutService',service);
}())
