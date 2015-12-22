(function () {

    var controller = function (orgResources, $timeout, mixedContentToArray, $scope, $location, $routeParams) {
        var mode = 1;
        var changedEvents = [];
        var calendar;
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
                for (key in events) {
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
        c.dataCopy = {};
        c.processUrl = function () {
            if ($routeParams.type.length === 1 && $routeParams.type === '_') {
                mode = 1;
            }
            else {
                mode = 0;
                var urlParams = $routeParams.type.split('&');
                this.groupId = urlParams[0];
                this.meetingId = urlParams[1];
            }
        };
        c.getInfo = function () {
            orgResources.meetings().get({groupId: this.groupId, meetingsId: this.meetingId})
                .$promise.then(function (response) {
                    console.log(response);
                    c.data = response;
                    c.title = response.title;
                    c.description = response.description;
                    c.duration = parseInt(response.duration)/60;
                })
        };
        c.getTimeslots = function () {
            var splittedTimeStart, splittedTimeEnd;
            if (mode === 0) {
                c.getInfo();
                orgResources.plannerTimeslots().query({
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
                        calendar = jQuery('#meetingTimeslots').fullCalendar(c.calendarConfig);
                    })
            }
            else {
                calendar = jQuery('#meetingTimeslots').fullCalendar(c.calendarConfig);
            }
        };
        c.removeTimeslot = function (id) {
            orgResources.plannerTimeslots().remove({
                groupId: this.groupId,
                meetingId: this.meetingId,
                timeslotId: id
            }).$promise
                .then(function () {
                    alert('evviva');
                })
        };
        c.calendarConfig = {
            customButtons: {
                saveBtn: {
                    text: 'Save schedule',
                    click: function () {
                        c.saveSchedule();
                    }
                },
                deleteBtn: {
                    text: 'Delete event',
                    click: function () {
                        if (c.eventRemoveId.length !== 0) {
                            if (mode === 0) {
                                c.removeTimeslot(c.eventRemoveId.two);
                            }
                            calendar.fullCalendar('removeEvents', c.eventRemoveId.one);
                            jQuery('.fc-deleteBtn-button').removeAttr('style');
                            c.eventRemoveId = {};
                        }
                    }
                }
            },
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
            eventClick: function (calEvent, jsEvent, view) {
                jQuery('.fc-deleteBtn-button').show();
                c.eventRemoveId = {
                    one: calEvent._id,
                    two: calEvent.specificId
                };
            },
            select: function (start, end, jsEvent, view) {
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
            eventResize: function (event, delta, revertFunc, jsEvent, ui, view) {
                //changedEvents[event._id] = event;
                console.log(event.new !== true);
                if (event.new !== true) {
                    changedEvents[event._id] = event;
                }
            },
            eventDrop: function (event, delta, revertFunc, jsEvent, ui, view) {
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
                jQuery('#confirmPopup').modal('show');
            },
            hide: function () {
                jQuery('#confirmPopup').modal('hide');
            }
        };
        c.submit = function () {
            var form = $scope.meetingInfoForm;
            var newEvents, modifiedEvents = [];
            var alsoEditEvents = false;
            var events = calendar.fullCalendar('clientEvents');
            var minEventDuration;
            var processedEvents;
            this.invalidFields.nameReq = form.title.$error.required;
            this.invalidFields.descriptionReq = form.description.$error.required;
            this.invalidFields.durationReq = form.duration.$error.required;
            this.invalidFields.oneGroup = !angular.isDefined(this.selectedGroup);
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
            for (key in this.invalidFields) {
                if (this.invalidFields[key] === true) {
                    this.thereErrors = true;
                    break;
                }
            }
            this.thereErrors = form.$invalid || this.invalidFields.durationConflict || this.invalidFields.oneEventLeast
                || this.invalidFields.oneGroup;
            if (!this.thereErrors) {
                processedEvents = backendEventAdapter(events, true);
                if (mode === 1) {
                    orgResources.meetings().save({groupId: this.selectedGroup, meetingsId: ''}, jQuery.param({
                        title: this.title,
                        description: this.description,
                        duration: (this.duration * 60)
                    })).$promise.then(function (response) {
                            console.log(response);
                            for (var i = 0; i < processedEvents.length; i++) {
                                orgResources.timers().save({groupId: c.selectedGroup, meetingsId: response.id},
                                    jQuery.param(processedEvents[i])
                                ).$promise.then(function () {
                                        if (i === processedEvents.length) {
                                            c.confirmPopup.message = 'Meeting successfully planned';
                                            c.confirmPopup.show();
                                            $timeout(function () {
                                                c.confirmPopup.hide();
                                                $location.path('/user');
                                            }, 2000)
                                        }
                                    }, function (response) {
                                        mixedContentToArray.process(response.data, c.errors, true);
                                    })
                            }
                        }, function (response) {
                            mixedContentToArray.process(response.data, c.errors, true);
                        })
                }
                else {
                    newEvents = backendEventAdapter(checkNewEvents(events), true);
                    modifiedEvents = backendEventAdapter(changedEvents, false);

                    alsoEditEvents = modifiedEvents.length > 0;
                    for (var i = 0; i < newEvents.length; i++) {
                        orgResources.plannerTimeslots().save({
                                groupId: this.groupId,
                                meetingId: this.meetingId,
                                timeslotId: ''
                            },
                            jQuery.param(newEvents[i])).$promise.then(function (response) {
                                if (i === newEvents.length-1 && !alsoEditEvents) {
                                    c.confirmPopup.message = "Schedule successfully saved";
                                    c.confirmPopup.show();

                                    $timeout(function () {
                                        c.confirmPopup.hide();
                                        $location.path('/user');
                                    }, 2000)
                                }

                            });
                    }
                    for (i = 0; i < modifiedEvents[1].length; i++) {
                        orgResources.plannerTimeslots().update({
                                groupId: this.groupId,
                                meetingId: this.meetingId,
                                timeslotId: modifiedEvents[0][i]
                            },
                            jQuery.param(modifiedEvents[1][i])).$promise.then(function (response) {
                                if (i === modifiedEvents.length - 1) {
                                    c.confirmPopup.message = "Schedule successfully saved";
                                    c.confirmPopup.show();

                                    $timeout(function () {
                                        c.confirmPopup.hide();
                                        $location.path('/user');
                                    }, 2000)
                                }

                            });
                    }
                }

            }
        };
        c.getGroups = function () {
            orgResources.groupsplanner().query({groupId: ''}).$promise
                .then(function (response) {
                    c.groups = response;
                })
        };
        c.processUrl();
        c.getGroups();
        c.getTimeslots();

    };

    var app = angular.module('Plunner');
    app.controller('nmController', controller);
}());
