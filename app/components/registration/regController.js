(function(){
  var controller = function($scope,$location){
    //an object that encapsulate the validity status of input fields
    this.validFields = {
      orgNameReq : false,
      orgMailReq : false,
      orgPwd : false,
      orgMailVal : false
    }
    //Processes the submit of dsiForm (domain sign in)
    this.process = function(){
      var form = $scope.regForm;
      if(!form.$invalid){
        $location.url('/userSignIn');
      }
      //validity status of input fields checking
      this.validFields.orgNameReq = form.orgPwd.$error.required;
      this.validFields.orgNameReq = form.orgName.$error.required;
      this.validFields.orgNameReq = form.orgEmail.$error.required;
      this.validFields.orgNameReq = form.orgEmail.$error.email;
    }
    //The checking of the existence of a given domain as a plunner organization has
    //produced a result
    var success = function(response){
      if(response.checked){
        $location.url(this.dName+'.plunner.com');
      }
      else if(response.status < 208){
        this.noDomain = true;
      }
      else{
        fail();
      }
    }
    //The checking of the existence of a given domain as a plunner organization has not
    //produced a result
    var fail = function(){
      this.serverError = true
    }
  }
  var app = angular.module('Plunner');
  app.controller('regController',controller);
}())
