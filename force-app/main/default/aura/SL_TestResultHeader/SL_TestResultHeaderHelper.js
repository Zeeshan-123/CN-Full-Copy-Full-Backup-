({
    getDataOnInit : function (cmp, event, helper) {
        var action = cmp.get("c.getPatientDetailForHeader");
        action.setParams({
            'strAccId' : cmp.get('v.pId'),
            'ehrId' : cmp.get('v.ehrId'),
        });
        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var resultData = response.getReturnValue();
                console.table('===resultData===>', resultData);

                let patientName = (resultData.hasOwnProperty('currentPatientAcc') && resultData.currentPatientAcc.hasOwnProperty('Name') ) ?
                                  resultData.currentPatientAcc.Name : '';
                cmp.set('v.patientName', patientName);

                // let testResult = (resultData.hasOwnProperty('currentEhr') && resultData.currentEhr.hasOwnProperty('Testing_Status__c') ) ?
                //                   resultData.currentEhr.Testing_Status__c : '';
                // cmp.set('v.testResult', testResult);

                // let testDate = (resultData.hasOwnProperty('currentEhr') && resultData.currentEhr.hasOwnProperty('HealthCloudGA__AppliesDateTime__c') ) ?
                //                 resultData.currentEhr.HealthCloudGA__AppliesDateTime__c : '';

                let testResult = (resultData.hasOwnProperty('currentEhr') && resultData.currentEhr.hasOwnProperty('ehrTestingStatus') ) ?
                                  resultData.currentEhr.ehrTestingStatus : '';
                cmp.set('v.testResult', testResult);

                let testDate = (resultData.hasOwnProperty('currentEhr') && resultData.currentEhr.hasOwnProperty('ehrResultDateTime') ) ?
                                resultData.currentEhr.ehrResultDateTime : '';
                cmp.set('v.testDate', testDate);
            }
            if (state === "ERROR") {
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
    }
})