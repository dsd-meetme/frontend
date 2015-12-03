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
        });
      }
    };

    var app = angular.module('Plunner');
    app.controller('opController',controller);
  }());
