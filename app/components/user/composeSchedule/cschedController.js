(function(){
    var controller = function(orgResources){
        var c = this;
        c.events = [
            { title: '',start : '2016-01-05T13:11:59', end : '2016-01-05T17:11:59'}
        ];
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
            allDaySlot: false,
            header: {
                right: 'deleteBtn,saveBtn, prev,next today'
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
        var calendar = jQuery('#composeScheduleCal').fullCalendar(c.calendarConfig);

        c.saveSchedule = function(){
            var array = [];
            var events = calendar.fullCalendar('clientEvents');

            for(var i=0; i<events.length; i++){
                array.push({
                    time_start : events[i]._start._d.getTime(),
                    time_end : events[i]._end._d.getTime()
                })
            }
            console.log(array);
        };
        c.confirmPopup = {
            message : ''
        }


    }
    var app = angular.module('Plunner');
    app.controller('cschedController',controller);

}())
