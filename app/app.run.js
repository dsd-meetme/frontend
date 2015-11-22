(function(){
  var app = angular.module('Plunner');

  app.run(function($rootScope, $location,$cookies) {
    //Route filtering
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
      //Redirect to orgSignIn if you're not authenticated
      var cookie = $cookies.get('auth_token');
      var controller = next.controller;
      if(controller==='dashController' && cookie  === undefined ){
        $location.path('/osignin');
      }
      /*else if(controller==='organizationProfileController' && cookie === undefined){
        $location.path('/orgSignIn');
      }*/
      //Redirect to dashboard if you're authenticated and if you try to access the
      //orgSignIn area
      else if(next.controller==='osiController' && $cookies.get('auth_token') !== undefined){
        $location.path('/organization');
      }
    });
  });
}())
