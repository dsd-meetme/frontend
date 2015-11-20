(function(){
    var service = function($http, $cookies, $location,$rootScope){
      return {
        errors : [],
        login : function(credentials,scope_prop){
          $http({
            method : 'POST',
            url : '//api.plunner.com/companies/auth/login',
            data : 'email='+credentials.email + '&password='+credentials.pwd,
            headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'},
            withCredentials : true
          }).then(
            function(response){
              $location.path('/dashboard')
            }
          ,
          function(response){
            console.log(response);
            scope_prop = false;
            if(response.status==='422'){
                          console.log("entro qui");
            }


          });
        },
      }
    }
    var app = angular.module('Plunner');
    app.factory('authService',service);
}())
