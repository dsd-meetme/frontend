(function(){
  /**
  A controller that manages global events
  **/
  var controller = function($scope,$location,$rootScope){
    this.comError = false;
    $rootScope.$on('event:comError',function(){
      $scope.rootController.comError = true;
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
