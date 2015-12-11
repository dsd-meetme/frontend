(function(){

    var app = angular.module('Plunner');
    var excludedUrlFromToken = [
        'http://api.plunner.com/companies/auth/login',
        'http://api.plunner.com/companies/auth/register',
        'http://api.plunner.com/companies/password/email',
        'http://api.plunner.com/employees/auth/login',
        'http://api.plunner.com/companies/password/email',
        'http://api.plunner.com/companies/password/reset',
        'http://api.plunner.com/employees/password/email',
        'http://api.plunner.com/employees/password/reset'
    ]
    /**
     Http interceptors
     **/
    app.config(['$httpProvider',
        function($httpProvider) {
            $httpProvider.interceptors.push(function($q,$cookies,$rootScope) {
                return {
                    request : function(config) {
                        //If not template retrieving requests
                        if(config.url.search('app/') === -1){
                            //Post requests always pack data as classic post form parameters
                            if(config.method === 'POST' || config.method === 'PUT'){
                                config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
                            }
                            //all requests need to specify a jwt except for the ones in the excludedUrlFromToken array
                            if(excludedUrlFromToken.indexOf(config.url) === -1 ){
                                var token = $cookies.get('auth_token');
                                /*console.log("Url "+config.url);
                                 console.log('Appending token to request '+token);*/
                                if(token){
                                    config.headers.Authorization = token;
                                }
                            }

                        }
                        return config;
                    },
                    response : function(response) {
                        //If not template retrieving requests or OPTIONS requests
                        if(response.config.url.search('app/')===-1 && response.config.method !== 'OPTIONS'){
                            //Gets the refreshed jwt
                            var token;
                            if(response.config.url==='http://api.plunner.com/companies/auth/login' || response.config.url==='http://api.plunner.com/employees/auth/login' ){
                                token = 'Bearer '+response.data.token;
                            }
                            else{
                                token = response.headers('Authorization');
                            }
                            //console.log("Received token "+token);
                            //if a jwt already exists
                            if($cookies.get('auth_token')){
                                $cookies.remove('auth_token');
                            }
                            $cookies.put('auth_token',token);
                        }
                        return response;
                    },
                    responseError : function(response){
                        if(response.status === 401){
                            $location('/401');
                        }
                        else if(response.status === 403){
                            $location('/401');
                        }
                        else if(response.status !== 422){
                            //General com error broadcast
                            $rootScope.$broadcast('event:comErrorGeneral');
                        }
                        return $q.reject(response);
                    }
                };
            });
        }]);
}());
