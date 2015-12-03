(function(){

  var controller = function(){
    console.log(this);
    var c = this;
    var meetingDatepickerMgmt = function(){

      $.datepicker._defaults.onAfterUpdate = null;
      var datepicker__updateDatepicker = $.datepicker._updateDatepicker;
      $.datepicker._updateDatepicker = function( inst ) {
        datepicker__updateDatepicker.call( this, inst );
        var onAfterUpdate = this._get(inst, 'onAfterUpdate');
        if (onAfterUpdate)
        onAfterUpdate.apply((inst.input ? inst.input[0] : null),
        [(inst.input ? inst.input.val() : ''), inst]);
      }

      var cur = -1, prv = -1;
      jQuery('#meetingDatepicker').datepicker(
        {
          beforeShowDay: function ( date ) {
            return [true, ( (date.getTime() >= Math.min(prv, cur) && date.getTime() <= Math.max(prv, cur)) ? 'date-range-selected' : '')];
          },

          onSelect: function ( dateText, inst ) {
            var d1, d2;
            prv = cur;
            cur = (new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay)).getTime();
            if ( prv == -1 || prv == cur ) {
              prv = cur;
              $('#meetingDatepickerInput').val( dateText );
            } else {
              d1 = $.datepicker.formatDate( 'mm/dd/yy', new Date(Math.min(prv,cur)), {} );
              d2 = $.datepicker.formatDate( 'mm/dd/yy', new Date(Math.max(prv,cur)), {} );
              $('#meetingDatepickerInput').val( d1+' - '+d2 );
            }
          },
          onChangeMonthYear: function ( year, month, inst ) {
            //prv = cur = -1;
          }
          /*onAfterUpdate: function ( inst ) {
          $('<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" data-handler="hide" data-event="click">Done</button>')
          .appendTo($('#jrange div .ui-datepicker-buttonpane'))
          .on('click', function () { $('#meetingDatepicker div').hide(); });
        }*/
        }
      );
    }

    var deadlineDatepickerMgmt = function(){
      jQuery('#deadlineDatepicker').datepicker();
    }
    meetingDatepickerMgmt();
    deadlineDatepickerMgmt();
    c.formGroupA = {
      invalidFields : {
        titleReq : false,
      },
      data : {
        title : '',
        desc : '',
        meetingPlace : '',
        exportDate : ''
      }
    };
    c.formGroupB = {
      showDlDatepicker : function(){
        this.dlDatepickerVisibility = true;
      },
      dlDatepickerVisibility : false,
      data : {
        deadline : '',
        meetingRange : ''
      },
      invalidFields : {
        range : false
      }
    };
    c.formGroupC = {
      data : {
        partecipants : []
      },
      invalidPartecipants : {
        number : false,
        required : false
      }
    };
    c.formGroupD = {
      data : {
        schedules : []
      },
      invalidFields : {
        notimeslots : false
      }
    };
    c.formGroupE = {
      data : {
        timeSlots : ''
      }
    }
    c.submit = function(){
      c.formGroupA.invalidFields.titleReq = $scope.formGroupA.title.$error.required;
      var starMeetingDate = formGroupB.data.meetingRange.split(' - ')[0]
      var endingDate = formGroupB.data.meetingRange.split(' - ')[1];
      var counter = 0;
      var requiredCounter = 0;
      var invalidPartecipants, invalidSchedules;
      angular.forEach(c.formGroupC.data.partecipants, function(value, key){
        if(value.excluded === true){
          counter++;
        }
        if(value.required === true){
          requiredCounter++
        }
      })
      if(counter > 0){
        invalidPartecipants = false;
        if(requiredCounter > 0){
          invalidPartecipants = false;
        }
        else{
          c.formGroupC.invalidPartecipants.required = true;
          invalidPartecipants = true;
        }

      }
      else{
        c.formGroupC.invalidPartecipants.number = true;
        invalidPartecipants = true;
      }
      if(c.formGroupD.data.schedules.length === 0){
        if(c.formGroupE.data.timeSlots === 'YES'){
          c.formGroupD.invalidFields.
          invalidSchedules = true
        }
        else{
          c.formGroupD.invalidFields.notimeslots = true;
        }
      }
      if(starMeetingDate !== endingDate && !angular.isUndefined(endingDate) && !formGroupA.$invalid && !invalidPartecipants){
        //
      }
    }
  }

  var app = angular.module('Plunner');
  app.controller('nmController',controller);
}())
