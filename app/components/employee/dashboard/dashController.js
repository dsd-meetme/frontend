(function(){
  /**
  An controller to manage the actions that can be accomplished by a plunner organization
  @author Giorgio Pea
  @param logoutService A service used to manage the logout of a plunner's organization
  **/
  var controller = function(logoutService,dataProvider){
    this.errors = {
      unauthorized : false,
      forbidden : false
    }
    this.data = {};
    this.logout = function(){
        logoutService.logout('/usignin');
    }
  }

  var app = angular.module('Plunner');
  app.controller('dashEmpController',controller);
}())
