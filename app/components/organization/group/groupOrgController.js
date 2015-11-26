(function(){
  var controller = function($routeParams, orgResources){
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
      orgResources.group().get({groupId:id}).$promise
      .then(function(response){
        console.log(response);
        self.data.group = response;
        self.getEmployees();
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
      orgResources.group().remove({groupId:id}).$promise
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
        orgResources.group().get({groupId:id}).$promise
        .then(function(){

        },function(){
          //
        })
    }
    self.getEmployees = function(){
      orgResources.employeeInGroup().get({groupId:id, employeeId: ''}).$promise
      .then(
        function(response){
          console.log(response);
          self.data.members = response;
        }, function(response){

        }
      )
    }
    self.removeEmployee = function(eid){
      orgResources.employeeInGroup().remove({groupId:id, employeeId: eid}).$promise
      .then(
        function(){

        }, function(){

        }
      )
    }
    self.getInfo();
  }
  var app = angular.module('Plunner');
  app.controller('groupOrgController',controller);
}())
