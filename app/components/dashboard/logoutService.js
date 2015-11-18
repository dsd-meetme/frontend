(function(){
  var service = function($http,$location,$cookies){
    return {
      logout : function(){
        $cookies.remove('auth_token');
      }
    }
  }
  var app = angular.module('Plunner');
  app.factory('logoutService',service);
}())
