({
	     getUploadedFiles : function(component, event)
    {
        debugger;
        var action = component.get("c.getFiles");  
        
        action.setParams({  
            "recordId": component.get("v.caseId") 
        });      
        
        action.setCallback(this,function(response)
		{  
            debugger
            var state = response.getState();  
            if(state=='SUCCESS')
            {  
                var result = response.getReturnValue();           
                component.set("v.files",result);  
            }  
        });  
        $A.enqueueAction(action);  
    },
    endRequestWithException: function(component, event, helper)
    {
        debugger;

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
   },
    showToast : function(message){
    var toastEvent = $A.get("e.force:showToast");
    toastEvent.setParams({
        title : 'Warning',
        message: message,
        duration:' 3000',
        key: 'info_alt',
        type: 'error',
        mode: 'dismissible'
    });
    toastEvent.fire();
   },
    deleteUploadedFile : function(component, event) 
    {  
        var action = component.get("c.deleteFile");           
        action.setParams({
            "contentDocumentId": event.currentTarget.id            
        });  
        
        action.setCallback(this,function(response)
        {  
            var state = response.getState();  
            
            if(state=='SUCCESS')
            {  
                this.getUploadedFiles(component);
                component.set("v.showSpinner", false); 
                // show toast on file deleted successfully
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "message": "File has been deleted successfully!",
                    "type": "success",
                    "duration" : 2000
                });
                toastEvent.fire();
            }  
        });  
        $A.enqueueAction(action);  
    },  
})