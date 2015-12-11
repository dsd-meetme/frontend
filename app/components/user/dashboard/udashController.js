(function(){
    /**
     An controller to manage the actions that can be accomplished by a plunner organization
     @author Giorgio Pea
     @param logoutService A service used to manage the logout of a plunner's organization
     **/
    var controller = function($scope,dataPublisher, mixedContentToArray){
        var c = this;
        var selectedCalsArrayBuilder = function(source, dest){
            for(var i = 0; i<source.length; i++){
                dest.push({
                    value : source[i],
                    selected : false
                });
            }
        };
        var getSelectedCals = function(array){
            var tmpArr = [];
            for(var i = 0; i<array.length; i++){
                if(array[i].selected){
                    tmpArr.push(array[i].value);
                }
            }
            return tmpArr;
        };
        c.errors = {
            unauthorized : false,
            forbidden : false
        };
        c.meetingsList = {
            groupA : {
                isVisible : true,
                data : null,
                show : function(){
                    this.isVisible = true;
                    c.meetingsList.groupB.isVisible = false;
                }
            },
            groupB : {
                isVisible : false,
                data : null,
                show : function(){
                    this.isVisible = true;
                    c.meetingsList.groupA.isVisible = false;
                }
            }
        };
        c.schedulesList = {
            groupA : {
                isVisible : true,
                data : null,
                show : function(){
                    this.isVisible = true;
                    c.schedulesList.groupB.isVisible = false;
                }
            },
            groupB : {
                isVisible : false,
                data : null,
                show : function(){
                    this.isVisible = true;
                    c.schedulesList.groupA.isVisible = false;
                }
            },
        };
        c.events = [];
        c.saveSchedule = function(){
            console.log(calendar.fullCalendar('clientEvents'));
        };
        c.importSchedule = {
            credentials : {
                username : '',
                url: '',
                password: '',
            },
            form : $scope.importScheduleForm,
            calendars : [],
            errors : [],
            invalidFields : {
                urlRequired : false,
                urlValid : false,
                usernameRequired : false,
                passwordRequired : false
            },
            selectedCals : [],
            showLoader : false,
            getCalendars : function(){
                var form = $scope.importScheduleForm;
                console.log(c.importSchedule.form);
                this.invalidFields.urlRequired = form.url.$error.required;
                this.invalidFields.urlVal = form.url.$error.url;
                this.invalidFields.usernameRequired = form.username.$error.required;
                this.invalidFields.passwordRequired = form.password.$error.required;
                if(!form.$invalid){
                    this.credentials.username = this.username;
                    this.credentials.url = this.url;
                    this.credentials.password = this.password;
                    this.showLoader = true;
                    dataPublisher.publish("http://api.plunner.com/employees/calendars/calendars", {
                        url : this.url,
                        username : this.username,
                        password : this.password
                    })
                        .then(function(response){
                            c.importSchedule.calendars = response.data;
                            selectedCalsArrayBuilder(response.data, c.importSchedule.selectedCals);
                            console.log(c.importSchedule.selectedCals);
                            c.importSchedule.showLoader = false;
                        },function(response){
                            c.importSchedule.showLoader = false;
                            if(response.status === 422){
                                mixedContentToArray.process(response.data, c.importSchedule.errors,true);
                            }
                        })
                }

            },
            submit : function(){
                console.log(this.selectedCals);
                if(this.calendars.length === 0){
                    alert('entro');
                    this.errors.push('Before importing a calendar select one after having pressed get calendars')
                }
                else if(!getSelectedCals(this.selectedCals)){
                    this.errors.push('Select at least one schedule to import');
                }
                else{
                    var selectedCalendars = getSelectedCals(this.selectedCals);
                    console.log(selectedCalendars);
                    for(var i=0; i<selectedCalendars.length; i++){
                        dataPublisher.publish('http://api.plunner.com/employees/calendars/caldav',{
                            name : selectedCalendars[i],
                            url : this.credentials.url,
                            username : this.credentials.username,
                            password : this.credentials.password,
                            calendar_name : selectedCalendars[i],
                            enabled : 'true'
                        })
                            .then(function(){
                                alert('pohhg');
                            },function(response){
                                if(response.status === 422) {
                                    mixedContentToArray.process(response.data, c.importSchedule.errors, true);
                                }
                            })
                    }

                }
            }
        };
        //var calendar = jQuery('#calendar').fullCalendar();
    };

    var app = angular.module('Plunner');
    app.controller('udashController',controller);
}());
