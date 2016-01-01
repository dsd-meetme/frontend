(function () {
    //A service that returns resource objects that encapsulate the restful communication logic relative
    //to a user
    var service = function ($resource, configService) {

        var apiDomain = configService.apiDomain;

        var userGroups = $resource(apiDomain + '/employees/groups', null);

        var userPlannedMeetings = $resource(apiDomain + '/employees/meetings/:meetingId', null);

        var userSchedule = $resource(apiDomain + '/employees/calendars/:calendarId', null, {
            'update': {
                method: 'PUT'
            }
        });

        var userScheduleTimeslots = $resource(apiDomain + '/employees/calendars/:calendarId/timeslots/:timeslotId', null, {
            'update': {
                method: 'PUT'
            }
        });

        var userInfo = $resource(apiDomain + '/employees/employee', null, {
            'update': {
                method: 'PUT'
            }
        });

        return {
            userGroups: userGroups,
            userPlannedMeetings: userPlannedMeetings,
            userSchedule: userSchedule,
            userScheduleTimeslots: userScheduleTimeslots,
            userInfo: userInfo
        }

    };

    var app = angular.module('Plunner');
    app.factory('userResources', ['$resource', 'configService', service]);

}());