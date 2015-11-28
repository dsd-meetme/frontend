(function(){

  var controller = function(recService,$scope){

    var c = this;
    c.errors = {};
    c.success = false;
    c.invalidFields = {
      emailReq : false,
      emailVal : false
    }
    c.recover = function(){
      var form = $scope.recoveryForm;
      c.invalidFields.emailReq = form.email.$error.required;
      c.invalidFields.emailVal = form.email.$error.email;
      if(!form.$invalid){
        recService.recover('http://api.plunner.com/companies/password/mail',{email : c.email},);
      }

    }
  }
  var app = angular.module('Plunner');
  app.controller('recController',controller);
}())
