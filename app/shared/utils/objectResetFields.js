(function(){


    var objectResetFields = function(object){
        for(var key in object){
            object[key] = false;
        }
    };

    var service = function(){

        return {
            resetFields : objectResetFields
        }

    };


    var app = angular.module('Plunner');
    app.factory('objectResetFields', [service]);

}());