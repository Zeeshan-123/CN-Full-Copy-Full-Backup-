({
	
    // show toast of success and navigate to newly created case record            
	endRequest: function(component, event, helper)
    {
        var recId=component.get('v.parentId');
        var toastEvent = $A.get("e.force:showToast");
        		toastEvent.setParams({
                        title : 'SUCCESS',
                        message: $A.get("$Label.c.Community_RequestCreatedMessage"),
                        duration:' 2000',
                        key: 'info_alt',
                        type: 'success',
                        mode: 'dismissible'
                    });
                   toastEvent.fire();
                    
                var urlEvent = $A.get("e.force:navigateToURL");
                urlEvent.setParams({
                "url": '/s/detail/'+recId
               });
      			  urlEvent.fire();
   },
                
       // this method shows spinner
    showSpinner: function (component, event, helper)
    {
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-hide");
    },
    
    // this method hides spinner
    hideSpinner: function (component, event, helper) 
    {
        var spinner = component.find("mySpinner");
        $A.util.addClass(spinner, "slds-hide");
    },
    callServer : function(component,method,callback,params) {
        var action = component.get(method);
        if (params) {        
            action.setParams(params);
        }
        
        action.setCallback(this,function(response) {            
            var state = response.getState();
            if (state === "SUCCESS") { 
                // pass returned value to callback function
                callback.call(this,response.getReturnValue());   
            } else if (state === "ERROR") {
                // generic error handler
                var errors = response.getError();
                if (errors) {
                    console.log("Errors", errors);
                    if (errors[0] && errors[0].message) {
                        throw new Error("Error" + errors[0].message);
                    }
                } else {
                    throw new Error("Unknown Error");
                }
            }
        });
        
        $A.enqueueAction(action);
    }
                
})