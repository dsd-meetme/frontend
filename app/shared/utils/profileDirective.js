(function () {
    var directive = function () {
        return {
            restrict: 'A',
            controller: ['$injector', '$scope', function ($injector, $scope) {
                this.getName = function (type) {
                    $injector.get('orgResources').orgInfo().get()
                        .$promise.then(function(){

                        })
                    $scope.$apply();
                }
            }],
            scope : {
              name : ''
            },
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
