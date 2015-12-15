(function () {
    /**
     An controller to manage the actions that can be accomplished by a plunner organization
     @author Giorgio Pea
     @param logoutService A service used to manage the logout of a plunner's organization
     **/
    var controller = function ($scope, dataPublisher, mixedContentToArray, orgResources, $timeout) {

        var processMeetings = function (a) {
            var Array = [];
            var tmp, key;
            console.log(a)
            for (var i = 0; i < a.length; i++) {
                for (var j = 0; j < a[i].meetings.length; j++) {
                    tmp = a[i].meetings[j];
                    tmp.group_name = a[i].name;
                    Array.push(tmp);
                }

            }
            return Array;
        };
        var processCaldav = function (a) {
            var ArrayOne = [];
            var ArrayTwo = [];
            var tmp, key;
            for (var i = 0; i < a.length; i++) {
                if (a[i].caldav == null) {
                    ArrayOne.push(a[i]);
                }
                else {
                    ArrayTwo.push(a[i]);
                }


            }
            return [ArrayOne, ArrayTwo];
        };
        var c = this;
        c.errors = {
            unauthorized: false,
            forbidden: false
        };
        c.meetingSection = true;
        c.showMeetings = function () {
            c.meetingSection = true;
            c.scheduleSection = false;
        };
        c.showSchedules = function () {
            c.meetingSection = false;
            c.scheduleSection = true;
        };
        var selectedCalsArrayBuilder = function (source, dest) {
            for (var i = 0; i < source.length; i++) {
                dest.push({
                    value: source[i],
                    selected: false
                });
            }
        };
        var getSelectedCals = function (array) {
            var tmpArr = [];
            for (var i = 0; i < array.length; i++) {
                if (array[i].selected) {
                    tmpArr.push(array[i].value);
                }
            }
            return tmpArr;
        };

        c.meetingsList = {
            groupA: {
                isVisible: true,
                data: null,
                show: function () {
                    this.isVisible = true;
                    c.meetingsList.groupB.isVisible = false;
                }
            },
            groupB: {
                isVisible: false,
                data: null,
                show: function () {
                    this.isVisible = true;
                    c.meetingsList.groupA.isVisible = false;
                }
            }
        };
        c.schedulesList = {
            groupA: {
                isVisible: true,
                data: null,
                show: function () {
                    this.isVisible = true;
                    c.schedulesList.groupB.isVisible = false;
                }
            },
            groupB: {
                isVisible: false,
                data: null,
                show: function () {
                    this.isVisible = true;
                    c.schedulesList.groupA.isVisible = false;
                }
            },
        };
        c.deleteInPMeeting = function(groupId, meetingId){
            orgResources.meetings().remove({groupId: groupId, meetingsId: meetingId}).$promise
                .then(function(){
                    alert('evviva');
                    c.getMeetings();
                })
        };
        c.events = [];
        c.saveSchedule = function () {
            console.log(calendar.fullCalendar('clientEvents'));
        };
        c.getSchedules = function () {
            orgResources.calendar().query({calendarId: ''}).$promise
                .then(function (response) {
                    console.log(response);
                    var compute = processCaldav(response);
                    console.log(compute);
                    c.schedulesList.groupA.data = compute[0];
                    c.schedulesList.groupB.data = compute[1];
                });
        };
        c.limits = {
            pmeetings : 10,
            tpmeetings : 10,
            ischedules : 10,
            cschedules : 10,
            change : function(param, value){
                this[param] = value;
            }
        };
        c.getMeetings = function () {
            orgResources.empGroups().query().$promise
                .then(function (response) {
                    console.log(response);
                    var compute = processMeetings(response);
                    c.meetingsList.groupA.data = compute;
                });
            orgResources.meetingsEmp().query().$promise
                .then(function (response) {
                    console.log(response);
                    var a,b;
                    //var compute = processMeetings(response);
                    c.meetingsList.groupB.data = response;
                    /*for(var i=0; i< c.meetingsList.groupB.data.length; i++){
                        a = new moment(c.meetingsList.groupB.data[i].start_time);
                        b = parseInt(c.meetingsList.groupB.data[i].duration)/60;
                        c.meetingsList.groupB.data[i].finalDate = a.add(b, 'm').format('dddd, MMMM Do YYYY, h:mm:ss a');
                        console.log(c.meetingsList.groupB.data[i].finalDate)
                    }*/
                });

        };
        c.confirmPopup = {
            message: ''
        };
        c.importSchedule = {
            credentials: {
                url: '',
                username: '',
                password: ''
            },
            selectedCals: [],
            calendars: [],
            errors: [],
            invalidFields: {
                urlRequired: false,
                urlValid: false,
                usernameRequired: false,
                passwordRequired: false
            },
            showPopup: function () {
                var popup = jQuery('#importSchedule');
                this.thereErrors = false;
                popup.find('input').val('');
                popup.modal('show');
            },
            thereErrors: false,
            showLoader: false,
            getCalendars: function () {
                var form = $scope.importScheduleForm;
                this.invalidFields.urlRequired = form.url.$error.required;
                this.invalidFields.urlVal = form.url.$error.url;
                this.invalidFields.usernameRequired = form.username.$error.required;
                this.invalidFields.passwordRequired = form.password.$error.required;
                if (form.$invalid) {
                    this.thereErrors = true;
                }
                if (!form.$invalid) {
                    this.thereErrors = false;
                    this.credentials.url = this.url;
                    this.credentials.username = this.username;
                    this.credentials.password = this.password;
                    this.showLoader = true;
                    dataPublisher.publish("http://api.plunner.com/employees/calendars/calendars", {
                        url: this.url,
                        username: this.username,
                        password: this.password
                    })
                        .then(function (response) {
                            c.importSchedule.calendars = response.data;
                            selectedCalsArrayBuilder(response.data, c.importSchedule.selectedCals);
                            c.importSchedule.showLoader = false;
                        }, function (response) {
                            c.importSchedule.showLoader = false;
                            if (response.status === 422) {
                                mixedContentToArray.process(response.data, c.importSchedule.errors, true);
                            }
                        });
                }
            },
            submit: function () {

                if (this.calendars.length === 0) {
                    this.errors.push('Before importing a schedule select it after having pressed get schedules')
                }
                else if (!getSelectedCals(this.selectedCals)) {
                    this.errors.push('Select at least one schedule to import');
                }
                else {
                    var selectedCalendars = getSelectedCals(this.selectedCals);
                    console.log(selectedCalendars);
                    for (var i = 0; i < selectedCalendars.length; i++) {
                        dataPublisher.publish('http://api.plunner.com/employees/calendars/caldav', {
                            name: selectedCalendars[i],
                            url: this.credentials.url,
                            username: this.credentials.username,
                            password: this.credentials.password,
                            calendar_name: selectedCalendars[i],
                            enabled: 1
                        })
                            .then(function () {
                                c.confirmPopup.message = 'Schedules successfully imported!';
                                jQuery('#importSchedule').modal('hide');
                                jQuery('#confirmPopup').modal('show');
                                $timeout(function () {
                                    jQuery('#confirmPopup').modal('hide');
                                    c.getSchedules();
                                }, 2000)
                            }, function (response) {
                                if (response.status === 422) {
                                    mixedContentToArray.process(response.data, c.importSchedule.errors, true);
                                }
                            })
                    }

                }
            }
        };
        c.deleteSchedule = function (id) {
            orgResources.calendar().remove({calendarId: id}).$promise
                .then(function () {
                    c.confirmPopup.message = 'Schedule successfully deleted';
                    jQuery('#confirmPopup').modal('show');
                    $timeout(
                        function () {
                            jQuery('#confirmPopup').modal('hide');
                            c.getSchedules();
                        }, 2000
                    );

                })
        };
        c.editSchedule = {
            errors: [],
            thereErrors: false,
            invalidFields: {
                nameReq: false,
                urlReq: false,
                usernameReq: false,
                passwordLength: false,
                passwordMatch: false
            },
            data: {
                name: '',
                username: '',
                url: '',
                enabled: 0,
                calendar_name: ''
            },
            showPopup: function (index) {
                var popup = jQuery('#editSchedule');
                this.data.id = c.schedulesList.groupB.data[index].id;
                this.data.name = c.schedulesList.groupB.data[index].name;
                this.data.username = c.schedulesList.groupB.data[index].caldav.username;
                this.data.url = c.schedulesList.groupB.data[index].caldav.url;
                this.data.enabled = c.schedulesList.groupB.data[index].enabled;
                this.data.cal_name = c.schedulesList.groupB.data[index].caldav.calendar_name;
                console.log(this.data.enabled);
                popup.modal('show');
            },
            submit: function (index) {
                var form = $scope.editScheduleForm;
                console.log(form);
                this.invalidFields.nameReq = form.name.$error.required;
                this.invalidFields.urlReq = form.url.$error.required;
                this.invalidFields.urlVal = form.url.$error.url;
                this.invalidFields.usernameReq = form.username.$error.required;
                this.invalidFields.passwordLength = form.password.$error.minlength;
                this.invalidFields.passwordMatch = (this.data.password !== this.confirmation_password);
                console.log(this.invalidFields);
                for (key in this.invalidFields) {
                    if (this.invalidFields[key]) {
                        this.thereErrors = true;
                        break;
                    }
                }
                console.log(this.thereErrors);
                if (!form.$invalid && !this.invalidFields.passwordMatch) {
                    var config_obj, enabled;
                    if (this.data.enabled === 'true') {
                        enabled = 1;
                    }
                    else {
                        enabled = 0;
                    }
                    if (this.data.password !== '') {
                        config_obj = {
                            name: this.data.name,
                            enabled: this.data.enabled === enabled,
                            username: this.data.username,
                            url: this.data.url,
                            password: this.data.password,
                            calendar_name: this.data.cal_name
                        }
                    }
                    else {
                        config_obj = config_obj = {
                            name: this.data.name,
                            enabled: this.data.enabled === enabled,
                            username: this.data.username,
                            url: this.data.url,
                            calendar_name: this.data.cal_name
                        }
                    }
                    orgResources.calendar().update({calendarId: this.data.id}, jQuery.param(config_obj)).$promise.
                        then(function (response) {
                            c.confirmPopup.message = 'Changes successfully saved!';
                            jQuery('#editSchedule').modal('hide');
                            jQuery('#confirmPopup').modal('show');
                            $timeout(function () {
                                jQuery('#confirmPopup').modal('hide');
                                c.getSchedules();
                            }, 2000)
                        }, function (response) {
                            if (response.status === 422) {
                                mixedContentToArray.process(response.data, c.editSchedule.errors, true);
                            }
                        })
                }
            }
        };
        c.getSchedules();
        c.getMeetings();
    };

    var app = angular.module('Plunner');
    app.controller('udashController', controller);
}());
