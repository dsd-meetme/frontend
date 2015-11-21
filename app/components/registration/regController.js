(function(){
  /**
  A controller that manages a plunner's organization registration
  @param regService A service used to perform the actual plunner's organization registration
  **/
  var controller = function($scope,$location,regService,$rootScope){
    var self = this;
    //In case of account already registered, sets a property to true so that
    //an error can be displayed on the view
    self.errors = {};
    //an object that encapsulate the validity status of input fields
    self.validFields = {
      orgNameReq : false,
      orgMailReq : false,
      orgPwdReq : false,
      orgMailVal : false,
      orgPwdCmatch : false,
      orgPwdLength : false
    }
    //Processes the submit of dsiForm (domain sign in)
    self.process = function(){
      var form = $scope.regForm;
      console.log(form);
      //validity status of input fields checking
      self.validFields.orgPwdReq = form.orgPwd.$error.required;
      self.validFields.orgNameReq = form.orgName.$error.required;
      self.validFields.orgMailReq = form.orgEmail.$error.required;
      self.validFields.orgPwdLength = form.orgPwd.$error.minlength;
      self.validFields.orgMailVal = form.orgEmail.$error.email;
      self.validFields.orgPwdCmatch = (form.orgPwd.$modelValue !== form.orgPwdC.$modelValue);
      console.log(this.validFields);
      if(!form.$invalid && !self.validFields.orgPwdCmatch){
        regService.register({
          email : this.orgEmail,
          pwd : this.orgPwd,
          name : this.orgName
        })
      }
    }
  }
  var app = angular.module('Plunner');
  app.controller('regController',controller);
}())
