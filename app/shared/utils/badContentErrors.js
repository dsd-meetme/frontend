(function(){

  var directive = function(){
    return {
      template : '<div ng-repeat="(key,value) in container"><p ng-repeat="error in value" class="text-danger">{{error}}</p></div>',
      restrict : 'E',
      translude : true,
      scope : {
        container : '&errors-container'
      },
      link : function(scope,attrs,element){
        scope.$watch(attrs.errors-container,function(value){
          scope.container = value;
        });
      }
    }
  }

  var app = angular.module('Plunner');
  app.directive('form-errors',directive);
}())
