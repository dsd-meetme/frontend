(function(){
  var app = angular.module('Plunner');
  app.directive('interrors',function(){
    return {
      template : "<div><p ng-show='code_1'>You are not authorized to do this action</p><p ng_show='code_2'>You are accessing a resource that's not yours<p></div>",
      restrict : "E",
      scope : {
        code_1 : false,
        code_2 : false
      },
      link : function(scope, element, attrs){
        console.log(attrs);
        scope.$watch(attrs.code,function(value){
          if(value===401){
            scope.code_1 = true;
            scope.code_2 = false;
          }
          else if(value===403){
            scope.code_2 = true;
            scope.code_1 = false;
          }
        })
      }
    }
  });
}())
