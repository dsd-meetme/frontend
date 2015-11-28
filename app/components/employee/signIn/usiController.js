(function(){
  /**
  A controller for managing the login of Users and Administrators in the context
  of a plunner organization
  @author Giorgio Pea
  @param loginService A service that is used to manage the login of a plunner's organization
  **/
  var controller = function($rootScope,$scope,$location,dataPublisher){
    var c = this;

    c.errors = {};
    //an object that encapsulate the validity status of input fields
    c.validFields = {
      inputReq : false,
      emailReq : false,
      emailVal : false,
      org : false
    }

    c.login = function(){
      //Processes the submit of usiForm (organization sign in)
      var form = $scope.usiForm;
      //Validity status of input fields checking
      c.validFields.inputReq = form.usiPwd.$error.required;
      c.validFields.emailReq = form.usiEmail.$error.required;
      c.validFields.emailVal = form.usiEmail.$error.email;
      c.validFields.org = form.company.$error.required;
      if(!form.$invalid){
        dataPublisher.publish('http://api.plunner.com/employees/auth/login',{
          name : c.org,
          email : c.email,
          pwd : c.password,
          rmbMe : c.rmbMe
        }).then(function(response){
          $location.path('/employee')
        },function(response){
          if(response.status === 422){
            c.errors = response.data;
          }
        });
      }
    }
  }

  var app = angular.module('Plunner');
  app.controller('usiController',controller);
}())
