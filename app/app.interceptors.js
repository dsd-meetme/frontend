(function(){

  var app = angular.module('Plunner');
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
            if(config.url !== 'http://api.plunner.com/companies/auth/login' && config.url !== 'http://api.plunner.com/companies/auth/register' ){
              var token = $cookies.get('auth_token');
              if(token !== undefined){
                config.headers.authorization = token;
              }
            }

          }
          return config;
        },
        response : function(response) {
          //If not template retrieving request
          if(response.config.url.search('app/')===-1){
            //Gets the refreshed token
            var token = response.data.token;
            //Stores token
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
