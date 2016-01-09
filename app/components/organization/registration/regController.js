(function () {
    var controller = function ($scope, $location, dataPublisher, mixedContentToArray, configService) {
        var apiDomain = configService.apiDomain;
        var c = this;
        //In case of account already registered, sets a property to true so that
        //an error can be displayed on the view
        c.errors = [];
        //an object that encapsulate the validity status of input fields
        c.invalidFields = {
            nameReq: false,
            emailReq: false,
            passwordReq: false,
            emailVal: false,
            passwordMatch: false,
            passwordLength: false
        };
        c.confirmPopup = {
            show: function () {
                jQuery("#authorizationPopup").modal('show');
            },
            hide: function () {
                jQuery("#authorizationPopup").modal('hide');
            }
        }
        //Processes the submit of dsiForm (domain sign in)
        c.process = function () {
            var form = $scope.regForm;
            c.errors = [];
            //Validity status of input fields checking
            c.invalidFields.passwordReq = form.password.$error.required;
            c.invalidFields.nameReq = form.name.$error.required;
            c.invalidFields.emailReq = form.email.$error.required;
            c.invalidFields.passwordLength = form.password.$error.minlength;
            c.invalidFields.emailVal = form.email.$error.email;
            c.invalidFields.passwordMatch = (form.password.$modelValue !== form.passwordC.$modelValue);

            if (!form.$invalid && !c.invalidFields.passwordMatch) {
                c.confirmPopup.show();
                dataPublisher.publish(apiDomain + '/companies/auth/register', {
                    name: c.name,
                    email: c.email,
                    password: c.password,
                    password_confirmation: c.passwordC
                })
                    .then(
                    function () {
                        c.confirmPopup.hide();
                        $location.path('/organization');
                    },
                    function (response) {
                        if (response.status === 422) {
                            mixedContentToArray.process(response.data, c.errors, true);
                            c.confirmPopup.hide();
                        }
                        c.confirmPopup.hide();
                    }
                );
            }
        }
    };
    var app = angular.module('Plunner');
    app.controller('regController', ['$scope', '$location', 'dataPublisher', 'mixedContentToArray', 'configService', controller]);
}());
