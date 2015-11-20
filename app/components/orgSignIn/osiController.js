(function(){
  /**
  A controller for managing the login of Users and Administrators in the context
  of a plunner organization
  @author Giorgio Pea
  @param loginService A service that is used to manage the login of a plunner's organization
  **/
  var controller = function($rootScope,$scope,$location,loginService){
    $rootScope.$on('badMatch',function(){
      $scope.osiC.nonRegUser = true;
    });
    //an object that encapsulate the validity status of input fields
    this.validFields = {
      inputReq : false,
      emailReq : false,
      emailVal : false
    }

    this.login = function(){
      //Processes the submit of usiForm (organization sign in)
      var form = $scope.osiForm;
      //Validity status of input fields checking
      this.validFields.inputReq = form.osiPwd.$error.required;
      this.validFields.emailReq = form.osiEmail.$error.required;
      this.validFields.emailVal = form.osiEmail.$error.email;
      if(!form.$invalid){
        loginService.login({
          email : this.osiEmail,
          pwd : this.osiPwd,
          rmbMe : this.rmbMe
        });
      }
    }
  }
  var app = angular.module('Plunner');
  app.controller('osiController',controller);
}())
