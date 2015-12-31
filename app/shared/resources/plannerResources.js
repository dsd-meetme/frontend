(function(){

    var service = function($resource){
        var plannerManagedMeetings = $resource('http://api.plunner.com/employees/planners/groups/:groupId', null, {
            'update' : {
                method : 'PUT'
            }
        });
        var plannerMeetings = $resource('http://api.plunner.com/employees/planners/groups/:groupId/meetings/:meetingId', null, {
            'update' : {
                method : 'PUT'
            }
        });
        var plannerManagedMeetingsTimeslots = $resource('http://api.plunner.com/employees/planners/groups/:groupId/meetings/:meetingId/timeslots/:timeslotId', null, {
            'update' : {
                method : 'PUT'
            }
        });

        return {
            plannerManagedMeetings : plannerManagedMeetings,
            plannerManagedMeetingsTimeslots : plannerManagedMeetingsTimeslots,
            plannerMeetings : plannerMeetings
        }
    };

    var app = angular.module('Plunner');
    app.factory('plannerResources',['$resource', service]);




}());