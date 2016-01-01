(function(){

    var service = function(){
        //INSERT HERE THE URL OF YOUR APIS
        var apiDomain = 'http://api.plunner.com';

        return {
            apiDomain : apiDomain
        }
    };

    var app = angular.module('Plunner');
    app.factory('configService', [service]);

}());