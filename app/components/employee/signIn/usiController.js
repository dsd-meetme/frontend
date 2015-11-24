(function(){
  /**
  A controller for managing the login of Users and Administrators in the context
  of a plunner organization
  @author Giorgio Pea
  @param loginService A service that is used to manage the login of a plunner's organization
  **/
  var controller = function($rootScope,$scope,$location,loginService){
    var self = this;

    self.errors = {};
    //an object that encapsulate the validity status of input fields
    self.validFields = {
      inputReq : false,
      emailReq : false,
      emailVal : false
    }

    self.login = function(){
      //Processes the submit of usiForm (organization sign in)
      var form = $scope.usiForm;
      //Validity status of input fields checking
      self.validFields.inputReq = form.usiPwd.$error.required;
      self.validFields.emailReq = form.usiEmail.$error.required;
      self.validFields.emailVal = form.usiEmail.$error.email;
      if(!form.$invalid){
        loginService.login('http://api.plunner.com/employee/auth/login',{
          email : self.usiEmail,
          pwd : self.usiPwd,
          rmbMe : self.rmbMe
        }).then(function(){
          $location.path('/employee')
        },function(response){
          if(response.status === 422){
            self.errors = response.data;
          }
        });
      }
    }
  }

  var app = angular.module('Plunner');
  app.controller('usiController',controller);
}())
