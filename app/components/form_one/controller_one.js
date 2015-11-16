var app = angular.module("OurApp")
var controller_one = function($scope,jo){
  $scope.variable = "salkfhaslhf";
  $scope.variable_one = jo.get();
}
app.controller('lop',controller_one);
