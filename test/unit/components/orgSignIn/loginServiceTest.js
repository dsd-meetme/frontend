describe('organization login service',function(){
  var service;
  var rootScope;
  var backEnd;
  var location;
  var registeredUsers = {
    email : 'test@test.com',
    password : 'test'
  }
  beforeEach(module('Plunner'));
  beforeEach(inject(function(_loginService_,_$rootScope_,_$httpBackend_,_$location_){
    service = _loginService_;
    rootScope = _$rootScope_;
    backEnd = _$httpBackend_;
    location = _$location_
  }))
  beforeEach(function(){
    backEnd.when(
      'POST','http://api.plunner.com/companies/auth/login'
    ).respond(function(method, url, data, headers, params){
      var mail = data.split('&')[0].split('=')[1];
      var pwd = data.split('&')[1].split('=')[1];
      if(mail === registeredUsers.email && pwd === registeredUsers.password){
        return [200];
      }
      else{
        return [422];
      }

    });
  })
  it('should manage 422 response error', function() {
    service.login({
      email : 'asdasd',
      pwd : 'sdasd'
    });
    backEnd.flush();
    expect(service.success()).toBe(false);
    expect(service.error()).toBe(true);
  });
  it('should manage successfull responses',function(){
    service.login({
      email : 'test@test.com',
      pwd : 'test'
    });
    backEnd.flush();
    expect(service.success()).toBe(true);
    expect(service.error()).toBe(false)
  })

})
