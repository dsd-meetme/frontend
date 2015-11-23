(function(){
  var service = function(){
    return {
      addDays : function(days){
        var now = new Date();
        var thisDay = now.getDate();
        return now.setDate(thisDay+days);
      }
    }
  }
  var app = angular.module('Plunner');
  app.factory('dateManipulator',dateManipulator);
})
