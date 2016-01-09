(function () {
    var controller = function ($scope, $routeParams, dataPublisher, mixedContentToArray, configService) {
        var apiDomain = configService.apiDomain;
        var c = this;
        c.success = false;
        c.invalidFields = {
            emailReq: false,
            pwdLength: false,
            emailVal: false,
            companyReq: false
        };
        c.errors = [];
        c.confirmPopup = {
            show: function () {
                jQuery("#authorizationPopup").modal('show');
            },
            hide: function () {
                jQuery("#authorizationPopup").modal('hide');
            }
        };
        c.reset = function () {
            var form = $scope.resetForm;
            c.errors = [];
            c.invalidFields.emailReq = form.email.$error.required;
            c.invalidFields.emailVal = form.email.$error.email;
            c.invalidFields.pwdLength = form.password.$error.minlength;
            c.invalidFields.company = form.company.$error.required;
            c.invalidFields.passwordReq = form.password.$error.required;
            if (!form.$invalid) {
                c.confirmPopup.show();
                dataPublisher.publish(apiDomain + '/employee/password/reset', {
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
                        c.confirmPopup.hide();
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
    app.controller('urstController', ['$scope', '$routeParams', 'dataPublisher', 'mixedContentToArray', 'configService ', controller]);
}());
