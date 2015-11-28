(function(){
  /**
  A controller that manages a plunner's organization registration
  @param regService A service used to perform the actual plunner's organization registration
  **/
  var controller = function($scope,$location,dataPublisher,$rootScope){
    var c = this;
    //In case of account already registered, sets a property to true so that
    //an error can be displayed on the view
    c.errors = {};
    //an object that encapsulate the validity status of input fields
    c.validFields = {
      orgNameReq : false,
      orgMailReq : false,
      orgPwdReq : false,
      orgMailVal : false,
      orgPwdCmatch : false,
      orgPwdLength : false
    }
    //Processes the submit of dsiForm (domain sign in)
    c.process = function(){
      var form = $scope.regForm;
      console.log(form);
      //validity status of input fields checking
      c.validFields.orgPwdReq = form.orgPwd.$error.required;
      c.validFields.orgNameReq = form.orgName.$error.required;
      c.validFields.orgMailReq = form.orgEmail.$error.required;
      c.validFields.orgPwdLength = form.orgPwd.$error.minlength;
      c.validFields.orgMailVal = form.orgEmail.$error.email;
      c.validFields.orgPwdCmatch = (form.orgPwd.$modelValue !== form.orgPwdC.$modelValue);
      console.log(this.validFields);
      if(!form.$invalid && !c.validFields.orgPwdCmatch){
        dataPublisher.publish('http://api.plunner.com/companies/auth/register',{
          email : this.orgEmail,
          pwd : this.orgPwd,
          name : this.orgName
        })
        .then(
          function(response){
            $location.path('/dashboard');
          },
          function(response){
            if(response.status===422){
            }
          }
        );
      }
    }
  }
  var app = angular.module('Plunner');
  app.controller('regController',controller);
}())
