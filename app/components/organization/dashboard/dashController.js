(function(){
  /**
  An controller to manage the actions that can be accomplished by a plunner organization
  @author Giorgio Pea
  @param logoutService A service used to manage the logout of a plunner's organization
  **/
  var controller = function(logoutService,dataProvider){
    var self = this;
    self.errors = {
      unauthorized : false,
      forbidden : false
    }
    self.data = {};
    self.logout = function(){
        logoutService.logout('/osignin');
    };
    self.getEmployees = function(){
      dataProvider.provide('http://api.plunner.com/companies/employees').then(function(response){
        self.data.employees = response.data;
        //self.getGroups();
      },function(response){
        if(response.status === 401){
          self.errors.unauthorized = true;
        }
        else if(response.status === 403){
          self.errors.forbidden = true;
        }
      });
    }
    self.getGroups = function(){
      dataProvider.provide('http://api.plunner.com/companies/groups').then(function(response){
        self.data.groups = response.data;
      }, function(response){
        if(response.status === 401){
          self.errors.unauthorized = true;
        }
        else if(response.status === 403){
          self.errors.forbidden = true;
        }
      })
    }
    self.getEmployees();
  }

  var app = angular.module('Plunner');
  app.controller('dashController',controller);
}())
