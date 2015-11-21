(function(){
  /**
  A service used to register a plunner's organization
  **/
  var service = function($http,$location,errorsLocation){
    return {
      register : function(data){
        $http({
          method : 'POST',
          url : '//api.plunner.com/companies/auth/register',
          data : 'name='+data.name + '&email='+data.email+'&password='+data.pwd+'&password_confirmation='+data.pwd,
          headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'}
          //withCredentials:true
        }).then(
          function(response){
            $location.path('/dashboard');
          },
          function(response){
            if(response.status===422){
              errorsLocation = response.data;
            }
          }
        )
      }
    }
  }
  var app = angular.module('Plunner');
  app.factory('regService',service);
}())
