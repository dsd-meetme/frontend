(function(){
  var app = angular.module('Plunner');

  app.config(['$httpProvider',
  function($httpProvider) {
    $httpProvider.interceptors.push(function($q,$cookies) {
      return {
        request : function(config) {
          if(config.url !== 'http://api.plunner.com/companies/auth/login' && config.url !== 'http://api.plunner.com/companies/auth/register' ){
            var token = $cookies.get('auth_token');
            if(token !== undefined){
              config.headers.authorization = token;
            }
            return config;
          }
        },
        response : function(response) {
          console.log(response);
          var token = response.headers.authorization;
          if($cookies.get('auth_token')!==undefined){
            $cookies.remove('auth_token');

          }
          else{
            $cookies.get('auth_token',token);
          }
          return response;
        },
        responseError : function(response){
          if(response.status !== '422' && response.status !== '401' && response.status !== '403' ){
            console.log("sasfalshfhla");
          }
          return response;
        }
      };
    });
  }]);
}());
