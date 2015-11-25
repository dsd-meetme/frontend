(function(){
  var service = function($resource){
    var employeeResource = $resource('http://api.plunner.com/companies/employees/:employeeId',null,{
      'update' : {
        method : 'PUT'
      }
    });
    var groupResource = $resource('http://api.plunner.com/companies/groups/:groupId',null, {
      'update' : {
        method : 'PUT'
      }
    });
    var employeesWithinGroup = $resource('http://api.plunner.com/companies/groups/:groupId/employees/:employeeId',null, {
      'update' : {
        method : 'PUT'
      }
    });
    var planner = $resource('http://api.plunner.com/companies/groups/:groupId/planners/:plannerId',null, {
      'update' : {
        method : 'PUT'
      }
    });
    return {
        employee : function(){
          return employeeResource;
        },
        group : function(){
          return groupResource;
        },
        employeeInGroup : function(){
          return employeesWithinGroup;
        },
        planner : function(){
          return planner;
        }
    }
  }
  var app = angular.module('Plunner');
  app.factory('orgResources', service);
}())
