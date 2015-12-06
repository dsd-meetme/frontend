(function(){
  /**
  A controller for managing the set of a new password for an organization and the
  reset of the previous one
  @param dataPublisher A service used to perform an http post request
  **/
  var controller = function($scope, $routeParams,$location,mixedContentToArray){
    var c = this;
    c.errors = [];
    c.invalidFields = {
      emailReq : false,
      passwordLength : false,
      emailVal : false,
      passwordReq : false
    };
    c.reset = function(){
      var form = $scope.resetForm;
      //Checks the validity status of input fields
      c.invalidFields.emailReq = form.email.$error.required;
      c.invalidFields.emailVal = form.email.$error.email;
      c.invalidFields.pwdLength = form.password.$error.minlength;
      c.invalidFields.passwordReq = form.password.$error.required;
      //Submits
      if(!form.$invalid){
        dataPublisher.publish('http://api.plunner.com/companies/password/reset',{
          email : c.email,
          password : c.password,
          password_confirmation : c.password,
          token : $routeParams.token
        }).then(
          function(response){
            jQuery('#confirmPopup').modal('show');
            setTimeout(function(){
              jQuery('#confirmPopup').modal('hide');
              $location.path('/presentation');
            }, 2000);
          },
          function(response){
            if(response.status === 422){
              mixedContentToArray.process(response.data,c.errors, true);
            }
          }
        )
      }
    }
  };

  var app = angular.module('Plunner');
  app.controller('orstController', controller);
}());
