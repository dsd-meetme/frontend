(function(){
    var service = function($http, $cookies, $location,$rootScope){
      return {
        errors : [],
        login : function(credentials){
          $http({
            method : 'POST',
            url : '//api.plunner.com/auth/login',
            data : 'email='+credentials.email + '&password='+credentials.pwd,
            headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'},
            withCredentials : true
          }).then(
            function(response){
              $location.path('/dashboard')
            }
          ,
          function(response){
            if(response.status==='422'){
              $rootScope.$broadcast('event:NotRegUser');
            }


          });
        },
      }
    }
    var app = angular.module('Plunner');
    app.factory('authService',service);
}())
