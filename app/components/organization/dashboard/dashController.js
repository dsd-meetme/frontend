(function(){
  /**
   An controller to manage the actions that can be accomplished by a plunner organization
   @author Giorgio Pea
   @param logoutService A service used to manage the logout of a plunner's organization
   **/
  var controller = function($scope,logoutService,orgResources,arrayToUrlParams,$cookies){
    var c = this;
    c.errors = {
      unauthorized : false,
      forbidden : false
    }
    c.data = {};
    //Logout
    c.logout = function(){
      logoutService.logout('/osignin');
    };
    //Get employees
    c.getEmployees = function(){
      //employees restful index
      orgResources.employee().query({employeeId : ''}).$promise
          .then(function(response){
            c.data.employees = response;
            c.getGroups();
          },
          function(response){
            c.errors.unauthorized = (response.status === 401);
            c.errors.forbidden = (response.status === 403);
          });
    }
    //Get groups
    c.getGroups = function(){
      //employees restful groups index
      orgResources.group().query({groupId : ''}).$promise
          .then(function(response){
            c.data.groups = response;
          },
          function(response){
            c.errors.unauthorized = (response.status === 401);
            c.errors.forbidden = (response.status === 403);
          })
    }
    c.addGroup = {
      planner : null,
      members: [],
      name : '',
      desc : '',
      invalidFields : {
        nameReq : false,
        descReq : false,
        plannerReq : false,
        membersReq : false,
        nonMatchingPlanner : false
      },
      selectPlanner : function(id){
        this.selectedPlanner = id;
      },
      submit : function(){
        var validMembers = [];
        angular.forEach(this.members, function(value, key){
          if(value===true){
            validMembers.push(key.toString());
          }
        })
        //Validation
        this.invalidFields.nameReq = (this.name === '');
        this.invalidFields.descReq = (this.desc === '');
        this.invalidFields.membersReq = (this.members.length === 0);
        this.invalidFields.plannerReq = (this.planner == null || angular.isUndefined(this.planner));
        this.invalidFields.nonMatchingPlanner = (validMembers.indexOf(this.planner) === -1);

        //Submits everything to the server if data is valid
        if(this.invalidFields.nameReq === false
            && this.invalidFields.plannerReq === false
            && this.invalidFields.membersReq === false
            && this.invalidFields.nonMatchingPlanner === false
            && this.invalidFields.descReq === false){
          //Updates the group name and planner
          orgResources.group().save({groupId: ''},jQuery.param({name : this.name, planner_id : this.planner})).$promise
              .then(function(response){
                //Updates the group members
                orgResources.employeeInGroup().save({groupId: response.id, employeeId: ''},arrayToUrlParams.process('id',validMembers)).$promise
                    .then(function(response){
                      c.getGroups();
                      jQuery('#addGroup').modal('hide');
                      jQuery('#addGroup input').val('');
                    },function(){

                    })},
              function(){

              });
        }
      }
    }
    c.addEmployee = {
      name : '',
      email : '',
      password : '',
      confirmation_password : '',
      invalidFields : {
        nameReq : false,
        emailReq : false,
        passwordReq : false,
        passwordMatch : false,
        passwordLength : false,
        emailVal : false
      },
      submit : function(){
        console.log(this.invalidFields)
        var form = $scope.addEmployeeForm;
        console.log(form);
        //Validation
        this.invalidFields.nameReq = form.name.$error.required;
        this.invalidFields.emailReq = form.email.$error.required;
        this.invalidFields.passwordReq = form.password.$error.required;
        this.invalidFields.passwordLength = form.password.$error.minlength;
        this.invalidFields.emailVal = form.email.$error.email;
        this.invalidFields.passwordMatch = (this.password !== this.confirmation_password);


        //Submits everything to the server if data is valid
        if(!form.$invalid && !this.invalidFields.passwordMatch){
          //Updates the group name and planner
          orgResources.employee().save({employeeId: ''},jQuery.param({
            name : this.name,
            email : this.email,
            password : this.password,
            password_confirmation : this.confirmation_password
          })).$promise
              .then(function(response){
                //Updates the group members
                //orgResources.employeeInGroup().save({groupId: response.id, employeeId: ''}).$promise
                //.then(function(response){
                c.getEmployees();
                jQuery('#addEmployee').modal('hide');
                jQuery('#addEmployee input').val('');
              },
              function(){

              });
        }
      }
    }
    c.getEmployees();
  }

  var app = angular.module('Plunner');
  app.controller('dashOrgController',controller);
}())