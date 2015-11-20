(function(){
  var app = angular.module('Plunner');

  app.config(['$httpProvider',
  function($httpProvider) {
    $httpProvider.interceptors.push(function($q,$cookies) {
      return {
        request : function(config) {
          if(config.type === 'GET' || config.type === 'HEAD' || ){
            var token = $cookies.get('auth_token');
            if(token !== undefined){
              config.headers.authorization = token;
              return config;
            }
            return $q.reject('no_token');
          }
        },
        response : function(response) {
          console.log("sasfalshfhla111");
          var token = response.headers.authorization;
          if($cookies.get('auth_token')!==undefined){
            $cookies.remove('auth_token');
          }
          else{
            $cookies.get('auth_token',token);
          }
        },
        responseError : function(response){
          if(response.status !== '422' && response.status !== '401' && response.status !== '403' ){
            console.log("sasfalshfhla");
          }
        }
      };
    });
  }]);
}());
