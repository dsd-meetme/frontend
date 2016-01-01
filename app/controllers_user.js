(function () {

    var controller = function (userResources, mixedContentToArray, $routeParams, $scope, $location) {

        var calendar;
        var mode = 1;
        var changedEvents = [];
        var checkNewEvents = function (events) {
            var newEvents = [];
            for (var i = 0; i < events.length; i++) {
                if (events[i].new === true) {
                    newEvents.push(events[i]);
                }
            }
            return newEvents;
        };
        var backendEventAdapter = function (events, switcher) {
            var adaptedEvents = [];
            if (switcher) {
                for (var i = 0; i < events.length; i++) {
                    adaptedEvents.push({
                        time_start: events[i]._start._d.toISOString().split('.')[0].replace('T', ' '),
                        time_end: events[i]._end._d.toISOString().split('.')[0].replace('T', ' ')
                    })
                }
            }
            else {
                adaptedEvents[0] = [];
                adaptedEvents[1] = [];
                for (var key in events) {
                    adaptedEvents[0].push(events[key].specificId);
                    adaptedEvents[1].push({
                        time_start: events[key]._start._d.toISOString().split('.')[0].replace('T', ' '),
                        time_end: events[key]._end._d.toISOString().split('.')[0].replace('T', ' ')
                    })
                }
            }

            return adaptedEvents;

        };
        var c = this;
        c.events = [];
        c.eventRemoveId = [2];
        c.errors = [];
        c.invalidFields = {
            nameReq: false,
            eventsReq: false
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
        c.enabled = '0';
        c.thereErrors = false;
        c.processUrl = function () {
            if ($routeParams.type.length === 1 && $routeParams.type === '_') {
                mode = 1;
                this.showDelete = false;
            }
            else {
                mode = 0;
                var urlParams = $routeParams.type.split('&');
                this.id = urlParams[0];
                this.name = urlParams[1];
                this.enabled = urlParams[2];
                this.showDelete = true;

            }
        };
        c.getTimeslots = function () {
            var splittedTimeStart, splittedTimeEnd;
            if (mode === 0) {
                userResources.userScheduleTimeslots.query({calendarId: c.id, timeslotId: ''})
                    .$promise.then(function (response) {
                        for (var i = 0; i < response.length; i++) {
                            splittedTimeStart = response[i].time_start.split(' ');
                            splittedTimeEnd = response[i].time_end.split(' ');
                            c.events.push({
                                title: '',
                                start: splittedTimeStart[0] + 'T' + splittedTimeStart[1],
                                end: splittedTimeEnd[0] + 'T' + splittedTimeEnd[1],
                                specificId: response[i].id
                            });


                        }
                        if (window.innerWidth <= 768) {
                            c.calendarConfig.defaultView = 'agendaDay';
                        }
                        calendar = jQuery('#composeScheduleCal').fullCalendar(c.calendarConfig);
                    })
            }
            else {
                if (window.innerWidth <= 768) {
                    c.calendarConfig.defaultView = 'agendaDay';
                }
                calendar = jQuery('#composeScheduleCal').fullCalendar(c.calendarConfig);
            }

        };

        c.removeTimeslot = function (id) {
            c.confirmPopup.message = 'Deleting event';
            c.confirmPopup.show();
            userResources.userScheduleTimeslots.remove({calendarId: c.id, timeslotId: id}).$promise
                .then(function () {
                    c.confirmPopup.hide();
                })
        };
        c.deleteSchedule = function () {
            c.confirmPopup.message = 'Deleting schedule';
            c.confirmPopup.show();
            userResources.userSchedule.remove({calendarId: c.id})
                .$promise.then(function () {
                    c.confirmPopup.hide();
                    $location.path('/user')
                })
        };
        c.saveSchedule = function () {
            var newEvents, modifiedEvents = [];
            var alsoEditEvents = false;
            var events = calendar.fullCalendar('clientEvents');
            var processedEvents = [];
            var enabled, index, index_one;
            this.invalidFields.nameReq = (c.name === '' || c.name === undefined);
            this.invalidFields.eventsReq = (events.length === 0);
            this.thereErrors = this.invalidFields.nameReq || this.invalidFields.eventsReq;
            index = 0;
            index_one = 0;
            if (!(this.invalidFields.nameReq || this.invalidFields.eventsReq)) {
                if (this.enabled === true) {
                    enabled = '1'
                }
                else {
                    enabled = '0'
                }
                if (mode === 1) {
                    c.confirmPopup.message = 'Creating schedule';
                    c.confirmPopup.show();
                    processedEvents = backendEventAdapter(events, true);
                    userResources.userSchedule.save({calendarId: ''}, jQuery.param({
                        name: this.name,
                        enabled: enabled
                    })).$promise.then(function (response) {
                            for (var i = 0; i < processedEvents.length; i++) {
                                userResources.userScheduleTimeslots.save({calendarId: response.id, timeslotId: ''},
                                    jQuery.param(processedEvents[i])).$promise.then(function () {
                                        if (index === processedEvents.length - 1) {
                                            c.confirmPopup.hide();
                                            $location.path('/user');
                                        }
                                        index++;
                                    }, function (response) {
                                        if (response.status === 422) {
                                            mixedContentToArray.process(response.data, c.errors, true);
                                            c.confirmPopup.hide();
                                        }
                                    });
                            }
                        }, function (response) {
                            if (response.status === 422) {
                                mixedContentToArray.process(response.data, c.errors, true);
                                c.confirmPopup.hide();
                            }
                        })
                }
                else {
                    c.confirmPopup.message = 'Saving schedule';
                    c.confirmPopup.show();
                    index = 0;
                    processedEvents = backendEventAdapter(events, true);
                    newEvents = backendEventAdapter(checkNewEvents(events), true);
                    modifiedEvents = backendEventAdapter(changedEvents, false);
                    alsoEditEvents = modifiedEvents[1].length > 0;

                    userResources.userSchedule.update({calendarId: c.id}, jQuery.param({
                        name: this.name,
                        enabled: enabled
                    })).$promise.then(function () {
                            for (var i = 0; i < newEvents.length; i++) {
                                userResources.userScheduleTimeslots.save({calendarId: c.id, timeslotId: ''},
                                    jQuery.param(newEvents[i])).$promise.then(function () {
                                        if (index === newEvents.length - 1 && !alsoEditEvents) {
                                            c.confirmPopup.hide();
                                            $location.path('/user');
                                        }

                                    }, function (response) {
                                        if (response.status === 422) {
                                            mixedContentToArray.process(response.data, c.errors, true);
                                            c.confirmPopup.hide();
                                        }
                                    });
                            }
                            for (i = 0; i < modifiedEvents[1].length; i++) {
                                userResources.userScheduleTimeslots.update({
                                        calendarId: c.id,
                                        timeslotId: modifiedEvents[0][i]
                                    },
                                    jQuery.param(modifiedEvents[1][i])).$promise.then(function () {
                                        if (index_one === modifiedEvents[1].length - 1) {
                                            c.confirmPopup.hide();
                                            $location.path('/user');

                                        }
                                        index_one++;

                                    }, function (response) {
                                        if (response.status === 422) {
                                            mixedContentToArray.process(response.data, c.errors, true);
                                            c.confirmPopup.hide();
                                        }
                                    });
                            }
                            if (newEvents.length === 0 && modifiedEvents[1].length === 0) {
                                c.confirmPopup.hide();
                                $location.path('/user');
                            }
                        }, function (response) {
                            if (response.status === 422) {
                                mixedContentToArray.process(response.data, c.errors, true);
                                c.confirmPopup.hide();
                            }
                        });
                }
            }


        };
        c.calendarConfig = {
            firstDay: 1,
            allDaySlot: false,
            header: {
                right: 'prev,next today'
            },
            defaultView: 'agendaWeek',
            slotDuration: '00:15:00',
            events: c.events,
            editable: true,
            selectable: true,
            selectHelper: true,
            select: function (start, end) {
                calendar.fullCalendar('renderEvent',
                    {
                        start: start,
                        end: end,
                        new: true
                    },
                    true // make the event "stick"
                );
                calendar.fullCalendar('unselect');
            },
            eventResize: function (event) {
                if (event.new !== true) {
                    changedEvents[event._id] = event;
                }
            },
            eventDrop: function (event) {
                if (event.new !== true) {
                    changedEvents[event._id] = event;
                }
            },
            eventRender: function (event, element) {
                element.append("<span class='fa fa-close removeEvent'></span>");
                element.find(".fa-close").click(function () {
                    if (mode === 0) {
                        c.removeTimeslot(event.specificId);
                    }
                    calendar.fullCalendar('removeEvents', event._id);
                });
            }
        };
        c.processUrl();
        c.getTimeslots();
    };
    var app = angular.module('Plunner');
    app.controller('cschedController', ['userResources', 'mixedContentToArray', '$routeParams', '$scope', '$location', controller]);

}());

(function () {

    var controller = function ($scope, dataPublisher, mixedContentToArray, userResources, plannerResources, configService) {

        /*
         Gets the meetings relative to a given group.
         These meetings are stored in the meetings properties of the given group.
         These meetings are provided as an array of objects. Each of these objects represents a meeting
         and contains also the name of the group the meeting refers to

         */
        var apiDomain = configService.apiDomain;
        var processMeetings = function (groups) {
            var meetingsContainer = [];
            var tmp;
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
            userResources.userSchedule.query({calendarId: ''})
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
            userResources.userGroups.query()
                .$promise.then(function (response) {
                    c.meetings.toBePlanned = processMeetings(response);
                    pages = Math.ceil(c.meetings.toBePlanned.length / 10);
                    c.pagination.meetingsToBePlanned.pages = pages;
                    c.pagination.meetingsToBePlanned.utilArray = new Array(pages);
                });
            userResources.userPlannedMeetings.query({meetingId: ''})
                .$promise.then(function (response) {
                    c.meetings.planned = response;

                });
        };
        var getManagedMeetings = function () {
            var pages;
            plannerResources.plannerManagedMeetings.query()
                .$promise.then(function (response) {
                    c.meetings.managed = processMeetings(response);
                    pages = Math.ceil(c.meetings.managed.length / 10);
                    c.pagination.meetingsManaged.pages = pages;
                    c.pagination.meetingsManaged.utilArray = new Array(pages)
                });

        };
        var getUserInfo = function () {
            console.log(userResources);
            console.log(plannerResources);
            userResources.userInfo.get()
                .$promise.then(function (response) {
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
                show: function (resetInputs) {
                    var popup = jQuery('#importSchedule');
                    //this.thereErrors = false;
                    if (resetInputs) {
                        c.importSchedule.errors = [];
                        popup.find('input').val('');
                    }
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
                    this.errors = [];
                    this.credentials.url = this.url;
                    this.credentials.username = this.username;
                    this.credentials.password = this.password;
                    this.showLoader = true;
                    dataPublisher.publish(apiDomain + '/employees/calendars/calendars', {
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
                        dataPublisher.publish(apiDomain + '/employees/calendars/caldav', {
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
                                c.confirmPopup.hide();
                                c.importSchedule.popUp.show();
                            }
                        })
                    }

                }
            }
        };
        c.deleteSchedule = function (id) {
            c.confirmPopup.message = 'Deleting schedule';
            c.confirmPopup.show();
            userResources.userSchedule.remove({calendarId: id})
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
                calendar_name: '',
                password: ''
            },
            currentIndex: -1,
            popUp: {
                show: function (index, showErrors) {
                    var popup = jQuery('#editSchedule');
                    if (!showErrors) {
                        c.editSchedule.errors = [];
                    }
                    c.editSchedule.data.id = c.schedules.imported[index].id;
                    c.editSchedule.data.name = c.schedules.imported[index].name;
                    c.editSchedule.data.username = c.schedules.imported[index].caldav.username;
                    c.editSchedule.data.url = c.schedules.imported[index].caldav.url;
                    c.editSchedule.data.enabled = c.schedules.imported[index].enabled;
                    c.editSchedule.data.cal_name = c.schedules.imported[index].caldav.calendar_name;
                    c.editSchedule.currentIndex = index;
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
                this.invalidFields.calnameReq = form.cal_name.$error.required;
                this.invalidFields.passwordLength = form.password.$error.minlength;
                if(this.data.password !== '' && !angular.isUndefined(this.password_confirmation)){
                    this.invalidFields.passwordMatch = (this.data.password !== this.password_confirmation);
                }
                this.thereErrors = form.$invalid || this.invalidFields.passwordMatch;

                if (!this.thereErrors) {
                    c.confirmPopup.message = 'Saving changes!';
                    c.editSchedule.popUp.hide();
                    c.confirmPopup.show();
                    var configObj, enabled;
                    console.log(this.data.enabled);
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
                    userResources.userSchedule.update({calendarId: this.data.id}, jQuery.param(configObj))
                        .$promise.then(function () {
                            getSchedules();
                            c.confirmPopup.hide();

                        }, function (response) {
                            if (response.status === 422) {
                                mixedContentToArray.process(response.data, c.editSchedule.errors, true);
                                c.confirmPopup.hide();
                                c.editSchedule.popUp.show(c.editSchedule.currentIndex, true);
                            }
                        })
                }
            }
        };
        c.deletePlannedMeeting = function (groupId, meetingId) {
            c.confirmPopup.message = 'Deleting meeting';
            c.confirmPopup.show();
            plannerResources.plannerMeetings.remove({groupId: groupId, meetingId: meetingId}).$promise
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
    app.controller('udashController', ['$scope', 'dataPublisher', 'mixedContentToArray', 'userResources', 'plannerResources', 'configService', controller]);
}());

(function () {

    var controller = function (userResources, plannerResources, mixedContentToArray, $scope, $location, $routeParams) {
        var mode = 'c';
        var changedEvents = [];
        var calendar;
        var selectDay = function () {
            var date = moment();
            var day = date.day();
            if (day < 6) {
                date.add(7 - date.day(), 'days').minute(0).hour(0);
            }
            else {
                date.add(8, 'days').minute(0).hour(0);
            }

            return date;
        };
        var checkNewEvents = function (events) {
            var newEvents = [];

            for (var i = 0; i < events.length; i++) {
                if (events[i].new === true) {
                    newEvents.push(events[i]);
                }
            }
            return newEvents;
        };
        var backendEventAdapter = function (events, switcher) {
            var adaptedEvents = [];
            if (switcher) {
                for (var i = 0; i < events.length; i++) {
                    adaptedEvents.push({
                        time_start: events[i]._start._d.toISOString().split('.')[0].replace('T', ' '),
                        time_end: events[i]._end._d.toISOString().split('.')[0].replace('T', ' ')
                    })
                }
            }
            else {
                adaptedEvents[0] = [];
                adaptedEvents[1] = [];
                for (var key in events) {
                    adaptedEvents[0].push(events[key].specificId);
                    adaptedEvents[1].push({
                        time_start: events[key]._start._d.toISOString().split('.')[0].replace('T', ' '),
                        time_end: events[key]._end._d.toISOString().split('.')[0].replace('T', ' ')
                    })
                }
            }

            return adaptedEvents;

        };
        var getUserInfo = function () {
            userResources.userInfo.get()
                .$promise.then(function (response) {
                    c.userInfo.is_planner = response.is_planner
                });
        };
        var c = this;
        c.buttonText = 'Plan meeting';
        c.events = [];
        c.userInfo = {
            is_planner: false
        };
        c.inputEnabled = false;
        c.dataCopy = {};
        c.processUrl = function () {
            var urlParams;
            if ($routeParams.type.length === 1 && $routeParams.type === '_') {
                this.inputEnabled = true
            }
            else {
                urlParams = $routeParams.type.split('&');
                this.groupId = urlParams[0];
                this.meetingId = urlParams[1];
                mode = urlParams[2];
                if (mode === 'w') {
                    this.inputEnabled = true;
                    this.buttonText = 'Save changes'
                }
            }
        };
        c.getInfo = function () {
            if (mode === 'w') {
                plannerResources.plannerMeetings.get({groupId: c.groupId, meetingId: c.meetingId})
                    .$promise.then(function (response) {
                        console.log(response);
                        c.data = response;
                        c.title = response.title;
                        c.description = response.description;
                        c.duration = parseInt(response.duration) / 60;
                        c.groupName = response.group.name;
                    })
            }

        };
        c.deleteMeeting = function () {
            c.confirmPopup.message = "Deleting meeting";
            c.confirmPopup.show();
            plannerResources.plannerMeetings.remove({groupId: c.groupId, meetingId: c.meetingId}).$promise
                .then(function () {
                    c.confirmPopup.hide();
                    $location.path('/user');
                })
        };
        c.getTimeslots = function () {
            var splittedTimeStart, splittedTimeEnd;
            if (mode === 'w') {
                plannerResources.plannerManagedMeetingsTimeslots.query({
                    groupId: this.groupId,
                    meetingId: this.meetingId,
                    timeslotId: ''
                })
                    .$promise.then(function (response) {
                        for (var i = 0; i < response.length; i++) {
                            splittedTimeStart = response[i].time_start.split(' ');
                            splittedTimeEnd = response[i].time_end.split(' ');
                            c.events.push({
                                title: '',
                                start: splittedTimeStart[0] + 'T' + splittedTimeStart[1],
                                end: splittedTimeEnd[0] + 'T' + splittedTimeEnd[1],
                                specificId: response[i].id
                            });

                        }
                        if (window.innerWidth <= 768) {
                            c.calendarConfig.defaultView = 'agendaDay';
                        }
                        calendar = jQuery('#meetingTimeslots').fullCalendar(c.calendarConfig);
                    })
            }
            else {
                if (window.innerWidth <= 768) {
                    c.calendarConfig.defaultView = 'agendaDay';
                }
                calendar = jQuery('#meetingTimeslots').fullCalendar(c.calendarConfig);
            }
        };
        c.removeTimeslot = function (id) {
            c.confirmPopup.message = 'Deleting event';
            c.confirmPopup.show();
            plannerResources.plannerManagedMeetingsTimeslots.remove({
                groupId: this.groupId,
                meetingId: this.meetingId,
                timeslotId: id
            }).$promise
                .then(function () {
                    c.confirmPopup.hide();

                })
        };
        c.calendarConfig = {
            firstDay: 1,
            allDaySlot: false,
            header: {
                right: 'deleteBtn, prev,next today'
            },
            defaultView: 'agendaWeek',
            slotDuration: '00:15:00',
            events: c.events,
            editable: true,
            selectable: true,
            selectHelper: true,
            selectConstraint: {
                start: selectDay().toISOString(),
                end: selectDay().add(30, 'days')
            },
            eventConstraint: {
                start: selectDay().toISOString(),
                end: selectDay().add(30, 'days')
            },
            eventRender: function (event, element) {
                element.append("<span class='fa fa-close removeEvent'></span>");
                element.find(".fa-close").click(function () {
                    if (mode === 'w') {
                        c.removeTimeslot(event.specificId);
                    }
                    calendar.fullCalendar('removeEvents', event._id);
                });
            },
            select: function (start, end) {
                calendar.fullCalendar('renderEvent',
                    {
                        start: start,
                        end: end,
                        new: true
                    },
                    true // make the event "stick"
                );
                calendar.fullCalendar('unselect');
            },
            eventResize: function (event) {
                //changedEvents[event._id] = event;
                console.log(event.new !== true);
                if (event.new !== true) {
                    changedEvents[event._id] = event;
                }
            },
            eventDrop: function (event) {
                if (event.new !== true) {
                    changedEvents[event._id] = event;
                }
            }
        };
        c.invalidFields = {
            nameReq: false,
            descriptionReq: false,
            durationReq: false,
            durationVal: false,
            durationLimit: false,
            oneEventLeast: false,
            durationConflict: false,
            oneGroup: false
        };
        c.selectGroup = function (id) {
            this.selectedGroup = id;
        };
        c.errors = [];
        c.thereErrors = false;
        c.confirmPopup = {
            message: '',
            show: function () {
                jQuery('#authorizationPopup').modal('show');
            },
            hide: function () {
                jQuery('#authorizationPopup').modal('hide');
            }
        };
        c.submit = function () {
            var form = $scope.meetingInfoForm;
            var newEvents, modifiedEvents = [];
            var alsoEditEvents = false;
            var events = calendar.fullCalendar('clientEvents');
            var minEventDuration;
            var processedEvents;
            var index, index_one;
            index = 0;
            index_one = 0;
            this.invalidFields.nameReq = form.title.$error.required;
            this.invalidFields.descriptionReq = form.description.$error.required;
            this.invalidFields.durationReq = form.duration.$error.required;
            this.invalidFields.oneGroup = !angular.isDefined(this.selectedGroup) && mode !== 'w';
            this.invalidFields.durationVal = form.duration.$error.number;
            if (!this.invalidFields.durationReq) {
                this.invalidFields.durationLimit = !(this.duration >= 15 && this.duration <= 300);
            }
            this.invalidFields.oneEventLeast = events.length === 0;

            for (var i = 0; i < events.length; i++) {
                minEventDuration = (events[i].end.format('x') - events[i].start.format('x')) / 1000;
                if (minEventDuration < this.duration) {
                    this.invalidFields.durationConflict = true;
                    break;
                }
            }
            for (var key in this.invalidFields) {
                if (this.invalidFields[key] === true) {
                    this.thereErrors = true;
                    break;
                }
            }
            this.thereErrors = form.$invalid || this.invalidFields.durationConflict || this.invalidFields.oneEventLeast
                || this.invalidFields.oneGroup;
            if (!this.thereErrors) {
                processedEvents = backendEventAdapter(events, true);
                if (mode === 'c') {
                    c.confirmPopup.message = "Creating meeting";
                    c.confirmPopup.show();
                    plannerResources.plannerMeetings.save({groupId: c.selectedGroup, meetingId: ''}, jQuery.param({
                        title: this.title,
                        description: this.description,
                        duration: (this.duration * 60)
                    })).$promise.then(function (response) {
                            console.log(response);
                            for (var i = 0; i < processedEvents.length; i++) {
                                plannerResources.plannerManagedMeetingsTimeslots.save({
                                        groupId: c.selectedGroup,
                                        meetingId: response.id,
                                        timeslotId: ''
                                    },
                                    jQuery.param(processedEvents[i])
                                ).$promise.then(function () {
                                        if (index === processedEvents.length - 1) {
                                            c.confirmPopup.hide();
                                            $location.path('/user');
                                        }
                                        index++;
                                    }, function (response) {
                                        if (response.status === 422) {
                                            mixedContentToArray.process(response.data, c.errors, true);
                                            c.confirmPopup.hide();
                                        }

                                    })
                            }
                        }, function (response) {
                            if (response.status === 422) {
                                mixedContentToArray.process(response.data, c.errors, true);
                                c.confirmPopup.hide();
                            }

                        })
                }
                else {
                    c.confirmPopup.message = "Saving changes";
                    c.confirmPopup.show();
                    index = 0;
                    newEvents = backendEventAdapter(checkNewEvents(events), true);
                    modifiedEvents = backendEventAdapter(changedEvents, false);

                    alsoEditEvents = modifiedEvents[1].length > 0;

                    plannerResources.plannerMeetings.update({groupId: c.groupId, meetingId: c.meetingId}, jQuery.param({
                        title: this.title,
                        description: this.description,
                        duration: (this.duration * 60)
                    })).$promise.then(function () {
                            for (var i = 0; i < newEvents.length; i++) {
                                plannerResources.plannerManagedMeetingsTimeslots.save({
                                        groupId: c.groupId,
                                        meetingId: c.meetingId,
                                        timeslotId: ''
                                    },
                                    jQuery.param(newEvents[i])).$promise.then(function () {
                                        if (index === newEvents.length - 1 && !alsoEditEvents) {
                                            c.confirmPopup.hide();
                                            $location.path('/user');
                                        }
                                        index++;

                                    }, function (response) {
                                        if (response.status === 422) {
                                            mixedContentToArray.process(response.data, c.errors, true);
                                            c.confirmPopup.hide();
                                        }
                                    });
                            }
                            for (i = 0; i < modifiedEvents[1].length; i++) {
                                plannerResources.plannerManagedMeetingsTimeslots.update({
                                        groupId: c.groupId,
                                        meetingId: c.meetingId,
                                        timeslotId: modifiedEvents[0][i]
                                    },
                                    jQuery.param(modifiedEvents[1][i])).$promise.then(function () {
                                        if (index_one === modifiedEvents[1].length - 1) {
                                            c.confirmPopup.hide();
                                            $location.path('/user');
                                        }

                                    }, function (response) {
                                        if (response.status === 422) {
                                            mixedContentToArray.process(response.data, c.errors, true);
                                            c.confirmPopup.hide();
                                        }
                                    });
                            }
                            if (newEvents.length === 0 && modifiedEvents[1].length === 0) {
                                c.confirmPopup.hide();
                                $location.path('/user');

                            }
                        }, function (response) {
                            if (response.status === 422) {
                                mixedContentToArray.process(response.data, c.errors, true);
                                c.confirmPopup.hide();
                            }

                        })
                }

            }
        };
        c.getGroups = function () {
            if (mode === 'c') {
                plannerResources.plannerManagedMeetings.query({groupId: ''}).$promise
                    .then(function (response) {
                        c.groups = response;
                    })
            }

        };
        getUserInfo();
        c.processUrl();
        c.getGroups();
        c.getInfo();
        c.getTimeslots();

    };

    var app = angular.module('Plunner');
    app.controller('nmController', ['userResources', 'plannerResources', 'mixedContentToArray', '$scope', '$location', '$routeParams', controller]);
}());

(function () {

    var controller = function ($scope, userResources, mixedContentToArray) {

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
                    if ((c.dataCopy.name === c.data.name) && c.dataCopy.password === '') {
                        c.editMode.exit();
                    }
                    else {
                        toSend = {
                            name: c.dataCopy.name,
                            email: c.data.name
                        };
                        if (c.dataCopy.password !== '') {
                            toSend.password = c.dataCopy.password;
                            toSend.password_confirmation = c.dataCopy.password;
                        }
                        c.confirmPopup.show();
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
    app.controller('upController', ['$scope', 'userResources', 'mixedContentToArray', controller]);

}());

(function () {
    var controller = function ($scope, dataPublisher, mixedContentToArray, configService) {
        var apiDomain = configService.apiDomain;
        var c = this;
        c.errors = [];
        c.success = false;
        c.invalidFields = {
            nameReq: false,
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
            c.invalidFields.nameReq = form.name.$error.required;
            c.invalidFields.emailReq = form.email.$error.required;
            c.invalidFields.emailVal = form.email.$error.email;
            if (!form.$invalid) {
                c.confirmPopup.show()
                dataPublisher.publish(apiDomain + '/employees/password/email', {
                    company: c.name,
                    email: c.email
                })
                    .then(function () {
                        c.errors.length = 0;
                        c.success = true;
                        jQuery('input').val('');
                        c.confirmPopup.hide();
                    }, function (response) {
                        if (response.status === 422) {
                            mixedContentToArray.process(response.data, c.errors, true);
                            c.confirmPopup.hide();
                        }
                    })
            }

        }

    };

    var app = angular.module('Plunner');
    app.controller('urecController', ['$scope', 'dataPublisher', 'mixedContentToArray', 'configService', controller]);
}());

(function () {
    var controller = function ($scope, $routeParams, dataPublisher, mixedContentToArray, configService) {
        var apiDomain = configService.apiDomain;
        var c = this;
        c.success = false;
        c.invalidFields = {
            emailReq: false,
            pwdLength: false,
            emailVal: false,
            companyReq: false
        };
        c.errors = [];
        c.confirmPopup = {
            show: function () {
                jQuery("#authorizationPopup").modal('show');
            },
            hide: function () {
                jQuery("#authorizationPopup").modal('hide');
            }
        };
        c.reset = function () {
            var form = $scope.resetForm;
            c.invalidFields.emailReq = form.email.$error.required;
            c.invalidFields.emailVal = form.email.$error.email;
            c.invalidFields.pwdLength = form.password.$error.minlength;
            c.invalidFields.company = form.company.$error.required;
            c.invalidFields.passwordReq = form.password.$error.required;
            if (!form.$invalid) {
                c.confirmPopup.show();
                dataPublisher.publish(apiDomain + '/employee/password/reset', {
                    company: c.company,
                    email: c.email,
                    password: c.password,
                    password_confirmation: c.password,
                    token: $routeParams.token
                }).then(
                    function () {
                        c.errors.length = 0;
                        c.success = true;
                        jQuery('input').val('');
                        c.confirmPopup.hide();
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
    app.controller('urstController', ['$scope', '$routeParams', 'dataPublisher', 'mixedContentToArray', 'configService ', controller]);
}());

(function () {

    var controller = function ($scope, $location, dataPublisher, mixedContentToArray, configService) {
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
            emailVal: false,
            nameReq: false
        };
        c.login = function () {
            var remember;
            //Processes the submit of usiForm (organization sign in)
            var form = $scope.usiForm;
            //Checks the validity status of input fields
            c.invalidFields.passwordReq = form.password.$error.required;
            c.invalidFields.emailReq = form.email.$error.required;
            c.invalidFields.emailVal = form.email.$error.email;
            c.invalidFields.nameReq = form.name.$error.required;
            if (!form.$invalid) {
                if (c.rmbMe === 'true') {
                    remember = '1'
                }
                else {
                    remember = '0'
                }
                authorizationPopup.show();
                dataPublisher.publish(apiDomain + '/employees/auth/login', {
                    company: c.name,
                    email: c.email,
                    password: c.password,
                    remember: remember
                }).then(function (response) {
                    authorizationPopup.hide();
                    $location.path('/user')
                }, function (response) {
                    if (response.status === 422) {
                        mixedContentToArray.process(response.data, c.errors, true);
                        authorizationPopup.hide();
                    }
                });
            }
        }
    };

    var app = angular.module('Plunner');
    app.controller('usiController', ['$scope', '$location', 'dataPublisher', 'mixedContentToArray', 'configService', controller]);
}());
