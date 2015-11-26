(function(){

  var controller = function(){

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
      jQuery('#datepicker').datepicker(
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
              $('dinput').val( dateText );
            } else {
              d1 = $.datepicker.formatDate( 'mm/dd/yy', new Date(Math.min(prv,cur)), {} );
              d2 = $.datepicker.formatDate( 'mm/dd/yy', new Date(Math.max(prv,cur)), {} );
              $('#dinput').val( d1+' - '+d2 );
            }
          },
          onChangeMonthYear: function ( year, month, inst ) {
            //prv = cur = -1;
          },
          onAfterUpdate: function ( inst ) {
            $('<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" data-handler="hide" data-event="click">Done</button>')
            .appendTo($('#jrange div .ui-datepicker-buttonpane'))
            .on('click', function () { $('#datepicker div').hide(); });
          }
        });

      }
    }
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
      }
    };
    c.formGroupC = {
      data : {
        schedules = []
      }
    };
    c.formGroupD = {

    }


    var app = angular.module('Plunner');
    app.controller('nmController',controller);
  }())
