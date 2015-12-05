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
          templateUrl: 'app/components/user/signIn/usiTemplate.html',
          controller: 'usiController',
          controllerAs: 'usiC'
        }).
        when('/signup', {
          templateUrl: 'app/components/organization/registration/regTemplate.html',
          controller: 'regController',
          controllerAs: 'regC'
        }).
        when('/organization', {
          templateUrl: 'app/components/organization/dashboard/odashTemplate.html',
          controller: 'odashController',
          controllerAs: 'odashC'
        }).
        when('/user', {
          templateUrl: 'app/components/user/dashboard/udashTemplate.html',
          controller: 'udashController',
          controllerAs: 'udashC'
        }).
        when('/organization/profile',{
          templateUrl: 'app/components/organization/profile/opTemplate.html',
          controller: 'opController',
          controllerAs: 'opC'
        }).
        when('/user/schedules/compose', {
          templateUrl: 'app/components/user/composeSchedule/cschedTemplate.html',
          controller: 'cschedController',
          controllerAs: 'cschedC'
        }).
        when('/orgrecovery',{
          templateUrl: 'app/components/organization/recovery/orecTemplate.html',
          controller: 'orecController',
          controllerAs: 'orecC'
        }).
        when('/presentation',{
          templateUrl: 'app/components/presentation/presTemplate.html',
          controller: 'presController',
          controllerAs: 'presC'
        }).
        when('/organization/users/:id',{
          templateUrl: 'app/components/organization/user/userTemplate.html',
          controller: 'userController',
          controllerAs: 'userC'
        }).
        when('/organization/groups/:id', {
          templateUrl: 'app/components/organization/group/groupTemplate.html',
          controller : 'groupController',
          controllerAs : 'groupC'
        }).
        when('/user/newmeeting', {
          templateUrl: 'app/components/user/meeting/nmTemplate.html',
          controller : 'nmController',
          controllerAs : 'nmC'
        }).
        when('/userecovery', {
          templateUrl: 'app/components/user/recovery/urecTemplate.html',
          controller : 'urecController',
          controllerAs : 'urecC'
        }).
        when('/usereset/:token', {
          templateUrl: 'app/components/user/recovery/urstTemplate.html',
          controller : 'urstController',
          controllerAs : 'urstC'
        }).
        when('/orgreset/:token', {
          templateUrl: 'app/components/organization/recovery/orstTemplate.html',
          controller : 'orstController',
          controllerAs : 'orstC'
        }).
        otherwise({
          redirectTo: '/presentation'
        });
    }]);
}());
