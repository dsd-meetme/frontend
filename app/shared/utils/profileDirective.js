(function () {
    var directive = function () {
        return {
            restrict: 'A',
            translude: true,
            controller : ['$injector', '$scope', function ($injector, $scope) {
                this.retrieve = function (type) {
                    if(type==='org'){
                        $injector.get('orgResources').orgInfo().get()
                            .$promise.then(function(response){
                                $scope.profileName =  response.name
                            });
                    }
                    else if(type==='user'){
                        $injector.get('orgResources').employee().get()
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
