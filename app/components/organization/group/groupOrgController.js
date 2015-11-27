(function(){
  var controller = function($routeParams, orgResources,$location,$timeout){
    var self = this;
    self.data = {};
    self.errors = {
      unauth : false,
      forb : false
    },
    self.invalidFields = {
      nameReq : false
    }
    self.inchange = false;
    //employee id
    var id = $routeParams.id;
    //Get employee info in the context of an org
    self.getInfo = function(){
      //restful show
      orgResources.group().get({groupId:id}).$promise
      .then(function(response){
        console.log(response);
        self.data.group = response;
        self.data.groupC = response;
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
    }
    //Delete an employee in the context of an org
    self.deleteGroup = function(){
      //restful delete
      orgResources.group().remove({groupId:id}).$promise
      .then(function(response){
        jQuery('#confirmPopup').modal('show');
        $timeout(function(){
          jQuery('#confirmPopup').modal('hide');
          $location.path('/organization')
        },2000);
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
    self.updatePlanner = function(ida){
      console.log(id);
      if(ida !== self.data.group.planner_id){
        console.log('entro qui')
        orgResources.group().update({groupId:id},{
          name : self.data.group.name,
          description : self.data.group.desc,
          planner_id : ida
        }).$promise
      .then(function(){
        alert('sucess');
        self.getInfo();
      },function(){
        //
      })
      }
    }
    //Update employee info
    self.updateInfo = function(){
        self.invalidFields.nameReq = (self.data.groupC.name === '');
        if(self.invalidFields.nameReq === false){
          orgResources.group().update({groupId:id},{
            name : self.data.groupC.name,
            description : self.data.groupC.desc,
            planner_id : self.data.group.planner_id
          }).$promise
        .then(function(){
          alert('sucess');
          self.inchange = false;
          self.getInfo();
        },function(){
          //
        })
      }
    }
    self.getEmployees = function(){
      orgResources.employeeInGroup().query({groupId:id, employeeId: ''}).$promise
      .then(
        function(response){
          console.log(response);
          self.data.members = response;
        }, function(response){

        }
      )
    }
    self.deleteFromGroup = function(eid){
      orgResources.employeeInGroup().remove({groupId:id, employeeId: eid}).$promise
      .then(
        function(){
          self.getEmployees();
        }, function(){

        }
      )
    }
    self.getInfo();
  }
  var app = angular.module('Plunner');
  app.controller('groupOrgController',controller);
}())
