({
    doInit : function(component, event, helper) 
    {
        var action = component.get("c.getApplicantInfo");
        
        action.setCallback(this,function(response)
                           {
                               var state = response.getState();
                               
                               if (state === "SUCCESS")
                               {
                                   var resultData = response.getReturnValue(); 
                                   
                                   // request exist 
                                   if (resultData.caseExists)
                                   {
                                       component.set("v.caseId",resultData.caseObj.Id);
                                       component.set("v.requestNumber", resultData.caseObj.CaseNumber);
                                       component.set("v.showSuccessMessage", true);
                                       debugger
                                       if (resultData.caseObj.Status === "Selected") {
                                           //component.set("v.selectedOrNotSelected","Congratulations!");
                                           //component.set("v.selectedOrNotSelectedMsg","You’ve been selected to participate in Cherokee Nation’s 2021 Controlled Hunt. Specifically, the " + resultData.caseObj.Selected_Event__c + ".  Cherokee Nation will contact you soon with more details.")
                                           //component.set("v.selectedOrNotSelectedDescription","If you have any questions or are no longer interested in participating in this hunt, please contact the Wildlife Conservation department by calling " + 918-453-5000 + ", ext. 5333.")
                                           component.set("v.showSelectedMessage",true);
                                           component.set("v.showSuccessMessage", false);
                                           component.set("v.winningEvent",resultData.caseObj.Selected_Event__c);
                                           
                                       } else if (resultData.caseObj.Status === "Not Selected") {
                                           component.set("v.showNotSelectedMessage",true);
                                           component.set("v.showSuccessMessage", false);
                                           
                                           //component.set("v.selectedOrNotSelected","Thank You");
                                           //component.set("v.selectedOrNotSelectedMsg","Thank you for applying for Cherokee Nation’s inaugural Controlled Hunt program. Unfortunately, you were not selected to participate in a controlled hunt this year.")
                                           //component.set("v.selectedOrNotSelectedDescription","As Cherokee citizens, we are blessed with access to thousands of acres, on which to freely hunt, fish and gather. The following is a link to the map of properties, within the Cherokee reservation, open and available for these activities, WALK IN ONLY. (Click Here to view Hunting and Fishing Lands)  Please enjoy these properties while waiting for next year’s Controlled Hunt application.")
                                       } else if (resultData.caseObj.Status === "Pending") {
                                           
                                       }
                                   }
                                   //show dealine message
                                   else
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
    
    viewRequest: function(component, event, helper)
    {
        var recId = component.get("v.caseId");
        window.location.replace('/s/detail/'+recId);
    }, 
})