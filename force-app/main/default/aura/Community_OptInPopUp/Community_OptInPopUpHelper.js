({
	UpdatePersonAccount : function(component,event,helper){
         debugger;
        component.set("v.isLoading", true);
        var Accnt = component.get("v.Accnt");
        //var emailOpt = component.get("v.emailChoice"); 
        //var smsOpt = component.get("v.smsChoice");
        debugger;
        
        
        var action = component.get("c.setOptIn");
             action.setParams({
                 accId : 	Accnt,
                 //emailOpt : emailOpt, 
               //  smsOpt : smsOpt, 
                 
                 
              
             });
             debugger; 
             action.setCallback(this, function(response) {
                 var state = response.getState();
                 debugger; 
                 if (state == 'SUCCESS') {
                     debugger; 
                     var result = response.getReturnValue();
                     console.log(result);
                     
                    debugger; 
                     
                     
                     component.set("v.showOptIn", false);
                     
                     component.set("v.isLoading", false);
                     var ReturnAccountObj = component.getEvent("ReturnAccountObj");
                     debugger; 
                     console.log(ReturnAccountObj);
                     debugger; 
                     
                     ReturnAccountObj.setParams({
                         "Accnt" : result,
                     });
                     debugger; 
                    
                     ReturnAccountObj.fire();
                     debugger; 
                 }
                 else if (state == 'ERROR'){
                     debugger; 
                     component.set("v.isLoading", false);
                     let errors = response.getError();
                     helper.showErrorMessage(component, event, helper, errors[0].message);
                 }
             })
             $A.enqueueAction(action); 
        
    //     var CloneAccnt = component.get('v.CloneAccnt');

        //check If data is changed?
         //Email != OrigEmail ||
         
     }
    
 
  
})