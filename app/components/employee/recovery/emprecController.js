(function(){
  var controller = function($scope, dataPublisher){
    var c = this;
    c.errors = {};
    c.success = false;
    c.invalidFields = {
      nameReq : false,
      emailReq : false,
      emailVal : false
    }
    c.recover = function(){
      var form = $scope.recoveryForm;
      c.invalidFields.nameReq = form.name.$error.required;
      c.invalidFields.mailReq = form.email.$error.required;
      c.invalidFields.emailVal = form.email.$error.email;
      if(!form.$invalid){
        dataPublisher.publish('http://api.plunner.com/employees/password/email', {
          company : c.name,
          email : c.email,
        })
        .then(function(response){
          c.success = true;
        }, function(response){

        })
      }

    }

  }

  var app = angular.module('Plunner');
  app.controller('empRecController',controller)
}())
