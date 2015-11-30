(function () {
    /**
     A controller for managing the login of Users and Administrators in the context
     of a plunner organization
     @author Giorgio Pea
     @param loginService A service that is used to manage the login of a plunner's organization
     **/
    var controller = function ($rootScope, $scope, $location, dataPublisher) {
        var c = this;

        c.errors = {};
        //an object that encapsulate the validity status of input fields
        c.invalidFields = {
            inputReq: false,
            emailReq: false,
            emailVal: false,
            orgNameReq: false
        };
        c.loaderVisibility = false;
        c.login = function () {
            //Processes the submit of usiForm (organization sign in)
            var form = $scope.usiForm;
            //Validity status of input fields checking
            c.invalidFields.passwordReq = form.password.$error.required;
            c.invalidFields.emailReq = form.email.$error.required;
            c.invalidFields.emailVal = form.email.$error.email;
            c.invalidFields.orgNameReq = form.name.$error.required;
            if (!form.$invalid) {
                c.loaderVisibility = true;
                dataPublisher.publish('http://api.plunner.com/employees/auth/login', {
                    company: c.name,
                    email: c.email,
                    password: c.password,
                    rmbMe: c.rmbMe
                }).then(function (response) {
                    $location.path('/user')
                }, function (response) {
                    c.loaderVisibility = false;
                    if (response.status === 422) {
                        c.errors = response.data;
                    }
                });
            }
        }
    };

    var app = angular.module('Plunner');
    app.controller('usiController', controller);
}());
