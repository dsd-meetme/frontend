(function(){
  var controller = function($routeParams, orgResources,$location,$timeout){

    var c = this;
    //group id
    var id = $routeParams.id;
    c.data = {};
    c.errors = {
      unauthorized : false,
      forbidden : false
    },
    c.invalidFields = {
      nameReq : false
    }
    c.inchange = false;

    //Get employee info in the context of an org
    c.getInfo = function(){
      //restful show
      orgResources.group().get({groupId:id}).$promise
      .then(function(response){
        c.data.group = response;
        c.data.groupC = response;
        c.getEmployees();
      },function(response){
        c.errors.unauthorized = (response.status === 401);
        c.errors.forbidden = (response.status === 403);
      })
    }
    //Delete an employee in the context of an org
    c.delete = function(){
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
        c.errors.unauthorized = (response.status === 401);
        c.errors.forbidden = (response.status === 403);
      })
    }
    c.updatePlanner = function(plannerId){
      if(plannerId !== c.data.group.planner_id){
        orgResources.group().update({groupId:id},jQuery.param({
          name : c.data.group.name,
          description : c.data.group.desc,
          planner_id : plannerId
        })).$promise
      .then(function(){
        alert('sucess');
        c.getInfo();
      },function(){
        c.errors.unauthorized = (response.status === 401);
        c.errors.forbidden = (response.status === 403);
      })
      }
    }
    //Update employee info
    c.updateInfo = function(){
        c.invalidFields.nameReq = (c.data.groupC.name === '');
        if(c.invalidFields.nameReq === false){
          orgResources.group().update({groupId:id},{
            name : c.data.groupC.name,
            description : c.data.groupC.desc,
            planner_id : c.data.group.planner_id
          }).$promise
        .then(function(response){
          alert('sucess');
          c.inchange = false;
          c.getInfo();
        },function(response){
          c.errors.unauthorized = (response.status === 401);
          c.errors.forbidden = (response.status === 403);
        })
      }
    }
    c.getEmployees = function(){
      orgResources.employeeInGroup().query({groupId:id, employeeId: ''}).$promise
      .then(
        function(response){
          c.data.members = response;
        }, function(response){
          c.errors.unauthorized = (response.status === 401);
          c.errors.forbidden = (response.status === 403);
        }
      )
    }
    c.deleteFromGroup = function(eid){
      orgResources.employeeInGroup().remove({groupId:id, employeeId: eid}).$promise
      .then(
        function(response){
          c.getEmployees();
        }, function(response){
          c.errors.unauthorized = (response.status === 401);
          c.errors.forbidden = (response.status === 403);
        }
      )
    }
    c.getInfo();
  }
  var app = angular.module('Plunner');
  app.controller('groupOrgController',controller);
}())
