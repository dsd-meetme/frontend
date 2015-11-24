(function(){
  /**
  A controller that manages global events
  **/
  var controller = function($scope,$location,$rootScope){
    $rootScope.$on('event:comError',function(){
      $scope.rootController.comError = true
    });
    this.presentation = function(){
      $location.path('/presentation');
    }
  }

  var app = angular.module('Plunner');
  app.controller('rootController',controller);
}())
