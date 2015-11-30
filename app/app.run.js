(function(){
  var app = angular.module('Plunner');

  app.run(function($rootScope, $location,$cookies) {
    //Route filtering
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
      //Gets the decoded jwt
      var mode;
      var token = $cookies.get('auth_token');

      if(token != null || !angular.isUndefined(token)){
        mode = jwt_decode($cookies.get('auth_token')).mode;
      }
      //Gets the url the user want to reach
      var path = next.originalPath;

      //Mode checking(organizations)
      if(!angular.isUndefined(path)){
        console.log('centro');
        if(path.search('organization')!== -1){
          if(angular.isUndefined(mode) || mode !== 'cn'){
            $location.path('/osignin');
          }
        }
        //Mode checking(employees)
        else if(path.search('employee')!== -1 && path.search('auth') === -1){
          if(mode === undefined || mode !== 'en'){
            $location.path('/usignin');
          }
        }
        if(path.search('/orgsignin')!== -1 || path.search('/usersignin')!== -1){
          if(mode === 'en'){
            $location.path('/user');
          }
          else if(mode === 'cn'){
            $location.path('/organization');
          }
        }
      }
    });
  });
}())
