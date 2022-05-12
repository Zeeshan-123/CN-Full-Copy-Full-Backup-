({
     // this method shows spinner
     showSpinner: function (component, event, helper)
     {
         var spinner = component.find("Spinner2");
         $A.util.removeClass(spinner, "slds-hide");
     },
      // this method hides spinner
    hideSpinner: function (component, event, helper) 
    {
        var spinner = component.find("Spinner2");
        $A.util.addClass(spinner, "slds-hide");
    },
     // show toast of success and navigate to newly created case record            
	endRequest: function(component, event, helper)
    {
        debugger;
        component.set("v.surveyForm",false);
        component.set("v.showSuccessMessage", true);
        this.hideSpinner(component,event,helper);
        
       
        // var recId=component.get('v.caseId');
        var toastEvent = $A.get("e.force:showToast");
        		toastEvent.setParams({
                        title : 'SUCCESS',
                        message: 'Survey submitted successfully',
                        duration:' 2000',
                        key: 'info_alt',
                        type: 'success',
                        mode: 'dismissible'
                    });
                   toastEvent.fire();
                    
        // var urlEvent = $A.get("e.force:navigateToURL");
        //         urlEvent.setParams({
        //         "url": '/s/detail/'+recId
        //        });
      	// 	urlEvent.fire();
   },
   endRequestWithException: function(component, event, helper)
    {
        debugger;
        component.set("v.surveyForm",true);
        this.hideSpinner(component,event,helper);

        var exceptionMsg = component.get("v.exceptionMsg");
        // var recId=component.get('v.caseId');
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title : 'ERROR',
            message: exceptionMsg,
            duration:' 3000',
            key: 'info_alt',
            type: 'error',
            mode: 'dismissible'
        });
        toastEvent.fire();
                    
        // var urlEvent = $A.get("e.force:navigateToURL");
        //         urlEvent.setParams({
        //         "url": '/s/detail/'+recId
        //        });
      	// 	urlEvent.fire();
   },
})