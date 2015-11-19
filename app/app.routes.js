(function(){
  var app = angular.module('Plunner');
  //Routing
  app.config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
        when('/orgSignIn', {
          templateUrl: 'app/components/orgSignIn/usiTemplate.html',
          controller: 'osiController',
          controllerAs: 'osiC'
        }).
        when('/register', {
          templateUrl: 'app/components/registration/regTemplate.html',
          controller: 'regController',
          controllerAs: 'regC'
        }).
        when('/dashboard', {
          templateUrl: 'app/components/dashboard/dashTemplate.html',
          controller: 'dashController',
          controllerAs: 'dashC'
        }).
        otherwise({
          redirectTo: '/'
        });
    }]);
}());
