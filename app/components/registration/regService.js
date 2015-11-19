(function(){
  var service = function($http){
    return {
      register : function(data){
        $http({
          method : 'POST',
          url : '//api.plunner.com/auth/register',
          data : 'name='+data.name + '&email='+data.email+'&password='+data.pwd+'&password_confirmation='+data.pwd,
          headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'},
          withCredentials : true
        }).then(
          function(response){
            console.log(response);
          },
          function(response){
            console.log(response);
          }
        )
      }
    }
  }
  var app = angular.module('Plunner');
  app.factory('regService',service);
}())
