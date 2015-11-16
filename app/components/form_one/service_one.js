var service = function(){
  return {
    get : function(){
      return "string";
    }
  }
}
var app = angular.module("OurApp");
app.service('jo',service);
