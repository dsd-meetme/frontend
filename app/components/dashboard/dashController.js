(function(){
  /**
  An controller to manage the actions that can be accomplished by a plunner organization
  @author Giorgio Pea
  @param logoutService A service used to manage the logout of a plunner's organization
  **/
  var controller = function(logoutService){
    this.logout = function(){
        logoutService.logout();
    }
  }

  var app = angular.module('Plunner');
  app.controller('dashController',controller);
}())
