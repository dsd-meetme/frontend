(function(){
  /**
  A controller that manages global events
  **/
  var controller = function($scope,$location,$rootScope){
    $rootScope.$on('event:comError',function(){
      $scope.rootController.comError = true
    });
    this.signIn = function(){
      $location.path('/orgSignIn');
    }
    this.reg = function(){
      $location.path('/register');
    }
  }

  var app = angular.module('Plunner');
  app.controller('rootController',controller);
}())
