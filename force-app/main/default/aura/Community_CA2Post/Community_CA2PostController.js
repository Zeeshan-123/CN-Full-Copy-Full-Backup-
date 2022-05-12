({
	    doInit : function(component, event, helper)   {
        var action = component.get("c.validateApplicantEligibility");
           		
            action.setCallback(this,function(response) {
 			var state = response.getState();

              if (state === "SUCCESS")  {
                  var resultData = response.getReturnValue(); 
                  // request exist 
                  if (resultData.ClothingVoucherApp != undefined) {
                      var result = response.getReturnValue();
                      component.set("v.caseId", result.ClothingVoucherApp.Id);
                      component.set("v.requestNumber", result.ClothingVoucherApp.CaseNumber);
                      // show success message
                      component.set("v.showSuccessMessage", true);
                  }//end
                 
                  //show dealine message
                  else{
                      component.set("v.showDeadLineMessage", true);
                  }
              }                                                   
            if (state === "ERROR")  {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title : 'SUCCESS',
                    message: response.getReturnValue(),
                    duration:' 60000',
                    key: 'info_alt',
                    type: 'error',
                    mode: 'pester'
                });
                toastEvent.fire();
            }
        });   
        
        $A.enqueueAction(action);
      	
    },
    
     viewRequest: function(component, event, helper)  {
         var recId = component.get("v.caseId");
         window.location.replace('/s/detail/'+recId);
     }, 
})