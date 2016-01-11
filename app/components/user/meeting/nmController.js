(function () {

    var controller = function (userResources, plannerResources, mixedContentToArray, $scope, $location, $routeParams) {

        var mode = 'c';
        var c = this;
        var changedEvents = [];
        var calendar;
        var startTime;

        var selectDay = function () {
            var date = moment();
            date.utc();
            var day = date.day();
            if (day <= 6) {
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

        var adaptToResolution = function () {
            if (window.innerWidth <= 768) {
                calendarConfig.defaultView = 'agendaDay';
            }
        };

        var getUserInfo = function () {
            userResources.userInfo.get()
                .$promise.then(function (response) {
                    c.userInfo.is_planner = response.is_planner
                });
        };

        var getMeetings = function () {
            var meeting;
            if (mode === 'w') {
                plannerResources.plannerManagedMeetings.query({current: 1})
                    .$promise.then(function (response) {
                        for (var i = 0; i < response.length; i++) {
                            for (var j = 0; j < response[i].meetings.length; j++) {
                                meeting = response[i].meetings[j];
                                if (meeting.id === c.meetingId) {
                                    c.startTime = meeting.start_time;
                                    startTime = meeting.start_time;
                                    getTimeslots();
                                    break;

                                }
                            }
                        }
                        if (startTime) {
                            c.showEmptyState = true;
                        }
                    });
            }
            else {
                calendar = jQuery('#meetingTimeslots').fullCalendar(calendarConfig)
            }

        };
        var getTimeslots = function () {
            if (!startTime) {
                plannerResources.plannerManagedMeetingsTimeslots.query({
                    groupId: c.groupId,
                    meetingId: c.meetingId,
                    timeslotId: ''
                })
                    .$promise.then(function (response) {
                        var splittedTimeStart, splittedTimeEnd;
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
                        calendar = jQuery('#meetingTimeslots').fullCalendar(calendarConfig);
                    })
            }
        };
        
        var processUrl = function () {
            var urlParams;
            if ($routeParams.type.length === 1 && $routeParams.type === '_') {
                c.inputEnabled = true
            }
            else {
                urlParams = $routeParams.type.split('&');
                c.groupId = urlParams[0];
                c.meetingId = urlParams[1];

                mode = urlParams[2];
                if (mode === 'w') {
                    c.inputEnabled = true;
                    c.buttonText = 'Save changes'
                }
            }
        };
        
        var getMeetingInfo = function () {
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

        var removeTimeslot = function (id) {
            c.confirmPopup.message = 'Deleting event';
            c.confirmPopup.show();
            plannerResources.plannerManagedMeetingsTimeslots.remove({
                groupId: c.groupId,
                meetingId: c.meetingId,
                timeslotId: id
            }).$promise
                .then(function () {
                    c.confirmPopup.hide();
                }, function () {
                    c.confirmPopup.hide();
                })
        };


        var createMeeting = function (events) {
            var processedEvents = backendEventAdapter(events, true);
            c.confirmPopup.message = "Creating meeting";
            c.confirmPopup.show();
            plannerResources.plannerMeetings.save({groupId: c.selectedGroup, meetingId: ''}, jQuery.param({
                title: c.title,
                description: c.description,
                duration: (c.duration * 60)
            })).$promise.then(function (response) {
                    saveMeetingTimeslots(response.id, processedEvents, true, true)
                }, function (response) {
                    if (response.status === 422) {
                        mixedContentToArray.process(response.data, c.errors, true);
                        c.confirmPopup.hide();
                    }
                    c.confirmPopup.hide();

                })
        };
        var updateMeetingTimeslots = function (events, redirect) {
            console.log(events);
            var counter = 0;
            console.log(events[1].length);
            for (var i = 0; i < events[1].length; i++) {
                plannerResources.plannerManagedMeetingsTimeslots.update({
                        groupId: c.groupId,
                        meetingId: c.meetingId,
                        timeslotId: events[0][i]
                    },
                    jQuery.param(events[1][i])).$promise.then(function () {
                        if (counter === events[1].length - 1) {
                            c.confirmPopup.hide();
                            if (redirect) {
                                $location.path('/user');
                            }
                        }
                        counter++;

                    }, function (response) {
                        if (response.status === 422) {
                            mixedContentToArray.process(response.data, c.errors, true);
                            c.confirmPopup.hide();
                        }
                        c.confirmPopup.hide();
                    })
            }

        };
        var saveMeetingTimeslots = function (meetingId, events, redirect, showPopupCondition, isUpdate) {
            var counter = 0;
            var groupId;
            if (isUpdate){
                groupId = c.groupId;
            }
            else{
                groupId = c.selectedGroup;
            }
            for (var i = 0; i < events.length; i++) {
                plannerResources.plannerManagedMeetingsTimeslots.save({
                        groupId: groupId,
                        meetingId: meetingId,
                        timeslotId: ''
                    },
                    jQuery.param(events[i])
                ).$promise.then(function () {
                        if (counter === events.length - 1 && showPopupCondition) {
                            c.confirmPopup.hide();
                            if (redirect) {
                                $location.path('/user');
                            }

                        }
                        counter++;
                    }, function (response) {
                        if (response.status === 422) {
                            mixedContentToArray.process(response.data, c.errors, true);
                            c.confirmPopup.hide();
                        }
                        c.confirmPopup.hide();

                    })
            }

        };
        var updateMeeting = function (events) {
            var alsoEditedEvents = false;
            var newEvents = backendEventAdapter(checkNewEvents(events), true);
            var modifiedEvents = backendEventAdapter(changedEvents, false);
            console.log(newEvents);
            console.log(modifiedEvents);
            c.confirmPopup.message = "Saving changes";
            c.confirmPopup.show();
            alsoEditedEvents = modifiedEvents[1].length > 0;
            plannerResources.plannerMeetings.update({groupId: c.groupId, meetingId: c.meetingId}, jQuery.param({
                title: c.title,
                description: c.description,
                duration: (c.duration * 60)
            })).$promise.then(function () {
                    if (!startTime) {
                        saveMeetingTimeslots(c.meetingId, newEvents, true, !alsoEditedEvents, true);
                        updateMeetingTimeslots(modifiedEvents, true);

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
                    c.confirmPopup.hide();

                })
        };

        c.buttonText = 'Plan meeting';
        c.events = [];
        c.userInfo = {
            is_planner: false
        };
        c.inputEnabled = false;
        c.dataCopy = {};
        c.showEmptyState = false;
        c.startTime;
        c.deleteMeeting = function () {
            c.confirmPopup.message = "Deleting meeting";
            c.confirmPopup.show();
            plannerResources.plannerMeetings.remove({groupId: c.groupId, meetingId: c.meetingId}).$promise
                .then(function () {
                    c.confirmPopup.hide();
                    $location.path('/user');
                }, function () {
                    c.confirmPopup.hide();
                })
        };
        var calendarConfig = {
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
                        removeTimeslot(event.specificId);
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
            c.selectedGroup = id;
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
            var events;
            if (!c.showEmptyState) {
                events = calendar.fullCalendar('clientEvents');
            }
            else {
                events = [];
            }

            var minEventDuration;
            this.invalidFields.nameReq = form.title.$error.required;
            this.invalidFields.descriptionReq = form.description.$error.required;
            this.invalidFields.durationReq = form.duration.$error.required;
            this.invalidFields.oneGroup = !angular.isDefined(this.selectedGroup) && mode !== 'w';
            this.invalidFields.durationVal = form.duration.$error.number;

            if (!this.invalidFields.durationReq) {
                this.invalidFields.durationLimit = !(this.duration >= 15 && this.duration <= 300);
            }
            if (!startTime) {
                this.invalidFields.oneEventLeast = events.length === 0;
                for (var i = 0; i < events.length; i++) {
                    minEventDuration = (events[i].end.format('x') - events[i].start.format('x')) / 1000;
                    if (minEventDuration < this.duration) {
                        this.invalidFields.durationConflict = true;
                        break;
                    }
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
            console.log(c.invalidFields);
            if (!this.thereErrors) {
                if (mode === 'c') {
                    createMeeting(events);
                }
                else {
                    updateMeeting(events);
                }

            }
        };
        var getGroups = function () {
            if (mode === 'c') {
                plannerResources.plannerManagedMeetings.query({groupId: ''}).$promise
                    .then(function (response) {
                        c.groups = response;
                    })
            }

        };
        adaptToResolution();
        getUserInfo();
        processUrl();
        getMeetings();
        getGroups();
        getMeetingInfo();


    };

    var app = angular.module('Plunner');
    app.controller('nmController', ['userResources', 'plannerResources', 'mixedContentToArray', '$scope', '$location', '$routeParams', controller]);
}());
