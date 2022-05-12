({
    sendIsolationNotes : function(component, event, helper){
        
        var action = component.get("c.sendIsolationNote");
        action.setParams({ 
            acntId 	:	component.get("v.AccountId"),
            email	:	component.get("v.EmailToSendIsolationNote")	
        }); 
        action.setCallback(this,function(response){
            debugger;
            var state = response.getState();
            if (state === "SUCCESS"){
                //enable Next button
                component.set("v.isActive", false);
                //hide spinner
                $A.util.addClass(component.find("spinner"), "slds-hide");
                helper.showSuccessMessage(component, event, helper, 'Email Sent Successfully.');
                var resultData = response.getReturnValue();
                component.set("v.QS2", false);
                component.set("v.QS3", true);
            }
            if (state === "ERROR"){
                var err='';
                var errors = response.getError();
                errors.forEach( function (error){
                    //top-level error.  there can be only one
                    if (error.message){
                        err=err+' '+error.message;					
                    }
                    //page-level errors (validation rules, etc)
                    if (error.pageErrors){
                        error.pageErrors.forEach( function(pageError) {
                            err=err+' '+pageError.message;					
                        });					
                    }
                    
                    if (error.fieldErrors){
                        //field specific errors--we'll say what the field is					
                        for (var fieldName in error.fieldErrors){
                            //each field could have multiple errors
                            error.fieldErrors[fieldName].forEach( function (errorList){	
                                err=err+' '+errorList.message, "Field Error on " + fieldName + " : ";						
                            });                                
                        };  //end of field errors forLoop					
                    } //end of fieldErrors if
                }); //end Errors forEach
                
                helper.showErrorMessage(component, event, helper, err);
            }
        });   
        $A.enqueueAction(action);
    },
    setCAssessment : function(component, event, helper, message){
        var CA = component.get("v.ClinicalAssessmentToMakeCall");
        var Assessment = [ "SubjectiveFever", "Chills", "WorseningCough", "ShortnessOfBreath", "Fatigue", "MuscleAches", "Headache", "LossOfTaste",
                          "SoreThroat", "RunnyNose", "Nausea", "Diarrhea", "Other"];
        
        for(var i = 0; i < Assessment.length; i++) {
            var fieldId = Assessment[i];
            var cmpFindFieldId = component.find(fieldId);
            var fieldValue = cmpFindFieldId.get("v.checked");
            if(fieldValue){
                if(fieldId == "SubjectiveFever")
                    CA.HealthCloudGA__SubjectiveFever__c = 'true';
                else if(fieldId == "Chills")
                    CA.HealthCloudGA__Chills__c = 'true';
                else if(fieldId == "WorseningCough")
                    CA.HealthCloudGA__Cough__c = 'true';
                else if(fieldId == "ShortnessOfBreath")
                    CA.HealthCloudGA__ShortnessOfBreath__c = 'true';
                else if(fieldId == "Fatigue")
                    CA.Fatigue__c = 'true';
                else if(fieldId == "MuscleAches")
                    CA.HealthCloudGA__MuscleAches__c = 'true';
                else if(fieldId == "Headache")
                    CA.HealthCloudGA__Headache__c = 'true';
                else if(fieldId == "LossOfTaste")
                    CA.New_Lost_of_Taste_Smell__c = 'true';
                else if(fieldId == "SoreThroat")
                    CA.HealthCloudGA__SoreThroat__c = 'true';
                else if(fieldId == "RunnyNose")
                    CA.HealthCloudGA__RunnyNose__c = 'true';
                else if(fieldId == "Nausea")
                    CA.HealthCloudGA__NauseaOrVomiting__c = 'true';
                else if(fieldId == "Diarrhea")
                    CA.HealthCloudGA__Diarrhoea__c = 'true';
                else if(fieldId == "Other")
                    CA.HealthCloudGA__OtherSymptoms__c = component.get("v.ClinicalAssessment.HealthCloudGA__OtherSymptoms__c");                                         
            }
        }
        component.set("v.ClinicalAssessmentToMakeCall", CA);
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
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title : 'Success',
            message: message,
            duration:' 5000',
            key: 'info_alt',
            type: 'success',
            mode: 'dismissible'
        });
        toastEvent.fire();
    }

   
})