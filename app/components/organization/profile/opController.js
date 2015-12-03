(function(){
  var controller = function(orgResources,$scope){
    var c = this;
    c.data = {};
    c.errors = {
      unauthorized : false,
      forbidden : false
    };
    c.getInfo = function(){
      orgResources.company().query().$promise
      .then(
        function(response){
            c.data = response;
        }, function(response){
          if(response.status === 401){
            c.errors.unauthorized = true;
          }
          else if(response.status === 403){
            c.errors.forbidden = true;
          }
        }
      );
    }
  };

  var app = angular.module('Plunner');
  app.controller('opController',controller);
}());
