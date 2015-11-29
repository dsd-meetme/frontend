(function(){

  var controller = function(dataPublisher,$scope){

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
        dataPublisher.publish('http://api.plunner.com/companies/password/email',{email : c.email})
        .then(function(){
          c.success = true;
        },function(){

        })
      }

    }
  }
  var app = angular.module('Plunner');
  app.controller('recController',controller);
}())
