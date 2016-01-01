(function(){

    var service = function(){
        var apiDomain = 'http://api.plunner.com';

        return {
            apiDomain : apiDomain
        }
    };

    var app = angular.module('Plunner');
    app.factory('configService', [service]);

}());