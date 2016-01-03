(function () {

    var controller = function ($location) {
        this.reset = 'unreset';
        var c = this;
        var resetCheck = function () {
            if ($location.url() === '/') {
                c.reset = 'reset';
            }
        }

        resetCheck();

    };

    var app = angular.module('Plunner');
    app.controller('presentationController', ['$location', controller]);
}());
