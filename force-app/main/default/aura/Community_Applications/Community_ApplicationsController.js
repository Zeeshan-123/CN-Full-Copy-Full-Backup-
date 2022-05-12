({
    doInit: function (component, event) {
        var action = component.get("c.getInfo");
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var resultData = response.getReturnValue();
                var cases = resultData;
                if (cases.length > 0) {
                    for (var i = 0; i < cases.length; i++) {

                        if (cases[i].Request_Reason__c == 'CA')
                            component.set("v.ClothingAssistanceURL", $A.get("$Label.c.Community_CAURL"));

                        if (cases[i].Request_Reason__c == 'HA')
                            component.set("v.HuntURL", $A.get("$Label.c.Community_HuntDrawURL"));

                        if (cases[i].Request_Reason__c == 'Student Coat Assistance')
                            component.set("v.CoatAssistanceURL", $A.get("$Label.c.Community_CA2URL"));
                    }
                }
            }
            if (state === "ERROR") {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title: 'SUCCESS',
                    message: response.getReturnValue(),
                    duration: ' 5000',
                    key: 'info_alt',
                    type: 'error',
                    mode: 'pester'
                });
                toastEvent.fire();
            }
        });

        $A.enqueueAction(action);
        var action = component.get("c.getAccount");
        action.setCallback(this, function (response) {
            var state = response.getState();
            debugger;
            if (state === "SUCCESS") {
                var resultData = response.getReturnValue();
                var acc = resultData;
                debugger;
                console.log(acc.Eligible_For_Housing_Stipend__c);
                if (acc.Eligible_For_Housing_Stipend__c) {
                    component.set("v.ShowHousing", acc.Eligible_For_Housing_Stipend__c);

                    debugger;

                }
                 console.log(acc.Hotspot_Eligible__c);
                if (acc.Hotspot_Eligible__c) {
                    component.set("v.ShowMobileHotspot", acc.Hotspot_Eligible__c);

                }
               
            }
            if (state === "ERROR") {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title: 'ERROR',
                    message: response.getReturnValue(),
                    duration: ' 5000',
                    key: 'info_alt',
                    type: 'error',
                    mode: 'pester'
                });
                toastEvent.fire();
            }
        });
        $A.enqueueAction(action);
    },
})