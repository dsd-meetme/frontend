(function () {
    var directive = function () {
        return {
            restrict: 'E',
            template : '<li class="user_section" profile target="org"><a href="/#/organization/profile"><img class="user_icon" src="assets/img/user_icon.png" alt=""/>{{name}} </a> </li>',
            controller: ['$injector', '$scope', function ($injector, $scope) {
                this.getName = function (type, name) {
                    var restManager = $injector.get('orgResources');
                    if(type==="org"){
                        restManager.orgInfo().get()
                            .$promise.then(function(response){
                                name = response.name;
                            });
                    }
                    else if(type==="user"){
                        restManager.employee().get()
                            .$promise.then(function(){
                                name = response.name;
                            });
                    }
                }
            }],
            scope : {
              name : '@'
            },
            link: function (scope, element, attrs, controllers) {
                controllers.getName(attrs.target, scope.name);
            }
        }

    };
    var app = angular.module('Plunner');
    app.directive('profile', directive);
}());
