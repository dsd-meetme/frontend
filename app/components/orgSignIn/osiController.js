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

    this.process = function(){
      //validity status of input fields checking
      this.validFields.inputReq = form.osiPwd.$error.required;
      this.validFields.emailReq = form.osiEmail.$error.required;
      this.validFields.emailVal = form.osiEmail.$error.email;
      //Processes the submit of usiForm (organization sign in)
      var form = $scope.osiForm;
      if(!form.$invalid){
        authService.login({
          email : this.osiEmail,
          pwd : this.osiPwd,
          rmbMe : this.rmbMe
        });
      }
    }
    $rootScope.$on('event:NonRegUser',function(){
      this.nonRegUser = true;
    })
  }

  var app = angular.module('Plunner');
  app.controller('osiController',controller);
}())
