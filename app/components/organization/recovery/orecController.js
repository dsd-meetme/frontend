(function () {
    /**
     A controller that  manages the registration of an organization
     @param dataPublisher A service used to perform an http post request
     **/
    var controller = function ($scope, dataPublisher, mixedContentToArray) {
        var c = this;
        c.errors = [];
        c.success = false;
        c.invalidFields = {
            emailReq: false,
            emailVal: false
        };
        c.recover = function () {
            var form = $scope.recoveryForm;
            //Checks the validity status of input fields
            c.invalidFields.emailReq = form.email.$error.required;
            c.invalidFields.emailVal = form.email.$error.email;
            //Submits
            if (!form.$invalid) {
                jQuery("#authorizationPopup").modal('show');
                dataPublisher.publish('http://api.plunner.com/companies/password/email', {email: c.email})
                    .then(function () {
                        c.errors.length = 0;
                        //clears the form fields
                        jQuery('input').val('');
                        c.success = true;
                        jQuery("#authorizationPopup").modal('hide');
                    }, function (response) {
                        if (response.status === 422) {
                            mixedContentToArray.process(response.data, c.errors, true);
                            jQuery("#authorizationPopup").modal('hide');
                        }
                    });
            }
        }
    };
    var app = angular.module('Plunner');
    app.controller('orecController', controller);
}());
