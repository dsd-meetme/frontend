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
        when('/usignin', {
          templateUrl: 'app/components/employee/signIn/usiTemplate.html',
          controller: 'usiController',
          controllerAs: 'usiC'
        }).
        when('/register', {
          templateUrl: 'app/components/organization/registration/regTemplate.html',
          controller: 'regController',
          controllerAs: 'regC'
        }).
        when('/organization', {
          templateUrl: 'app/components/organization/dashboard/dashTemplate.html',
          controller: 'dashOrgController',
          controllerAs: 'dashOrgC'
        }).
        when('/employee', {
          templateUrl: 'app/components/employee/dashboard/dashTemplate.html',
          controller: 'dashEmpController',
          controllerAs: 'dashEmpC'
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
        when('/presentation',{
          templateUrl: 'app/components/presentation/presTemplate.html',
          controller: 'presController',
          controllerAs: 'presC'
        }).
        when('/organization/employees/:id',{
          templateUrl: 'app/components/organization/employee/empOrgTemplate.html',
          controller: 'empOrgController',
          controllerAs: 'empOrgC'
        }).
        when('/organization/groups/:id', {
          templateUrl: 'app/components/organization/group/groupOrgTemplate.html',
          controller : 'groupOrgController',
          controllerAs : 'groupOrgC'
        }).
        otherwise({
          redirectTo: '/'
        });
    }]);
}());
