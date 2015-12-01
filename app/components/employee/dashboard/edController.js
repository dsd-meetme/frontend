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
    c.logout = function(){
        logoutService.logout('/usignin');
    }
  };

  var app = angular.module('Plunner');
  app.controller('dashEmpController',controller);
}())
