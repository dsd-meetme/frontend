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
(function () {
    /**
     * A service that performs an http POST request given a url and some data
     * @param $http Angular's http service
     * @returns {{publish: Function}} A method that executes an http POST request given a url and some data
     */
    var service = function ($http) {
        /**
         * Executes a http POST request given an url and some data
         * @param url The url that is the target of the http POST request to be executed
         * @param data The data to be sent to the specified url using the POST request to be executed
         * @returns {*}
         */
        var publish = function (url, data) {
            return $http({
                method: 'POST',
                url: url,
                data: jQuery.param(data)
            })
        };
        return {
            publish: publish
        }

    };

    var app = angular.module('Plunner');
    app.factory('dataPublisher', service);
}());

(function(){
  //A service that manages the logout of an organization or an employee
  var service = function($location,$cookies){
    return {
      logout : function(url){
        function InvalidArgumentException(msg,argumentIndex){
          this.message = msg;
          this.argumentIndex = argumentIndex;
        }
        if(!angular.isString(url)){
          throw new InvalidArgumentException("This method's unique argument must be a string",0);

        }
        else{
          $cookies.remove('auth_token');
          $location.path(url);
        }
      }
    }
  };

  var app = angular.module('Plunner');
  app.factory('logoutService',service);
}());

(function () {
    var service = function () {

        var process = function(name, array){

            function InvalidArgumentException(msg, argumentIndex) {
                this.message = msg;
                this.argumentIndex = argumentIndex;
            }

            if (!angular.isString(name) || name === '') {
                throw new InvalidArgumentException("This method's first argument must be a non empty string", 0);
            }
            else if (!angular.isArray(array)) {
                throw new InvalidArgumentException("This method's second argument must be an array", 1)
            }

            else {
                var string = name + '[0]=' + array[0];
                for (var i = 1; i < array.length; i++) {
                    string = string + '&' + name + '[' + i + ']=' + array[i];
                }
                return string;
            }

        };

        return {
            process: process
        }
    };

    var app = angular.module('Plunner');
    app.factory('arrayToUrlParams', service);
}());

(function () {
    var directive = function () {
        return {
            restrict: 'A',
            controller: ['$injector', '$scope', function ($injector, $scope) {
                this.logout = function (redirect) {
                    $injector.get('logoutService').logout(redirect);
                    $scope.$apply();
                }
            }],
            link: function (scope, element, attrs, controllers) {
                element.on('click', function (e) {
                    e.preventDefault();
                    controllers.logout(attrs.redirect);
                })
            }
        }

    };
    var app = angular.module('Plunner');
    app.directive('logout', directive);
}());

(function () {
    var service = function () {

        var process = function (object, container, clearContainerBefore) {
            function InvalidArgumentException(msg, argumentIndex) {
                this.message = msg;
                this.argumentIndex = argumentIndex;
            }
            var key, i;
            var clearFlag = clearContainerBefore || false;
            if (!angular.isObject(object) || angular.isArray(object)) {
                throw new InvalidArgumentException("This method's first argument must be an object", 0);
            }
            else if (!angular.isArray(container)) {
                throw new InvalidArgumentException("This method's second argument must be an array", 1);
            }
            else {
                if (clearFlag) {
                    container.length = 0;
                }
                for (key in object) {
                    if (!angular.isArray(object[key])) {
                        container.push(object[key]);
                    }
                    else {
                        for (i = 0; i < object[key].length; i++) {
                            container.push(object[key][i]);
                        }
                    }
                }
            }
        };
        return {
            process: process
        }
    };
    var app = angular.module('Plunner');
    app.factory('mixedContentToArray', service)
}());

(function(){
    var filter = function(input, delimiters){
        var splittedDelimiters = delimiters.split(',');
        var start = parseInt(splittedDelimiters[0]);
        var end = parseInt(splittedDelimiters[1]);

        if(input){
            return input.slice(start,end+1);
        }


    };

    var app = angular.module('Plunner');
    app.filter('paginationFilter', function(){
        return filter;
    });
}());
(function () {
    var directive = function () {
        return {
            restrict: 'A',
            translude: true,
            controller : ['$injector', '$scope', function ($injector, $scope) {
                this.retrieve = function (type) {
                    if(type==='org'){
                        $injector.get('orgResources').orgInfo.get()
                            .$promise.then(function(response){
                                $scope.profileName =  response.name
                            });
                    }
                    else if(type==='user'){
                        $injector.get('userResources').userInfo.get()
                            .$promise.then(function(response){
                                $scope.profileName =  response.name
                            });
                    }

                }
            }],
            link: function (scope, element, attrs, controllers) {
                controllers.retrieve(attrs.type);
            }
        }

    };
    var app = angular.module('Plunner');
    app.directive('profile', directive);
}());
