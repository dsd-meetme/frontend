(function(){
  var controller = function(orgResources,$scope){
    var c = this;
    c.data = {};
    c.errors = {
      unauthorized : false,
      forbidden : false
    };
    c.showCurrentState = true;
    c.showEditMode = false;
    c.getInfo = function(){
      orgResources.company().query().$promise
      .then(
        function(response){
          c.data = response;
          console.log(c.data);
        });
      }
    };

    c.enterEditMode = function(){
      c.showCurrentState = false;
      c.showEditMode = true;
    };

    var app = angular.module('Plunner');
    app.controller('opController',controller);
  }());
