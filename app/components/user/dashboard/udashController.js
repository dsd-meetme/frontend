(function () {
    /**
     An controller to manage the actions that can be accomplished by a plunner organization
     @author Giorgio Pea
     @param logoutService A service used to manage the logout of a plunner's organization
     **/
    var controller = function ($scope, dataPublisher, mixedContentToArray, orgResources, $timeout) {

        /*
         Gets the meetings relative to a given group.
         These meetings are stored in the meetings properties of the given group.
         These meetings are provided as an array of objects. Each of these objects represents a meeting
         and contains also the name of the group the meeting refers to

         */
        var processMeetings = function (groups) {
            var meetingsContainer = [];
            var tmp;
            console.log('Groups');
            console.log(groups);
            for (var i = 0; i < groups.length; i++) {
                for (var j = 0; j < groups[i].meetings.length; j++) {
                    tmp = groups[i].meetings[j];
                    tmp.group_name = groups[i].name;
                    meetingsContainer.push(tmp);
                }
            }
            return meetingsContainer;

        };
        /*
         Separates imported schedules from composed schedules. This is achieved using the caldav property
         of a schedule, which is null if the schedule is composed
         */
        var processSchedules = function (schedules) {
            var importedSchedules = [];
            var composedSchedules = [];
            var tmp;
            for (var i = 0; i < schedules.length; i++) {
                tmp = schedules[i];
                if (tmp.caldav == null) {
                    composedSchedules.push(tmp);
                }
                else {
                    importedSchedules.push(tmp);
                }
            }
            return {
                importedSchedules: importedSchedules,
                composedSchedules: composedSchedules
            };
        };
        /*
         Pushes to the given dest objects whose value property is given by elements of source, and whose
         selected property is false
         */
        var selectableSchedulesBuilder = function (source, dest) {
            for (var i = 0; i < source.length; i++) {
                dest.push({
                    value: source[i],
                    selected: false
                });
            }
        };
        /*
         Gets the selectable schedules that have been selected
         */
        var getSelectedSchedules = function (selectableSchedules) {
            var selectedSchedules = [];
            for (var i = 0; i < selectableSchedules.length; i++) {
                if (selectableSchedules[i].selected) {
                    selectedSchedules.push(selectableSchedules[i].value);
                }
            }
            return selectedSchedules;
        };
        var c = this;
        var getSchedules = function () {
            var pages, processsedSchedules;
            orgResources.calendar().query({calendarId: ''})
                .$promise.then(function (response) {
                    processedSchedules = processSchedules(response);
                    c.schedules.imported = processedSchedules.importedSchedules;
                    pages = Math.ceil(c.schedules.imported.length / 10);
                    c.pagination.schedulesImported.pages = pages;
                    c.pagination.schedulesImported.utilArray = new Array(pages);
                    c.schedules.composed = processedSchedules.composedSchedules;
                    pages = Math.ceil(c.schedules.composed.length / 10);
                    c.pagination.schedulesComposed.pages = pages;
                    c.pagination.schedulesComposed.utilArray = new Array(pages);
                });
        };
        var getMeetings = function () {
            var pages;
            orgResources.empGroups().query()
                .$promise.then(function (response) {
                    c.meetings.toBePlanned = processMeetings(response);
                    pages = Math.ceil(c.meetings.toBePlanned.length / 10);
                    c.pagination.meetingsToBePlanned.pages = pages;
                    c.pagination.meetingsToBePlanned.utilArray = new Array(pages);
                });
            orgResources.meetingsEmp().query({meetingId: ''})
                .$promise.then(function (response) {
                    console.log('Gotten planned meetings');
                    console.log(response);
                    c.meetings.planned = response;

                });
        };
        var getManagedMeetings = function () {
            var pages;
            orgResources.managedMeetings().query()
                .$promise.then(function (response) {
                    c.meetings.managed = processMeetings(response);
                    pages = Math.ceil(c.meetings.managed.length / 10);
                    c.pagination.meetingsManaged.pages = pages;
                    c.pagination.meetingsManaged.utilArray = new Array(pages)
                });

        };
        var getUserInfo = function () {
            orgResources.employee().get()
                .$promise.then(function (response) {
                    c.userInfo.name = response.name;
                    c.userInfo.email = response.email;
                    c.userInfo.is_planner = response.is_planner;
                    if (c.userInfo.is_planner) {
                        getManagedMeetings();
                    }
                })
        };
        //Flags for deciding what view show to the user
        c.viewSections = {
            meetings: true,
            schedules: false,
            showMeetings: function () {
                this.schedules = false;
                this.meetings = true;
            },
            showSchedules: function () {
                this.meetings = false;
                this.schedules = true;
            }
        };
        c.userInfo = {
            name: '',
            email: '',
            is_planner: false
        };
        c.meetings = {
            planned: null,
            toBePlanned: null,
            managed: null
        };
        c.schedules = {
            imported: null,
            composed: null
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
        c.pagination = {
            changePage: function (section, page) {
                var sectionRef = this[section];
                if (page > sectionRef.currentPage) {
                    sectionRef.currentPage = page;
                    sectionRef.startIndex = sectionRef.endIndex + 1;
                    sectionRef.endIndex = sectionRef.startIndex + 9;
                    sectionRef.filterString = sectionRef.startIndex + ',' + this.sectionRef;
                }
                else if (page < sectionRef.currentPage) {
                    sectionRef.currentPage = page;
                    sectionRef.endIndex = sectionRef.startIndex - 1;
                    sectionRef.startIndex = sectionRef.endIndex - 9;
                    sectionRef.filterString = sectionRef.startIndex + ',' + sectionRef.endIndex;

                }
            },
            meetingsPlanned: {
                pages: 1,
                currentPage: 1,
                utilArray: null,
                startIndex: 0,
                endIndex: 9,
                filterString: '0,9'
            },
            meetingsManaged: {
                pages: 1,
                currentPage: 1,
                utilArray: null,
                startIndex: 0,
                endIndex: 9,
                filterString: '0,9'
            },
            meetingsToBePlanned: {
                pages: 1,
                currentPage: 1,
                utilArray: null,
                startIndex: 0,
                endIndex: 9,
                filterString: '0,9'
            },
            schedulesImported: {
                pages: 1,
                currentPage: 1,
                utilArray: null,
                startIndex: 0,
                endIndex: 9,
                filterString: '0,9'
            },
            schedulesComposed: {
                pages: 1,
                currentPage: 1,
                utilArray: null,
                startIndex: 0,
                endIndex: 9,
                filterString: '0,9'
            }
        };

        c.importSchedule = {
            credentials: {
                url: '',
                username: '',
                password: ''
            },
            calendars: [],
            errors: [],
            invalidFields: {
                urlRequired: false,
                urlValid: false,
                usernameRequired: false,
                passwordRequired: false
            },
            thereErrors: false,
            showLoader: false,
            popUp: {
                show: function () {
                    var popup = jQuery('#importSchedule');
                    //this.thereErrors = false;
                    popup.find('input').val('');
                    popup.modal('show');
                },
                hide: function () {
                    jQuery('#importSchedule').modal('hide');
                }

            },
            getCalendars: function () {
                var form = $scope.importScheduleForm;
                this.invalidFields.urlRequired = form.url.$error.required;
                this.invalidFields.urlVal = form.url.$error.url;
                this.invalidFields.usernameRequired = form.username.$error.required;
                this.invalidFields.passwordRequired = form.password.$error.required;
                this.thereErrors = form.$invalid;
                if (!this.thereErrors) {
                    this.credentials.url = this.url;
                    this.credentials.username = this.username;
                    this.credentials.password = this.password;
                    this.showLoader = true;
                    dataPublisher.publish("http://api.plunner.com/employees/calendars/calendars", {
                        url: this.url,
                        username: this.username,
                        password: this.password
                    }).then(function (response) {
                        selectableSchedulesBuilder(response.data, c.importSchedule.calendars);
                        c.importSchedule.showLoader = false;
                    }, function (response) {
                        c.importSchedule.showLoader = false;
                        if (response.status === 422) {
                            mixedContentToArray.process(response.data, c.importSchedule.errors, true);
                        }
                    });
                }
            },
            submit: function () {

                if (this.calendars.length === 0) {
                    this.errors.push('Before importing a schedule select it after having pressed get schedules')
                }
                else if (!getSelectedSchedules(this.calendars)) {
                    this.errors.push('Select at least one schedule to import');
                }
                else {
                    c.confirmPopup.message = 'Importing schedules';
                    c.importSchedule.popUp.hide();
                    c.confirmPopup.show();
                    var selectedCalendars = getSelectedSchedules(this.calendars);
                    for (var i = 0; i < selectedCalendars.length; i++) {
                        dataPublisher.publish('http://api.plunner.com/employees/calendars/caldav', {
                            name: selectedCalendars[i],
                            url: this.credentials.url,
                            username: this.credentials.username,
                            password: this.credentials.password,
                            calendar_name: selectedCalendars[i],
                            enabled: 1
                        }).then(function () {
                            getSchedules();
                            c.confirmPopup.hide();
                        }, function (response) {
                            if (response.status === 422) {
                                mixedContentToArray.process(response.data, c.importSchedule.errors, true);
                            }
                        })
                    }

                }
            }
        };
        c.deleteSchedule = function (id) {
            c.confirmPopup.message = 'Deleting schedule';
            c.confirmPopup.show();
            orgResources.calendar().remove({calendarId: id})
                .$promise.then(function () {
                    getSchedules();
                    c.confirmPopup.hide();
                })
        };
        c.editSchedule = {
            errors: [],
            thereErrors: false,
            invalidFields: {
                nameReq: false,
                urlReq: false,
                usernameReq: false,
                passwordLength: false,
                passwordMatch: false
            },
            data: {
                name: '',
                username: '',
                url: '',
                enabled: 0,
                calendar_name: ''
            },
            popUp: {
                show: function (index) {
                    var popup = jQuery('#editSchedule');
                    c.editSchedule.data.id = c.schedules.imported[index].id;
                    c.editSchedule.data.name = c.schedules.imported[index].name;
                    c.editSchedule.data.username = c.schedules.imported[index].caldav.username;
                    c.editSchedule.data.url = c.schedules.imported[index].caldav.url;
                    c.editSchedule.data.enabled = c.schedules.imported[index].enabled;
                    c.editSchedule.data.cal_name = c.schedules.imported[index].caldav.calendar_name;
                    popup.modal('show');
                },
                hide: function () {
                    jQuery('#editSchedule').modal('hide');
                }
            },
            submit: function () {
                var form = $scope.editScheduleForm;
                this.invalidFields.nameReq = form.name.$error.required;
                this.invalidFields.urlReq = form.url.$error.required;
                this.invalidFields.urlVal = form.url.$error.url;
                this.invalidFields.usernameReq = form.username.$error.required;
                this.invalidFields.passwordLength = form.password.$error.minlength;
                this.invalidFields.passwordMatch = (this.data.password !== this.confirmation_password);
                this.thereErrors = form.$invalid || this.invalidFields.passwordMatch;

                if (!this.thereErrors) {
                    c.confirmPopup.message = 'Saving changes!';
                    var configObj, enabled;
                    if (this.data.enabled === true) {
                        enabled = '1';
                    }
                    else {
                        enabled = '0';
                    }
                    if (this.data.password !== '') {
                        configObj = {
                            name: this.data.name,
                            enabled: enabled,
                            username: this.data.username,
                            url: this.data.url,
                            password: this.data.password,
                            calendar_name: this.data.cal_name
                        }
                    }
                    else {
                        configObj = {
                            name: this.data.name,
                            enabled: enabled,
                            username: this.data.username,
                            url: this.data.url,
                            calendar_name: this.data.cal_name
                        }
                    }
                    orgResources.calendar().update({calendarId: this.data.id}, jQuery.param(configObj))
                        .$promise.then(function () {
                            c.editSchedule.popUp.hide();
                            c.confirmPopup.show();
                            getSchedules();
                            c.confirmPopup.hide();

                        }, function (response) {
                            if (response.status === 422) {
                                mixedContentToArray.process(response.data, c.editSchedule.errors, true);
                            }
                        })
                }
            }
        };
        c.deletePlannedMeeting = function (groupId, meetingId) {
            c.confirmPopup.message = 'Deleting meeting';
            c.confirmPopup.show();
            orgResources.meetings().remove({groupId: groupId, meetingsId: meetingId}).$promise
                .then(function () {
                    getMeetings();
                    getManagedMeetings();
                    c.confirmPopup.hide();
                })
        };
        getUserInfo();
        getSchedules();
        getMeetings();
    };

    var app = angular.module('Plunner');
    app.controller('udashController', controller);
}());
