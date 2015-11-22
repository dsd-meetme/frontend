(function(){
  var service = function($http){
    return {
      recover : function(email,errorsLocation){
        console.log("centro");
        $http({
          method : 'POST',
          url : 'http://api.plunner.com/companies/password/email',
          data : 'email='+email,
          headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(
          function(response){
          },
          function(response){
            if(response.status === 422){
              errorsLocation = response.data;
            }
          }
        )
      }
    }

  }
  var app = angular.module('Plunner');
  app.factory('recService',service);
}())
