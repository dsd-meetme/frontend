(function(){
  var controller = function(logoutService){
    this.process = function(){
        logoutService.logout();
    }
  }

  var app = angular.module('Plunner');
  app.controller('dashController',controller);
}())
