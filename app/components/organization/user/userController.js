(function(){
  /**
  A controller that manage existing users inside an organization
  @param orgResources A service that provides objects that incapsulate restful communication
  logic
  **/
  var controller = function($scope,$routeParams,$location,$timeout,mixedContentToArray,orgResources){
    var c = this;
    //user id
    var id = $routeParams.id;
    c.data = {};
    c.dataC = {};
    c.confirmPopup = {
      message : '',
      show : function(){
        jQuery('#confirmPopupa').modal('show');
      },
      hide : function(){
        jQuery('#confirmPopupa').modal('hide');
      }
    }
    c.changeNameMail = {
      errors : [],
      inChange : false,
      form : $scope.nmeForm,
      invalidFields : {
        nameReq : false,
        emailReq : false,
        emailVal : false
      },
      abort : function(){
        this.inChange = false;
      },
      show : function(){
        this.inChange = true
      },
      submit : function(){
        var form = $scope.changeForm;
        //Checks the validity status of input fields
        this.invalidFields.emailVal = form.email.$error.email;
        this.invalidFields.emailReq = form.email.$error.required;
        this.invalidFields.nameReq = form.name.$error.required;
        if(!form.$invalid){
          orgResources.user().update({userId: id},jQuery.param(c.dataC)).$promise
          .then(function(response){
            c.confirmPopup.message = 'Changes successfully made';
            c.confirmPopup.show();
            $timeout(function(){
              c.confirmPopup.hide();
            },2000);
            c.changeNameMail.abort();
            c.getInfo();
          },function(response){
            if(response.status===422){
              c.changeNameMail.errors.length = 0;
              mixedContentToArray.process(response.data, c.changeNameMail.errors,true);
            }
          });
        }
      }
    };
    c.changePassword = {
      errors : [],
      inChange : false,
      form : $scope.nmeForm,
      invalidFields : {
        passwordLength : false,
        passwordMatch : false
      },
      abort : function(){
        this.inChange = false;
      },
      show : function(){
        this.inChange = true
      },
      submit : function(){
        var form = $scope.changeForm;
        this.invalidFields.passwordLen = form.password.$error.minlength;
        this.invalidFields.passwordMatch = (c.dataC.password !== c.dataC.password_confirmation);
        if(!form.$invalid && !this.invalidFields.passwordMatch ){
          c.dataC.pass
          orgResources.user().update({userId: id},jQuery.param(c.dataC)).$promise
          .then(function(response){
            c.confirmPopup.message = 'Changes successfully made';
            c.confirmPopup.show();
            $timeout(
              function(){
                c.confirmPopup.hide();
              },2000);
              c.changePassword.abort();
              c.getInfo();
            },function(response){
              if(response.status===422){
                mixedContentToArray.process(response.data, c.changePassword.errors,true);
              }
            })
          }
        }
      };
      //Get user info in the context of an org
      c.getInfo = function(){
        //restful show
        orgResources.user().get({userId:id}).$promise
        .then(function(response){
          c.data = response;
          c.dataC.name = c.data.name;
          c.dataC.email = c.data.email;
        });
      };
      //Delete an user in the context of an org
      c.delete = function(){
        //restful delete
        orgResources.user().remove({userId:id}).$promise
        .then(function(response){
          c.confirmPopup.message = 'Deletion successfully made';
          c.confirmPopup.show();
          $timeout(function(){
            c.confirmPopup.hide();
            $location.path('/organization');
          },2000);

        });
      }
      c.getInfo();
    }


    var app = angular.module('Plunner');
    app.controller('userController',controller);
  }())
