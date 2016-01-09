(function () {


    var controller = function ($scope, $routeParams, $location, mixedContentToArray, configService, dataPublisher) {

        var apiDomain = configService.apiDomain;
        var c = this;
        c.errors = [];
        c.invalidFields = {
            emailReq: false,
            passwordLength: false,
            emailVal: false,
            passwordReq: false
        };
        c.confirmPopup = {
            show: function () {
                jQuery('authorizationPopup').modal('show');
            },
            hide: function () {
                jQuery('authorizationPopup').modal('hide');
            }
        };
        c.reset = function () {
            var form = $scope.resetForm;
            c.errors = [];
            //Checks the validity status of input fields
            c.invalidFields.emailReq = form.email.$error.required;
            c.invalidFields.emailVal = form.email.$error.email;
            c.invalidFields.pwdLength = form.password.$error.minlength;
            c.invalidFields.passwordReq = form.password.$error.required;
            //Submits
            if (!form.$invalid) {
                c.confirmPopup.show();
                dataPublisher.publish(apiDomain + '/companies/password/reset', {
                    email: c.email,
                    password: c.password,
                    password_confirmation: c.password,
                    token: $routeParams.token
                }).then(
                    function () {
                        c.confirmPopup.hide();
                        $location.path('/presentation');
                    },
                    function (response) {
                        if (response.status === 422) {
                            mixedContentToArray.process(response.data, c.errors, true);
                            c.confirmPopup.hide();
                        }
                        c.confirmPopup.hide();
                    }
                )
            }
        }
    };

    var app = angular.module('Plunner');
    app.controller('orstController', ['$scope', '$routeParams', '$location', 'mixedContentToArray', 'configService', 'dataPublisher', controller]);
}());
