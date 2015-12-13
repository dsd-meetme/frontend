(function(){
    /**
     A controller to manage existing groups inside an organization
     @param orgResources A service that provides objects that incapsulate restful communication
     logic
     **/
    var controller = function($routeParams,$location,$timeout, mixedContentToArray,orgResources){

        var c = this;
        //group id
        var id = $routeParams.id;
        c.data = {
            group : {
                name : '',
                description: ''
            },
            members : [],
            groupC : {
                name: '',
                description: ''
            }
        };
        var emptyInvalidFields = function(invalidFields){
            for(key in invalidFields){
                invalidFields[key] = false;
            }
        };
        c.thereErrors = {
            info : false,
            planner : false
        };
        c.errors = {
            planner : [],
            info : []
        };
        c.invalidFields = {
            nameReq : false
        };
        c.confirmPopup = {
            message : ""
        };
        c.inchange = false;
        //Gets user info in the context of an organization
        c.getInfo = function(){
            //restful show
            orgResources.group().get({groupId:id}).$promise
                .then(function(response){
                    c.data.group.name = response.name;
                    c.data.group.description = response.description;
                    c.data.group.planner_id = response.planner_id;
                    //A copy of the retrieved data
                    //This copy will be used
                    c.data.groupC.name = response.name;
                    c.data.groupC.description = response.description;
                    c.getUsers();
                });
        };
        //Delete an employee in the context of an org
        c.delete = function(){
            //restful delete
            orgResources.group().remove({groupId:id}).$promise
                .then(function(response){
                    c.confirmPopup.message = "Group successfully deleted";
                    jQuery('#confirmPopup').modal('show');
                    $timeout(function(){
                        jQuery('#confirmPopup').modal('hide');
                        $location.path('/organization')
                    },2000);

                });
        };
        c.updatePlanner = function(plannerId){
            if(plannerId !== c.data.group.planner_id){
                orgResources.group().update({groupId:id},jQuery.param(
                        {
                            name : c.data.group.name,
                            description : c.data.group.desc,
                            planner_id : plannerId
                        })
                ).$promise
                    .then(function(){
                        c.confirmPopup.message = "Changes successfully made";
                        jQuery('#confirmPopup').modal('show');
                        setTimeout(function(){
                            jQuery('#confirmPopup').modal('hide');
                        },1000);
                        c.editMode.exit()
                        //Update view
                        c.getInfo();
                    },function(response){
                        if(response.status === 422){
                            mixedContentToArray.process(response.data, c.errors.planner, true);
                        }
                    });
            }
        };
        //Update user info
        c.updateInfo = function(){
            //Checks the validity status of input fields
            c.invalidFields.nameReq = (c.data.groupC.name === '');
            if(c.invalidFields.nameReq){
                c.thereErrors.info = true;
            }
            if(!c.invalidFields.nameReq){
                c.thereErrors.info = false;
                orgResources.group().update({groupId:id},jQuery.param(
                    {
                        name : c.data.groupC.name,
                        description : c.data.groupC.description,
                        planner_id : c.data.group.planner_id
                    })).$promise
                    .then(function(response){
                        c.errors.info = {};
                        c.inchange = false;
                        c.confirmPopup.message = "Changes successfully made!";
                        jQuery('#confirmPopup').modal('show');
                        setTimeout(function(){
                            jQuery('#confirmPopup').modal('hide');
                        },2000);
                        c.editMode.flag = false;
                        c.getInfo();
                    },function(response){
                        if(response.status === 422){
                            mixedContentToArray.process(response.data, c.errors.info, true);
                        }
                    });
            }
        };
        c.getUsers = function(){
            orgResources.userInGroup().query({groupId:id, userId: ''}).$promise
                .then(
                function(response){
                    c.data.members = response;
                })
        };
        c.deleteFromGroup = function(userId){
            orgResources.userInGroup().remove({groupId:id, userId: userId}).$promise
                .then(
                function(response){
                    c.confirmPopup.message = "Changes successfully made";
                    jQuery('#confirmPopup').modal('show');
                    setTimeout(function(){
                        jQuery('#confirmPopup').modal('hide');
                    },2000);
                    c.editMode.exit();
                    c.getUsers();
                }
            )
        };
        c.editMode = {
            flag : false,
            enter : function(){
                this.flag = true;
            },
            exit : function(){
                this.flag = false;
                c.data.groupC.name = c.data.group.name;
                c.data.groupC.description = c.data.group.description;
                c.thereErrors.info = false;
                c.thereErrors.planner = false;
                emptyInvalidFields(c.invalidFields);
            }
        };
        c.getInfo();

    };
    var app = angular.module('Plunner');
    app.controller('groupController',controller);
}());
