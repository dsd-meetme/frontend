(function(){
  var service = function(){
    return {
      process : function(name, array){
        function InvalidArgumentException(msg, argumentIndex){
          this.message = msg;
          this.argumentIndex = argumentIndex;
        }
        if(!angular.isString(name) || name === ''){
          throw new InvalidArgumentException("This method's first argument must be a non empty string",0);
        }
        else if(!angular.isArray(array)){
          throw new InvalidArgumentException("This method's second argument must be an array",1)
        }

        else{
          var string = name+'[0]='+array[0];
          for(var i = 1; i<array.length; i++){
            string = string+'&'+name+'['+i+']='+array[i];
          }
          return string;
        }
      }
    }
  }

  var app = angular.module('Plunner');
  app.factory('arrayToUrlParams',service);
}())
