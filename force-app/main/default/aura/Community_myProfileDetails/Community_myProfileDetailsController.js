({
	doInit : function(component, event) 
    {
      		//get user's account related info
        	var action = component.get("c.userDetails");
        	action.setCallback(this,function(response)
            {
            
 			var state = response.getState();
             if (state === "SUCCESS")
             {
               var resultData = response.getReturnValue();
               //var test = resultData.Users[0].Email;
               component.set("v.accnt",resultData); 
                 
              }
                
              if (state === "ERROR")
             {
                  var toastEvent = $A.get("e.force:showToast");
        			toastEvent.setParams({
                        title : 'SUCCESS',
                        message: response.getReturnValue(),
                        duration:' 5000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'pester'
                    });
                   toastEvent.fire();
             }
        });   

        $A.enqueueAction(action);
           
    },
	HideMe: function(component, event, helper)
    {
      component.set("v.ShowModule", false);
   },
   ShowModuleBox: function(component, event, helper) 
    {
        alert('here');
      debugger;
      component.set("v.ShowModule", false);  
      component.set("v.ShowModule", true);
   },        
})