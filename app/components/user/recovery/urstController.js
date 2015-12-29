(function () {
    var controller = function ($scope, $routeParams, $cookies, dataPublisher, mixedContentToArray) {
        c = this;
        c.success = false;
        c.invalidFields = {
            emailReq: false,
            pwdLength: false,
            emailVal: false,
            companyReq: false
        };
        c.errors = [];
        c.reset = function () {
            var form = $scope.resetForm;
            c.invalidFields.emailReq = form.email.$error.required;
            c.invalidFields.emailVal = form.email.$error.email;
            c.invalidFields.pwdLength = form.password.$error.minlength;
            c.invalidFields.company = form.company.$error.required;
            c.invalidFields.passwordReq = form.password.$error.required;
            if (!form.$invalid) {
                jQuery('#authorizationPopup').modal('show');
                dataPublisher.publish('http://api.plunner.com/employee/password/reset', {
                    company: c.company,
                    email: c.email,
                    password: c.password,
                    password_confirmation: c.password,
                    token: $routeParams.token
                }).then(
                    function () {
                        c.errors.length = 0;
                        c.success = true;
                        jQuery('input').val('');
                        jQuery('#authorizationPopup').modal('hide');
                    },
                    function (response) {
                        if (response.status === 422) {
                            mixedContentToArray.process(response.data, c.errors, true);
                            jQuery('#authorizationPopup').modal('hide');
                        }
                    }
                )
            }
        }
    }

    var app = angular.module('Plunner');
    app.controller('urstController', controller);
}())
