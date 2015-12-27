(function(){
    var filter = function(input, delimiters){
        var splittedDelimiters = delimiters.split(',');
        var start = parseInt(splittedDelimiters[0]);
        var end = parseInt(splittedDelimiters[1]);

        if(input){
            return input.slice(start,end+1);
        }


    };

    var app = angular.module('Plunner');
    app.filter('paginationFilter', function(){
        return filter;
    });
}());