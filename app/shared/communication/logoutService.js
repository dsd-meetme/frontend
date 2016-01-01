(function(){
  //A service that manages the logout of an organization or an employee
  var service = function($location,$cookies){
    return {
      logout : function(url){
        function InvalidArgumentException(msg,argumentIndex){
          this.message = msg;
          this.argumentIndex = argumentIndex;
        }
        if(!angular.isString(url)){
          throw new InvalidArgumentException("This method's unique argument must be a string",0);

        }
        else{
          $cookies.remove('auth_token');
          $location.path(url);
        }
      }
    }
  };

  var app = angular.module('Plunner');
  app.factory('logoutService',service);
}());
