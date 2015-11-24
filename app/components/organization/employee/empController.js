(function(){
  var controller = function(dataProvider,$routeParams,deleter){
    var self = this;
    self.data = {};
    self.errors = {
      unauth : false,
      forb : false
    }
    self.getInfo = function(){
      var employeeId = $routeParams.id;
      dataProvider.provide('http://api.plunner.com/companies/employees/'+employeeId)
      .then(function(response){
        self.data = response.data;
      },function(response){
        if(response.status === 401){
          self.errors.unauth = true;
          self.errors.forb = false;
        }
        else if(response.status === 403){
          self.errors.unauth = false;
          self.errors.forb = true;
        }
      })
    };
    self.delete = function(){
      deleter.delete('http://api.plunner.com/companies/employees/'+employeeId)
      .then(function(response){
        //Show success popup wait for some time
        //redirect
      },function(response){
        if(response.status === 401){
          self.errors.unauth = true;
          self.errors.forb = false;
        }
        else if(response.status === 403){
          self.errors.unauth = false;
          self.errors.forb = true;
        }
      })
    }
    self.update = function(){

    }
  }


  var app = angular.module('Plunner');
  app.controller('empOrgController',controller);
}())
