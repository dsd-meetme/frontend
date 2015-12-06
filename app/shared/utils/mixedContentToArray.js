(function(){
  var service = function(){
    return {
      process : function(object,container,clearContainerBefore){
        var key, i;
        var clearFlag = clearContainerBefore || false;
        if(!angular.isObject(object)){
          throw "This method's first argument must be an object";
        }
        else if(!angular.isArray(container)){
          throw "This method's second argument must be an array";
        }
        else{
          if(clearFlag){
            container.length = 0;
          }
          for(key in object){
            if(!angular.isArray(object[key])){
              container.push(object[key]);
            }
            else{
              for(i=0; i<object[key].length; i++){
                container.push(object[key][i]);
              }
            }
          }
        }
      }
    }
  }
  var app = angular.module('Plunner');
  app.factory('mixedContentToArray', service)
}())
