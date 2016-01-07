(function () {

    var controller = function ($scope, orgResources, arrayToUrlParams, mixedContentToArray) {

        var c = this;

        var getUsers = function () {
            var pages;
            //employees restful index
            orgResources.orgUser.query({userId: ''}).$promise
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
            orgResources.orgGroup.query({groupId: ''}).$promise
                .then(function (response) {
                    c.data.groups = response;
                    pages = Math.ceil(c.data.groups.length / 10);
                    c.pagination.groups.pages = pages;
                    c.pagination.groups.utilArray = new Array(pages);
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

        //Adds a group
        c.addGroup = {
            planner: null,
            members: [],
            name: '',
            desc: '',
            errors: [],
            invalidFields: {
                nameReq: false,
                plannerReq: false,
                membersReq: false
            },
            popUp: {
                show: function (resetInputs) {
                    var popup = jQuery('#addGroup');
                    if (resetInputs) {
                        c.addGroup.errors = [];
                        c.addGroup.planner = null;
                        c.addGroup.members = [];
                        c.addGroup.name = '';
                        c.addGroup.desc = '';
                        popup.find('input').val('').removeAttr('checked');
                    }
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
                this.invalidFields.descriptionReq = this.desc === '';

                validationStatus = this.invalidFields.descriptionReq || this.invalidFields.nameReq || this.invalidFields.membersReq || this.invalidFields.plannerReq;
                //Submits everything to the server if data is valid
                if (!validationStatus) {
                    c.confirmPopup.message = "Adding group";
                    c.addGroup.popUp.hide();
                    c.confirmPopup.show();
                    //Updates the group name and planner
                    orgResources.orgGroup.save({groupId: ''}, jQuery.param({
                        name: c.addGroup.name,
                        planner_id: c.addGroup.planner,
                        description: c.addGroup.desc
                    })).$promise
                        .then(function (response) {
                            //Updates the group members
                            orgResources.orgUserInGroup.save({
                                groupId: response.id,
                                userId: ''
                            }, arrayToUrlParams.process('id', validMembers)).$promise
                                .then(function () {
                                    getGroups();
                                    getUsers();
                                    c.confirmPopup.hide();
                                }, function (response) {
                                    //Puts relevant errors in array
                                    if (response.status === 422) {
                                        mixedContentToArray.process(response.data, c.addGroup.errors, true);
                                        c.confirmPopup.hide();
                                        c.addGroup.popUp.show();
                                    }
                                })
                        },
                        function (response) {
                            //Puts relevant errors in array 
                            if (response.status === 422) {
                                mixedContentToArray.process(response.data, c.addGroup.errors, true);
                                c.confirmPopup.hide();
                                c.addGroup.popUp.show();
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
                show: function (resetInputs) {
                    var popup = jQuery('#addUser');
                    if (resetInputs) {
                        c.addUser.errors = [];
                        c.addUser.name = '';
                        c.addUser.email = '';
                        c.addUser.password = '';
                        c.addUser.confirmation_password = '';
                    }
                    popup.modal('show');
                },
                hide: function () {
                    jQuery('#addUser').modal('hide');
                }

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

                //Submits everything to the server if data is valid
                if (!form.$invalid && !this.invalidFields.passwordMatch) {
                    c.confirmPopup.message = "Adding user";
                    this.popUp.hide();
                    c.confirmPopup.show();

                    //Updates the group name and planner
                    orgResources.orgUser.save({userId: ''}, jQuery.param({
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
                                c.confirmPopup.hide();
                                c.addUser.popUp.show();
                            }
                        });
                }
            }
        };
        getUsers();
        getGroups();
    };

    var app = angular.module('Plunner');
    app.controller('odashController', ['$scope', 'orgResources', 'arrayToUrlParams', 'mixedContentToArray', controller]);
}());
