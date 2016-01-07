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
                }, function(){
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
                }, function(){
                    c.confirmPopup.hide();
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
