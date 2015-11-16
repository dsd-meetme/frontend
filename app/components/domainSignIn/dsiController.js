(function(){
  var controller = function(plunnerAuth,$location){
    var success = function(response){
      if(response.checked ){
        $location.url(this.dName+'.plunner.com');
      }
      else if(response.status < 20){
        this.noD = true;
      }
      else{
        fail();
      }
    }
    var fail = function(response){
      this.serverError = true
    }
    this.process = function(){
      if(!dsiForm.$error){
        $location.url('/loginn');
      }
    }
  }
  var app = angular.module('Plunner');
  app.controller('dsiController',controller);
}())
