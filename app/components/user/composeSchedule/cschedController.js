(function(){
    var controller = function(orgResources, mixedContentToArray, $routeParams, $timeout, $location){
        var c = this;
        var mode = 1;
        console.log($routeParams);
        c.events = [];
        var calendar;
        c.processUrl = function(){
            if($routeParams.type.length === 1 && $routeParams.type === '_'){
                mode = 1;
            }
            else{
                mode = 0;
                var a = $routeParams.type.split('&');
                this.id = a[0];
                this.name = a[1];
                this.enabled = a[2];
            }
        };
        c.getTimeslots = function(){
            var split, splito;
            if(mode === 0){
                orgResources.timeslot().query({calendarId : this.id, timeslotId : ''}).$promise
                    .then(function(response){
                        console.log(response);
                        for(var i=0; i<response.length; i++){
                            split = response[i].time_start.split(' ');
                            splito = response[i].time_end.split(' ');
                            c.events.push({
                                title: '',
                                start: split[0]+'T'+split[1],
                                end: splito[0]+'T'+splito[1]
                            });
                            //console.log(c.events);
                        }
                        calendar =  jQuery('#composeScheduleCal').fullCalendar(c.calendarConfig);
                    })
            }
            else{
                calendar =  jQuery('#composeScheduleCal').fullCalendar(c.calendarConfig);
            }

        };
        c.eventRemoveId = '';
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
                        if(c.eventRemoveId !== ''){
                            calendar.fullCalendar('removeEvents', c.eventRemoveId);
                            jQuery('.fc-deleteBtn-button').removeAttr('style');
                            c.eventRemoveId = '';
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

            events: c.events,
            editable : true,
            selectable: true,
            selectHelper : true,
            eventClick: function(calEvent, jsEvent, view){

                jQuery('.fc-deleteBtn-button').show();
                c.eventRemoveId = calEvent._id;
                console.log(c.eventRemoveId);
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


        c.errors = [];
        c.invalidFields = {
            nameReq : false,
            eventsReq: false
        };
        c.confirmPopup = {
            message : ''
        }
        c.thereErrors = false;
        c.saveSchedule = function(){
            var array = [];
            var events = calendar.fullCalendar('clientEvents');
            console.log(events);

            this.invalidFields.nameReq = (c.name === '' || c.name === undefined);
            this.invalidFields.eventsReq = (events.length === 0);

            console.log(c.name);
            if(this.invalidFields.nameReq || this.invalidFields.eventsReq){
                this.thereErrors = true;
            }
            if(!this.invalidFields.nameReq && !this.invalidFields.eventsReq){
                this.thereErrors = false;
                var enabled;
                if(this.enabled){
                    enabled = '1'
                }
                else{
                    enabled = '0'
                }
                for(var i=0; i<events.length; i++){
                    array.push({
                        time_start : events[i]._start._d.toISOString().split('.')[0].replace('T', ' '),
                        time_end : events[i]._end._d.toISOString().split('.')[0].replace('T', ' ')
                    })
                }
                if(mode === 1){
                    console.log('entro nuovo');
                    orgResources.calendar().save({calendarId: ''},jQuery.param({
                        name : this.name,
                        enabled : enabled
                    })).$promise.then(function(response){
                            for(i= 0; i<array.length; i++){
                                orgResources.timeslot().save({calendarId: response.id, timeslotId : ''},
                                    jQuery.param(array[i])).$promise.then(function(response){
                                        if(i === array.length) {
                                            c.confirmPopup.message = "Schedule successfully created";
                                            jQuery('#confirmPopup').modal('show');

                                            $timeout(function(){
                                                jQuery('#confirmPopup').modal('hide');
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
                                    jQuery.param(array[i])).$promise.then(function(response){
                                        console.log('evviva')
                                    });
                                //}

                            }
                        })
                }

            }

            console.log(array);
        };
        c.confirmPopup = {
            message : ''
        }

        c.processUrl();
        c.getTimeslots();
    };
    var app = angular.module('Plunner');
    app.controller('cschedController',controller);

}())
