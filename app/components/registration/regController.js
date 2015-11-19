(function(){
  var controller = function($scope,$location,regService){
    //an object that encapsulate the validity status of input fields
    this.validFields = {
      orgNameReq : false,
      orgMailReq : false,
      orgPwdReq : false,
      orgMailVal : false,
      orgPwdCmatch : false,
      orgPwdLength : false
    }
    //Processes the submit of dsiForm (domain sign in)
    this.process = function(){
      var form = $scope.regForm;
      console.log(form);
      //validity status of input fields checking
      this.validFields.orgPwdReq = form.orgPwd.$error.required;
      this.validFields.orgNameReq = form.orgName.$error.required;
      this.validFields.orgMailReq = form.orgEmail.$error.required;
      this.validFields.orgPwdLength = form.orgPwd.$error.minlength;
      this.validFields.orgMailVal = form.orgEmail.$error.email;
      this.validFields.orgPwdCmatch = (form.orgPwd.$modelValue !== form.orgPwdC.$modelValue);
      console.log(this.validFields);
      if(!form.$invalid && !this.validFields.orgPwdCmatch){
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
