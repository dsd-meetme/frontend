(function(){
  var app = angular.module('Plunner');
  app.run(function($rootScope, $location,$cookies) {
    //If the url changes
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
      //Redirect to orgSignIn if you're not authenticated
      if(next.controller==='dashController' && $cookies.get('auth_token') === undefined ){
        $location.path('/orgSignIn');
      }
      //Redirect to dashboard if you're authenticated and if you try to access the
      //orgSignIn area
      else if(next.controller==='osiController' && $cookies.get('auth_token') !== undefined){
        $location.path('/dashboard');
      }
    });
  });
}())
