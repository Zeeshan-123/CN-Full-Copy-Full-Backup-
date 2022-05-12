({
    handleForgotPassword: function (component, event, helpler) 
    {
        debugger;
        var userNameInput = component.find("username");
        var userName = userNameInput.get("v.value");
        var errorMessages = null;
        
         // custom label
        var userNameRequired = $A.get("$Label.c.Community_UsernameRequiredMessages");
        
        //is username field is empty?
           if($A.util.isEmpty(userName)) 
        {
                errorMessages=userNameRequired;
        }
        
        //is username field is empty?
        if($A.util.isEmpty(userName)) 
        {
            userNameInput.setCustomValidity("Username required.");
            userNameInput.reportValidity(); 
        }
        
        //show error
        if(errorMessages != null)
        {
            var toastEvent = $A.get("e.force:showToast");
        	toastEvent.setParams({
                        title : 'Error',
                        message: errorMessages,
                        duration:' 5000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'dismissible'
                    });
                   toastEvent.fire();
        }
        //make server call
        else
        {
        component.set("v.isActive", true);
                //show spinner
        this.showSpinner(component); 
         var action = component.get("c.forgotPassword");
         action.setParams({
           			 username	:	userName 
        });
        
        action.setCallback(this, function(response) 
        {
            var rtnValue = response.getReturnValue();
            if (rtnValue == 'SUCCESS') 
            {
                //hide spinner
                this.hideSpinner(component); 
                //enable button
                component.set("v.isActive", false);
                //show success message 
                component.set("v.visible", false);
                component.set("v.visibleMessage", true);
                
            }
            
            
            else if (rtnValue != 'SUCCESS') 
            {
                //hide spinner
                this.hideSpinner(component);   
                //enable button
                component.set("v.isActive", false);
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title : 'Error',
                    message: rtnValue,
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'error',
                    mode: 'dismissible'
                });
                toastEvent.fire();
                //  $A.get('e.force:refreshView').fire();
            }
       });
        $A.enqueueAction(action);
        }        
               
    },
        // this method shows spinner
    showSpinner: function (component, event, helper)
    {
        var spinner = component.find("Spinner");
        $A.util.removeClass(spinner, "slds-hide");
    },
    
    // this method hides spinner
    hideSpinner: function (component, event, helper) 
    {
        var spinner = component.find("Spinner");
        $A.util.addClass(spinner, "slds-hide");
    },

    
})