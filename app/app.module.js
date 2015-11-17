(function(){
  angular.module('Plunner',['ngRoute','ngCookies'])
  .run(['$http', '$cookies', function($http, $cookies) {
  $http.defaults.headers.post['X-XSRF-TOKEN'] = $cookies.get('X-XSRF-TOKEN');
}]);
}());
