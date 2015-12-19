(function(){

    var controller = function(orgResources, mixedContentToArray, $routeParams, $timeout, $location){

        var calendar;
        var mode = 1;
        var c = this;
        c.events = [];
        c.eventRemoveId = [2];
        c.errors = [];
        c.invalidFields = {
            nameReq : false,
            eventsReq: false
        };
        c.confirmPopup = {
            message : '',
            show : function(){
                jQuery('#confirmPopup').modal('show');
            },
            hide : function(){
                jQuery('#confirmPopup').modal('hide');
            }
        };
        c.thereErrors = false;
        c.processUrl = function(){
            if($routeParams.type.length === 1 && $routeParams.type === '_'){
                mode = 1;
            }
            else{
                mode = 0;
                var urlParams = $routeParams.type.split('&');
                this.id = urlParams[0];
                this.name = urlParams[1];
                this.enabled = urlParams[2];
            }
        };
        c.getTimeslots = function(){
            var splittedTimeStart, splittedTimeEnd;
            if(mode === 0){
                orgResources.timeslot().query({calendarId : this.id, timeslotId : ''})
                    .$promise.then(function(response){
                        console.log('Timeslots');
                        console.log(response);
                        for(var i=0; i<response.length; i++){
                            splittedTimeStart = response[i].time_start.split(' ');
                            splittedTimeEnd = response[i].time_end.split(' ');
                            c.events.push({
                                title: '',
                                start: splittedTimeStart[0]+'T'+splittedTimeStart[1],
                                end: splittedTimeEnd[0]+'T'+splittedTimeEnd[1],
                                specificId: response[i].id
                            });
                        }
                        console.log('events');
                        console.log(c.events);
                        calendar =  jQuery('#composeScheduleCal').fullCalendar(c.calendarConfig);
                    })
            }
            else{
                calendar =  jQuery('#composeScheduleCal').fullCalendar(c.calendarConfig);
            }

        };

        c.removeTimeslot = function(id){
            orgResources.timeslot().remove({calendarId : this.id, timeslotId : id}).$promise
                .then(function(){
                    alert('evviva');
                })
        };

        c.saveSchedule = function(){
            var processedEvents = [];
            var events = calendar.fullCalendar('clientEvents');
            console.log('Events');
            console.log(events);
            this.invalidFields.nameReq = (c.name === '' || c.name === undefined);
            this.invalidFields.eventsReq = (events.length === 0);
            this.thereErrors = this.invalidFields.nameReq || this.invalidFields.eventsReq;
            if(!this.thereErrors){
                var enabled;
                if(this.enabled === true){
                    enabled = '1'
                }
                else{
                    enabled = '0'
                }
                for(var i=0; i<events.length; i++){
                    processedEvents.push({
                        time_start : events[i]._start._d.toISOString().split('.')[0].replace('T', ' '),
                        time_end : events[i]._end._d.toISOString().split('.')[0].replace('T', ' ')
                    })
                }
                if(mode === 1){
                    orgResources.calendar().save({calendarId: ''},jQuery.param({
                        name : this.name,
                        enabled : enabled
                    })).$promise.then(function(response){
                            for(i= 0; i<processedEvents.length; i++){
                                orgResources.timeslot().save({calendarId: response.id, timeslotId : ''},
                                    jQuery.param(processedEvents[i])).$promise.then(function(response){
                                        if(i === processedEvents.length) {
                                            c.confirmPopup.message = "Schedule successfully created";
                                            c.confirmPopup.show();

                                            $timeout(function(){
                                                c.confirmPopup.hide();
                                                $location.path('/user');
                                            },2000)
                                        }

                                    });
                            }
                        })
                }
                else{
                    orgResources.calendar().update({calendarId: this.id},jQuery.param({
                        name : this.name,
                        enabled : enabled
                    })).$promise.then(function(response){
                            for(var i= 0; i<events.length; i++){
                                orgResources.timeslot().save({calendarId: response.id, timeslotId : ''},
                                    jQuery.param(processedEvents[i])).$promise.then(function(response){
                                        if(i === processedEvents.length) {
                                            c.confirmPopup.message = "Schedule successfully saved";
                                            c.confirmPopup.show();

                                            $timeout(function(){
                                                c.confirmPopup.hide();
                                                $location.path('/user');
                                            },2000)
                                        }
                                    });
                                //}

                            }
                        })
                }

            }
        };
        c.calendarConfig = {
            customButtons : {
                saveBtn : {
                    text : 'Save schedule',
                    click : function(){
                        c.saveSchedule();
                    }
                },
                deleteBtn : {
                    text: 'Delete event',
                    click : function(){
                        if(c.eventRemoveId.length !== 0){
                            if(mode === 0){
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
            editable : true,
            selectable: true,
            selectHelper : true,
            eventClick: function(calEvent, jsEvent, view){
                jQuery('.fc-deleteBtn-button').show();
                c.eventRemoveId = {
                    one : calEvent._id,
                    two : calEvent.specificId
                };
            },
            select: function (start, end, jsEvent, view) {
                calendar.fullCalendar('renderEvent',
                    {
                        start: start,
                        end: end
                    },
                    true // make the event "stick"
                );
                calendar.fullCalendar('unselect');
            }
        };
        c.processUrl();
        c.getTimeslots();
    };
    var app = angular.module('Plunner');
    app.controller('cschedController',controller);

}());
