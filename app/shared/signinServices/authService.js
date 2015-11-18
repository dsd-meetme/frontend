(function(){
    var service = function($http, $cookies, $location,dataManipulator){
      return {
        login : function(credentials){
          $http({
            method : 'post',
            url : '//api.plunner.com/auth/login',
            data : 'email='+credentials.email + '&password='+credentials.pwd,
            withCredentials : true,
          }).then(
            function(response){
              var token = response.token;
              if(credentials.rmbMe==='true'){
                $cookies.put('auth_token',token,{
                  expires : dataManipulator.addDays(7);
                })
              }
              else{
                $cookies.put('auth_token',token);
              }
              $location.path('/dashboard')
            }
          ,
          function(response){
          });
        }
      }
    }
}())
