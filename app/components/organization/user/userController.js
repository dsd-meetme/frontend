(function(){
  /**
  A controller that manage existing users inside an organization
  @param orgResources A service that provides objects that incapsulate restful communication
  logic
  **/
  var controller = function($scope,$routeParams,orgResources,$location){
    var c = this;
    //user id
    var id = $routeParams.id;
    c.errors = {
      unauthorized : false,
      forbidden : false
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
      show : function(){
        this.inChange = true
      },
      submit : function(){
        var form = $scope.changeForm;
        //Checks the validity status of input fields
        this.invalidFields.emailVal = form.email.$error.email;
        this.invalidFields.emailReq = form.email.$error.required;
        this.invalidFields.nameReq = form.name.$error.required;
        if(!form.$invalid){
          orgResources.user().update({userId: id},jQuery.param(c.dataC)).$promise
          .then(function(){
            alert('success');
            c.changeNameMail.abort();
            c.getInfo();
          },function(){

          })
        }
      }
    };
    c.changePassword = {
      inChange : false,
      form : $scope.nmeForm,
      invalidFields : {
        passwordLength : false,
        passwordMatch : false
      },
      abort : function(){
        this.inChange = false;
      },
      show : function(){
        this.inChange = true
      },
      submit : function(){
        var form = $scope.changeForm;
        this.invalidFields.passwordLen = form.password.$error.minlength;
        this.invalidFields.passwordMatch = (c.dataC.password !== c.dataC.password_confirmation);
        if(!form.$invalid && !this.invalidFields.passwordMatch ){
          orgResources.user().update({userId: id},jQuery.param(c.dataC)).$promise
          .then(function(){
            alert('success');
            c.changePassword.abort();
            c.getInfo();
          },function(){

          })
        }
      }
    };
    //Get employee info in the context of an org
    c.getInfo = function(){
      //restful show
      orgResources.user().get({userId:id}).$promise
      .then(function(response){
        c.data = response;
        c.dataC.name = c.data.name;
        c.dataC.email = c.data.email;
      },function(response){

      })
    };
    //Delete an employee in the context of an org
    c.delete = function(){
      //restful delete
      orgResources.user().remove({userId:id}).$promise
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
  app.controller('userController',controller);
}())
