(function () {
    /**
     A controller for managing the login of a plunner organization
     @author Giorgio Pea
     @param dataPublisher A service used to perform an http post request
     **/
    var controller = function ($scope, $location, dataPublisher, mixedContentToArray) {
        /*This controller instance */
        var c = this;
        c.errors = [];
        //an object that encapsulate the validity status of input fields
        c.invalidFields = {
            passwordReq: false,
            emailReq: false,
            emailVal: false
        };
        c.loaderVisibility = false;
        c.login = function () {
            //Processes the submit of usiForm (organization sign in)
            var form = $scope.signInForm;
            //Checks the validity status of input fields
            c.invalidFields.passwordReq = form.password.$error.required;
            c.invalidFields.emailReq = form.email.$error.required;
            c.invalidFields.emailVal = form.email.$error.email;
            if (!form.$invalid) {
                //shows loader gif
                c.loaderVisibility = true;
                dataPublisher.publish('http://api.plunner.com/companies/auth/login', {
                    email: c.email,
                    password: c.password,
                    rmbMe: c.rmbMe
                }).then(function () {
                    $location.path('/organization');
                }, function (response) {
                    c.loaderVisibility = false;
                    if (response.status === 422) {
                        mixedContentToArray.process(response.data, c.errors, true);
                    }
                });
            }
        }
    };

    var app = angular.module('Plunner');
    app.controller('osiController', controller);
}());
