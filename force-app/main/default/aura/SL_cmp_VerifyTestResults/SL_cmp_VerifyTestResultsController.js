({
    doInit : function(component, event) {
        let urlParams = decodeURIComponent(window.location.search.substring(1));

        let recordId = '';
        let resultType = '';
        let ehrId = '';
        if(!$A.util.isEmpty(urlParams)) {
            let lstParams = urlParams.split('&');
            if(urlParams.includes('pId')) {
                recordId = (lstParams[0]).split('=')[1];
            } else if(urlParams.includes('Id')) {
                recordId = (lstParams[0]).split('=')[1];
            }
            if(urlParams.includes('ehrId')) {
                ehrId = (lstParams[1]).split('=')[1];
            }
            if(urlParams.includes('test')) {
                resultType = (lstParams[2]).split('=')[1];
            }
        }
        component.set('v.pId', recordId);
        component.set('v.ehrId', ehrId);
        component.set('v.resultType', resultType);

        let apexCallParams = {
            'strAccId' : recordId,
            'resultType' : resultType,
            'ehrId' : ehrId
        };

        var action = component.get("c.updateAttemptCount");
        action.setParams(apexCallParams);
        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var resultData = response.getReturnValue();
                if(resultData.hasOwnProperty('currentPatientAcc')) {
                    component.set('v.acnt', resultData.currentPatientAcc);
                    component.set('v.PersonContactId', resultData.currentPatientAcc.PersonContactId);
                }
                component.set('v.showInputS', true);

                if($A.util.isEmpty(resultType) && urlParams.includes('Id')) {
                    component.set('v.diseaseCommPageUrl',
                                  (resultData.lstCnDiseaseMdt.filter(ele => ele.Name_of_Disease__c.includes('Flu')))[0].Community_Page_URL__c);
                }
                else {
                    (resultData.lstCnDiseaseMdt).forEach(ele => {
                        if(ele.Result_URL_Parameter__c.includes(resultType)) {
                            component.set('v.diseaseCommPageUrl', ele.Community_Page_URL__c);
                        }
                    })
                }
            }
            if (state === "ERROR") {
                component.set('v.showInputS', true);
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
    
    validateUser : function(component, event, helper) {
        // Show Spinner
        helper.showSpinner(component, event, helper);

        var DobFId = component.find('DateOfBirth');
        var Dob	= component.get('v.Dob');
        var errorMessages = null;
        var formatedDate = Dob.replace(/(\d\d)\/(\d\d)\/(\d{4})/, "$3-$1-$2");
        var date_regex = /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/ ;
        var checkDateFormate = date_regex.test(Dob);

        //is Date of Birth field is empty?
        if($A.util.isEmpty(Dob)) {
            DobFId.setCustomValidity("Date of Birth required.");
            DobFId.reportValidity();
        }
        else {
            if(!checkDateFormate) {
                errorMessages='Invalid date format, correct one is MM/DD/YYYY.';
                helper.showError(component, event, errorMessages);
                
                // Hide Spinner
                helper.hideSpinner(component, event, helper);

                // Enable the Next Button
                component.set("v.isActive", false);
            }
            // if no error then make server call  
            else {
                component.set('v.formatedDate', formatedDate);

                let isFluPage = component.get('v.isFluPage');
                let isCNPage = component.get('v.isCNPage');

                //disable Next button
                component.set("v.isActive", true);
                                
                let acnt = component.get('v.acnt');
                let ehrId = component.get('v.ehrId');

                /* Get the Duplicate Account records */
                var duplicatePatientAction = component.get("c.getDuplicatePatients");
                duplicatePatientAction.setParams({
                    strAccId                :   acnt.Id,
                    ehrId                   :   ehrId,
                    Dob                     :   formatedDate,
                    resultType              :   component.get('v.resultType')
                    // isFluPatientSearch      :   isFluPage,
                    // isCovidNegPatientSearch :   isCNPage
                });
                duplicatePatientAction.setCallback(this,function(response) {
                    var state = response.getState();                    
                    if (state === "SUCCESS") {
                        var rtnVal = response.getReturnValue();
                        console.log('===getDuplicatePatients rtnVal===>', rtnVal);
                        component.set('v.patientEncodedIdMapping', rtnVal.mapAccIdToEncodedId);

                        // If duplciate found
                        if(rtnVal.hasOwnProperty('isDuplicatePatientFound') && rtnVal.isDuplicatePatientFound == true) {
                            if(rtnVal.hasOwnProperty('isSuccess') && rtnVal.isSuccess 
                                && rtnVal.hasOwnProperty('lstMatchingPatients') && rtnVal.lstMatchingPatients.length > 0) 
                            {
                                let tempDups = [];
                                rtnVal.lstMatchingPatients.forEach(ele => {
                                    tempDups.push({'label': ele.Name, 'value': ele.Id});
                                });
                                component.set('v.duplicatePatientOpts', tempDups);
                                component.set('v.isShowDuplicatePatients', true);
                                
                                // Hide DOB input
                                component.set("v.showInputS", false);

                                // Hide Spinner
                                helper.hideSpinner(component, event, helper);
                            }
                        }
                        // If duplciate not found
                        else if(rtnVal.hasOwnProperty('isDuplicatePatientFound') && rtnVal.isDuplicatePatientFound == false) {
                            component.set('v.isShowDuplicatePatients', false);

                            if(rtnVal.hasOwnProperty('isSuccess') && rtnVal.isSuccess 
                                && rtnVal.hasOwnProperty('lstMatchingPatients') && rtnVal.lstMatchingPatients.length == 1) 
                            {
                                let currentPatient = (rtnVal.lstMatchingPatients)[0];
                                component.set('v.selectedDuplicatePatient', currentPatient.Id);

                                let tempMap = component.get('v.patientEncodedIdMapping');
                                for(var key in tempMap){
                                    if(key == currentPatient.Id) component.set('v.selectedDuplicatePatientEncoded', tempMap[key]);
                                }
                                helper.handleSelectedPatientResult(component, event, helper);
                            }
                            else if(!rtnVal.isSuccess && rtnVal.rtnMsg == undefined) {
                                helper.hideSpinner(component, event, helper);
                                helper.showError(component, event, 'Unknown Error!');
                                // Enable the Next Button
                                component.set("v.isActive", false);
                            }
                            else if(!rtnVal.isSuccess && rtnVal.rtnMsg == 'Failed') {
                                helper.hideSpinner(component, event, helper);
                                helper.showError(component, event, 'We could not verify the Date of Birth entered. Please try again.');
                                // Enable the Next Button
                                component.set("v.isActive", false);
                            }
                            else if(!rtnVal.isSuccess && rtnVal.rtnMsg == 'MaxAttemptsReached') {
                                helper.hideSpinner(component, event, helper);
                                component.set("v.showDob", false);
                                // Enable the Next Button
                                component.set("v.isActive", false);
                            }
                        }
                    }
                    if(state === 'ERROR') {
                        // Enable Next button
                        component.set("v.isActive", false);

                        // Hide Spinner
                        helper.hideSpinner(component, event, helper);

                        var err = '';
                        var errors = response.getError();
                        errors.forEach( function (error) {
                            //top-level error.  there can be only one
                            if (error.message) {
                                err = err + ' '+error.message;
                            }
                            //page-level errors (validation rules, etc)
                            if (error.pageErrors) {
                                error.pageErrors.forEach( function(pageError) {
                                    err = err + ' '+pageError.message;
                                });
                            }
                            if (error.fieldErrors) {
                                //field specific errors--we'll say what the field is
                                for (var fieldName in error.fieldErrors) {
                                    //each field could have multiple errors
                                    error.fieldErrors[fieldName].forEach( function (errorList) {
                                        err = err + ' ' + errorList.message, "Field Error on " + fieldName + " : ";
                                    });
                                };
                            }
                        });
                        helper.showError(component, event, err);
                    }
                });
                $A.enqueueAction(duplicatePatientAction);
            }
        }
    },

    handlePatientSelectionChange: function (cmp, event) {
        var changeValue = event.getParam('value');
        component.set('v.selectedDuplicatePatient', changeValue);
    },

    handlePatientResult : function(component, event, helper) {
        let selectedPatientId = component.get('v.selectedDuplicatePatient');
        if($A.util.isEmpty(selectedPatientId)) {
            // Enable Next button
            component.set("v.isActive", false);

            // Hide Spinner
            helper.hideSpinner(component, event, helper);

            helper.showError(component, event, 'Please select at least one Patient to see the test result.');
        } else {
            helper.showSpinner(component, event, helper);
            helper.handleSelectedPatientResult(component, event, helper);
        }
    },

    validateAndReplace: function (component, event) {
        const input = event.getSource();
        const inputValue = input.get('v.value');
        const validValue = inputValue.replace(/^(\d\d)(\d)$/g,'$1/$2')
        .replace(/^(\d\d\/\d\d)(\d+)$/g,'$1/$2')
        .replace(/[^\d\/]/g,'');
        input.set('v.value', validValue);
    },
    
    clearError : function(component, event) {
        var fieldId = event.getSource().getLocalId();
        var fieldInput = component.find(fieldId);
        var fieldValue = fieldInput.get("v.value");
       
        if(fieldValue != '') {
            //  $A.util.removeClass(fieldId, 'slds-has-error');
            fieldInput.setCustomValidity('');
            fieldInput.reportValidity();
        }
    },
})