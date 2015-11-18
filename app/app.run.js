(function(){
  var app = angular.module('Plunner');
  app.run(function($rootScope, $location,$cookies) {
      $rootScope.$on("$routeChangeStart", function (event, next, current) {
          if(next.controller==='dashController' && $cookies.get('auth_token') === undefined ){
            $location.path('/userSignIn');
          }
          else if(next.controller==='usiController' && $cookies.get('auth_token') !== undefined){
            $location.path('/dashboard');
          }
          else if (next.controller==='logoutController' && $cookies.get('auth_token') !== undefined) {
            $location.path('/userSignIn');
          }
  });
});
}())
