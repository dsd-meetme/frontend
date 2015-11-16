var app = angular.module('OurApp');
var d_directive = function(){
  return {
    restrict : 'E',
    template: '<input type="text">',
    link: function(scope,element,attrs){
      console.log(element);
    }
  }
}
app.directive('dada',d_directive);
