(function(){
  var controller = function($scope,$routeParams,orgResources){
    var self = this;
    self.data = {};
    self.errors = {
      unauth : false,
      forb : false
    }
    self.invalidFields = {
      emailVal : false,
      passwordLen : false,
      passwordMatch : false
    }
    self.shallowData = {

    }
    //employee id
    var id = $routeParams.id;
    //Get employee info in the context of an org
    self.getInfo = function(){
      //restful show
      orgResources.employee().get({employeeId:id}).$promise
      .then(function(response){
        self.data = response;
      },function(response){
        if(response.status === 401){
          self.errors.unauth = true;
          self.errors.forb = false;
        }
        else if(response.status === 403){
          self.errors.unauth = false;
          self.errors.forb = true;
        }
      })
    };
    //Delete an employee in the context of an org
    self.delete = function(){
      //restful delete
      orgResources.employee().remove({employeeId:id}).$promise
      .then(function(response){
        alert('Evviva');
        //Show success popup wait for some time
        //redirect
      },function(response){
        if(response.status === 401){
          self.errors.unauth = true;
          self.errors.forb = false;
        }
        else if(response.status === 403){
          self.errors.unauth = false;
          self.errors.forb = true;
        }
      })
    }
    //Update employee info
    self.update = function(data){
        //validation
        orgResources.employees.update({employeeId:id}).$promise
        .then(function(){
          //
        },function(){
          //
        })
    }
    self.editOpen = function(){
      self.nameMailEdit = true;
    }
    self.editClosed = function(){
      self.passwordEdit = true;
    }
    self.getGroups = function(){

    }
    self.nmeConfirm = function(){
      var form = $scope.nmeForm;
      self.invalidFields.emailVal = form.email.$error.email || false;
      console.log(self.invalidFields);
      if(!form.$invalid && self.shallowData !== undefined){
        orgResources.employee().update({employeeId:id},{
          name : self.shallowData.name || undefined,
          email : self.shallowData.email || undefined,
        }).$promise.
        then(function(){
          alert('success');
        },function(){
          alert('failure');
        })
      }
    };
    self.peConfirm = function(){
      var form = $scope.peForm;
      self.invalidFields.passwordLen = form.password.$error.minlength || false;
      self.invalidFields.passwordMatch = (self.shallowData.password !== self.shallowData.cpassword);
      console.log(self.invalidFields);
      if(!form.$invalid && !self.invalidFields.passwordMatch){
        self.update({
          password : self.shallowData.password,
          password_confirmed : self.cpassword
        })
      }
    }
    self.nmeAbort = function(){
      self.nameMailEdit = false;
    }
    self.peAbort = function(){
      self.passwordEdit = false;
    }
    self.getInfo();
  }


  var app = angular.module('Plunner');
  app.controller('empOrgController',controller);
}())
