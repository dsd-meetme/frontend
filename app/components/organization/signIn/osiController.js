(function () {
    /**
     A controller for managing the login of a plunner organization
     @author Giorgio Pea
     @param dataPublisher A service used to perform an http post request
     **/
    var controller = function ($scope, $location, dataPublisher, mixedContentToArray) {
        /*This controller instance */
        var c = this;
        var authorizationPopup = {
            show : function(){
                jQuery('#authorizationPopup').modal('show')
            },
            hide : function(){
                jQuery('#authorizationPopup').modal('hide')
            }
        };
        c.errors = [];
        //an object that encapsulate the validity status of input fields
        c.invalidFields = {
            passwordReq: false,
            emailReq: false,
            emailVal: false
        };
        c.login = function () {
            var remember;
            //Processes the submit of usiForm (organization sign in)
            var form = $scope.signInForm;
            //Checks the validity status of input fields
            c.invalidFields.passwordReq = form.password.$error.required;
            c.invalidFields.emailReq = form.email.$error.required;
            c.invalidFields.emailVal = form.email.$error.email;
            if (!form.$invalid) {
                if(c.rmbMe === 'true'){
                    remember = '1'
                }
                else{
                    remember = '0'
                }
                authorizationPopup.show();
                dataPublisher.publish('http://api.plunner.com/companies/auth/login', {
                    email: c.email,
                    password: c.password,
                    remember: remember
                }).then(function () {
                    authorizationPopup.hide();
                    $location.path('/organization');
                }, function (response) {
                    if (response.status === 422) {
                        mixedContentToArray.process(response.data, c.errors, true);
                    }
                });
            }
        }
    };

    var app = angular.module('Plunner');
    app.controller('osiController', controller);
}());
