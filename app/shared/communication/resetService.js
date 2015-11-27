(function(){
  var service = function($http,$routeParams){
    var token = $routeParams.token;
    return {
      reset : function(url,data){
        return $http(
          {
            method : 'POST',
            url : url,
            data : jQuery.param(data)
          }
        );
      }
    }
  }

  var app = angular.module('Plunner');

  app.factory('resetService', service);
}())
