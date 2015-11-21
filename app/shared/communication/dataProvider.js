(function(){
  var service = function($http){
    return {
      provide : function(url,storageLocation,errorsLocation){
        return $http({
          method : 'GET',
          url : url,
          //withCredentials : true
        }).then(
          function(response){
            storageLocation.data = response.data;
            errorsLocation.forbidden = false;
            errorsLocation.unauthorized = false;
          }
        ,
        function(response){
          if(response.status === 401){
            errorsLocation.unauthorized = true;
          }
          else if(response.status === 403){
            errorsLocation.forbidden = true;
          }
        });
      }
    }
  }
  var app = angular.module('Plunner');
  app.factory('dataProvider',service);
}());
