(function () {

    var controller = function (orgResources, $timeout, mixedContentToArray, $scope) {
        console.log(this);
        var c = this;
        c.events = [];
        c.calendarConfig = {
            allDaySlot: false,
            header: {
                right: 'prev,next today'
            },
            defaultView: 'agendaWeek',
            firstDay: 1,
            slotDuration: '00:15:00',
            events: c.events,
            editable : true,
            selectable: true,
            selectHelper : true,
            eventClick: function(calEvent, jsEvent, view){

                //jQuery('.fc-deleteBtn-button').show();
                //c.eventRemoveId = calEvent._id;
                //console.log(c.eventRemoveId);
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
        var calendar = jQuery('#meetingTimeslots').fullCalendar(c.calendarConfig);

        c.invalidFields = {
            nameReq : false,
            descriptionReq : false,
            durationReq: false,
            durationVal: false,
            durationLimit: false,
            oneEventLeast: false,
            durationConflict: false
        };
        c.selectedGroupAssign = function(id){
            this.selectedGroup = id;
        };
        c.errors = [];
        c.thereErrors = false;
        c.submit = function(){
            var form = $scope.meetingInfoForm;
            var processedEvents = [];

            var exp;
            this.events = calendar.fullCalendar('clientEvents');
            this.invalidFields.nameReq = form.title.$error.required;
            this.invalidFields.descriptionReq = form.description.$error.required;
            this.invalidFields.durationReq = form.duration.$error.required;
            console.log(this.duration);
            console.log(this.duration > 0 && this.duration <= 720);
            this.invalidFields.durationVal = form.duration.$error.number;
            this.invalidFields.durationLimit = !(this.duration > 15 && this.duration <= 300);
            this.invalidFields.oneEventLeast = this.events.length === 0;

            for(var i=0; i<this.events.length; i++){
               exp = (this.events[i]._end._d.getTime() - this.events[i]._start._d.getTime())/1000;
                if(exp < this.duration){
                    this.invalidFields.durationConflict = true;
                    break;
                }
                processedEvents.push({
                    time_start : this.events[i]._start._d.toISOString().split('.')[0].replace('T', ' '),
                    time_end : this.events[i]._end._d.toISOString().split('.')[0].replace('T', ' ')
                })
            }
            for(key in this.invalidFields){
                if(this.invalidFields[key] === true){
                    this.thereErrors = true;
                    break;
                }
            }
            console.log(this.selectedGroup);
            if(!form.$invalid && !this.invalidFields.oneEventLeast && !this.invalidFields.durationConflict){
                this.thereErrors = false;
                console.log(typeof(this.selectedGroup));
                orgResources.meetings().save({groupId: this.selectedGroup, meetingsId: ''},jQuery.param({
                    title : this.title,
                    description : this.description,
                    duration : (this.duration/15)
                })).$promise
                    .then(function(response){
                        console.log(response);
                        for(var i=0; i<processedEvents.length; i++){
                            orgResources.timers().save({groupId: c.selectedGroup, meetingsId: response.id},
                                jQuery.param(processedEvents[i])
                            ).$promise.then(function(){
                                    alert('Evviva');
                                })
                        }
                    })
            }
        };
        c.getGroups = function(){
            orgResources.groupsplanner().query({groupId : ''}).$promise
                .then(function(response){
                    c.groups = response;
                    console.log(response);
                })
        };

        c.getGroups();
























        /*var meetingDatepickerMgmt = function () {

            $.datepicker._defaults.onAfterUpdate = null;
            var datepicker__updateDatepicker = $.datepicker._updateDatepicker;
            $.datepicker._updateDatepicker = function (inst) {
                datepicker__updateDatepicker.call(this, inst);
                var onAfterUpdate = this._get(inst, 'onAfterUpdate');
                if (onAfterUpdate)
                    onAfterUpdate.apply((inst.input ? inst.input[0] : null),
                        [(inst.input ? inst.input.val() : ''), inst]);
            }

            var cur = -1, prv = -1;
            jQuery('#meetingDatepicker').datepicker(
                {
                    minDate: 0,
                    beforeShowDay: function (date) {
                        var now = new Date();
                        return [true, ( (date.getTime() >= Math.min(prv, cur) && date.getTime() <= Math.max(prv, cur) && date.getTime() > now.getTime()) ? 'date-range-selected' : '')];
                    },

                    onSelect: function (dateText, inst) {
                        var d1, d2;
                        prv = cur;
                        cur = (new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay)).getTime();
                        if (prv == -1 || prv == cur) {
                            prv = cur;
                            $('#meetingDatepickerInput').val(dateText);
                        } else {
                            d1 = $.datepicker.formatDate('mm/dd/yy', new Date(Math.min(prv, cur)), {});
                            d2 = $.datepicker.formatDate('mm/dd/yy', new Date(Math.max(prv, cur)), {});
                            $('#meetingDatepickerInput').val(d1 + ' - ' + d2);
                        }
                    },
                    onChangeMonthYear: function (year, month, inst) {
                        //prv = cur = -1;
                    }
                    /*onAfterUpdate: function ( inst ) {
                     $('<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" data-handler="hide" data-event="click">Done</button>')
                     .appendTo($('#jrange div .ui-datepicker-buttonpane'))
                     .on('click', function () { $('#meetingDatepicker div').hide(); });
                     }
                }
            );
        }

        var deadlineDatepickerMgmt = function () {
            jQuery('#deadlineDatepicker').datepicker();
        }
        meetingDatepickerMgmt();
        deadlineDatepickerMgmt();
        c.formGroupA = {
            invalidFields: {
                titleReq: false,
            },
            data: {
                title: '',
                desc: '',
                meetingPlace: '',
                exportDate: ''
            }
        };
        c.formGroupB = {
            showDlDatepicker: function () {
                this.dlDatepickerVisibility = true;
            },
            dlDatepickerVisibility: false,
            data: {
                deadline: '',
                meetingRange: ''
            },
            invalidFields: {
                range: false
            }
        };
        c.formGroupC = {
            data: {
                partecipants: []
            },
            invalidPartecipants: {
                number: false,
                required: false
            }
        };
        c.formGroupD = {
            data: {
                schedules: []
            },
            invalidFields: {
                notimeslots: false
            }
        };
        c.formGroupE = {
            data: {
                timeSlots: ''
            }
        }
        c.submit = function () {
            c.formGroupA.invalidFields.titleReq = $scope.formGroupA.title.$error.required;
            var starMeetingDate = formGroupB.data.meetingRange.split(' - ')[0]
            var endingDate = formGroupB.data.meetingRange.split(' - ')[1];
            var counter = 0;
            var requiredCounter = 0;
            var invalidPartecipants, invalidSchedules;
            angular.forEach(c.formGroupC.data.partecipants, function (value, key) {
                if (value.excluded === true) {
                    counter++;
                }
                if (value.required === true) {
                    requiredCounter++
                }
            })
            if (counter > 0) {
                invalidPartecipants = false;
                if (requiredCounter > 0) {
                    invalidPartecipants = false;
                }
                else {
                    c.formGroupC.invalidPartecipants.required = true;
                    invalidPartecipants = true;
                }

            }
            else {
                c.formGroupC.invalidPartecipants.number = true;
                invalidPartecipants = true;
            }
            if (c.formGroupD.data.schedules.length === 0) {
                if (c.formGroupE.data.timeSlots === 'YES') {
                    c.formGroupD.invalidFields.
                        invalidSchedules = true
                }
                else {
                    c.formGroupD.invalidFields.notimeslots = true;
                }
            }
            if (starMeetingDate !== endingDate && !angular.isUndefined(endingDate) && !formGroupA.$invalid && !invalidPartecipants) {
                //
            }
        }*/
    };

    var app = angular.module('Plunner');
    app.controller('nmController', controller);
}())
