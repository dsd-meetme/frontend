(function(){
  var controller = function($scope, resetService){
    c = this;
    c.invalidFields = {
      emailReq : false,
      pwdLength : false,
      emailVal : false
    }
    c.reset = function(){
      var form = $scope.resetForm;
      c.invalidFields.emailReq = form.email.$error.required;
      c.invalidFields.emailVal = form.email.$error.email;
      c.invalidFields.pwdLength = form.password.$error.minlength;
      if(!form.$invalid){
        resetService.reset('http://api.plunner.com/companies/password/reset',{
          email : c.email,
          password : c.password,
          password_confirmed : c.password
        }).then(
          function(){
            alert('successo')
          },
          function(){

          }
        )
      }
    }
  }

  var app = angular.module('Plunner');
  app.controller('resetController', controller);
}())
