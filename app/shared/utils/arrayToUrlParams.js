(function(){
  var service = function(){
    return {
      process : function(name, array){
        var string = name+'[0]='+array[0];
        for(var i = 1; i<array.length; i++){
          string = string+'&'+name+'['+i+']='+array[i];
        }
        return string;
      }
    }
  }

  var app = angular.module('Plunner');
  app.factory('arrayToUrlParams',service);
}())
