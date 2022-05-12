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
                    component.set("v.showSurveyPopup", true);
                }
            }
        });
        
        $A.enqueueAction(action2);
        
        
    },
    takeToSurvey: function (component, event) {
        window.location.replace("/s/survey-form");
    },
    
    dontSHowAgain: function (component, event) {
        //  localStorage.setItem("showSurveyPopup", "No");
        component.set("v.showSurveyPopup", false);
        var acntId = component.get("v.accntId");
        var action2 = component.get("c.setInterestedInSurveyField");
        action2.setParams({
            accId : acntId
        });
        action2.setCallback(this, function (resp) {
            var state = resp.getState();
            if (state === "SUCCESS") {
                
            }
        });
        
        $A.enqueueAction(action2);
    },
})