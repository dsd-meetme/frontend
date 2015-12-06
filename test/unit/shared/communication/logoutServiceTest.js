describe('logoutService service tests', function(){
  var service;
  var cookies;
  var location;
  beforeEach(module('Plunner'));
  beforeEach(inject(function(_logoutService_,_$cookies_,_$location_){
    service = _logoutService_;
    cookies = _$cookies_;
    location = _$location_;
  }));
  it('should fire an exception when the unique argument passed is not a string',function(){
    var flag;
    try {
      service.logout(23);
    }
    catch(e){
      flag = true;
      expect(e.constructor.name).toEqual('InvalidArgumentException');
      expect(e.argumentIndex).toEqual(0);
    }
    expect(flag).toBe(true);
  });
  it('should remove a cookie whose name is "auth_token"',function(){
    cookies.put('auth_token','cookie');
    service.logout('url');
    expect(cookies.get('auth_token')).not.toBeTruthy();
  });
  it('should change the current location of the browser(aka url) with the given one',function(){
    service.logout('myurl');
    expect(location.url()).toEqual('/myurl');
  })
})
