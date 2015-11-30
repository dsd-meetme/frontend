(function(){
  /**
  A controller for managing the login of Users and Administrators in the context
  of a plunner organization
  @author Giorgio Pea
  @param loginService A service that is used to manage the login of a plunner's organization
  **/
  var controller = function($scope,$location,dataPublisher){
    /*This controller instance */
    var c = this;

    c.errors = {};
    //an object that encapsulate the validity status of input fields
    c.validFields = {
      passwordReq : false,
      emailReq : false,
      emailVal : false
    }
    c.loaderVisibility = false;
    c.login = function(){
      //Processes the submit of usiForm (organization sign in)
      var form = $scope.signinForm;
      //Validity status of input fields checking
      c.validFields.passwordReq = form.password.$error.required;
      c.validFields.emailReq = form.email.$error.required;
      if(!form.$invalid){
        //shows loader gif
        c.loaderVisibility = true;
        dataPublisher.publish('http://api.plunner.com/companies/auth/login',{
          email : c.email,
          password : c.password,
          rmbMe : c.rmbMe
        }).then(function(response){
            $location.path('/organization');
        },function(response){
          c.loaderVisibility = false;
          if(response.status === 422){
            c.errors = response.data;
          }
        });
      }
    }
  }

  var app = angular.module('Plunner');
  app.controller('osiController',controller);
}());
