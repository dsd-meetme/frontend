(function(){
  var constants = {
    admin: 'admin',
    planner: 'planner',
    user: 'user'
  }
  var app = angular.module('Plunner');
  app.constant('USER_ROLES', constants);
}())
