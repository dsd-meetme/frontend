(function(){
    var service = function($http, $cookies, $location,$rootScope){
      var self = this;
      var error = false;
      var success = false;
      return {
        errors : [],
        login : function(credentials){
          $http({
            method : 'POST',
            url : 'http://api.plunner.com/companies/auth/login',
            data : 'email='+credentials.email + '&password='+credentials.pwd,
            headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'}
            //withCredentials : true
          }).then(
            function(response){
              success = true;
              $location.path('/dashboard');
            }
          ,
          function(response){
            if(response.status===422){
                error = true;
                $rootScope.$emit('event:badMatch');
            }


          });
        },
        success : function(){
          return success;
        },
        error : function(){
          return error;
        }
      }
    }
    var app = angular.module('Plunner');
    app.factory('loginService',service);
}())
