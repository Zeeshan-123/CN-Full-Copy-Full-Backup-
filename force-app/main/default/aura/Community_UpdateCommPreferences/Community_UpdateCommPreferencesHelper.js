({
    UpdatePersonAccount : function(component,event,helper){
         debugger;
        component.set("v.isLoading", true);
        var Accnt = component.get('v.Accnt');
        var orgAccnt = component.get('v.orgAccnt');
        debugger;
        var Email = component.get('v.Email');
        var OrigEmail = component.get('v.OrigEmail');
        var emailChoice = component.get('v.emailChoice');
        var smsChoice = component.get('v.smsChoice');
        debugger;
    //     var CloneAccnt = component.get('v.CloneAccnt');

        //check If data is changed?
         //Email != OrigEmail ||
         debugger;
         if( Accnt.Opt_In_to_Email__c != emailChoice || Accnt.Opt_In_to_SMS__c != smsChoice){
            Accnt.Opt_In_to_Email__c = emailChoice; 
             console.log(Accnt.Opt_In_To_Email__c); 
             console.log(emailChoice);
            Accnt.Opt_In_to_SMS__c = smsChoice; 
       debugger; 
      
             
             var action = component.get("c.UpdateAccnt");
             action.setParams({
                 userAccount : 	Accnt,
              
             });
             
             action.setCallback(this, function(response) {
                 var state = response.getState();
                 if (state == 'SUCCESS') {
                     helper.showSuccessMessage(component,event,helper,'Profile changes are updated successfully.');
                     var result = response.getReturnValue();
                     console.log(result);
                     
                    // Re-format Date of Birth
                     var splitDate = result.Date_of_Birth__c.split('-');
                     var year = splitDate[0];
                     var month = splitDate[1];
                     var day = splitDate[2];
                     var uDob = month+'/'+day+'/'+year;
                     result.Date_of_Birth__c = uDob;
                     result.Date_of_Birth__c = uDob;
                     
                     //Re-format mobile phone
                     var number = result.PersonMobilePhone.replace(/\D/g, '').slice(-10);
                     result.PersonMobilePhone = '('+number.substring(0,3)+') '+number.substring(3,6)+'-'+number.substring(6,10);
                     
                     //Re-format home phone
                     if (!$A.util.isUndefinedOrNull(result.Phone)) {
                         var number = result.Phone.replace(/\D/g, '').slice(-10);
                         result.Phone = '('+number.substring(0,3)+') '+number.substring(3,6)+'-'+number.substring(6,10);
                     }
                     
                    
                     component.set("v.isLoading", false);
                     var ReturnAccountObj = component.getEvent("ReturnAccountObj");
                     ReturnAccountObj.setParams({
                         "Accnt" : result,
                     });
                     debugger; 
                     ReturnAccountObj.fire();
                 }
                 else if (state == 'ERROR'){
                     component.set("v.isLoading", false);
                     let errors = response.getError();
                     helper.showErrorMessage(component, event, helper, errors[0].message);
                 }
             })
             $A.enqueueAction(action); 
         }
         else{ // else show message
             component.set("v.isLoading", false);
             helper.showSuccessMessage(component,event,helper,'No changes to save.');
         } 
     },
    
 
   
    
    
    callServer : function(component, method, callback, params, helper) {
        debugger;
        var action = component.get(method);
        if (params) {        
            action.setParams(params);
        }
        
        action.setCallback(this,function(response) {            
            var state = response.getState();
            if (state === "SUCCESS") { 
                // pass returned value to callback function
                callback.call(this,response.getReturnValue());   
            } else if (state === "ERROR") {
                // generic error handler
                var errors = response.getError();
                if (errors) {
                    console.log("Errors", errors);
                    if (errors[0] && errors[0].message) {
                         this.showErrorMessage(component, event, helper, errors[0].message);
                    }
                } else {
                     this.showErrorMessage(component, event, helper, 'Unknown Error');
                }
            }
        });
        
        $A.enqueueAction(action);
    },
    
    //handle error messages
    showErrorMessage : function(component, event, helper, message){

        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title : 'Warning',
            message: message,
            duration:' 7000',
            key: 'info_alt',
            type: 'error',
            mode: 'dismissible'
        });
        toastEvent.fire();
    },
    
    //handle success/informative messages
    showSuccessMessage : function(component, event, helper, message){
        debugger;
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title : 'Success',
            message: message,
            duration:' 3000',
            key: 'info_alt',
            type: 'success',
            mode: 'dismissible'
        });
        toastEvent.fire();
    }
    
})