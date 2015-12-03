(function(){
    //A service that returns resource objects that encapsulate the restful communication logic relative
    //to groups, employees and others
    var service = function($resource){
        var userResource = $resource('http://api.plunner.com/companies/employees/:userId',null,{
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
        })
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
            }
        }
    }
    var app = angular.module('Plunner');
    app.factory('orgResources', service);
}())
