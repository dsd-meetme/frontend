(function () {

    var controller = function (userResources, plannerResources, mixedContentToArray, $scope, $location, $routeParams) {
        var mode = 'c';
        var changedEvents = [];
        var calendar;
        var selectDay = function () {
            var date = moment();
            date.utc();
            var day = date.day();
            if (day <= 6 ) {
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
        var startTime;

        var getUserInfo = function () {
            userResources.userInfo.get()
                .$promise.then(function (response) {
                    c.userInfo.is_planner = response.is_planner
                });
        };
        var c = this;
        var getMeetings = function () {
            var meeting;
            if(mode === 'w'){
                plannerResources.plannerManagedMeetings.query({current: 1})
                    .$promise.then(function (response) {
                        console.log(response);
                        for(var i= 0; i<response.length; i++){
                            for (var j = 0; j < response[i].meetings.length; j++) {
                                meeting = response[i].meetings[j];
                                if (meeting.id === c.meetingId) {
                                    c.startTime = meeting.start_time;
                                    startTime = meeting.start_time;
                                    break;
                                }
                            }
                        }

                        if(startTime){
                            c.showEmptyState = true;
                        }
                    });
            }

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
                if (!startTime) {
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
            }
            else {
                if (window.innerWidth <= 768) {
                    c.calendarConfig.defaultView = 'agendaDay';
                }
                console.log('entro qui');
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
            var events;
            if (!c.showEmptyState) {
                events = calendar.fullCalendar('clientEvents');
            }
            else {
                events = [];
            }

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
                processedEvents = backendEventAdapter(events, true);
                if (mode === 'c') {
                    console.log(processedEvents);
                    c.confirmPopup.message = "Creating meeting";
                    c.confirmPopup.show();
                    plannerResources.plannerMeetings.save({groupId: c.selectedGroup, meetingId: ''}, jQuery.param({
                        title: this.title,
                        description: this.description,
                        duration: (this.duration * 60)
                    })).$promise.then(function (response) {
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
                                            //$location.path('/user');
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
                            if (!startTime) {
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
        getMeetings();
        c.getTimeslots();
        c.getGroups();
        c.getInfo();


    };

    var app = angular.module('Plunner');
    app.controller('nmController', ['userResources', 'plannerResources', 'mixedContentToArray', '$scope', '$location', '$routeParams', controller]);
}());
