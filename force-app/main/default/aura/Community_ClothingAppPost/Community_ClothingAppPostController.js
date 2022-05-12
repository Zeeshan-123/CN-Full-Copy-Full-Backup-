({
	    doInit : function(component, event, helper) 
    {
        var action = component.get("c.validateApplicantEligibility");
           		
            action.setCallback(this,function(response)
            {
 			var state = response.getState();

              if (state === "SUCCESS")
              {
                  var resultData = response.getReturnValue(); 
                  
                  // request exist 
                  if (resultData.userClothingApplication == 'True')
                  {
                      var result = response.getReturnValue();
                      component.set("v.caseId", result.ClothingApplication.Id);
                      component.set("v.requestNumber", result.ClothingApplication.CaseNumber);
                      // show success message
                      component.set("v.showSuccessMessage", true);
                      // if application is editable for all aspects
                      if( result.ClothingApplication.Status == 'UNDER REVIEW')
                      {
                          component.set("v.showEditBtn", true);
                      }
                  }//end
                 
                  //show dealine message
                  else if(resultData.noClothingApplicationSubmitted == 'True')
                  {
                      component.set("v.showDeadLineMessage", true);
                  }
              }                                                   
            if (state === "ERROR")
            {
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
      editRequestModal: function(component, event, helper)
    {
       component.set("v.showSuccessMessage", false);
       component.set("v.showCAEdit", true);
    },
    
     viewRequest: function(component, event, helper)
     {
         var recId = component.get("v.caseId");
         window.location.replace('/s/detail/'+recId);
     }, 
})