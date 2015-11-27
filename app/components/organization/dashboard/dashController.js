  (function(){
    /**
    An controller to manage the actions that can be accomplished by a plunner organization
    @author Giorgio Pea
    @param logoutService A service used to manage the logout of a plunner's organization
    **/
    var controller = function(logoutService,orgResources,arrayToUrlParams,$cookies){
      var self = this;
      var a = [1,2]
      console.log($.param(angular.toJson(a)));
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
        orgResources.employee().query({employeeId : ''}).$promise
        //console.log('token to deliver '+$cookies.get('auth_token'))
        /*$http({
        method : 'GET',
        url : 'http://api.plunner.com/companies/employees',
        headers : {
        Authorization : $cookies.get('auth_token')
      }
    })*/
    .then(function(response){
      console.log(response.headers);
      /*$cookies.remove('auth_token');
      $cookies.put('auth_token',response.headers('Authorization'));*/
      console.log('token ricevuto '+$cookies.get('auth_token'));
      self.data.employees = response;
      self.getGroups();
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
    orgResources.group().query({groupId : ''}).$promise
    .then(function(response){
      console.log(response)
      self.data.groups = response;
      console.log(self.data.groups);
      console.log($cookies.get('auth_token'));

    }, function(response){
      if(response.status === 401){
        self.code = 401;
      }
      else if(response.status === 403){
        self.code = 403;
      }
    })
  }
  self.getEmployees();
  self.addGroup = {
    planner : null,
    members: [],
    selectPlanner : function(id){
      this.selectedPlanner = id;
    },
    name : '',
    desc : '',
    invalidFields : {
      nameReq : false,
      descReq : false,
      plannerReq : false,
      membersReq : false,
      nonMatchingPlanner : false
    },
    submit : function(){
      var validMembers = [];
      angular.forEach(this.members, function(value, key){
        if(value===true){
          validMembers.push(key.toString());
        }
      })
      this.invalidFields.nameReq = (this.name === '');
      this.invalidFields.descReq = (this.desc === '');
      this.invalidFields.membersReq = (this.members.length === 0);
      this.invalidFields.plannerReq = (this.planner == null || angular.isUndefined(this.planner));
      this.invalidFields.nonMatchingPlanner = (validMembers.indexOf(this.planner) === -1);

      console.log(this.invalidFields);
      if(this.invalidFields.nameReq === false && this.invalidFields.plannerReq === false
        && this.invalidFields.membersReq === false
        && this.invalidFields.nonMatchingPlanner === false
        && this.invalidFields.descReq === false){
          orgResources.group().save({groupId: ''},jQuery.param({name : this.name, planner_id : this.planner})).$promise
          .then(function(response){
            var b = response.id;
            console.log(b);
            orgResources.employeeInGroup().save({groupId: b, employeeId: ''},arrayToUrlParams.process('id',validMembers)).$promise
            .then(function(response){
              self.getGroups();
              jQuery('#addGroup').modal('hide');
            },function(){})
          },function(){

          });
        }
      }
    }
  }

  var app = angular.module('Plunner');
  app.controller('dashOrgController',controller);
  }())
