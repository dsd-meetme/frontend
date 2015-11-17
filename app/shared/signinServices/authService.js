(function(){
  var service = function($http,sessionService){
    var thisService = {};


    thisService.login = function (credentials) {
       return $http
         .post('//api.plunner.com/auth/login', credentials)
         .then(function (res) {
           console.log(res)
           Session.create(res.data.id, res.data.user.id,
                          res.data.user.role);
           return res.data.user;
         });
     };

     thisService.isAuthenticated = function () {
       return !!Session.userId;
     };

     thisService.isAuthorized = function (authorizedRoles) {
       if (!angular.isArray(authorizedRoles)) {
         authorizedRoles = [authorizedRoles];
       }
       return (thisService.isAuthenticated() &&
         authorizedRoles.indexOf(Session.userRole) !== -1);
     };

     return thisService;
  }

  var app = angular.module('Plunner');
  app.factory('authService',service);
}())
