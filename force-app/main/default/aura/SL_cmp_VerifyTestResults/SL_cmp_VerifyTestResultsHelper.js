({
    handleSelectedPatientResult : function(component, event, helper) {
        let selectedPatientId = component.get('v.selectedDuplicatePatient');
        let formatedDate = component.get('v.formatedDate');
        let ehrId = component.get('v.ehrId');
        // let isFluPage = component.get('v.isFluPage');
        // let isCNPage = component.get('v.isCNPage');

        let encodedAccId;
        let tempMap = component.get('v.patientEncodedIdMapping');
        for(var key in tempMap) {
            if(key == selectedPatientId) encodedAccId = tempMap[key];
        }

        // Get the Account info
        var action = component.get("c.getUserInfo");
        action.setParams({
            strAccId                :   selectedPatientId,
            ehrId                   :   ehrId,
            Dob                     :   formatedDate
        });
        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var resultData = response.getReturnValue();
                // Disable Next button
                component.set("v.isActive", false);
                
                this.hideSpinner(component, event, helper);
                
                if (resultData == null) {
                    var err = 'Invalid URL or Date of Birth.';
                    this.showError(component, event, err);
                }
                else {
                    //if APEX error
                    if(resultData == undefined) {
                        this.showError(component, event, 'Unknown Error!');
                        // Enable the Next Button
                        component.set("v.isActive", false);
                    }
                    //if failed
                    else if(resultData == "Failed") {
                        this.showError(component, event, 'We could not verify the Date of Birth entered. Please try again.');
                        // Enable the Next Button
                        component.set("v.isActive", false);
                    }
                    //if Max attempts reached  
                    else if(resultData == "MaxAttemptsReached") {
                        component.set("v.showDob", false);
                        // Enable the Next Button
                        component.set("v.isActive", false);
                    }
                    //Succeed
                    else {
                        // Hide the Patient Selection
                        component.set('v.isShowDuplicatePatients', false);
                        component.set("v.acnt", resultData);
                        component.set("v.showInputS", false);    // Vikash: Commenting for testing purpose
                        
                        let redirectUrl = component.get('v.diseaseCommPageUrl') + '?pId=' + encodedAccId + '&ehrId=' + component.get('v.ehrId') + '&test=' + component.get('v.resultType');
                        var urlEvent = $A.get("e.force:navigateToURL");
                        urlEvent.setParams({
                            "url":  redirectUrl
                        });
                        urlEvent.fire();
                                                
                        // if(isCNPage) {
                        //     component.set("v.isShowFluPositiveResult", false);
                        //     component.set("v.isShowCovidNegative", true);
                        // }
                        // else if(isFluPage) {
                        //     component.set("v.isShowCovidNegative", false);
                        //     component.set("v.isShowFluPositiveResult", true);
                        // }
                    }
                }
            }
            if(state === 'ERROR') {
                // Hide Spinner
                this.hideSpinner(component, event, helper);

                var err='';
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
                                err=err+' '+errorList.message, "Field Error on " + fieldName + " : ";
                            });
                        };
                    }
                });
                this.showError(component, event, err);
            }
        });
        $A.enqueueAction(action);
    },

    showError: function (component, event, error) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title : 'ERROR',
            message: error,
            duration:' 10000',
            key: 'info_alt',
            type: 'error',
            mode: 'dismissible'
        });
        toastEvent.fire();
    },

    showSpinner : function (cmp, event, helper) {
        var spinner = cmp.find("bSpinner");
        $A.util.removeClass(spinner, "slds-hide");
        $A.util.addClass(spinner, "slds-show");
    },

    hideSpinner : function (cmp, event, helper) {
        var spinner = cmp.find("bSpinner");
        $A.util.removeClass(spinner, "slds-show");
        $A.util.addClass(spinner, "slds-hide");
    },


    /* 
    // Get the Account info
    var action = component.get("c.getUserInfo");
    action.setParams({
        strAccId                :   acnt.Id,      // rid,
        Dob                     :   formatedDate,
        isFluPatientSearch      :   isFluPage,
        isCovidNegPatientSearch :   isCNPage
    });
    action.setCallback(this,function(response) {
        var state = response.getState();
        if (state === "SUCCESS") {
            var resultData = response.getReturnValue();
            //disable Next button
            component.set("v.isActive", false);
            
            //hide spinner
            var spinner = component.find("bSpinner");
            $A.util.addClass(spinner, "slds-hide");
            
            if (resultData == null) {
                var err = 'Invalid URL or Date of Birth.';
                helper.showError(component, event, err);
            }
            else {
                //if APEX error
                if(resultData == undefined) {
                    helper.showError(component, event, 'Unknown Error!');
                }
                //if failed
                else if(resultData == "Failed") {
                    helper.showError(component, event, 'We could not verify the Date of Birth entered. Please try again.');
                }
                //if Max attempts reached  
                else if(resultData == "MaxAttemptsReached") {
                    component.set("v.showDob", false);
                }
                //Succeed
                else {
                    component.set("v.acnt", resultData);
                    // component.set("v.showInputS", false);    // Vikash: Commenting for testing purpose
                    if(isCNPage) {
                        component.set("v.isShowFluPositiveResult", false);
                        component.set("v.isShowCovidNegative", true);
                    }
                    else if(isFluPage) {
                        component.set("v.isShowCovidNegative", false);
                        component.set("v.isShowFluPositiveResult", true);
                    }
                }
            }
        }
        if(state === 'ERROR') {
            //hide spinner
            var spinner = component.find("Spinner2");
            $A.util.addClass(spinner, "slds-hide");
            var err='';
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
                            err=err+' '+errorList.message, "Field Error on " + fieldName + " : ";
                        });
                    };  //end of field errors forLoop
                }   //end of fieldErrors if
            });     //end Errors forEach
            helper.showError(component, event, err);
        }
    });
    $A.enqueueAction(action);
    */
})