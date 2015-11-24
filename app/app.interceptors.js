(function(){

  var app = angular.module('Plunner');
  var excludedUrlFromToken = [
    'http://api.plunner.com/companies/auth/login',
    'http://api.plunner.com/companies/auth/register',
    'http://api.plunner.com/companies/password/email'
  ]
  /**
  Http interceptors
  **/
  app.config(['$httpProvider',
  function($httpProvider) {
    $httpProvider.interceptors.push(function($q,$cookies,$rootScope) {
      return {
        request : function(config) {
          //If not template retrieving request
          if(config.url.search('app/')===-1){
            //If not a login/register request (these requests don't need to include the token)
            if(excludedUrlFromToken.indexOf(config.url) === -1 ){
              var token = $cookies.get('auth_token');
              console.log("Url "+config.url);
              console.log('Appending token to request '+token);
              if(token !== undefined){
                config.headers.Authorization = token;
              }
            }

          }
          return config;
        },
        response : function(response) {
          //If not template retrieving request
          if(response.config.url.search('app/')===-1 && response.config.method !== 'OPTIONS' ){
            //Gets the refreshed token
            var token = response.headers('Authorization');
            console.log("Received token "+token);
            if($cookies.get('auth_token')!==undefined){
              $cookies.remove('auth_token');
            }
            $cookies.put('auth_token',token);
          }
          return response;
        },
        responseError : function(response){
          if(response.status !== 422 && response.status !== 401 && response.status !== 403 ){
            $rootScope.$broadcast('event:comError');
          }
          return $q.reject(response);
        }
      };
    });
  }]);
}());
