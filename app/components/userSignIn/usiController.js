(function(){
  /**
    A controller for managing the login of Users and Administrators in the context
    of a plunner organization
    @author Giorgio Pea
  **/
  var controller = function($scope,$location,authService){
    //an object that encapsulate the validity status of input fields
    this.validFields = {
      inputReq : false,
      emailReq : false,
      emailVal : false
    }
    //Processes the submit of usiForm (user sign in)
    this.process = function(){
      var form = $scope.usiForm;
      if(!form.$invalid){
        authService.login({
          username : this.usiEmail,
          password : this.usiPwd
        })
      }
      //validity status of input fields checking
      this.validFields.inputReq = form.usiPwd.$error.required;
      this.validFields.emailReq = form.usiEmail.$error.required;
      this.validFields.emailVal = form.usiEmail.$error.email;

    }
    var success = function(){

    }
    var fail = function(){

    }

  }

  var app = angular.module('Plunner');
  app.controller('usiController',controller);
}())
