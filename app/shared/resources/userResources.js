(function(){

    var service = function($resource){
        var userGroups = $resource('http://api.plunner.com/employees/groups',null);
        var userPlannedMeetings = $resource('http://api.plunner.com/employees/meetings/:meetingId', null);
        var userSchedule = $resource('http://api.plunner.com/employees/calendars/:calendarId',null, {
            'update' : {
                method : 'PUT'
            }
        });
        var userScheduleTimeslots = $resource('http://api.plunner.com/employees/calendars/:calendarId/timeslots/:timeslotId', null, {
            'update' : {
                method : 'PUT'
            }
        });
        var userInfo = $resource('http://api.plunner.com/employees/employee', null, {
            'update' : {
                method : 'PUT'
            }
        });

        return {
            userGroups : userGroups,
            userPlannedMeetings : userPlannedMeetings,
            userSchedule : userSchedule,
            userScheduleTimeslots : userScheduleTimeslots,
            userInfo : userInfo
        }

    };

    var app = angular.module('Plunner');
    app.factory('userResources',['$resource', service]);

}());