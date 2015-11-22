(function(){

  var controller = function(recService,$scope){
    this.successFlag = false;
    this.errors = {};
    this.validFields = {
      required : false,
      valid : false
    }
    this.recover = function(){
      console.log("sadasdasd");
      var form = $scope.recoveryForm;
      this.validFields.required = form.emailField.$error.required;
      this.validFields.valid = form.emailField.$error.email;
      if(!form.$invalid){
        recService.recover(this.email,this.successFlag,this.errors);
      }

    }
  }
  var app = angular.module('Plunner');
  app.controller('recController',controller);
}())
