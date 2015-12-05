(function(){
  /**
  An controller to manage the actions that can be accomplished by a plunner organization
  @author Giorgio Pea
  @param logoutService A service used to manage the logout of a plunner's organization
  **/
  var controller = function(logoutService){
    var c = this;
    c.errors = {
      unauthorized : false,
      forbidden : false
    };
    c.meetingsList = {
      groupA : {
        isVisible : true,
        data : null,
        show : function(){
          this.isVisible = true;
          c.meetingsList.groupB.isVisible = false;
        }
      },
      groupB : {
        isVisible : false,
        data : null,
        show : function(){
          this.isVisible = true;
          c.meetingsList.groupA.isVisible = false;
        }
      }
    };
    c.schedulesList = {
      groupA : {
        isVisible : true,
        data : null,
        show : function(){
          this.isVisible = true;
          c.schedulesList.groupB.isVisible = false;
        }
      },
      groupB : {
        isVisible : false,
        data : null,
        show : function(){
          this.isVisible = true;
          c.schedulesList.groupA.isVisible = false;
        }
      },
    };
    c.logout = function(){
        logoutService.logout('/usignin');
    }
    jQuery('#calendar').fullCalendar({
      header: {
        center: 'prev,next,today',
        right: 'month,agendaWeek,agendaDay'
      },

      events: [
        {
            title  : 'event1',
            start  : '2016-01-01',
            editable : true
        },
        {
            title  : 'event2',
            start  : '2016-01-05',
        },
        {
            title  : 'event3',
            start  : '2016-01-09T12:30:00',
            allDay : false // will make the time show
        }
    ]})
  };

  var app = angular.module('Plunner');
  app.controller('udashController',controller);
}())
