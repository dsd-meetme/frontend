(function(){
  /**
  A controller for managing the login of Users and Administrators in the context
  of a plunner organization
  @author Giorgio Pea
  @param loginService A service that is used to manage the login of a plunner's organization
  **/
  var controller = function($rootScope,$scope,$location,loginService){
    var self = this;
    $rootScope.$on('event:badMatch',function(){
      self.nonRegUser = true;
    });
    //an object that encapsulate the validity status of input fields
    self.validFields = {
      inputReq : false,
      emailReq : false,
      emailVal : false
    }

    this.login = function(){
      //Processes the submit of usiForm (organization sign in)
      var form = $scope.osiForm;
      //Validity status of input fields checking
      self.validFields.inputReq = form.osiPwd.$error.required;
      self.validFields.emailReq = form.osiEmail.$error.required;
      self.validFields.emailVal = form.osiEmail.$error.email;
      if(!form.$invalid){
        loginService.login({
          email : self.osiEmail,
          pwd : self.osiPwd,
          rmbMe : self.rmbMe
        });
      }
    }
  }
  var app = angular.module('Plunner');
  app.controller('osiController',controller);
}())
