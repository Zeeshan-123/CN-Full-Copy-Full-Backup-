({
     doInit : function(component, event, helper) 
    {
        var userCheck = $A.get("$SObjectType.CurrentUser.Id");
        if (!$A.util.isUndefined(userCheck) || userCheck != null )
        {
            window.location.replace('/s/');
        }
        else
        {
            component.set("v.showforgotPassWindow", true);
        }
    },
    
        clearError : function(component, event)  
    {
		var fieldId = event.getSource().getLocalId();
        var fieldInput = component.find(fieldId);
        var fieldValue = fieldInput.get("v.value");
        
        if(fieldValue != '')
        {
          //  $A.util.removeClass(fieldId, 'slds-has-error');
            fieldInput.setCustomValidity('');
         	fieldInput.reportValidity();
        }
        
        
    },
    
    handleForgotPassword: function (component, event, helpler)
    {
        helpler.handleForgotPassword(component, event, helpler);
    },

     handleCancel: function (component, event, helpler) 
    {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
          "url": '/s/login'
        });
        urlEvent.fire();
     },
})