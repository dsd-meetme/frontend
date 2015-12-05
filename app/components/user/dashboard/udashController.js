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
    c.events = [];
    c.logout = function(){
        logoutService.logout('/usignin');
    }
    var calendar = jQuery('#calendar').fullCalendar({
    header: {
        //left: 'prev,next today',
        //center: 'title',
        right: 'prev,next today'
    },
    defaultView: 'agendaWeek',
    events: c.events,
    editable : true,
    selectable: true,
    selectHelper : true,
    select: function (start, end, jsEvent, view) {
      calendar.fullCalendar('renderEvent',
			{
          title : '',
					start: start,
					end: end
			},
			true // make the event "stick"
		  );
      calendar.fullCalendar('unselect');
    }
  });
  };

  var app = angular.module('Plunner');
  app.controller('udashController',controller);
}())
