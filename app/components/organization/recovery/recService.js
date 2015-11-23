(function(){
  var service = function($http){
    return {
      recover : function(email,controllerScope){
        console.log("centro");
        $http({
          method : 'POST',
          url : 'http://api.plunner.com/companies/password/email',
          data : 'email='+email,
          headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(
          function(response){
            controllerScope.success = true;
            controllerScope.errors = {};
          },
          function(response){
            if(response.status === 422){
              controllerScope.errors = response.data;
            }
          }
        )
      }
    }

  }
  var app = angular.module('Plunner');
  app.factory('recService',service);
}())
