(function () {

    var controller = function ($scope, $location, dataPublisher, mixedContentToArray, configService) {
        var apiDomain = configService.apiDomain;
        var c = this;
        var authorizationPopup = {
            show: function () {
                jQuery('#authorizationPopup').modal('show')
            },
            hide: function () {
                jQuery('#authorizationPopup').modal('hide')
            }
        };
        c.errors = [];
        //an object that encapsulate the validity status of input fields
        c.invalidFields = {
            passwordReq: false,
            emailReq: false,
            emailVal: false,
            nameReq: false
        };
        c.login = function () {
            var remember;
            //Processes the submit of usiForm (organization sign in)
            var form = $scope.usiForm;
            c.errors = [];
            //Checks the validity status of input fields
            c.invalidFields.passwordReq = form.password.$error.required;
            c.invalidFields.emailReq = form.email.$error.required;
            c.invalidFields.emailVal = form.email.$error.email;
            c.invalidFields.nameReq = form.name.$error.required;
            if (!form.$invalid) {
                if (c.rmbMe === 'true') {
                    remember = '1'
                }
                else {
                    remember = '0'
                }
                authorizationPopup.show();
                dataPublisher.publish(apiDomain + '/employees/auth/login', {
                    company: c.name,
                    email: c.email,
                    password: c.password,
                    remember: remember
                }).then(function (response) {
                    authorizationPopup.hide();
                    $location.path('/user')
                }, function (response) {
                    if (response.status === 422) {
                        mixedContentToArray.process(response.data, c.errors, true);
                        authorizationPopup.hide();
                    }
                    authorizationPopup.hide();
                });
            }
        }
    };

    var app = angular.module('Plunner');
    app.controller('usiController', ['$scope', '$location', 'dataPublisher', 'mixedContentToArray', 'configService', controller]);
}());
