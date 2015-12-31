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
                jQuery('#authorizationPopup').modal('show');
            },
            hide : function(){
                jQuery('#authorizationPopup').modal('hide');
            }
        };
        //Get user info in the context of an org
        c.getInfo = function(){
            //restful show
            orgResources.orgUser.get({userId:id}).$promise
                .then(function(response){
                    console.log('responso');
                    console.log(response)
                    c.data = response;
                    c.dataCopy.name = c.data.name;
                    c.dataCopy.email = c.data.email;
                });
        };
        //Delete an user in the context of an org
        c.delete = function(){
            //restful delete
            c.confirmPopup.message = 'Deleting user';
            c.confirmPopup.show();
            orgResources.orgUser.remove({userId:id}).$promise
                .then(function(response){
                        c.confirmPopup.hide();
                        $location.path('/organization');

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
                var toSend = {};
                var form = $scope.editForm;
                //Checks the validity status of input fields
                this.invalidFields.emailVal = form.email.$error.email;
                this.invalidFields.emailReq = form.email.$error.required;
                this.invalidFields.nameReq = form.name.$error.required;
                this.invalidFields.passwordLen = form.password.$error.minlength;
                this.invalidFields.passwordMatch = (c.dataCopy.password !== c.dataCopy.password_confirmation);
                this.thereErrors = (form.$invalid || this.invalidFields.passwordMatch);

                if (!this.thereErrors) {
                    c.confirmPopup.message = 'Saving changes';
                    c.confirmPopup.show();
                    toSend.name = c.dataCopy.name;
                    toSend.email = c.dataCopy.email;
                    console.log(c.dataCopy);
                    if(c.dataCopy.password){
                        toSend.password = c.dataCopy.password;
                        toSend.password_confirmation = c.dataCopy.password_confirmation;
                    }
                    orgResources.orgUser.update({userId: id}, jQuery.param(toSend)).$promise
                        .then(function () {
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
        };
        c.deleteFromGroup = function(id){
            orgResources.orgUserInGroup.remove({ groupId : id, userId : c.data.id})
                .$promise.then(function(){
                    c.confirmPopup.message = 'Changes successfully made';
                    c.confirmPopup.show();
                    $timeout(function () {
                        c.confirmPopup.hide();
                    }, 2000);
                    c.getInfo();
                    c.editMode.exit();
                })
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
                c.update.errors = [];
                emptyInvalidFields(c.update.invalidFields);
            }
        };
        c.getInfo();
    };


    var app = angular.module('Plunner');
    app.controller('userController',controller);
}());
