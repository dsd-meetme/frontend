(function(){
  /**
  A controller for managing the login of Users and Administrators in the context
  of a plunner organization
  @author Giorgio Pea
  **/
  var controller = function($rootScope,$scope,$location,authService){
    //an object that encapsulate the validity status of input fields
    this.validFields = {
      inputReq : false,
      emailReq : false,
      emailVal : false
    }
    //validity status of input fields checking
    this.validFields.inputReq = form.usiPwd.$error.required;
    this.validFields.emailReq = form.usiEmail.$error.required;
    this.validFields.emailVal = form.usiEmail.$error.email;
    //Processes the submit of usiForm (organization sign in)
    this.process = function(){
      var form = $scope.usiForm;
      if(!form.$invalid){
        authService.login({
          email : this.usiEmail,
          pwd : this.usiPwd,
          rmbMe : this.rmbMe
        });
      }
    }
    $rootScope.on('event:NonRegUser',function(){
      this.nonRegUser = true;
    })
  }

  var app = angular.module('Plunner');
  app.controller('osiController',controller);
}())
