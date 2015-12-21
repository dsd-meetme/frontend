(function(){

    var find = function(property, propertyValue, collection){
        angular.forEach(collection, function(key,value){
           if(key === property) {
               if (value === propertyValue) {
                   return collection[key];
               }
           }
        });
        return -1;
    };

    var service = function(){
        return {
            find : find
        }
    };

    var app = angular.module('Plunner');
    app.factory('findObjectByProperty', service);

}());