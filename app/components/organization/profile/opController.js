(function(){
  var controller = function(dataProvider){
    this.data = {};
    this.errors = {
      unauthorized : false,
      forbidden : false
    }
    dataProvider.provide('http://api.plunner.com/companies/example').then(
      function(response){
          this.data = response.data;
      }, function(response){
        if(response.status === 401){
          this.errors.unauthorized = true;
        }
        else if(response.status === 403){
          this.errors.forbidden = true;
        }
      }
    );


  }

  var app = angular.module('Plunner');
  app.controller('opController',controller);
}())
