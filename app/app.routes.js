var app = angular.module('Plunner');


app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: 'app/components/domainSignIn/dsiTemplate.html',
        controller: 'dsiController'
      }).
      when('/loginn', {
        templateUrl: 'app/components/signin/sinTemplate.html',
        controller: 'sinController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
