(function () {
    //A service that returns resource objects that encapsulate the restful communication logic relative
    //to a planner
    var service = function ($resource, configService) {

        var apiDomain = configService.apiDomain;

        var plannerManagedMeetings = $resource(apiDomain + '/employees/planners/groups/:groupId', null, {
            'update': {
                method: 'PUT'
            }
        });

        var plannerMeetings = $resource(apiDomain + '/employees/planners/groups/:groupId/meetings/:meetingId', null, {
            'update': {
                method: 'PUT'
            }
        });

        var plannerManagedMeetingsTimeslots = $resource(apiDomain + '/employees/planners/groups/:groupId/meetings/:meetingId/timeslots/:timeslotId', null, {
            'update': {
                method: 'PUT'
            }
        });

        return {
            plannerManagedMeetings: plannerManagedMeetings,
            plannerManagedMeetingsTimeslots: plannerManagedMeetingsTimeslots,
            plannerMeetings: plannerMeetings
        }
    };

    var app = angular.module('Plunner');
    app.factory('plannerResources', ['$resource', 'configService', service]);


}());