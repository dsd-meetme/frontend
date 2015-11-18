(function(){
    var service = function($http, $cookies, $location){
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
              console.log(response);
              var token = response.data.token;
              if(credentials.rmbMe==='true'){
                $cookies.put('auth_token',token,{
                  expires : dataManipulator.addDays(7)
                })
              }
              else{
                $cookies.put('auth_token',token);
              }
              $location.path('/dashboard')
            }
          ,
          function(response){
            if(response.status===442){
              errors.push(442)
            }
          });
        },
      }
    }
    var app = angular.module('Plunner');
    app.factory('authService',service);
}())
