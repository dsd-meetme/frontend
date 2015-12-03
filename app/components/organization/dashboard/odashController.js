(function () {
  /**
  An controller to manage the actions that can be accomplished by a plunner organization
  @author Giorgio Pea
  @param logoutService A service used to manage the logout of a plunner's organization
  @param orgResources A service that provides objects that incapsulate restful communication
  logic
  @param arrayToUrlParams A service that encodes an array in a url like form
  **/
  var controller = function ($scope, logoutService, orgResources, arrayToUrlParams, $cookies,$timeout) {
    var c = this;
    c.errors = {
      unauthorized: false,
      forbidden: false
    };
    c.data = {};
    c.confirmPopup = {
      message : ''
    };
    //Logout
    c.logout = function () {
      logoutService.logout('/osignin');
    };
    //Get employees
    c.getUsers = function () {
      //employees restful index
      orgResources.user().query({userId: ''}).$promise
      .then(function (response) {
        c.data.users = response;
        c.getGroups();
      },
      function (response) {
        c.errors.unauthorized = (response.status === 401);
        c.errors.forbidden = (response.status === 403);
      });
    };
    //Get groups
    c.getGroups = function () {
      //employees restful groups index
      orgResources.group().query({groupId: ''}).$promise
      .then(function (response) {
        c.data.groups = response;
      },
      function (response) {
        c.errors.unauthorized = (response.status === 401);
        c.errors.forbidden = (response.status === 403);
      })
    };
    c.addGroup = {
      planner: null,
      members: [],
      name: '',
      desc: '',
      errors: {},
      invalidFields: {
        nameReq: false,
        plannerReq: false,
        membersReq: false,
        nonMatchingPlanner: false
      },
      selectPlanner: function (id) {
        this.selectedPlanner = id;
      },
      submit: function () {
        var validMembers = [];
        angular.forEach(this.members, function (value, key) {
          if (value === true) {
            validMembers.push(key.toString());
          }
        });
        //Checks tha validity status of input fields
        this.invalidFields.nameReq = (this.name === '');
        this.invalidFields.membersReq = (this.members.length === 0);
        this.invalidFields.plannerReq = (this.planner == null || angular.isUndefined(this.planner));

        //Submits everything to the server if data is valid
        if (!this.invalidFields.nameReq && !this.invalidFields.plannerReq && !this.invalidFields.membersReq) {
            //Updates the group name and planner
            orgResources.group().save({groupId: ''}, jQuery.param({
              name: this.name,
              planner_id: this.planner
            })).$promise
            .then(function (response) {
              //Updates the group members
              orgResources.usersInGroup().save({
                groupId: response.id,
                employeeId: ''
              }, arrayToUrlParams.process('id', validMembers)).$promise
              .then(function (response) {
                c.getGroups();
                c.confirmPopup.message = "Group successfully added";
                jQuery('#addGroup').modal('hide');
                jQuery('#confirmPopup').modal('show');
                $timeout(function(){
                  jQuery('#confirmPopup').modal('hide');
                },2000);
                jQuery('#addGroup input').val('');
                jQuery('#addGroup input:checked').removeAttr('checked');
              }, function () {

              })
            },
            function (response) {
              this.errors = response.data;
            });
          }
        }
      };
      c.addUser = {
        name: '',
        email: '',
        password: '',
        errors: {},
        confirmation_password: '',
        invalidFields: {
          nameReq: false,
          emailReq: false,
          passwordReq: false,
          passwordMatch: false,
          passwordLength: false,
          emailVal: false
        },
        submit: function () {
          var form = $scope.addUserForm;
          //Checks the validity of input fields
          this.invalidFields.nameReq = form.name.$error.required;
          this.invalidFields.emailReq = form.email.$error.required;
          this.invalidFields.passwordReq = form.password.$error.required;
          this.invalidFields.passwordLength = form.password.$error.minlength;
          this.invalidFields.emailVal = form.email.$error.email;
          this.invalidFields.passwordMatch = (this.password !== this.confirmation_password);

          //Submits everything to the server if data is valid
          if (!form.$invalid && !this.invalidFields.passwordMatch) {
            //Updates the group name and planner
            orgResources.user().save({userId: ''}, jQuery.param({
              name: this.name,
              email: this.email,
              password: this.password,
              password_confirmation: this.confirmation_password
            })).$promise
            .then(function (response) {
              //Updates the group members
              //orgResources.employeeInGroup().save({groupId: response.id, employeeId: ''}).$promise
              //.then(function(response){
              c.getUsers();
              c.confirmPopup.message = "User successfully added";
              jQuery('#addUser').modal('hide');
              jQuery('#confirmPopup').modal('show');
              setTimeout(function(){
                jQuery('#confirmPopup').modal('hide');
              },2000);
              jQuery('#addUser input').val('');
              jQuery('#addUser input:checked').removeAttr('checked');
            },
            function (response) {
              c.addUser.errors = response.data;
            });
          }
        }
      };

      c.getUsers();
    };

    var app = angular.module('Plunner');
    app.controller('odashController', controller);
  }());
