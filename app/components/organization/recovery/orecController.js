(function () {

    var controller = function ($scope, dataPublisher, mixedContentToArray, configService) {

        var apiDomain = configService.apiDomain;
        var c = this;
        c.errors = [];
        c.success = false;
        c.invalidFields = {
            emailReq: false,
            emailVal: false
        };
        c.confirmPopup = {
            show: function () {
                jQuery("#authorizationPopup").modal('show');
            },
            hide: function () {
                jQuery("#authorizationPopup").modal('hide');
            }
        };
        c.recover = function () {
            c.errors = [];
            var form = $scope.recoveryForm;
            //Checks the validity status of input fields
            c.invalidFields.emailReq = form.email.$error.required;
            c.invalidFields.emailVal = form.email.$error.email;
            //Submits
            if (!form.$invalid) {
                c.confirmPopup.show();
                dataPublisher.publish(apiDomain + '/companies/password/email', {email: c.email})
                    .then(function () {
                        c.errors = [];
                        //clears the form fields
                        jQuery('input').val('');
                        c.success = true;
                        c.confirmPopup.hide();
                    }, function (response) {
                        if (response.status === 422) {
                            mixedContentToArray.process(response.data, c.errors, true);
                            c.confirmPopup.hide();
                        }
                    });
            }
        }
    };
    var app = angular.module('Plunner');
    app.controller('orecController', ['$scope', 'dataPublisher', 'mixedContentToArray', 'configService', controller]);
}());
