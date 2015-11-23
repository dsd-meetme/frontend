(function(){
  var service = function($http){
    return {
      provide : function(url,controllerScope){
        return $http({
          method : 'GET',
          url : url,
          //withCredentials : true
        }).then(
          function(response){
            controllerScope.data = response.data;
            controllerScope.errors.forbidden = false;
            controllerScope.errors.unauthorized = false;
          }
        ,
        function(response){
          if(response.status === 401){
            controllerScope.errors.unauthorized = true;
          }
          else if(response.status === 403){
            controllerScope.errors.forbidden = true;
          }
        });
      }
    }
  }
  var app = angular.module('Plunner');
  app.factory('dataProvider',service);
}());
