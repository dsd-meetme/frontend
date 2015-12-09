(function(){
  var directive = function(){
    return {
      restrict : 'A',
      controller : ['$injector','$scope',function($injector,$scope){
        this.logout = function(redirect){
          $injector.get('logoutService').logout(redirect);
          $scope.$apply();
        }
      }],
      link : function(scope, element, attrs, controllers){
        console.log(controllers);
        console.log(attrs.redirect);
        element.on('click', function(e){
          e.preventDefault();
          controllers.logout(attrs.redirect);
        })
      }
    }

  }
  var app = angular.module('Plunner');
  app.directive('logout',directive);
}())
