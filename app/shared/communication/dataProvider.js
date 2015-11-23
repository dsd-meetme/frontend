(function(){
  var service = function($http){
    return {
      provide : function(url){
        return $http({
          method : 'GET',
          url : url,
          //withCredentials : true
        });
      }
    }
  }
  var app = angular.module('Plunner');
  app.factory('dataProvider',service);
}());
