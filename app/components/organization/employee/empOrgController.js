(function(){
  var controller = function($scope,$routeParams,orgResources,$location){
    var c = this;
    //employee id
    var id = $routeParams.id;

    c.errors = {
      unauth : false,
      forb : false
    }

    c.data = {};
    c.dataC = {};

    c.changeNameMail = {
      inChange : false,
      form : $scope.nmeForm,
      invalidFields : {
        nameReq : false,
        emailReq : false,
        emailVal : false
      },
      abort : function(){
          this.inChange = false;
      },
      submit : function(){
        var form = $scope.changeForm;
        console.log(form);
        this.invalidFields.emailVal = form.email.$error.email || false;
        this.invalidFields.emailReq = form.email.$error.required || false;
        this.invalidFields.nameReq = form.name.$error.required || false;
        console.log(this.invalidFields);
        if(this.invalidFields.emailVal === false &&
        this.invalidFields.emailReq === false && this.invalidFields.nameReq === false){
          console.log(c.dataC);
          orgResources.employee().update({employeeId: id},jQuery.param(c.dataC)).$promise
          .then(function(){
            alert('success');
            c.changeNameMail.abort();
            c.getInfo();
          },function(){

          })
        }
      },
      show : function(){
        this.inChange = true
      }

    };
    c.changePassword = {
      inChange : false,
      form : $scope.nmeForm,
      invalidFields : {
        passwordLen : false,
        passwordMatch : false
      },
      abort : function(){
          this.inChange = false;
      },
      submit : function(){
        var form = $scope.changeForm;
        this.invalidFields.passwordLen = form.password.$error.minlength || false;
        this.invalidFields.passwordMatch = (c.dataC.password !== c.dataC.password_confirmation);
        console.log(this.invalidFields);
        if(!form.$invalid && !this.invalidFields.passwordMatch ){
          orgResources.employee().update({employeeId: id},jQuery.param(c.dataC)).$promise
          .then(function(){
            alert('success');
            c.changePassword.abort();
            c.getInfo();
          },function(){

          })
        }
      },
      show : function(){
        this.inChange = true
      }

    };
    //Get employee info in the context of an org
    c.getInfo = function(){
      //restful show
      orgResources.employee().get({employeeId:id}).$promise
      .then(function(response){
        c.data = response;
        c.dataC.name = c.data.name;
        c.dataC.email = c.data.email;
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
        $location.path('/organization');
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
    c.getInfo();
  }


  var app = angular.module('Plunner');
  app.controller('empOrgController',controller);
}())
