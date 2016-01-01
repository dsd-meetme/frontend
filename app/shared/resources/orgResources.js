(function () {
    //A service that returns resource objects that encapsulate the restful communication logic relative
    //to an organization
    var service = function ($resource, configService) {

        var apiDomain = configService.apiDomain;

        var orgUser = $resource(apiDomain + '/companies/employees/:userId', null, {
            'update': {
                method: 'PUT'
            }
        });
        var orgInfo = $resource(apiDomain + '/companies/company', null, {
            'update': {
                method: 'PUT'
            }
        });
        var orgGroup = $resource(apiDomain + '/companies/groups/:groupId', null, {
            'update': {
                method: 'PUT'
            }
        });
        var orgUserInGroup = $resource(apiDomain + '/companies/groups/:groupId/employees/:userId', null, {
            'update': {
                method: 'PUT'
            },
            'save': {
                method: 'POST',
                isArray: true
            },
            'remove': {
                method: 'DELETE',
                isArray: true
            }
        });

        return {

            orgUserInGroup: orgUserInGroup,
            orgInfo: orgInfo,
            orgUser: orgUser,
            orgGroup: orgGroup

        }
    };
    var app = angular.module('Plunner');
    app.factory('orgResources', ['$resource', 'configService', service]);
}());
