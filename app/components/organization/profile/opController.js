(function(){
  var controller = function(dataProvider){
    var self = this;
    self.data = {};
    self.errors = {
      unauthorized : false,
      forbidden : false
    }
    dataProvider.provide('http://api.plunner.com/companies/example').then(
      function(response){
          self.data = response.data;
      }, function(response){
        if(response.status === 401){
          self.errors.unauthorized = true;
        }
        else if(response.status === 403){
          self.errors.forbidden = true;
        }
      }
    );


  }

  var app = angular.module('Plunner');
  app.controller('opController',controller);
}())
