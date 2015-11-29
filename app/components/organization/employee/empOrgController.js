(function(){
  var controller = function($scope,$routeParams,orgResources){
    var c = this;
    //employee id
    var id = $routeParams.id;

    c.errors = {
      unauth : false,
      forb : false
    }

    c.profileData = {};

    c.nameMailForm = {
      formVisible : false,
      form : $scope.nmeForm,
      invalidFields : {
        emailVal : false
      },
      data : {
        name : null,
        email : null
      },
      abort : function(){
          this.formVisible = false;
      },
      submit : function(){
        console.log(this);
        console.log($scope.nmeForm);
        this.invalidFields.emailVal = this.form.email.$error.email;
        if(!this.form.$invalid){
          c.updateProfile(this.data);
        }
      },
      show : function(){
        this.formVisible = true
      }

    };
    c.passwordForm = {
      formVisible : false,
      form : $scope.peForm,
      invalidFields : {
        passwordLen : false,
        passwordMatch : false
      },
      data : {
        password : null,
        cpassword : null
      },
      abort : function(){
        this.formVisible = false;
      },
      submit : function(){
        this.invalidFields.passwordLen = this.form.password.$error.minlength;
        this.invalidFields.passwordMatch = (this.data.password !== this.data.cpassword);
        if(!this.form.$invalid){
          c.updateProfile(this.data);
        }
      },
      show : function(){
        this.formVisible = true;
      }
    }
    //Get employee info in the context of an org
    c.getInfo = function(){
      //restful show
      orgResources.employee().get({employeeId:id}).$promise
      .then(function(response){
        c.profileData = response;
      },function(response){
        if(response.status === 401){
          c.errors.unauth = true;
          c.errors.forb = false;
        }
        else if(response.status === 403){
          c.errors.unauth = false;
          c.errors.forb = true;
        }
      })
    };
    //Delete an employee in the context of an org
    c.delete = function(){
      //restful delete
      orgResources.employee().remove({employeeId:id}).$promise
      .then(function(response){
        alert('Evviva');
        //Show success popup wait for some time
        //redirect
      },function(response){
        if(response.status === 401){
          c.errors.unauth = true;
          c.errors.forb = false;
        }
        else if(response.status === 403){
          c.errors.unauth = false;
          c.errors.forb = true;
        }
      })
    }
    //Update employee info
    c.update = function(data){
        //validation
        orgResources.employees.update({employeeId:id}).$promise
        .then(function(){
          //
        },function(){
          //
        })
    }
    c.getGroups = function(){

    }
    c.getInfo();
  }


  var app = angular.module('Plunner');
  app.controller('empOrgController',controller);
}())
