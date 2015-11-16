var app = angular.module("OurApp",[])

var controller_domain = ['$scope',function($scope){

  	var domain = $scope.domainName;

  	$scope.checkDomain = function() {
  		if(domain != new String("domain_true")) {
  			alert($domain+" est différent de domain_true");
  		}
  	}
  	
}];

app.controller('domain',controller_domain);
