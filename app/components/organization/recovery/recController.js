(function(){

  var controller = function(recService,$scope){
    this.errors = {};
    this.success = false;
    this.validFields = {
      required : false,
      valid : false
    }
    this.recover = function(){
      var form = $scope.recoveryForm;
      this.validFields.required = form.emailField.$error.required;
      this.validFields.valid = form.emailField.$error.email;
      if(!form.$invalid){
        recService.recover(this.email,this);
      }

    }
  }
  var app = angular.module('Plunner');
  app.controller('recController',controller);
}())
