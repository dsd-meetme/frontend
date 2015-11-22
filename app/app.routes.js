(function(){
  var app = angular.module('Plunner');
  //Routing
  app.config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
        when('/osignin', {
          templateUrl: 'app/components/organization/signIn/osiTemplate.html',
          controller: 'osiController',
          controllerAs: 'osiC'
        }).
        when('/register', {
          templateUrl: 'app/components/organization/registration/regTemplate.html',
          controller: 'regController',
          controllerAs: 'regC'
        }).
        when('/organization', {
          templateUrl: 'app/components/organization/dashboard/dashTemplate.html',
          controller: 'dashController',
          controllerAs: 'dashC'
        }).
        when('/organization/profile',{
          templateUrl: 'app/components/organization/profile/opTemplate.html',
          controller: 'opController',
          controllerAs: 'opC'
        }).
        when('/osirecovery',{
          templateUrl: 'app/components/organization/recovery/recTemplate.html',
          controller: 'recController',
          controllerAs: 'recC'
        }).
        otherwise({
          redirectTo: '/'
        });
    }]);
}());
