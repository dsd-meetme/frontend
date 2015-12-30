(function () {
    
    var controller = function ($routeParams, $location, $timeout, mixedContentToArray, orgResources, arrayToUrlParams) {

        var c = this;
        //group id
        var id = $routeParams.id;
        var getUsers = function () {
            orgResources.userInGroup().query({groupId: id, userId: ''}).$promise
                .then(function (response) {
                    c.data.members = response;
                })
        };

        //Gets user info in the context of an organization
        var getGroupInfo = function () {
            //restful show
            orgResources.group().get({groupId: id}).$promise
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
            orgResources.group().remove({groupId: id}).$promise
                .then(function () {
                    c.confirmPopup.hide();
                    $location.path('/organization')
                });
        };
        c.updatePlanner = function (plannerId) {
            c.confirmPopup.message = "Updating planner";
            c.confirmPopup.show();
            if (plannerId !== c.data.group.planner_id) {
                orgResources.group().update({groupId: id}, jQuery.param(
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
                orgResources.group().update({groupId: id}, jQuery.param(
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
            errors : [],
            init: function () {
                orgResources.user().query({userId: ''})
                    .$promise.then(function (response) {
                        var modal = jQuery('#changePlanner');
                        modal.find('input').val('');
                        var pages;
                        c.allUsers = response;
                        pages = Math.ceil(c.allUsers.length / 10);
                        c.pagination.user.pages = pages;
                        c.pagination.user.utilArray = new Array(pages);
                        modal.modal('show');
                        c.editMode.exit();
                    })
            },
            change: function () {
                if(!this.planner_id){
                    this.errors.push('Select a user to be planner');
                }
                else if (this.plannerId !== c.data.group.planner_id) {
                    c.confirmPopup.message = "Saving changes";
                    c.confirmPopup.show();
                    jQuery('#changePlanner').modal('hide');
                    orgResources.group().update({groupId: id}, jQuery.param(
                            {
                                name: c.data.group.name,
                                description: c.data.group.description,
                                planner_id: this.plannerId
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
            }

        };
        c.addToGroup = {
            errors : [],
            members: [],
            validMembers: [],
            init: function () {
                var utilArray = [];
                var secondUtilArray = [];
                for (var i = 0; i < c.data.members.length; i++) {
                    secondUtilArray.push(c.data.members[i].id);
                }
                orgResources.user().query({userId: ''})
                    .$promise.then(function (response) {
                        var modal = jQuery('#addToGroup');
                        modal.find('input').val('');
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
                        modal.modal('show');
                        c.editMode.exit();
                    })
            },
            change: function () {

                var validMembers = [];
                angular.forEach(this.members, function (value, key) {
                    if (value === true) {
                        validMembers.push(key.toString());
                    }
                });
                if(validMembers.length === 0){
                    this.errors.push("Select at least one user");
                }
                else{
                    c.confirmPopup.message = "Adding user to group";
                    jQuery('#addToGroup').modal('hide');
                    c.confirmPopup.show();
                    orgResources.userInGroup().save({
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
                            }
                        })
                }

            }
        };
        c.deleteFromGroup = function (userId) {
            c.confirmPopup.message = "Removing user";
            c.confirmPopup.show();
            orgResources.userInGroup().remove({groupId: id, userId: userId}).$promise
                .then(
                function () {
                    c.getUsers();
                    c.editMode.exit();
                    c.confirmPopup.hide();
                }
            )
        };

        getGroupInfo();
        getUsers();

    };
    var app = angular.module('Plunner');
    app.controller('groupController', controller);
}());
