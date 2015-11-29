(function(){
  var controller = function(orgResources){
    var self = this;
    self.data = {};
    self.errors = {
      unauthorized : false,
      forbidden : false
    }
    orgResources.company().query().then(
      function(response){
          self.data = response.data;
      }, function(response){
        if(response.status === 401){
          self.errors.unauthorized = true;
        }
        else if(response.status === 403){
          self.errors.forbidden = true;
        }
      }
    );

    self.editProfile = function() {
      self.editMailPopUp = true;
    }

  }

  var app = angular.module('Plunner');
  app.controller('opController',controller);
}())
