(function(){
  var controller = function(){
    var c = this;
    c.events = [
      { title: '',start : '2016-01-05T13:11:59', end : '2016-01-05T17:11:59'}
    ]
    c.calendarConfig = {
      customButtons : {
        saveBtn : {
          text : 'Save schedule',
          click : function(){
            c.saveSchedule();
          }
        }
      },
      header: {
        right: 'saveBtn, prev,next today'
      },
      defaultView: 'agendaWeek',
      events: c.events,
      editable : true,
      selectable: true,
      selectHelper : true,
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
  }
  var calendar = jQuery('#calendar').fullCalendar(c.calendarConfig);

  c.saveSchedule = function(){
    console.log(calendar.fullCalendar('clientEvents'));
  }



}
var app = angular.module('Plunner');
app.controller('cschedController',controller);

}())
