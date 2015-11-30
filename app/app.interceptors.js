(function(){

  var app = angular.module('Plunner');
  var excludedUrlFromToken = [
    'http://api.plunner.com/companies/auth/login',
    'http://api.plunner.com/companies/auth/register',
    'http://api.plunner.com/companies/password/email',
    'http://api.plunner.com/employees/auth/login'
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
          if(config.url.search('app/')===-1 && config.url.search('template/') === -1){
            //If not a login/register request (these requests don't need to include the token)
            if(config.method === 'POST' || config.method === 'PUT'){
              config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
            }
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
          if(response.config.url.search('app/')===-1 && response.config.method !== 'OPTIONS'  && response.config.url.search('template/') === -1){
            //Gets the refreshed token
            var token;
            if(response.config.url==='http://api.plunner.com/companies/auth/login' || response.config.url==='http://api.plunner.com/employees/auth/login' ){
              token = 'Bearer '+response.data.token;
            }
            else{
              token = response.headers('Authorization');
            }
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
