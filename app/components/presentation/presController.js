(function(){
  /**
  A controller that manages global events
  **/
  var controller = function($scope,$location,$rootScope){
    
    this.osignIn = function(){
      $location.path('/organization');
    }
    this.reg = function(){
      $location.path('/register');
    }
    this.usignIn = function(){
      $location.path('/employee');
    }

  }

  var app = angular.module('Plunner');
  app.controller('presController',controller);
}())
