(function() {

    var controller = function ($scope,$timeout,orgResources,mixedContentToArray) {

        var c = this;

        c.data = {
            name : '',
            email : ''
        };

        c.getInfo = function(){
            orgResources.user().query({userId : ''}).$promise
                .then(function(response){
                    c.data.name = response.name;
                    c.data.email = response.email;
                });
        };
        c.changePassword = {
            showValue : false,
            invalidFields : {
                passwordRequired : false,
                passwordLength : false
            },
            errors : [],
            show : function(){
                this.showValue = true;
            },
            submit : function(){
                var form = $scope.changePasswordForm;
                this.invalidFields.passwordRequired = form.password.$error.required;
                this.invalidFields.passwordLength = form.password.$error.minlength;
                if(!form.$invalid){
                    orgResources.user().update({userId : ''}, this.password).$promise
                        .then(function(response){
                            jQuery('#confirmPopup').modal('show');
                            $timeout(function(){
                                jQuery('#confirmPopup').modal('hide')
                            },2000);
                        },function(response){
                            if(response.status === 422){
                                mixedContentToArray.process(response.data, c.changePassword.errors, true);
                            }
                        })
                }
            }

        };
        //c.getInfo();


    };

    var app = angular.module('Plunner');
    app.controller('upController', controller);

}());
