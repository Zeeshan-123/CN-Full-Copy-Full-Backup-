({
    
    
	HideMe: function(component, event, helper)
    {
      component.set("v.ShowModule", false);
   },
   ShowModuleBox: function(component, event, helper) 
    {
      component.set("v.ShowModule", true);
   },
    
   updateVetRecord: function(component, event, helper)
    {
        	//showing toast event on success
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'Success',
                        message: $A.get("$Label.c.Community_RecordUpdatedSuccessMessage"),
                        duration:' 1000',
                        key: 'info_alt',
                        type: 'success',
                        mode: 'pester'
                    });
           toastEvent.fire();
        // close modal
           component.set("v.ShowModule", false);
        // refresh view to show impact
        $A.get('e.force:refreshView').fire();
   }, 
    
  
})