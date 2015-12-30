(function () {
    var directive = function () {
        return {
            restrict: 'a',
            scope : {
              name : ''
            },
            link: function (scope, element, attrs, controllers) {

            }
        }

    };
    var app = angular.module('Plunner');
    app.directive('profile', directive);
}());
