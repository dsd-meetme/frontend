(function(){
    /**
     A controller that manage existing users inside an organization
     @param orgResources A service that provides objects that incapsulate restful communication
     logic
     **/
    var controller = function($scope,$routeParams,$location,$timeout,mixedContentToArray,orgResources){
        var c = this;
        //user id
        var id = $routeParams.id;
        var emptyInvalidFields = function(invalidFields){
            for(key in invalidFields){
                invalidFields[key] = false;
            }
        };
        c.data = {};
        c.dataCopy = {};
        c.confirmPopup = {
            message : '',
            show : function(){
                jQuery('#confirmPopup').modal('show');
            },
            hide : function(){
                jQuery('#confirmPopup').modal('hide');
            }
        };
        //Get user info in the context of an org
        c.getInfo = function(){
            //restful show
            orgResources.user().get({userId:id}).$promise
                .then(function(response){
                    c.data = response;
                    c.dataCopy.name = c.data.name;
                    c.dataCopy.email = c.data.email;
                });
        };
        //Delete an user in the context of an org
        c.delete = function(){
            //restful delete
            orgResources.user().remove({userId:id}).$promise
                .then(function(response){
                    c.confirmPopup.message = 'Deletion successfully made';
                    c.confirmPopup.show();
                    $timeout(function(){
                        c.confirmPopup.hide();
                        $location.path('/organization');
                    },2000);

                });
        };
        c.update = {
            thereErrors : false,
            invalidFields: {
                passwordLength: false,
                passwordMatch: false,
                nameReq: false,
                emailReq: false,
                emailVal: false
            },
            errors: [],
            submit: function () {
                var form = $scope.editForm;
                //Checks the validity status of input fields
                this.invalidFields.emailVal = form.email.$error.email;
                this.invalidFields.emailReq = form.email.$error.required;
                this.invalidFields.nameReq = form.name.$error.required;
                this.invalidFields.passwordLen = form.password.$error.minlength;
                this.invalidFields.passwordMatch = (c.dataCopy.password !== c.dataCopy.password_confirmation);
                this.thereErrors = (form.$invalid || this.invalidFields.passwordMatch);

                if (!this.thereErrors) {
                    orgResources.user().update({userId: id}, jQuery.param(c.dataCopy)).$promise
                        .then(function (response) {
                            c.confirmPopup.message = 'Changes successfully made';
                            c.confirmPopup.show();
                            $timeout(function () {
                                c.confirmPopup.hide();
                            }, 2000);
                            c.getInfo();
                            c.editMode.exit();
                        }, function (response) {
                            if (response.status === 422) {
                                mixedContentToArray.process(response.data, c.update.errors, true);
                            }
                        });
                }

            }
        };
        c.editMode = {
            flag : false,
            enter : function(){
                this.flag = true;
            },
            exit : function(){
                this.flag = false;
                c.dataCopy.name = c.data.name;
                c.dataCopy.email = c.data.email;
                c.dataCopy.password = '';
                c.dataCopy.password_confirmation = '';
                emptyInvalidFields(c.update.invalidFields);
            }
        };
        c.getInfo();
    };


    var app = angular.module('Plunner');
    app.controller('userController',controller);
}());
