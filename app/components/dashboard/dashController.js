(function(){
  var controller = function(logoutService){
    this.process = function(){
        logoutService.logout();
        $location('/userSignIn');
    }
  }

  var app = angular.module('Plunner');
  app.controller('dashController',controller);
}())
