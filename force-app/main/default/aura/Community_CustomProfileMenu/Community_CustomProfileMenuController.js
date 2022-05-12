({	
    doInit : function(component, event) 
    {
      		//get username
        	var action = component.get("c.getUserInfo");
        	action.setCallback(this,function(response)
            {
            
 			var state = response.getState();
             if (state === "SUCCESS")
             {
               var resultData = response.getReturnValue();
               component.set("v.userName",resultData.Name); 
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
    handleClick : function(component, event, helper)
    {
        var source = event.getSource();
        var label = source.get("v.label");
        
        if(label=="Logout")
        {
           window.location.replace('/secur/logout.jsp');
        }
        
        if(label=="Profile Settings")
        {
           window.location.replace('/s/profile-settings');
        }
        
    }
})