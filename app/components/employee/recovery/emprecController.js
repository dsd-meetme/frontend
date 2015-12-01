(function(){
    var controller = function($scope, dataPublisher){
        var c = this;
        c.errors = {};
        c.success = false;
        c.invalidFields = {
            nameReq : false,
            emailReq : false,
            emailVal : false
        };
        c.recover = function(){
            var form = $scope.recoveryForm;
            c.invalidFields.nameReq = form.name.$error.required;
            c.invalidFields.emailReq = form.email.$error.required;
            c.invalidFields.emailVal = form.email.$error.email;
            console.log(c.invalidFields);
            if(!form.$invalid){
                dataPublisher.publish('http://api.plunner.com/employees/password/email', {
                    company : c.name,
                    email : c.email
                })
                    .then(function(response){
                        c.errors = {};
                        c.success = true;
                        jQuery('input').val('');
                    }, function(response){
                        c.errors = response.data;
                    })
            }

        }

    };

    var app = angular.module('Plunner');
    app.controller('empRecController',controller)
}());