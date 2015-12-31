(function () {

    var controller = function ($scope, $timeout, userResources, mixedContentToArray) {

        var c = this;

        c.data = {
            name: '',
            email: ''
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

        c.getInfo = function () {
            userResources.userInfo.get().$promise
                .then(function (response) {
                    c.data.name = response.name;
                    c.data.email = response.email;
                    c.dataCopy.name = response.name;
                });
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
            name: '',
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
                var form = $scope.upC_profile_form;
                this.invalidFields.passwordLength = form.password.$error.minlength;
                this.invalidFields.passwordMatch = c.dataCopy.password !== c.dataCopy.password_confirmation;
                this.invalidFields.nameReq = form.name.$error.required;
                if (!form.$invalid && !this.invalidFields.passwordMatch) {
                    if((c.dataCopy.name === c.data.name) && c.dataCopy.password === ''){
                        c.editMode.exit();
                    }
                    else {
                        toSend = {
                            name : c.dataCopy.name,
                            email : c.data.name,
                        };
                        if(c.dataCopy.password !== ''){
                            toSend.password = c.dataCopy.password;
                            toSend.password_confirmation = c.dataCopy.password;
                        }
                        c.confirmPopup.show();
                        console.log(toSend);
                        userResources.userInfo.update(jQuery.param(toSend)).$promise
                            .then(function () {
                                c.dataCopy.password = '';
                                c.dataCopy.password_confirmation = '';
                                //Update view
                                c.getInfo();
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
        c.getInfo();


    };

    var app = angular.module('Plunner');
    app.controller('upController', controller);

}());
