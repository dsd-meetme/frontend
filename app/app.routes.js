(function(){
  var app = angular.module('Plunner');
  //Routing
  app.config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
        when('/orgsignin', {
          templateUrl: 'app/components/organization/signIn/osiTemplate.html',
          controller: 'osiController',
          controllerAs: 'osiC'
        }).
        when('/usersignin', {
          templateUrl: 'app/components/employee/signIn/usiTemplate.html',
          controller: 'usiController',
          controllerAs: 'usiC'
        }).
        when('/signup', {
          templateUrl: 'app/components/organization/registration/regTemplate.html',
          controller: 'regController',
          controllerAs: 'regC'
        }).
        when('/organization', {
          templateUrl: 'app/components/organization/dashboard/dashTemplate.html',
          controller: 'dashOrgController',
          controllerAs: 'dashOrgC'
        }).
        when('/user', {
          templateUrl: 'app/components/employee/dashboard/edTemplate.html',
          controller: 'dashEmpController',
          controllerAs: 'dashEmpC'
        }).
        when('/organization/profile',{
          templateUrl: 'app/components/organization/profile/opTemplate.html',
          controller: 'opController',
          controllerAs: 'opC'
        }).
        when('/orgpwdrecovery',{
          templateUrl: 'app/components/organization/recovery/recTemplate.html',
          controller: 'recController',
          controllerAs: 'recC'
        }).
        when('/presentation',{
          templateUrl: 'app/components/presentation/presTemplate.html',
          controller: 'presController',
          controllerAs: 'presC'
        }).
        when('/organization/users/:id',{
          templateUrl: 'app/components/organization/employee/empOrgTemplate.html',
          controller: 'empOrgController',
          controllerAs: 'empOrgC'
        }).
        when('/organization/groups/:id', {
          templateUrl: 'app/components/organization/group/groupOrgTemplate.html',
          controller : 'groupOrgController',
          controllerAs : 'groupOrgC'
        }).
        when('/user/newmeeting', {
          templateUrl: 'app/components/employee/newMeeting/nmTemplate.html',
          controller : 'nmController',
          controllerAs : 'nmC'
        }).
        when('/userpwdrecovery', {
          templateUrl: 'app/components/employee/recovery/recTemplate.html',
          controller : 'empRecController',
          controllerAs : 'emprecC'
        }).
        when('/userpwdreset/:token', {
          templateUrl: 'app/components/employee/recovery/empResetTemplate.html',
          controller : 'empResetController',
          controllerAs : 'empresC'
        }).
        when('/orgpwdreset/:token', {
          templateUrl: 'app/components/organization/recovery/resetTemplate.html',
          controller : 'resetController',
          controllerAs : 'resetC'
        }).
        otherwise({
          redirectTo: '/'
        });
    }]);
}());
