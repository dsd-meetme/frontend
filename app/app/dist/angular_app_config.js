(function () {

    var app = angular.module('Plunner');
    /**
     Http interceptors
     **/
    app.config(['$httpProvider','configServiceProvider',
        function ($httpProvider, configServiceProvider) {
            var apiDomain = configServiceProvider.$get().apiDomain;
            var excludedUrlFromToken = [
                apiDomain + '/companies/auth/login',
                apiDomain + '/companies/auth/register',
                apiDomain + '/companies/password/email',
                apiDomain + '/employees/auth/login',
                apiDomain + '/companies/password/email',
                apiDomain + '/companies/password/reset',
                apiDomain + '/employees/password/email',
                apiDomain + '/employees/password/reset'
            ];

            $httpProvider.interceptors.push(function ($q, $cookies, $location) {
                return {
                    request: function (config) {
                        //If not template retrieving requests
                        if (config.url.search('app/') === -1) {
                            //Post requests always pack data as classic post form parameters
                            if (config.method === 'POST' || config.method === 'PUT') {
                                config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
                            }
                            //all requests need to specify a jwt except for the ones in the excludedUrlFromToken array
                            if (excludedUrlFromToken.indexOf(config.url) === -1) {
                                var token = $cookies.get('auth_token');
                                /*console.log("Url "+config.url);
                                 console.log('Appending token to request '+token);*/
                                if (token) {
                                    config.headers.Authorization = token;
                                }
                            }

                        }
                        return config;
                    },
                    response: function (response) {
                        //If not template retrieving requests or OPTIONS requests
                        if (response.config.url.search('app/') === -1 && response.config.method !== 'OPTIONS' && response.config.url.search('email') === -1) {
                            //Gets the refreshed jwt
                            var token, exp;
                            if (response.config.url === apiDomain + '/companies/auth/login' || response.config.url === apiDomain + '/employees/auth/login') {
                                exp = jwt_decode(response.data.token).exp;
                                token = 'Bearer ' + response.data.token;
                            }
                            else {
                                token = response.headers('Authorization');
                                exp = jwt_decode(token).exp;
                            }
                            if ($cookies.get('auth_token')) {
                                $cookies.remove('auth_token');
                            }
                            $cookies.put('auth_token', token, {
                                expires: new Date(exp * 1000)
                            });
                        }
                        return response;
                    },
                    responseError: function (response) {
                        if (response.status === 401) {
                            $cookies.remove('auth_token');
                            $location.path('/401');
                        }
                        else if (response.status === 403) {
                            $cookies.remove('auth_token');
                            $location.path('/403');
                        }
                        else if (response.status === 404) {
                            //General com error broadcast
                            $location.path('/404')
                        }
                        else if (response.status !== 422) {
                            $cookies.remove('auth_token');
                            $location.path('/error')
                        }
                        return $q.reject(response);
                    }
                };
            });
        }]);
}());

(function(){
    var app = angular.module('Plunner');
    //Routing
    app.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/orgsignin', {
                    templateUrl: 'app/components/organization/signIn/osiTemplate.html',
                    controller: 'osiController',
                    controllerAs: 'osiC'
                }).
                when('/usersignin', {
                    templateUrl: 'app/components/user/signIn/usiTemplate.html',
                    controller: 'usiController',
                    controllerAs: 'usiC'
                }).
                when('/signup', {
                    templateUrl: 'app/components/organization/registration/regTemplate.html',
                    controller: 'regController',
                    controllerAs: 'regC'
                }).
                when('/organization', {
                    templateUrl: 'app/components/organization/dashboard/odashTemplate.html',
                    controller: 'odashController',
                    controllerAs: 'odashC'
                }).
                when('/user', {
                    templateUrl: 'app/components/user/dashboard/udashTemplate.html',
                    controller: 'udashController',
                    controllerAs: 'udashC'
                }).
                when('/organization/profile',{
                    templateUrl: 'app/components/organization/profile/opTemplate.html',
                    controller: 'opController',
                    controllerAs: 'opC'
                }).
                when('/user/schedules/compose/:type', {
                    templateUrl: 'app/components/user/composeSchedule/cschedTemplate.html',
                    controller: 'cschedController',
                    controllerAs: 'cschedC'
                }).
                when('/orgrecovery',{
                    templateUrl: 'app/components/organization/recovery/orecTemplate.html',
                    controller: 'orecController',
                    controllerAs: 'orecC'
                }).
                when('/',{
                    templateUrl: 'app/components/presentation/presTemplate.html'
                }).
                when('/organization/users/:id',{
                    templateUrl: 'app/components/organization/user/userTemplate.html',
                    controller: 'userController',
                    controllerAs: 'userC'
                }).
                when('/organization/groups/:id', {
                    templateUrl: 'app/components/organization/group/groupTemplate.html',
                    controller : 'groupController',
                    controllerAs : 'groupC'
                }).
                when('/user/newmeeting/:type', {
                    templateUrl: 'app/components/user/meeting/nmTemplate.html',
                    controller : 'nmController',
                    controllerAs : 'nmC'
                }).
                when('/userecovery', {
                    templateUrl: 'app/components/user/recovery/urecTemplate.html',
                    controller : 'urecController',
                    controllerAs : 'urecC'
                }).
                when('/usereset/:token', {
                    templateUrl: 'app/components/user/recovery/urstTemplate.html',
                    controller : 'urstController',
                    controllerAs : 'urstC'
                }).
                when('/orgreset/:token', {
                    templateUrl: 'app/components/organization/recovery/orstTemplate.html',
                    controller : 'orstController',
                    controllerAs : 'orstC'
                }).
                when('/user/profile',{
                    templateUrl: 'app/components/user/profile/upTemplate.html',
                    controller: 'upController',
                    controllerAs : 'upC'
                }).
                when('/404', {
                   templateUrl: 'app/components/errors/404.html'
                }).
                when('/403', {
                    templateUrl: 'app/components/errors/403.html'
                }).
                when('/401', {
                    templateUrl: 'app/components/errors/401.html'
                }).
                when('error', {
                    templateUrl: 'app/components/errors/generic.html'
                }).
                when('/signInHub', {
                    templateUrl: 'app/components/presentation/signInHub.html'
                }).
                otherwise({
                    redirectTo: '/404'
                });
        }]);
}());

(function(){
    var app = angular.module('Plunner');

    app.run(function($rootScope, $location,$cookies) {
        //Route filtering
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            //Gets the decoded jwt
            var mode,token, path;
            var excludedUrlsUser = [
                'userecovery',
                'usereset'
            ];
            token = $cookies.get('auth_token');
            //Gets the url the user want to reach
            path = next.originalPath;

            if(token){
                mode = jwt_decode(token).mode;
            }
            //Mode checking(organizations)
            if(path){
                if(path !== '/'){
                    jQuery('.wrapper').removeClass('backgroundLightBlue')
                }
                if(path.search('organization') !== -1){
                    if(angular.isUndefined(mode) || mode !== 'cn'){
                        $location.path('/orgsignin');
                    }
                }
                //Mode checking(employees)
                else if(path.search('user') !== -1 && path.search('recovery') === -1 && path.search('reset') === -1){
                        if(mode === undefined || mode !== 'en'){
                            $location.path('/usersignin');
                        }

                }
                //Redirect if the user is already logged in
                else if(path.search('/orgsignin') !== -1 ){
                    if(mode === 'cn'){
                        $location.path('/organization');
                    }
                }
                else if(path.search('/usersignin') !== -1){
                    if(mode === 'en'){
                        $location.path('/user');
                    }
                }
            }
        });
    });
}());
