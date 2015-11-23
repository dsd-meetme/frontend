(function(){
    var service = function($http,$location){
      return {
        /**
        Makes a POST request considering the given url, the given credentials, using
        **/
        login : function(url,credentials,errorsLocation,redirectTo){
          var data;
          if(credentials.name === undefined){
            data = 'email='+credentials.email + '&password='+credentials.pwd;
          }
          else{
            data = 'name='+credentials.name+'&email='+credentials.email+'&password='+credentials.pwd;
          }
          $http({
            method : 'POST',
            url : url,
            data : data,
            headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'}
            //withCredentials : true
          }).then(
            function(response){
              errorsLocation.alreadyExist = false;
              $location.path(redirectTo);
            }
          ,
          function(response){
            errorsLocation = response.data;
          });
        }
      }
    }
    var app = angular.module('Plunner');
    app.factory('loginService',service);
}())
