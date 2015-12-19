(function () {
    var controller = function ($scope, orgResources, mixedContentToArray) {

        var c = this;
        c.data = {};
        c.dataCopy = {};
        c.errors = [];
        c.showCurrentState = true;
        c.showEditMode = false;
        c.getInfo = function () {
            orgResources.company().query().$promise
                .then(
                function (response) {
                    c.data = response;
                    c.dataCopy.name = response.name;
                });
        };
        c.editProfile = {
            name: c.dataCopy.name,
            invalidFields: {
                passwordLength: false,
                passwordMatch: false
            },
            submit: function () {
                var form = $scope.editProfileForm;
                this.invalidFields.passwordLength = form.password.$error.minlength;
                this.invalidFields.passwordMatch = (this.password !== this.password_confirmation);
                if (!form.$invalid && !this.invalidFields.passwordMatch) {
                    orgResources.organization.update().$promise
                        .then(
                        function (response) {
                            jQuery('#editProfile').modal('hide');
                            jQuery('#confirmPopup').modal('show');
                            $timeout(function () {
                                jQuery('#confirmPopup').modal('hide');
                            }, 2000);
                            jQuery('#editProfile input').val('');
                            c.editProfile.name = c.dataCopy.name;
                        }, function (response) {
                            if (response.status === 422) {
                                mixedContentToArray.process(response.data, c.errors)
                            }
                        }
                    )
                }
            }
        }
    };

    var app = angular.module('Plunner');
    app.controller('opController', controller);
}());
