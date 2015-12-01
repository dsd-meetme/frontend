(function(){
  /**
  A controller that manages global events
  **/
  var controller = function($scope,$location,$rootScope){
    this.orgSignIn = function(){
      $location.path('/orgsignin');
    };
    this.reg = function(){
      $location.path('/signup');
    };
    this.userSignIn = function(){
      $location.path('/usersignin');
    };
    this.signup = function(){
      $location.path('/signup');
    }
  };

  var app = angular.module('Plunner');
  app.controller('presController',controller);
}());
