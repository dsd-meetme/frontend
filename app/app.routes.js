(function(){
  var app = angular.module('Plunner');

  app.config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
        when('/userSignIn', {
          templateUrl: 'app/components/userSignIn/usiTemplate.html',
          controller: 'usiController',
          controllerAs: 'usiC'
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
