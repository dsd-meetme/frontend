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
