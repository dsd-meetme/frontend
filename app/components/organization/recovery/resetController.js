(function(){
  var controller = function($scope, dataPublisher, $routeParams,$location){
    c = this;
    c.invalidFields = {
      emailReq : false,
      passwordLength : false,
      emailVal : false,
      passwordReq : false
    };
    /*$cookies.remove('auth_token');
    $cookies.put('auth_token',$routeParams.token)*/
    c.reset = function(){
      var form = $scope.resetForm;
      c.invalidFields.emailReq = form.email.$error.required;
      c.invalidFields.emailVal = form.email.$error.email;
      c.invalidFields.pwdLength = form.password.$error.minlength;
      c.invalidFields.passwordReq = form.password.$error.required;
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
            }, 2000)
          },
          function(){

          }
        )
      }
    }
  };

  var app = angular.module('Plunner');
  app.controller('resetController', controller);
}());
