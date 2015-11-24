(function(){
  /**
  An controller to manage the actions that can be accomplished by a plunner organization
  @author Giorgio Pea
  @param logoutService A service used to manage the logout of a plunner's organization
  **/
  var controller = function(logoutService,orgResources){
    var self = this;
    self.errors = {
      unauthorized : false,
      forbidden : false
    }
    self.data = {};
    //Logout
    self.logout = function(){
        logoutService.logout('/osignin');
    };
    //Get employees
    self.getEmployees = function(){
      //employees restful index
      orgResources.employee.$get({employeeId : ''}).$promise
      .then(function(response){
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
    //Get groups
    self.getGroups = function(){
      //employees restful groups index
      orgResources.group.$get({groupId : ''}).$promise
      .then(function(response){
        self.data.groups = response.data;
      }, function(response){
        if(response.status === 401){
          self.code = 401;
        }
        else if(response.status === 403){
          self.code = 403;
        }
      })
    }
    //self.getEmployees();
  }

  var app = angular.module('Plunner');
  app.controller('dashOrgController',controller);
}())
