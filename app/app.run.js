(function(){
  var app = angular.module('Plunner');
  app.run(function($rootScope, $location,$cookies) {
      $rootScope.$on("$routeChangeStart", function (event, next, current) {
          if(next.controller==='dashController' && $cookies.get('auth_token') === undefined ){
            $location.path('/userSignIn');
          }
  });
});
}())
