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
                        c.addUser.password_confirmation = '';
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

(function () {

    var controller = function ($routeParams, $location, mixedContentToArray, orgResources, arrayToUrlParams) {

        var c = this;
        //group id
        var id = $routeParams.id;
        var getUsers = function () {
            orgResources.orgUserInGroup.query({groupId: id, userId: ''}).$promise
                .then(function (response) {
                    c.data.members = response;
                })
        };

        //Gets user info in the context of an organization
        var getGroupInfo = function () {
            //restful show
            orgResources.orgGroup.get({groupId: id}).$promise
                .then(function (response) {
                    c.data.group.name = response.name;
                    c.data.group.description = response.description;
                    c.data.group.id = response.id;
                    c.data.group.planner_id = response.planner_id;
                    c.data.group.planner_name = response.planner_name;
                    //A copy of the retrieved data
                    //This copy will be used
                    c.data.groupCopy.name = response.name;
                    c.data.groupCopy.description = response.description;
                });
        };
        c.data = {
            group: {
                name: '',
                description: '',
                id: ''
            },
            members: [],
            groupCopy: {
                name: '',
                description: ''
            }
        };
        c.errors = {
            planner: [],
            info: []
        };
        c.invalidFields = {
            nameReq: false
        };
        c.editMode = {
            flag: false,
            enter: function () {
                this.flag = true;
            },
            exit: function () {
                this.flag = false;
                c.errors.info = [];
                c.errors.planner = [];
                c.data.groupCopy.name = c.data.group.name;
                c.data.groupCopy.description = c.data.group.description;
                c.invalidFields.nameReq = false;
            }
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
        c.inChange = false;
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
            }
        };

        //Delete an employee in the context of an org
        c.delete = function () {
            //restful delete
            c.confirmPopup.message = "Deleting group";
            c.confirmPopup.show();
            orgResources.orgGroup.remove({groupId: id}).$promise
                .then(function () {
                    c.confirmPopup.hide();
                    $location.path('/organization')
                });
        };
        c.updatePlanner = function (plannerId) {
            c.confirmPopup.message = "Updating planner";
            c.confirmPopup.show();
            if (plannerId !== c.data.group.planner_id) {
                orgResources.orgGroup.update({groupId: id}, jQuery.param(
                        {
                            name: c.data.group.name,
                            description: c.data.group.description,
                            planner_id: plannerId
                        })
                ).$promise
                    .then(function () {
                        //Update view
                        getGroupInfo();
                        c.editMode.exit();
                        c.confirmPopup.hide();
                    }, function (response) {
                        if (response.status === 422) {
                            mixedContentToArray.process(response.data, c.errors.planner, true);
                            c.confirmPopup.hide();
                        }
                    });
            }
        };
        //Update user info
        c.updateInfo = function () {
            //Checks the validity status of input fields
            c.invalidFields.nameReq = (c.data.groupCopy.name === '');

            if (!c.invalidFields.nameReq) {
                c.confirmPopup.message = "Saving changes";
                c.confirmPopup.show();
                orgResources.orgGroup.update({groupId: id}, jQuery.param(
                    {
                        name: c.data.groupCopy.name,
                        description: c.data.groupCopy.description,
                        planner_id: c.data.group.planner_id
                    })).$promise
                    .then(function () {
                        getGroupInfo();
                        c.editMode.exit();
                        c.confirmPopup.hide();
                    }, function (response) {
                        if (response.status === 422) {
                            mixedContentToArray.process(response.data, c.errors.info, true);
                            c.confirmPopup.hide();
                        }
                    });
            }
        };
        c.changePlanner = {
            errors: [],
            popUp: {
                show: function (resetInputs) {
                    var popup = jQuery('#changePlanner');
                    if (resetInputs) {
                        c.changePlanner.errors = [];
                        c.changePlanner.plannerId = '';
                        popup.find('input').val('');
                    }
                    popup.modal('show')
                },
                hide: function () {
                    jQuery('#changePlanner').modal('hide');
                }
            },
            init: function () {
                if (c.allUsers.length === 0) {
                    orgResources.orgUser.query({userId: ''})
                        .$promise.then(function (response) {
                            var pages;
                            c.allUsers = response;
                            pages = Math.ceil(c.allUsers.length / 10);
                            c.pagination.user.pages = pages;
                            c.pagination.user.utilArray = new Array(pages);
                            c.changePlanner.popUp.show(true);
                            c.editMode.exit();
                        })
                }
                else {
                    c.changePlanner.popUp.show(true);
                }

            },
            change: function () {
                if (!this.planner_id) {
                    this.errors.push('Select a user to be planner');
                }
                else if (this.plannerId !== c.data.group.planner_id) {
                    c.confirmPopup.message = "Saving changes";
                    c.changePlanner.popUp.hide();
                    c.confirmPopup.show();

                    orgResources.orgGroup.update({groupId: id}, jQuery.param(
                            {
                                name: c.data.group.name,
                                description: c.data.group.description,
                                planner_id: c.changePlanner.plannerId
                            })
                    ).$promise
                        .then(function () {
                            //Update view
                            getGroupInfo();
                            c.editMode.exit();
                            c.confirmPopup.hide();
                        }, function (response) {
                            if (response.status === 422) {
                                mixedContentToArray.process(response.data, c.errors.planner, true);
                                c.confirmPopup.hide();
                                c.changePlanner.popUp.show();
                            }
                        });
                }
            }

        };
        c.addToGroup = {
            errors: [],
            members: [],
            validMembers: [],
            popUp: {
                show: function (resetInputs) {
                    var popup = jQuery('#addToGroup');
                    if (resetInputs) {
                        c.changePlanner.errors = [];
                        c.changePlanner.members = [];
                        c.changePlanner.validMembers = [];
                        popup.find('input').val('');
                    }
                    popup.modal('show')
                },
                hide: function () {
                    jQuery('#addToGroup').modal('hide');
                }
            },
            init: function () {
                var utilArray = [];
                var secondUtilArray = [];
                if (c.allUsers.length === 0) {
                    for (var i = 0; i < c.data.members.length; i++) {
                        secondUtilArray.push(c.data.members[i].id);
                    }
                    orgResources.orgUser.query({userId: ''})
                        .$promise.then(function (response) {
                            var pages;
                            for (var j = 0; j < response.length; j++) {
                                if (secondUtilArray.indexOf(response[j].id) === -1) {
                                    utilArray.push(response[j]);
                                }
                            }
                            c.allUsers = utilArray;
                            pages = Math.ceil(c.allUsers.length / 10);
                            c.pagination.user.pages = pages;
                            c.pagination.user.utilArray = new Array(pages);
                            c.addToGroup.popUp.show(true);
                            c.editMode.exit();
                        })
                }
                else {
                    c.addToGroup.popUp.show(true);
                }

            },
            change: function () {
                var validMembers = [];
                angular.forEach(this.members, function (value, key) {
                    if (value === true) {
                        validMembers.push(key.toString());
                    }
                });
                if (validMembers.length === 0) {
                    this.errors.push("Select at least one user");
                }
                else {
                    c.confirmPopup.message = "Adding user to group";
                    c.addToGroup.popUp.hide();
                    c.confirmPopup.show();
                    orgResources.orgUserInGroup.save({
                        groupId: c.data.group.id,
                        userId: ''
                    }, arrayToUrlParams.process('id', validMembers)).$promise
                        .then(function () {
                            //Update view
                            getGroupInfo();
                            c.editMode.exit();
                            c.confirmPopup.hide();
                        }, function (response) {
                            //Puts relevant errors in array
                            if (response.status === 422) {
                                mixedContentToArray.process(response.data, c.errors.planner, true);
                                c.confirmPopup.hide();
                                c.addToGroup.popUp.show();
                            }
                        })
                }

            }
        };
        c.deleteFromGroup = function (userId) {
            c.confirmPopup.message = "Removing user";
            c.confirmPopup.show();
            orgResources.orgUserInGroup.remove({groupId: id, userId: userId}).$promise
                .then(
                function () {
                    getUsers();
                    c.editMode.exit();
                    c.confirmPopup.hide();
                }
            )
        };

        getGroupInfo();
        getUsers();

    };
    var app = angular.module('Plunner');
    app.controller('groupController', ['$routeParams', '$location', 'mixedContentToArray', 'orgResources', 'arrayToUrlParams', controller]);
}());

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

(function () {

    var controller = function ($scope, dataPublisher, mixedContentToArray, configService) {

        var apiDomain = configService.apiDomain;
        var c = this;
        c.errors = [];
        c.success = false;
        c.invalidFields = {
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
            //Checks the validity status of input fields
            c.invalidFields.emailReq = form.email.$error.required;
            c.invalidFields.emailVal = form.email.$error.email;
            //Submits
            if (!form.$invalid) {
                c.confirmPopup.show();
                dataPublisher.publish(apiDomain + '/companies/password/email', {email: c.email})
                    .then(function () {
                        c.errors = [];
                        //clears the form fields
                        jQuery('input').val('');
                        c.success = true;
                        c.confirmPopup.hide();
                    }, function (response) {
                        if (response.status === 422) {
                            mixedContentToArray.process(response.data, c.errors, true);
                            c.confirmPopup.hide();
                        }
                    });
            }
        }
    };
    var app = angular.module('Plunner');
    app.controller('orecController', ['$scope', 'dataPublisher', 'mixedContentToArray', 'configService', controller]);
}());

(function () {


    var controller = function ($scope, $routeParams, $location, mixedContentToArray, configService, dataPublisher) {

        var apiDomain = configService.apiDomain;
        var c = this;
        c.errors = [];
        c.invalidFields = {
            emailReq: false,
            passwordLength: false,
            emailVal: false,
            passwordReq: false
        };
        c.confirmPopup = {
            show: function () {
                jQuery('authorizationPopup').modal('show');
            },
            hide: function () {
                jQuery('authorizationPopup').modal('hide');
            }
        };
        c.reset = function () {
            var form = $scope.resetForm;
            //Checks the validity status of input fields
            c.invalidFields.emailReq = form.email.$error.required;
            c.invalidFields.emailVal = form.email.$error.email;
            c.invalidFields.pwdLength = form.password.$error.minlength;
            c.invalidFields.passwordReq = form.password.$error.required;
            //Submits
            if (!form.$invalid) {
                c.confirmPopup.show();
                dataPublisher.publish(apiDomain + '/companies/password/reset', {
                    email: c.email,
                    password: c.password,
                    password_confirmation: c.password,
                    token: $routeParams.token
                }).then(
                    function () {
                        c.confirmPopup.hide();
                        $location.path('/presentation');
                    },
                    function (response) {
                        if (response.status === 422) {
                            mixedContentToArray.process(response.data, c.errors, true);
                            c.confirmPopup.hide();
                        }
                    }
                )
            }
        }
    };

    var app = angular.module('Plunner');
    app.controller('orstController', ['$scope', '$routeParams', '$location', 'mixedContentToArray', 'configService', 'dataPublisher', controller]);
}());

(function () {
    var controller = function ($scope, $location, dataPublisher, mixedContentToArray, configService) {
        var apiDomain = configService.apiDomain;
        var c = this;
        //In case of account already registered, sets a property to true so that
        //an error can be displayed on the view
        c.errors = [];
        //an object that encapsulate the validity status of input fields
        c.invalidFields = {
            nameReq: false,
            emailReq: false,
            passwordReq: false,
            emailVal: false,
            passwordMatch: false,
            passwordLength: false
        };
        c.confirmPopup = {
            show: function () {
                jQuery("#authorizationPopup").modal('show');
            },
            hide: function () {
                jQuery("#authorizationPopup").modal('hide');
            }
        }
        //Processes the submit of dsiForm (domain sign in)
        c.process = function () {
            var form = $scope.regForm;
            //Validity status of input fields checking
            c.invalidFields.passwordReq = form.password.$error.required;
            c.invalidFields.nameReq = form.name.$error.required;
            c.invalidFields.emailReq = form.email.$error.required;
            c.invalidFields.passwordLength = form.password.$error.minlength;
            c.invalidFields.emailVal = form.email.$error.email;
            c.invalidFields.passwordMatch = (form.password.$modelValue !== form.passwordC.$modelValue);

            if (!form.$invalid && !c.invalidFields.passwordMatch) {
                c.confirmPopup.show();
                dataPublisher.publish(apiDomain + '/companies/auth/register', {
                    name: c.name,
                    email: c.email,
                    password: c.password,
                    password_confirmation: c.passwordC
                })
                    .then(
                    function () {
                        c.confirmPopup.hide();
                        $location.path('/organization');
                    },
                    function (response) {
                        if (response.status === 422) {
                            mixedContentToArray.process(response.data, c.errors, true);
                            c.confirmPopup.hide();
                        }
                    }
                );
            }
        }
    };
    var app = angular.module('Plunner');
    app.controller('regController', ['$scope', '$location', 'dataPublisher', 'mixedContentToArray', 'configService', controller]);
}());

(function () {
    var controller = function ($scope, $location, dataPublisher, mixedContentToArray, configService) {
        /*This controller instance */
        var apiDomain = configService.apiDomain;
        var c = this;
        var authorizationPopup = {
            show: function () {
                jQuery('#authorizationPopup').modal('show')
            },
            hide: function () {
                jQuery('#authorizationPopup').modal('hide')
            }
        };
        c.errors = [];
        //an object that encapsulate the validity status of input fields
        c.invalidFields = {
            passwordReq: false,
            emailReq: false,
            emailVal: false
        };
        c.login = function () {
            var remember;
            //Processes the submit of usiForm (organization sign in)
            var form = $scope.signInForm;
            //Checks the validity status of input fields
            c.invalidFields.passwordReq = form.password.$error.required;
            c.invalidFields.emailReq = form.email.$error.required;
            c.invalidFields.emailVal = form.email.$error.email;
            if (!form.$invalid) {
                if (c.rmbMe === 'true') {
                    remember = '1'
                }
                else {
                    remember = '0'
                }
                authorizationPopup.show();
                dataPublisher.publish(apiDomain + '/companies/auth/login', {
                    email: c.email,
                    password: c.password,
                    remember: remember
                }).then(function () {
                    authorizationPopup.hide();
                    $location.path('/organization');
                }, function (response) {
                    authorizationPopup.hide();
                    if (response.status === 422) {
                        mixedContentToArray.process(response.data, c.errors, true);
                        authorizationPopup.hide();
                    }
                });
            }
        }
    };

    var app = angular.module('Plunner');
    app.controller('osiController', ['$scope','$location','dataPublisher','mixedContentToArray','configService',controller]);
}());

(function () {

    var controller = function ($scope, $routeParams, $location, mixedContentToArray, orgResources) {
        var c = this;
        //user id
        var id = $routeParams.id;
        var emptyInvalidFields = function (invalidFields) {
            for (var key in invalidFields) {
                invalidFields[key] = false;
            }
        };
        c.data = {};
        c.dataCopy = {};
        c.confirmPopup = {
            message: '',
            show: function () {
                jQuery('#authorizationPopup').modal('show');
            },
            hide: function () {
                jQuery('#authorizationPopup').modal('hide');
            }
        };
        //Get user info in the context of an org
        var getInfo = function () {
            //restful show
            orgResources.orgUser.get({userId: id}).$promise
                .then(function (response) {
                    c.data = response;
                    c.dataCopy.name = c.data.name;
                    c.dataCopy.email = c.data.email;
                });
        };
        //Delete an user in the context of an org
        c.delete = function () {
            //restful delete
            c.confirmPopup.message = 'Deleting user';
            c.confirmPopup.show();
            orgResources.orgUser.remove({userId: id}).$promise
                .then(function () {
                    c.confirmPopup.hide();
                    $location.path('/organization');

                });
        };
        c.update = {
            thereErrors: false,
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
                    if (c.dataCopy.password) {
                        toSend.password = c.dataCopy.password;
                        toSend.password_confirmation = c.dataCopy.password_confirmation;
                    }
                    orgResources.orgUser.update({userId: id}, jQuery.param(toSend)).$promise
                        .then(function () {
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
        };
        c.deleteFromGroup = function (id) {
            c.confirmPopup.message = 'Removing user from group';
            c.confirmPopup.show();
            orgResources.orgUserInGroup.remove({groupId: id, userId: c.data.id})
                .$promise.then(function () {
                    c.editMode.exit();
                    c.confirmPopup.hide();
                })
        };
        c.editMode = {
            flag: false,
            enter: function () {
                this.flag = true;
            },
            exit: function () {
                this.flag = false;
                c.dataCopy.name = c.data.name;
                c.dataCopy.email = c.data.email;
                c.dataCopy.password = '';
                c.dataCopy.password_confirmation = '';
                c.update.errors = [];
                emptyInvalidFields(c.update.invalidFields);
            }
        };
        getInfo();
    };


    var app = angular.module('Plunner');
    app.controller('userController', ['$scope', '$routeParams', '$location', 'mixedContentToArray', 'orgResources', controller]);
}());
