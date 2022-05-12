({
    doInit : function(component, event) 
    {
        
        var action2 = component.get("c.isSurveyExists");
        action2.setCallback(this, function (resp) {
            var state = resp.getState();
            if (state === "SUCCESS") {
                var resultData = resp.getReturnValue();
                if (!resultData) {
                    //show survey link popup
                    component.set("v.showOptIn", true);
                }
            }
        });
        
        $A.enqueueAction(action2);
        
        
    },
    
    
    dontSHowAgain: function (component, event) {
        //  localStorage.setItem("showSurveyPopup", "No");
        component.set("v.showOptIn", false);
        var Accnt = component.get("v.Accnt");
        var action2 = component.get("c.setOptIn");
        action2.setParams({
            accId : Accnt
        });
        action2.setCallback(this, function (resp) {
            var state = resp.getState();
            if (state === "SUCCESS") {
                
            }
        });
        
        $A.enqueueAction(action2);
        component.set("v.close", true);
    },
    
    UpdateAccount : function(component, event, helper) {
        debugger;
        var Accnt = component.get('v.Accnt');
        console.log(component.get('v.Accnt.Opt_In_to_SMS__c'));
        console.log(component.get('v.Accnt.Opt_In_to_Email__c'));
        
        helper.UpdatePersonAccount(component, event, helper);
    }
})