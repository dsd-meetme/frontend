(function () {

    var controller = function (orgResources, mixedContentToArray, findObjectByProperty, $routeParams, $scope, $timeout, $location) {

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
        c.thereErrors = false;
        c.processUrl = function () {
            if ($routeParams.type.length === 1 && $routeParams.type === '_') {
                mode = 1;
            }
            else {
                mode = 0;
                var urlParams = $routeParams.type.split('&');
                this.id = urlParams[0];
                this.name = urlParams[1];
                this.enabled = urlParams[2];
            }
        };
        c.getTimeslots = function () {
            var splittedTimeStart, splittedTimeEnd;
            if (mode === 0) {
                orgResources.timeslot().query({calendarId: this.id, timeslotId: ''})
                    .$promise.then(function (response) {
                        console.log('Timeslots');
                        console.log(response);
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
                        calendar = jQuery('#composeScheduleCal').fullCalendar(c.calendarConfig);
                    })
            }
            else {
                calendar = jQuery('#composeScheduleCal').fullCalendar(c.calendarConfig);
            }

        };

        c.removeTimeslot = function (id) {
            orgResources.timeslot().remove({calendarId: this.id, timeslotId: id}).$promise
                .then(function () {
                    c.confirmPopup.message = 'Event succesfully deleted!';
                    c.confirmPopup.show();
                    $timeout(function () {
                        c.confirmPopup.hide();
                    }, 2000)
                })
        };

        c.saveSchedule = function () {
            var newEvents, modifiedEvents = [];
            var alsoEditEvents = false;
            var events = calendar.fullCalendar('clientEvents');
            var processedEvents = [];
            this.invalidFields.nameReq = (c.name === '' || c.name === undefined);
            this.invalidFields.eventsReq = (events.length === 0);
            this.thereErrors = this.invalidFields.nameReq || this.invalidFields.eventsReq;
            var enabled, index,index_one;
            index = 0;
            index_one = 0;
            if (!this.thereErrors) {

                if (this.selected === true) {
                    enabled = '1'
                }
                else {
                    enabled = '0'
                }
                if (mode === 1) {
                    processedEvents = backendEventAdapter(events, true);
                    orgResources.calendar().save({calendarId: ''}, jQuery.param({
                        name: this.name,
                        enabled: enabled
                    })).$promise.then(function (response) {
                            for (var i = 0; i < processedEvents.length; i++) {
                                orgResources.timeslot().save({calendarId: response.id, timeslotId: ''},
                                    jQuery.param(processedEvents[i])).$promise.then(function (response) {
                                        if (index === processedEvents.length - 1) {
                                            c.confirmPopup.message = "Schedule successfully created";
                                            c.confirmPopup.show();

                                            $timeout(function () {
                                                c.confirmPopup.hide();
                                                $location.path('/user');
                                            }, 2000)
                                        }
                                        index++;

                                    });
                            }
                        })
                }
                else {
                    index = 0;
                    if (c.selected === 'true') {
                        enabled = '1'
                    }
                    else {
                        enabled = '0'
                    }
                    processedEvents = backendEventAdapter(events, true);
                    newEvents = backendEventAdapter(checkNewEvents(events), true);
                    modifiedEvents = backendEventAdapter(changedEvents, false);
                    alsoEditEvents = modifiedEvents[1].length > 0;

                    orgResources.calendar().update({calendarId: this.id}, jQuery.param({
                        name: this.name,
                        enabled: enabled
                    })).$promise.then(function () {


                            for (var i = 0; i < newEvents.length; i++) {
                                orgResources.timeslot().save({calendarId: c.id, timeslotId: ''},
                                    jQuery.param(newEvents[i])).$promise.then(function (response) {
                                        if (index === newEvents.length - 1 && !alsoEditEvents) {
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
                                orgResources.timeslot().update({calendarId: c.id, timeslotId: modifiedEvents[0][i]},
                                    jQuery.param(modifiedEvents[1][i])).$promise.then(function (response) {
                                        if (index_one === modifiedEvents[1].length - 1 ) {
                                            c.confirmPopup.message = "Schedule successfully saved";
                                            c.confirmPopup.show();

                                            $timeout(function () {
                                                c.confirmPopup.hide();
                                                $location.path('/user');
                                            }, 2000)
                                        }
                                        index_one++;

                                    });
                            }
                            if(newEvents.length === 0 && modifiedEvents[1].length === 0 ){
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
    app.controller('cschedController', controller);

}());
