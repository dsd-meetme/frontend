(function(){
  var controller = function(orgResources,$scope){
    var self = this;
    self.data = {};
    self.errors = {
      unauthorized : false,
      forbidden : false
    };
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

    // STATIC DATAS FOR GRAPHIC TESTS
    self.data.name = "Organization Name";
    self.data.email = "testInit@test.com";
    self.data.organizationPwd = "test"
    /* DYNAMIC DATAS QUERY TO SERVER
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
    console.log(self.data);
    self.editProfile = {
      name : '',
      email : '',
      newPwd : '',
      newPwdCheck : '',
      pwd : '',
      changedFields : {
        name : false,
        email : false,
        pwd : false
      },
      invalidFields : {
        emailVal : false,
        newPwdReq : false,
        newPwdCheckReq : false,
        pwdReq : false,
        oneChangeReq : false
      },
      submit : function(){

        var form = $scope.editProfileForm;
        this.changedFields.name = (form.name === '');
        this.changedFields.email = (form.email === '');
        this.changedFields.pwd = (form.newPwd === '');
        // CHECK EMAIL SYNTAX + PWD LENGHT
        //this.invalidFields.emailReq = (this.email === '');
        this.invalidFields.emailVal = form.email.$error.email;
        this.invalidFields.newPwdReq = (form.newPwd.LENGHT < 6);
        if (this.changedFields.pwd) {
          this.invalidFields.newPwdCheckReq = !(form.newPwd === form.newPwdCheck);
        }
        this.invalidFields.pwdReq = !(form.currentPwd === "tes");
        this.invalidFields.oneChangeReq = (!(form.name === '') || !(form.email === '') || !(form.newPwd === ''));

        // TO LINK WITH API
        console.log(this.changedFields);
        console.log(this.invalidFields);
        if(this.invalidFields.nameReq === false 
          && this.invalidFields.emailReq === false
          && this.invalidFields.oneChangeReq === false){
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
    };

    self.deleteOrg = function() {
      console.log("Delete Organisation");
    }
    

  };

  var app = angular.module('Plunner');
  app.controller('opController',controller);
}());
