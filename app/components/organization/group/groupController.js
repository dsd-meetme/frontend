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
            groupCopy : {
                name: '',
                description: ''
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
        c.editMode = {
            flag : false,
            enter : function(){
                this.flag = true;
            },
            exit : function(){
                this.flag = false;
                c.data.groupCopy.name = c.data.group.name;
                c.data.groupCopy.description = c.data.group.description;
                c.thereErrors.info = false;
                c.thereErrors.planner = false;
                c.invalidFields.nameReq = false;
            }
        };
        c.confirmPopup = {
            message : '',
            show : function(){
                jQuery('#confirmPopup').modal('show');
            },
            hide : function(){
                jQuery('#confirmPopup').modal('hide');
            }
        };
        c.inChange = false;
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
                    c.data.groupCopy.name = response.name;
                    c.data.groupCopy.description = response.description;
                    c.getUsers();
                });
        };
        //Delete an employee in the context of an org
        c.delete = function(){
            //restful delete
            orgResources.group().remove({groupId:id}).$promise
                .then(function(){
                    c.confirmPopup.message = "Group successfully deleted";
                    c.editMode.exit();
                    c.confirmPopup.show();
                    $timeout(function(){
                        c.confirmPopup.hide();
                        $location.path('/organization')
                    },2000);

                });
        };
        c.updatePlanner = function(plannerId){
            if(plannerId !== c.data.group.planner_id){
                orgResources.group().update({groupId:id},jQuery.param(
                        {
                            name : c.data.group.name,
                            description : c.data.group.description,
                            planner_id : plannerId
                        })
                ).$promise
                    .then(function(){
                        c.confirmPopup.message = "Changes successfully made";
                        c.confirmPopup.show();
                        setTimeout(function(){
                            c.confirmPopup.hide();
                        },2000);

                        //Update view
                        c.getInfo();
                        c.editMode.exit();
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
            c.invalidFields.nameReq = (c.data.groupCopy.name === '');
            c.thereErrors.info = c.invalidFields.nameReq;

            if(!c.thereErrors.info){
                orgResources.group().update({groupId:id},jQuery.param(
                    {
                        name : c.data.groupCopy.name,
                        description : c.data.groupCopy.description,
                        planner_id : c.data.group.planner_id
                    })).$promise
                    .then(function(){
                        c.inchange = false;
                        c.confirmPopup.message = "Changes successfully made!";
                        c.confirmPopup.show();
                        setTimeout(function(){
                            c.confirmPopup.hide();
                        },2000);
                        c.getInfo();
                        c.editMode.exit();
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
                function(){
                    c.confirmPopup.message = "Changes successfully made";
                    c.confirmPopup.show();
                    setTimeout(function(){
                        c.confirmPopup.hide();
                    },2000);
                    c.getUsers();
                    c.editMode.exit();
                }
            )
        };

        c.getInfo();

    };
    var app = angular.module('Plunner');
    app.controller('groupController',controller);
}());
