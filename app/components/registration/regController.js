(function(){
  var controller = function($scope,$location){
    //an object that encapsulate the validity status of input fields
    this.validFields = {
      orgNameReq : false,
      orgMailReq : false,
      orgPwd : false,
      orgMailVal : false,
      orgPwdCmatch : false,
    }
    //Processes the submit of dsiForm (domain sign in)
    this.process = function(){
      var form = $scope.regForm;
      if(!form.$invalid){
      }
      //validity status of input fields checking
      this.validFields.orgPwd = form.orgPwd.$error.required;
      this.validFields.orgNameReq = form.orgName.$error.required;
      this.validFields.orgMailReq = form.orgEmail.$error.required;
      this.validFields.orgMailVal = form.orgEmail.$error.email;
      this.validFields.orgPwdCmatch = (this.orgPwdC !== this.orgPwd);
    }
  }
  var app = angular.module('Plunner');
  app.controller('regController',controller);
}())
