(function(){
  var app = angular.module('Plunner');

  app.config(['$httpProvider',
  function($httpProvider) {
    $httpProvider.interceptors.push(function($q,$cookies) {
      return {
        request : function(config) {
          if(config.url!=='http://api.plunner.com/auth/login'){
            var token = $cookies.get('auth_token');
            if(token !== undefined){
              config.headers.authorization = token;
              return config;
            }
            return $q.reject('no_token');
          }
        },
        response : function(response) {
          var token = response.headers.authorization;
          if($cookies.get('auth_token')!==undefined){
            $cookies.remove('auth_token');
          }
          else{
            $cookies.get('auth_token',token);
          }
        }
      };
    });
  }]);
}());
