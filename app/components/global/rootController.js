(function(){
  /**
  A controller that manages global events
  **/
  var controller = function($location,$rootScope){
    var c = this;
    c.comErrors = {
      general : false,
      auth : false
    }
    $rootScope.$on('event:comErrorGeneral',function(){
      c.comErrors.auth = false;
      c.comErrors.general = true;
    });
    $rootScope.$on('event:comErrorAuth',function(){
      c.comErrors.general = false;
      c.comErrors.auth = true;
    });
    this.presentation = function(){
      $location.path('/presentation');
    }
    this.orgsignin = function(){
      $location.path('/orgsignin');
    }
    this.signup = function(){
      $location.path('/signup');
    }
    this.usersignin = function(){
      $location.path('/usersignin');
    }
  }

  var app = angular.module('Plunner');
  app.controller('rootController',controller);
}())
