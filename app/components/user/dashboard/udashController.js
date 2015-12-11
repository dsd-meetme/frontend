(function(){
  /**
  An controller to manage the actions that can be accomplished by a plunner organization
  @author Giorgio Pea
  @param logoutService A service used to manage the logout of a plunner's organization
  **/
  var controller = function($scope,dataPublisher, mixedContentToArray){
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
    c.saveSchedule = function(){
      console.log(calendar.fullCalendar('clientEvents'));
    }
    c.importSchedule = {
      calendars : [],
      errors : [],
      invalidFields : {
        urlRequired : false,
        urlValid : false,
        usernameRequired : false,
        passwordRequired : false
      },
      showLoader : false,
      getCalendars : function(){
        var form = $scope.importScheduleForm;
        this.invalidFields.urlRequired = form.url.$error.required;
        this.invalidFields.urlVal = form.url.$error.url;
        this.invalidFields.usernameRequired = form.username.$error.required;
        this.invalidFields.passwordRequired = form.password.$error.required;
        if(!form.$invalid){
          this.showLoader = true;
          dataPublisher.publish("http://api.plunner.com/employees/calendars/calendars", {
            url : this.url,
            username : this.username,
            password : this.password
          })
          .then(function(response){
            c.importSchedule.calendars = response.data;
            this.showLoader = false;
          },function(response){
            c.importSchedule.showLoader = false;
            if(response.status === 422){
              mixedContentToArray.process(response.data, c.importSchedule.errors,true);
            }
          })
        }

      }
    }
    //var calendar = jQuery('#calendar').fullCalendar();
  };

  var app = angular.module('Plunner');
  app.controller('udashController',controller);
}())
