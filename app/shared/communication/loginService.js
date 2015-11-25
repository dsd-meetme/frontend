(function(){
    var service = function($http){
      return {
        /**
        Makes a POST request considering the given url, the given credentials, using
        **/
        login : function(url,credentials){
          var data;
          if(credentials.name === undefined){
            data = 'email='+credentials.email + '&password='+credentials.pwd;
          }
          else{
            data = 'company='+credentials.name+'&email='+credentials.email+'&password='+credentials.pwd;
          }
          return $http({
            method : 'POST',
            url : url,
            data : data,
            headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'}
            //withCredentials : true
          });
        }
      }
    }
    var app = angular.module('Plunner');
    app.factory('loginService',service);
}())
