describe('mixedContentToArray service tests', function(){
  var service;
  beforeEach(module('Plunner'));
  beforeEach(inject(function(_mixedContentToArray_){
    service = _mixedContentToArray_;
  }));
  it('should fire an exception when the first argument passed is not an object',function(){
    var flag;
    try{
      service.process([],[]);
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
      service.process({},12323);
    }
    catch(e){
      flag = true;
      expect(e.constructor.name).toEqual("InvalidArgumentException");
      expect(e.argumentIndex).toEqual(1);
    }
    expect(flag).toBe(true);
  });
  it('should flatten the data in the given object into the given array',function(){
    var object, array,flag;
    object = {
      prop_1 : "string",
      prop_2 : 1,
      prop_3 : ["string_1", 2 ]
    };
    array = [];
    try{
      service.process(object,array);
    }
    catch(e){
      flag = true;
    }
    expect(flag).not.toBe(true);
    expect(array.length).toEqual(4);
    expect(array[0]).toEqual("string");
    expect(array[1]).toEqual(1);
    expect(array[2]).toEqual("string_1");
    expect(array[3]).toEqual(2);
  })
})
