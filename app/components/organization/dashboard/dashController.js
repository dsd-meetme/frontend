(function(){
  /**
  An controller to manage the actions that can be accomplished by a plunner organization
  @author Giorgio Pea
  @param logoutService A service used to manage the logout of a plunner's organization
  **/
  var controller = function(logoutService,orgResources,$cookies,$http){
    var self = this;
    self.errors = {
      unauthorized : false,
      forbidden : false
    }
    self.data = {};
    //Logout
    self.logout = function(){
        logoutService.logout('/osignin');
    };
    //Get employees
    self.getEmployees = function(){
      //employees restful index
      orgResources.employee().query({employeeId : ''}).$promise
      //console.log('token to deliver '+$cookies.get('auth_token'))
      /*$http({
        method : 'GET',
        url : 'http://api.plunner.com/companies/employees',
        headers : {
          Authorization : $cookies.get('auth_token')
        }
      })*/
      .then(function(response){
        console.log(response.headers);
        /*$cookies.remove('auth_token');
        $cookies.put('auth_token',response.headers('Authorization'));*/
        console.log('token ricevuto '+$cookies.get('auth_token'));
        self.data.employees = response;
        self.getGroups();
      },function(response){
        if(response.status === 401){
          self.errors.unauthorized = true;
        }
        else if(response.status === 403){
          self.errors.forbidden = true;
        }
      });
    }
    //Get groups
    self.getGroups = function(){
      //employees restful groups index
      orgResources.group().query({groupId : ''}).$promise
      .then(function(response){
        console.log(response)
        self.data.groups = response;
        console.log(self.data.groups);
        console.log($cookies.get('auth_token'));

      }, function(response){
        if(response.status === 401){
          self.code = 401;
        }
        else if(response.status === 403){
          self.code = 403;
        }
      })
    }
    self.getEmployees();
  }

  var app = angular.module('Plunner');
  app.controller('dashOrgController',controller);
}())
