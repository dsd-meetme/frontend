var app = angular.module('Plunner');


app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: 'app/components/domainSignIn/dsiTemplate.html',
        controller: 'dsiController'
      }).
      when('/userSignIn', {
        templateUrl: 'app/components/userSignIn/usiTemplate.html',
        controller: 'usiController'
      }).
      when('/register', {
        templateUrl: 'app/components/registration/regTemplate.html',
        controller: 'regController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
