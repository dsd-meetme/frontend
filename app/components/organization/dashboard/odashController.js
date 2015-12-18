(function () {
    /**
     An controller to manage the actions that can be accomplished by a plunner organization
     @author Giorgio Pea
     @param logoutService A service used to manage the logout of a plunner's organization
     @param orgResources A service that provides objects that incapsulate restful communication
     logic
     @param arrayToUrlParams A service that encodes an array in a url like form
     **/
    var controller = function ($scope, logoutService, orgResources, arrayToUrlParams, $cookies, $timeout, mixedContentToArray) {
        var c = this;
        c.data = {};

        c.confirmPopup = {
            message : '',
            show : function(){
                jQuery('#confirmPopup').modal('show');
            },
            hide : function(){
                jQuery('#confirmPopup').modal('hide');
            }
        };
        //Flags for deciding what view show to the user
        c.viewSections = {
            users : true,
            groups : false,
            showUsers : function(){
                this.groups = false;
                this.users = true;
            },
            showGroups : function(){
                this.users = false;
                this.groups = true;
            }
        };
        //Gets employees
        c.getUsers = function () {
            //employees restful index
            orgResources.user().query({userId: ''}).$promise
                .then(function (response) {
                    c.data.users = response;
                    c.getGroups();
                });
        };
        //Gets groups
        c.getGroups = function () {
            //employees restful groups index
            orgResources.group().query({groupId: ''}).$promise
                .then(function (response) {
                    c.data.groups = response;
                });
        };
        //Adds a group
        c.addGroup = {
            planner: null,
            members: [],
            name: '',
            thereErrors: false,
            desc: '',
            errors: [],
            invalidFields: {
                nameReq: false,
                plannerReq: false,
                membersReq: false
            },
            showPopup : function(){
                var popup = jQuery('#addGroup');
                popup.find('input').val('').removeAttr('checked');
                popup.modal('show');
            },
            hidePopup : function(){
                var popup = jQuery('#addGroup');
                popup.modal('hide');
            },
            submit: function () {
                var validMembers = [];
                var counter = 0;
                angular.forEach(this.members, function (value, key) {
                    if (value === true) {
                        validMembers.push(key.toString());
                    }
                });
                console.log(this.members);
                //Checks tha validity status of input fields
                this.invalidFields.nameReq = (this.name === '');
                this.invalidFields.membersReq = (this.members.length === 0);
                this.invalidFields.plannerReq = (this.planner == null || angular.isUndefined(this.planner));
                for(key in this.invalidFields){
                    if(this.invalidFields[key]){
                        this.thereErrors = true;
                        break;
                    }
                    else{
                        counter++;
                    }
                }
                if(counter === Object.keys(this.invalidFields).length){
                    this.thereErrors = false;
                }
                //Submits everything to the server if data is valid
                if (!this.thereErrors) {
                    //Updates the group name and planner
                    orgResources.group().save({groupId: ''}, jQuery.param({
                        name: this.name,
                        planner_id: this.planner,
                        description: this.desc
                    })).$promise
                        .then(function (response) {
                            //Updates the group members
                            orgResources.userInGroup().save({
                                groupId: response.id,
                                userId: ''
                            }, arrayToUrlParams.process('id', validMembers)).$promise
                                .then(function () {
                                    c.getGroups();
                                    c.confirmPopup.message = "Group successfully added";
                                    c.addGroup.hidePopup();
                                    c.confirmPopup.show();
                                    $timeout(function () {
                                        c.confirmPopup.hide();
                                    }, 2000);
                                }, function (response) {
                                    //Puts relevant errors in array
                                    if (response.status === 422) {
                                        mixedContentToArray.process(response.data, c.addGroup.errors, true);
                                    }
                                })
                        },
                        function (response) {
                            //Puts relevant errors in array 
                            if (response.status === 422) {
                                mixedContentToArray.process(response.data, c.addGroup.errors, true);
                            }
                        });
                }
            }
        };
        //Adds a user
        c.addUser = {
            name: '',
            email: '',
            password: '',
            errors: [],
            thereErrors : false,
            confirmation_password: '',
            invalidFields: {
                nameReq: false,
                emailReq: false,
                passwordReq: false,
                passwordMatch: false,
                passwordLength: false,
                emailVal: false
            },
            showPopup : function(){
                var popup = jQuery('#addUser');
                popup.find('input').val('').removeAttr('checked');
                popup.modal('show');
            },
            submit: function () {
                var form = $scope.addUserForm;
                //Checks the validity of input fields
                this.invalidFields.nameReq = form.name.$error.required;
                this.invalidFields.emailReq = form.email.$error.required;
                this.invalidFields.passwordReq = form.password.$error.required;
                this.invalidFields.passwordLength = form.password.$error.minlength;
                this.invalidFields.emailVal = form.email.$error.email;
                this.invalidFields.passwordMatch = (this.password !== this.confirmation_password);

                this.thereErrors = (form.$invalid || this.invalidFields.passwordMatch);
                //Submits everything to the server if data is valid
                if (!this.thereErrors) {
                    //Updates the group name and planner
                    orgResources.user().save({userId: ''}, jQuery.param({
                        name: this.name,
                        email: this.email,
                        password: this.password,
                        password_confirmation: this.confirmation_password
                    })).$promise
                        .then(function () {
                            //Updates the group members
                            //orgResources.employeeInGroup().save({groupId: response.id, employeeId: ''}).$promise
                            //.then(function(response){
                            c.getUsers();
                            c.confirmPopup.message = "User successfully added";
                            jQuery('#addUser').modal('hide');
                            jQuery('#confirmPopup').modal('show');
                            $timeout(function () {
                                jQuery('#confirmPopup').modal('hide');
                            }, 2000);
                        },
                        function (response) {
                            if (response.status === 422) {
                                mixedContentToArray.process(response.data, c.addUser.errors, true);
                            }
                        });
                }
            }
        };
        //Gets the users
        c.getUsers();
    };

    var app = angular.module('Plunner');
    app.controller('odashController', controller);
}());
