describe('arrayToUrlParams service tests', function(){
  var service;
  beforeEach(module('Plunner'));
  beforeEach(inject(function(_arrayToUrlParams_){
    service = _arrayToUrlParams_;
  }));
  it('should fire an exception when the first argument passed is not a string',function(){
    var flag;
    try{
      service.process(213,[]);
    }
    catch(e){
      flag = true;
      expect(e.constructor.name).toEqual("InvalidArgumentException");
      expect(e.argumentIndex).toEqual(0);
    }
    expect(flag).toBe(true);
  });
  it('should fire an exception when the first argument passed is an empty string',function(){
    var flag;
    try{
      service.process("",[]);
    }
    catch(e){
      flag = true;
      expect(e.constructor.name).toEqual("InvalidArgumentException");
      expect(e.argumentIndex).toEqual(0);
    }
    expect(flag).toBe(true);
  });
  it('should fire an exception when the second argument passed is not an array',function(){
    var flag;
    try{
      service.process("string",12323);
    }
    catch(e){
      flag = true;
      expect(e.constructor.name).toEqual("InvalidArgumentException");
      expect(e.argumentIndex).toEqual(1);
    }
    expect(flag).toBe(true);
  });
  it('should produce a string that represents in url like way the given array',function(){
    var name, array,string,flag;
    name = "name";
    array = [1,3,4,3];
    try{
      string = service.process(name,array);
    }
    catch(e){
      flag = true;
    }
    expect(flag).not.toBe(true);
    expect(string).toEqual("name[0]=1&name[1]=3&name[2]=4&name[3]=3");
  })
})
