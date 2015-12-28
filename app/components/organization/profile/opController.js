(function() {

    var controller = function ($scope,$timeout,orgResources,mixedContentToArray) {

        var c = this;

        c.data = {
            name : '',
            email : ''
        };

        c.getInfo = function(){
            orgResources.orgInfo().get().$promise
                .then(function(response){
                    c.data.name = response.name;
                    c.data.email = response.email;
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
                c.dataCopy.password = '';
                c.dataCopy.password_confirmation = '';
                this.flag = false;
            }
        };
        c.dataCopy = {
            password : '',
            password_confirmation : ''
        };
        c.update = {
            invalidFields : {
                passwordLength : false,
                passwordMatch : false
            },
            errors : [],
            submit : function(){
                var form = $scope.opC_profile_form;
                this.invalidFields.passwordLength = form.password.$error.minlength;
                this.invalidFields.passwordMatch = c.dataCopy.password !== c.dataCopy.password_confirmation;
                if(!form.$invalid && !this.invalidFields.passwordMatch){
                    if(c.dataCopy.password === ''){
                        c.editMode.exit();
                    }
                    else{
                        jQuery('#authorizationPopup').modal('show');
                        orgResources.employee().update(jQuery.param({
                            name : c.data.name,
                            email : c.data.email,
                            password : c.dataCopy.password,
                            password_confirmation : c.dataCopy.password
                        })).$promise
                            .then(function(response){
                                c.dataCopy.password = '';
                                c.dataCopy.password_confirmation = '';
                                //Update view
                                c.getInfo();
                                c.editMode.exit();
                                jQuery('#authorizationPopup').modal('hide');
                            },function(response){
                                if(response.status === 422){
                                    mixedContentToArray.process(response.data, c.update.errors, true);
                                }
                            })
                    }
                }
            }

        };
        c.getInfo();
    };

    var app = angular.module('Plunner');
    app.controller('opController', controller);

}());
