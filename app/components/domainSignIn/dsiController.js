(function(){
  /**
    A controller for managing the checking of a plunner organization domain, so
    that a User or an Administrator can sign in in the context of that organization
    @param plunnerAuth A service that exposes among others, a method used to check
    the existence of a given domain as a plunner organization domain. This service
    communicates with the Plunner app server
  **/
  var controller = function($scope,$location){
    //an object that encapsulate the validity status of input fields
    this.validFields = {
      domainNameReq : false
    }
    //Processes the submit of dsiForm (domain sign in)
    this.process = function(){
      var form = $scope.dsiForm;
      if(!form.$invalid){
        $location.url('/userSignIn');
      }
      //validity status of input fields checking
      this.validFields.domainNameReq = form.dsiDomainName.$error.required;
    }
    //The checking of the existence of a given domain as a plunner organization has
    //produced a result
    var success = function(response){
      if(response.checked){
        $location.url(this.dName+'.plunner.com');
      }
      else if(response.status < 208){
        this.noDomain = true;
      }
      else{
        fail();
      }
    }
    //The checking of the existence of a given domain as a plunner organization has not
    //produced a result
    var fail = function(){
      this.serverError = true
    }

  }

  var app = angular.module('Plunner');
  app.controller('dsiController',controller);
}())
