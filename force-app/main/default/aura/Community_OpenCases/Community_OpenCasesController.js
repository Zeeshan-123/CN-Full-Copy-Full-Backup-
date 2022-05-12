({
	doInit : function(component, event, helper)
    {
        debugger;
       var urlEvent = $A.get("e.force:navigateToURL");
                urlEvent.setParams({
                "url": '/s/#openCase'
               });
        urlEvent.fire();    
        window.location.reload();
	}
})