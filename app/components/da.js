(function(){
  var da = function($location){
    this.do = function(){
      $location.url('/login');
    }
  }
  var app = angular.module('Plunner');
  app.controller('da',da)
}())
