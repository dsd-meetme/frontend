(function () {

    var controller = function ($scope, orgResources, mixedContentToArray) {

        var c = this;

        c.data = {
            name: '',
            email: ''
        };

        var getInfo = function () {
            orgResources.orgInfo.get().$promise
                .then(function (response) {
                    c.data.name = response.name;
                    c.data.email = response.email;
                    c.dataCopy.name = response.name;
                });
        };
        c.confirmPopup = {
            message: '',
            show: function () {
                jQuery('#authorizationPopup').modal('show');
            },
            hide: function () {
                jQuery('#authorizationPopup').modal('hide');
            }
        };
        c.editMode = {
            flag: false,
            enter: function () {
                this.flag = true;
            },
            exit: function () {
                c.update.errors = [];
                c.update.invalidFields.passwordMatch = false;
                c.update.invalidFields.passwordLength = false;
                c.update.invalidFields.nameReq = false;
                c.dataCopy.password = '';
                c.dataCopy.password_confirmation = '';
                this.flag = false;
            }
        };
        c.dataCopy = {
            password: '',
            password_confirmation: ''
        };
        c.update = {
            invalidFields: {
                passwordLength: false,
                passwordMatch: false
            },
            errors: [],
            submit: function () {
                var toSend;
                var form = $scope.opC_profile_form;
                this.invalidFields.passwordLength = form.password.$error.minlength;
                this.invalidFields.passwordMatch = c.dataCopy.password !== c.dataCopy.password_confirmation;
                this.invalidFields.nameReq = form.name.$error.required;
                if (!form.$invalid && !this.invalidFields.passwordMatch) {
                    if (c.dataCopy.password === '' && (c.dataCopy.name === c.data.name)) {
                        c.editMode.exit();
                    }
                    else {
                        c.confirmPopup.show();
                        toSend = {
                            name: c.dataCopy.name,
                            email: c.data.email
                        };
                        if (c.dataCopy.password !== '') {
                            toSend.password = c.dataCopy.password;
                            toSend.password_confirmation = c.dataCopy.password;
                        }
                        orgResources.orgInfo.update(jQuery.param(toSend)).$promise
                            .then(function () {
                                c.dataCopy.password = '';
                                c.dataCopy.password_confirmation = '';
                                //Update view
                                getInfo();
                                c.editMode.exit();
                                c.confirmPopup.hide();
                            }, function (response) {
                                if (response.status === 422) {
                                    mixedContentToArray.process(response.data, c.update.errors, true);
                                    c.confirmPopup.hide();
                                }
                            })
                    }
                }
            }

        };
        getInfo();
    };

    var app = angular.module('Plunner');
    app.controller('opController', ['$scope', 'orgResources', 'mixedContentToArray', controller]);

}());
