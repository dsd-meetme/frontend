(function(){
  var controller = function(orgResources,$window){
    var self = this;
    self.data = {};
    self.errors = {
      unauthorized : false,
      forbidden : false
    }
    self.organizationName = "Organization A";
    self.organizationEmail = "contact@organizationa.com";
    self.organizationPwd = "password"
/*
    orgResources.company().query().then(
      function(response){
          self.data = response.data;
      }, function(response){
        if(response.status === 401){
          self.errors.unauthorized = true;
        }
        else if(response.status === 403){
          self.errors.forbidden = true;
        }
      }
    );
*/
    self.editProfile = {
      name : '',
      email : '',
      newPwd : '',
      newPwdCheck : '',
      pwd : '',
      changedFields : {
        name : false,
        email : false,
        pwd : false,
      },
      invalidFields : {
        emailReq : false,
        newPwdReq : false,
        newPwdCheckReq : false,
        pwdReq : false,
      },
      submit : function(){
        this.changedFields.name = !(this.name === '');
        this.changedFields.email = !(this.email === '');
        this.changedFields.pwd = !(this.newPwd === '');

        // CHECK EMAIL SYNTAX + PWD LENGHT
        //this.invalidFields.emailReq = (this.email === '');
        this.invalidFields.newPwdReq = (this.newPwd.LENGHT < 6);
        this.invalidFields.newPwdCheckReq = !(this.newPwd === this.newPwdCheck);
        this.invalidFields.pwdReq = !(this.pwd === self.organizationPwd);

        // TO LINK WITH API
        console.log(this.invalidFields);
        if(this.invalidFields.nameReq === false 
          && this.invalidFields.emailReq === false){
            //orgResources.employee().save({employeeId: ''},jQuery.param({name : this.name, email : this.email})).$promise
            //.then(function(response){
            //  var b = response.id;
            //  console.log(b);
              self.getEmployees();
              jQuery('#addEmployee').modal('hide');
            //},function(){

            //});
          }
      }
    }

    self.deleteAccount = function() {
      $window.alert("ALERT!!");
    }

  }

  var app = angular.module('Plunner');
  app.controller('opController',controller);
}())
