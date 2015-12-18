(function () {
    var service = function () {

        var process = function (object, container, clearContainerBefore) {
            function InvalidArgumentException(msg, argumentIndex) {
                this.message = msg;
                this.argumentIndex = argumentIndex;
            }
            var key, i;
            var clearFlag = clearContainerBefore || false;
            if (!angular.isObject(object) || angular.isArray(object)) {
                throw new InvalidArgumentException("This method's first argument must be an object", 0);
            }
            else if (!angular.isArray(container)) {
                throw new InvalidArgumentException("This method's second argument must be an array", 1);
            }
            else {
                if (clearFlag) {
                    container.length = 0;
                }
                for (key in object) {
                    if (!angular.isArray(object[key])) {
                        container.push(object[key]);
                    }
                    else {
                        for (i = 0; i < object[key].length; i++) {
                            container.push(object[key][i]);
                        }
                    }
                }
            }
        };
        return {
            process: process
        }
    };
    var app = angular.module('Plunner');
    app.factory('mixedContentToArray', service)
}());
