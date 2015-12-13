(function(){
    /**
     An controller to manage the actions that can be accomplished by a plunner organization
     @author Giorgio Pea
     @param logoutService A service used to manage the logout of a plunner's organization
     **/
    var controller = function($scope,dataPublisher, mixedContentToArray, orgResources){
        var c = this;
        c.errors = {
            unauthorized : false,
            forbidden : false
        };
        c.meetingSection = true;
        c.showMeetings = function() {
            c.meetingSection = true;
            c.scheduleSection = false;
        };
        c.showSchedules = function() {
            c.meetingSection = false;
            c.scheduleSection = true;
        };
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
        c.getSchedules = function(){
            orgResources.calendar().query({calendarId : ''}).$promise
                .then(function(response){
                    c.schedulesList.groupA.data = response;
                });
        };
        c.importSchedule = {
            credentials : {
                url : '',
                username : '',
                password : ''
            },
            selectedCals : [],
            calendars : [],
            errors : [],
            invalidFields : {
                urlRequired : false,
                urlValid : false,
                usernameRequired : false,
                passwordRequired : false
            },
            showLoader : false,
            getCalendars : function(){
                var form = $scope.importScheduleForm;
                this.invalidFields.urlRequired = form.url.$error.required;
                this.invalidFields.urlVal = form.url.$error.url;
                this.invalidFields.usernameRequired = form.username.$error.required;
                this.invalidFields.passwordRequired = form.password.$error.required;
                if(!form.$invalid){
                    this.credentials.url = this.url;
                    this.credentials.username = this.username;
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
                            c.importSchedule.showLoader = false;
                        },function(response){
                            c.importSchedule.showLoader = false;
                            if(response.status === 422){
                                mixedContentToArray.process(response.data, c.importSchedule.errors,true);
                            }
                        });
                }
            },
            submit : function(){

                if(this.calendars.length === 0){
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
                            enabled : 1
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
        c.deleteSchedule = function(id){
          orgResources.calendar().remove({calendarId : id}).$promise
              .then(function(){
                  alert('evviva');
                  c.getSchedules();
              })
        };
        c.editSchedule = {
            errors : [],
            thereErrors : false,
            invalidFields : {
                nameReq : false,
                urlReq : false,
                usernameReq: false,
                passwordLength: false,
                passwordMatch: false
            },
            data : {},
            showPopup : function(index){
                var popup = jQuery('#editSchedule');
                popup.find('input').val('').removeAttr('checked');
                this.data = c.schedulesList.groupA.data[index];
                popup.modal('show');
            },
            submit : function(index){
                var form = $scope.editScheduleForm;
                console.log(form);
                this.invalidFields.nameReq = form.name.$error.required;
                this.invalidFields.urlReq = form.url.$error.required;
                this.invalidFields.urlVal = form.url.$error.url;
                this.invalidFields.usernameReq = form.username.$error.required;
                this.invalidFields.passwordLength = form.password.$error.minlength;
                this.invalidFields.passwordMatch = (this.data.password !== this.confirmation_password);
                console.log(this.invalidFields);
                for(key in this.invalidFields){
                    if(this.invalidFields[key]){
                        this.thereErrors = true;
                        break;
                    }
                }
                console.log(this.thereErrors);
                if(!form.$invalid && !this.invalidFields.passwordMatch){
                    console.log(this.data);
                    orgResources.calendar().update({calendarId : this.data.id},jQuery.param({
                        name : this.data.name,
                        enabled : this.data.enabled === 'true' ? '1':'0',
                        username : this.data.caldav.username,
                        url : this.data.caldav.url,
                        password : this.data.caldav.password,
                        calendar_name: this.data.caldav.calendar_name
                    })).$promise.
                        then(function(response){
                            alert('whao');
                        },function(response){
                            if(response.status === 422){
                                mixedContentToArray(response.data, c.editSchedule.errors, true);
                            }
                        })
                }
            }
        };
        c.getSchedules();
    };

    var app = angular.module('Plunner');
    app.controller('udashController',controller);
}());
