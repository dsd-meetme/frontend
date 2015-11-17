(function(){
  var controller = function($scope,$location,AUTH_EVENTS){
    $scope.on(AUTH_EVENTS.loginSuccess,function(){
      $location.path('/login');
    });
  }
}())
