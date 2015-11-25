(function(){
  var app = angular.module('Plunner');

  app.run(function($rootScope, $location,$cookies) {
    //Route filtering
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
      //Gets the decoded jwt
      var mode = undefined;
      var token = $cookies.get('auth_token');
      if(token !== undefined){
        mode = jwt_decode($cookies.get('auth_token')).mode;
      }
      //Gets the url the user want to reach
      var path = next.originalPath;
      //Mode checking(organizations)
      if(path.search('organization')!== -1 && path.search('auth') === -1 ){
        console.log("mode"+mode);
        if(mode === undefined || mode !== 'cn'){
          $location.path('/osignin');
        }
      }
      //Mode checking(employees)
      else if(path.search('employees')!== -1 && path.search('auth') === -1){
        if(mode === undefined || mode !== 'en'){
          $location.path('/usignin');
        }
      }
    });
  });
}())
