(function(){
    var app = angular.module('Plunner');

    app.run(function($rootScope, $location,$cookies) {
        //Route filtering
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            //Gets the decoded jwt
            var mode,token, path;
            token = $cookies.get('auth_token');
            //Gets the url the user want to reach
            path = next.originalPath;

            $rootScope['event:comErrorGeneral']
            if(token){
                mode = jwt_decode(token).mode;
            }
            //Mode checking(organizations)
            if(path){
                if(path.search('organization') !== -1){
                    if(angular.isUndefined(mode) || mode !== 'cn'){
                        $location.path('/orgsignin');
                    }
                }
                //Mode checking(employees)
                else if(path.search('employee') !== -1){
                    if(mode === undefined || mode !== 'en'){
                        $location.path('/usignin');
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
}())
