(function(){
  var service = function(){
    var data = {
      empId : undefined,
      groupId : undefined
    }
    return {
      getEmpId : function(){
        return data.empId;
      },
      getGroupId : function(){
        return data.groupId;
      },
      clearData : function(){
        data.empId = undefined;
        data.groupId = undefined;
      }
    }
  }
}())
