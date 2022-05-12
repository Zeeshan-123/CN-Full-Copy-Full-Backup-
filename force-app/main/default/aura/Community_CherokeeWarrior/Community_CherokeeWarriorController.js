({
	doInit : function(component, event) 
    {
      		//get user's Veteran's  related info
        	var action = component.get("c.getUserInfo");
        	action.setCallback(this,function(response)
            {
 			var state = response.getState();
             if (state === "SUCCESS")
             {
               var resultData = response.getReturnValue();
     	 	   component.set("v.veteranRecList",resultData);       
              }
                
              if (state === "ERROR")
             {
            var toastEvent = $A.get("e.force:showToast");
        	toastEvent.setParams({
                        title : 'ERROR',
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
    
      doRender : function(component, event, helper) 
		{
        var frames = document.getElementsByName("frm");
   
     
        for (var j = 0; j < frames.length; j++)
        {
            var frame = frames[j];
            frame.setAttribute("allowfullscreen", "true");
            frame.setAttribute("src", "https://www.youtube.com/embed/jbiKVMEnkps");
        }
        
     
    },
    
    ShowCreateModuleBox: function(component, event, helper) 
    {
      
      component.set("v.ShowCreateModule", false); 
      component.set("v.ShowCreateModule", true);
      
   },
    
    // called by onuploadfinished attribute
       refreshView: function(component, event, helper)
    {
       $A.get('e.force:refreshView').fire();
   },
    
    
    ShowEditModuleBox: function(component, event, helper) 
    {      
        var rectarget = event.target.dataset.id;
        
 		component.set("v.parentId",rectarget);
        component.set("v.ShowEditModule", false); 
      	component.set("v.ShowEditModule", true);
  
    },
    
  
})