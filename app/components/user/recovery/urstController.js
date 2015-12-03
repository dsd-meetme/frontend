(function(){
    var controller = function($scope, dataPublisher, $routeParams,$cookies){
        c = this;
        c.invalidFields = {
            emailReq : false,
            pwdLength : false,
            emailVal : false,
            companyReq : false
        };
        /*$cookies.remove('auth_token');
         $cookies.put('auth_token',$routeParams.token)*/
        c.reset = function(){
            var form = $scope.resetForm;
            c.invalidFields.emailReq = form.email.$error.required;
            c.invalidFields.emailVal = form.email.$error.email;
            c.invalidFields.pwdLength = form.password.$error.minlength;
            c.invalidFields.company = form.company.$error.required;
            c.invalidFields.passwordReq = form.password.$error.required;
            if(!form.$invalid){
                dataPublisher.publish('http://api.plunner.com/employee/password/reset',{
                    company : c.company,
                    email : c.email,
                    password : c.password,
                    password_confirmation : c.password,
                    token : $routeParams.token
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
    app.controller('urestController', controller);
}())
