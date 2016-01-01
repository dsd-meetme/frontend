(function () {
    var controller = function ($scope, dataPublisher, mixedContentToArray, configService) {
        var apiDomain = configService.apiDomain;
        var c = this;
        c.errors = [];
        c.success = false;
        c.invalidFields = {
            nameReq: false,
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
            var form = $scope.recoveryForm;
            c.invalidFields.nameReq = form.name.$error.required;
            c.invalidFields.emailReq = form.email.$error.required;
            c.invalidFields.emailVal = form.email.$error.email;
            if (!form.$invalid) {
                c.confirmPopup.show()
                dataPublisher.publish(apiDomain + '/employees/password/email', {
                    company: c.name,
                    email: c.email
                })
                    .then(function () {
                        c.errors.length = 0;
                        c.success = true;
                        jQuery('input').val('');
                        c.confirmPopup.hide();
                    }, function (response) {
                        if (response.status === 422) {
                            mixedContentToArray.process(response.data, c.errors, true);
                            c.confirmPopup.hide();
                        }
                    })
            }

        }

    };

    var app = angular.module('Plunner');
    app.controller('urecController', ['$scope', 'dataPublisher', 'mixedContentToArray', 'configService', controller]);
}());
