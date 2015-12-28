(function(){
    //A service that returns resource objects that encapsulate the restful communication logic relative
    //to groups, employees and others
    var service = function($resource){
        var userResource = $resource('http://api.plunner.com/companies/employees/:userId',null,{
            'update' : {
                method : 'PUT'
            }
        });
        var orgInfo = $resource('http://api.plunner.com/companies/company',null, {
            'update' : {
                method : 'PUT'
            }
        });
        var groupResource = $resource('http://api.plunner.com/companies/groups/:groupId',null, {
            'update' : {
                method : 'PUT'
            }
        });
        var userWithinGroup = $resource('http://api.plunner.com/companies/groups/:groupId/employees/:userId',null, {
            'update' : {
                method : 'PUT'
            },
            'save' : {
                method : 'POST',
                isArray : true
            },
            'remove' : {
                method : 'DELETE',
                isArray : true
            }
        });
        var planner = $resource('http://api.plunner.com/companies/groups/:groupId/planners/:plannerId',null, {
            'update' : {
                method : 'PUT'
            },
            'remove' : {
                method : 'DELETE',
                isArray : true
            }
        });
        var company = $resource('http://api.plunner.com/companies/example', null, {
            'update' : {
                method : 'PUT'
            },
            'remove' : {
                method : 'DELETE',
                isArray : true
            }
        });
        var empGroups = $resource('http://api.plunner.com/employees/groups',null);
        var meetingsEmp = $resource('http://api.plunner.com/employees/meetings/:meetingId', null);

        var calendar = $resource('http://api.plunner.com/employees/calendars/:calendarId',null, {
            'update' : {
                method : 'PUT'
            }
        });
        var timeslot = $resource('http://api.plunner.com/employees/calendars/:calendarId/timeslots/:timeslotId', null, {
            'update' : {
                method : 'PUT'
            }
        });
        var meetings = $resource('http://api.plunner.com/employees/planners/groups/:groupId/meetings/:meetingsId', null, {
            'update' : {
                method : 'PUT'
            }
        });
        var timers = $resource('http://api.plunner.com/employees/planners/groups/:groupId/meetings/:meetingsId/timeslots', null);
        var groupsPlanner = $resource('http://api.plunner.com/employees/planners/groups/:groupId', null, {
            'update' : {
                method : 'PUT'
            }
        });
        var plannerTimeslots = $resource('http://api.plunner.com/employees/planners/groups/:groupId/meetings/:meetingId/timeslots/:timeslotId', null, {
            'update' : {
                method : 'PUT'
            }
        });
        var employee = $resource('http://api.plunner.com/employees/employee', null, {
            'update' : {
                method : 'PUT'
            }
        });
        var managedMeetings = $resource('http://api.plunner.com/employees/planners/groups', null, {
            'update' : {
                method : 'PUT'
            }
        });
        return {
            user : function(){
                return userResource;
            },
            group : function(){
                return groupResource;
            },
            userInGroup : function(){
                return userWithinGroup;
            },
            planner : function(){
                return planner;
            },
            calendar : function(){
                return calendar;
            },
            empGroups : function(){
                return empGroups;
            },
            timeslot : function(){
                return timeslot;
            },
            meetings : function(){
                return meetings;
            },
            groupsplanner: function(){
                return groupsPlanner;
            },
            meetingsEmp : function(){
                return meetingsEmp;
            },
            timers : function(){
                return timers;
            },
            plannerTimeslots : function(){
                return plannerTimeslots;
            },
            employee : function(){
                return employee;
            },
            managedMeetings : function(){
                return managedMeetings;
            },
            orgInfo : function(){
              return orgInfo;
            }
        }
    };
    var app = angular.module('Plunner');
    app.factory('orgResources', service);
}());
