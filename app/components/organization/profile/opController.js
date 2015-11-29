(function(){
  var controller = function(dataProvider){
    var self = this;
    self.data = {};

    self.errors = {
      unauthorized : false,
      forbidden : false
    }
    dataProvider.provide('http://api.plunner.com/companies/example',self);


  }

  var app = angular.module('Plunner');
  app.controller('opController',controller);
}())
