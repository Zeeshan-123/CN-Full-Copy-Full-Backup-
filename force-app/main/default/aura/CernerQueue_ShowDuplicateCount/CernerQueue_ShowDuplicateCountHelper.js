({
    
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
})