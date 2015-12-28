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
        c.confirmPopup = {
            message: '',
            show: function () {
                jQuery('#authorizationPopup').modal('show');
            },
            hide: function () {
                jQuery('#authorizationPopup').modal('hide');
            }
        };
        c.data = {};
        //Flags for deciding what view show to the user
        c.viewSections = {
            users: true,
            groups: false,
            showUsers: function () {
                this.groups = false;
                this.users = true;
            },
            showGroups: function () {
                this.users = false;
                this.groups = true;
            }
        };
        c.pagination = {
            user: {
                pages: 1,
                currentPage: 1,
                utilArray: null,
                startIndex: 0,
                endIndex: 9,
                filterString: '0,9',
                changePage: function (page) {
                    if (page > this.currentPage) {
                        this.currentPage = page;
                        this.startIndex = this.endIndex + 1;
                        this.endIndex = this.startIndex + 9;
                        this.filterString = this.startIndex + ',' + this.endIndex;
                    }
                    else if (page < this.currentPage) {
                        this.currentPage = page;
                        this.endIndex = this.startIndex - 1;
                        this.startIndex = this.endIndex - 9;
                        this.filterString = this.startIndex + ',' + this.endIndex;

                    }
                }

            },
            groups: {
                pages: 1,
                currentPage: 1,
                utilArray: null,
                startIndex: 0,
                endIndex: 9,
                filterString: '0,9',
                changePage: function (page) {
                    if (page > this.currentPage) {
                        this.currentPage = page;
                        this.startIndex = this.endIndex + 1;
                        this.endIndex = this.startIndex + 9;
                        this.filterString = this.startIndex + ',' + this.endIndex;
                    }
                    else if (page < this.currentPage) {
                        this.currentPage = page;
                        this.endIndex = this.startIndex - 1;
                        this.startIndex = this.endIndex - 9;
                        this.filterString = this.startIndex + ',' + this.endIndex;

                    }
                }
            }
        };
        //Gets employees
        var getUsers = function () {
            var pages;
            //employees restful index
            orgResources.user().query({userId: ''}).$promise
                .then(function (response) {
                    c.data.users = response;
                    pages = Math.ceil(c.data.users.length / 10);
                    c.pagination.user.pages = pages;
                    c.pagination.user.utilArray = new Array(pages);
                });
        };
        //Gets groups
        var getGroups = function () {
            var pages;
            //employees restful groups index
            orgResources.group().query({groupId: ''}).$promise
                .then(function (response) {
                    c.data.groups = response;
                    pages = Math.ceil(c.data.groups.length / 10);
                    c.pagination.groups.pages = pages;
                    c.pagination.groups.utilArray = new Array(pages);
                });
        };
        var getOrganizationInfo = function () {
            orgResources.orgInfo().get()
                .$promise.then(function (response) {
                    c.data.orgInfo = response;
                });
        };
        //Adds a group
        c.addGroup = {
            planner: null,
            members: [],
            thereErrors: false,
            name: '',
            desc: '',
            errors: [],
            invalidFields: {
                nameReq: false,
                plannerReq: false,
                membersReq: false
            },
            popUp: {
                show: function () {
                    var popup = jQuery('#addGroup');
                    popup.find('input').val('').removeAttr('checked');
                    popup.modal('show');
                },
                hide: function () {
                    jQuery("#addGroup").modal('hide');
                }

            },
            submit: function () {
                var validMembers = [];
                var validationStatus;
                angular.forEach(this.members, function (value, key) {
                    if (value === true) {
                        validMembers.push(key.toString());
                    }
                });
                //Checks tha validity status of input fields
                this.invalidFields.nameReq = (this.name === '');
                this.invalidFields.membersReq = (this.members.length === 0);
                this.invalidFields.plannerReq = (this.planner == null || angular.isUndefined(this.planner));

                validationStatus = this.invalidFields.nameReq || this.invalidFields.membersReq || this.invalidFields.plannerReq;
                //Submits everything to the server if data is valid
                if (!validationStatus) {
                    c.confirmPopup.message = "Adding group";
                    c.addGroup.popUp.hide();
                    c.confirmPopup.show();
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
                                    getGroups();
                                    c.confirmPopup.hide();
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
            confirmation_password: '',
            invalidFields: {
                nameReq: false,
                emailReq: false,
                passwordReq: false,
                passwordMatch: false,
                passwordLength: false,
                emailVal: false
            },
            popUp: {
                show: function () {
                    var popup = jQuery('#addUser');
                    popup.find('input').val('').removeAttr('checked');
                    popup.modal('show');
                },
                hide: function () {
                    jQuery('#addUser').modal('hide');
                }

            },
            submit: function () {
                var form = $scope.addUserForm;
                console.log(form);
                //Checks the validity of input fields
                this.invalidFields.nameReq = form.name.$error.required;
                this.invalidFields.emailReq = form.email.$error.required;
                this.invalidFields.passwordReq = form.password.$error.required;
                this.invalidFields.passwordLength = form.password.$error.minlength;
                this.invalidFields.emailVal = form.email.$error.email;
                this.invalidFields.passwordMatch = (this.password !== this.confirmation_password);

                //Submits everything to the server if data is valid
                if (!form.$invalid && !this.invalidFields.passwordMatch) {
                    console.log(form);
                    c.confirmPopup.message = "Adding user";
                    this.popUp.hide();
                    c.confirmPopup.show();

                    //Updates the group name and planner
                    orgResources.user().save({userId: ''}, jQuery.param({
                        name: this.name,
                        email: this.email,
                        password: this.password,
                        password_confirmation: this.confirmation_password
                    })).$promise
                        .then(function () {
                            getUsers();
                            c.confirmPopup.hide();
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
        getOrganizationInfo();
        getUsers();
        getGroups();
    };

    var app = angular.module('Plunner');
    app.controller('odashController', controller);
}());
