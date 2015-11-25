(function(){
  /**
  A controller for managing the login of Users and Administrators in the context
  of a plunner organization
  @author Giorgio Pea
  @param loginService A service that is used to manage the login of a plunner's organization
  **/
  var controller = function($rootScope,$scope,$location,loginService,$cookies){
    var self = this;

    this.errors = {};
    //an object that encapsulate the validity status of input fields
    this.validFields = {
      inputReq : false,
      emailReq : false,
      emailVal : false
    }

    this.login = function(){
      console.log('enter')
      //Processes the submit of usiForm (organization sign in)
      var form = $scope.osiForm;
      //Validity status of input fields checking
      self.validFields.inputReq = form.osiPwd.$error.required;
      self.validFields.emailReq = form.osiEmail.$error.required;
      self.validFields.emailVal = form.osiEmail.$error.email;
      if(!form.$invalid){
        loginService.login('http://api.plunner.com/companies/auth/login',{
          email : self.osiEmail,
          pwd : self.osiPwd,
          rmbMe : self.rmbMe
        }).then(function(response){
            console.log(response);
            /*$cookies.put('auth_token','Bearer '+response.data.token);
            console.log('Putted token '+$cookies.get('auth_token'))*/
            $location.path('/organization');
        },function(response){
          if(response.status === 422){
            self.errors = response.data;
          }
        });
      }
    }
  }
  var app = angular.module('Plunner');
  app.controller('osiController',controller);
}())
