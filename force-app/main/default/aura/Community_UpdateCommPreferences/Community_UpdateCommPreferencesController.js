({
    doInit : function(component, event, helper) {

        debugger;
        var Accnt = component.get("v.Accnt");
        debugger;
        var orgAccnt =  component.get("v.Accnt");
        var smsChoice = component.get("v.Accnt.Opt_In_to_SMS__c");
        var emailChoice = component.get("v.Accnt.Opt_In_to_Email__c");
        debugger;
        component.set("v.smsChoice", smsChoice);
        debugger; 
         component.set("v.emailChoice", emailChoice);

		
        
        component.set("v.orgAccnt", orgAccnt);
  debugger; 
        
       
        
    },
    
    
   
    
    showWarning: function(component, event, helper) {
    	component.set('v.showMsg', true);
	}, 
    
    showWarning: function(component, event, helper) {
    	component.set('v.showMsg', true);
	}, 
        
    UpdateAccount : function(component, event, helper) {
        debugger;
        var Accnt = component.get('v.Accnt');
        console.log(component.get('v.Accnt.Opt_In_to_SMS__c'));
        console.log(component.get('v.Accnt.Opt_In_to_Email__c'));
        
        helper.UpdatePersonAccount(component, event, helper);
    }
})