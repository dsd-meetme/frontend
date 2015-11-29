(function(){
  var service = function($http){
    return {
      publish : function(url,data){
        return $http({
          method : 'POST',
          url : url,
          data : jQuery.param(data),
        })
      }
    }

  }
  var app = angular.module('Plunner');
  app.factory('dataPublisher',service);
}())
