(function(){
  var service = function($http){
    return {
      register : function(data){
        $http({
          method : 'POST',
          url : '//api.plunner.com/register',
          data : 'name='+data.name + '&email='+data.email+'&password='+data.pwd,
          headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'},
          withCredentials : true
        }).then(
          function(response){

          },
          function(response){

          }
        )
      }
    }
  }
  var app = angular.module('Plunner');
  app.factory('regService',service);
}())
