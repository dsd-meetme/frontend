(function(){
  var controller = function($routeParams,orgResources){
    var self = this;
    self.data = {};
    self.errors = {
      unauth : false,
      forb : false
    }
    //employee id
    var id = $routeParams.id;
    //Get employee info in the context of an org
    self.getInfo = function(){
      //restful show
      orgResources.employee.$get({employeeId:id}).$promise
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
    //Delete an employee in the context of an org
    self.delete = function(){
      //restful delete
      orgResources.employee.$remove({employeeId:id}).$promise
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
    //Update employee info
    self.update = function(data){
        //validation
        orgResources.employees.update({employeeId:id}).$promise
        .then(function(){
          //
        },function(){
          //
        })
    }
  }


  var app = angular.module('Plunner');
  app.controller('empOrgController',controller);
}())
