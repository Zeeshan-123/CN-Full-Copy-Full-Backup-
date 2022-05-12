({
    onEmploymentDetailsChange : function(component, event, helper) {
        var EmploymentDetail = component.get("v.Acnt.Place_of_Employment__c");
        if(EmploymentDetail == 'CN Government' || EmploymentDetail == 'CN Business Employee'){
            component.set("v.showWhichDept", true);
        }
        else{
            component.set("v.Acnt.PersonDepartment", '');
            component.set("v.showWhichDept", false); 
        }
        
        if(EmploymentDetail == 'Other'){
            component.set("v.showOtherPlaceOfEmployment", true);
        }
        else{
            component.set("v.Acnt.Other_Place_of_Employment__c", '');
            component.set("v.showOtherPlaceOfEmployment", false); 
        }
    },
    
    onSymptomChange : function(component, event, helper) {
        debugger; 
        var showOnsetdate = false;
        var Assessment = [ "SubjectiveFever", "Chills", "WorseningCough", "ShortnessOfBreath", "Fatigue", "MuscleAches", "Headache", "LossOfTaste",
                          "SoreThroat", "RunnyNose", "Nausea", "Diarrhea", "Other"];
        
        for(var i = 0; i < Assessment.length; i++) {
            var fieldId = Assessment[i];
            var cmpFindFieldId = component.find(fieldId);
            var fieldValue = cmpFindFieldId.get("v.checked");
            if(fieldValue) {
                component.set("v.isSymptomatic", true); 
                showOnsetdate = true;
            }
        }
        
        if(showOnsetdate){
            component.set("v.showSympOnsetDate", true); 
        }
        else{
            component.set("v.Acnt.Date_of_when_symptoms_onset__c", null);
            component.set("v.showSympOnsetDate", false); 
        }
    },
    
    onDayCareChange : function(component, event, helper) {
        var dayCareAttended = component.get("v.Acnt.Do_you_attend_in_person_school_Daycare__c");
        if(dayCareAttended == 'Yes'){
            component.set("v.showDayCareTT", true);
        }
        else{
            component.set("v.Acnt.NameofEducationCenter__c", '');
            component.set("v.showDayCareTT", false); 
        }       
    },
    
    onReceivedVaccine : function(component, event, helper) {
        var Recieved_COVID19_Vax = component.get("v.ClinicalAssessmentToMakeCall.Recieved_COVID19_vaccination__c");
        if(Recieved_COVID19_Vax == 'Yes'){
            component.set("v.showVaxQs", true);
        }
        else{
            component.set("v.ClinicalAssessmentToMakeCall.COVID19_vaccination_type__c", '');
            component.set("v.ClinicalAssessmentToMakeCall.How_many_doses_recieved__c", '');
            component.set("v.ClinicalAssessmentToMakeCall.Last_COVID_19_Vaccination_Date__c", '');
            component.set("v.showVaxQs", false); 
        }       
    },
    
    onSymptomsOnsetDateChange : function(component, event, helper) {
        debugger
        var symptomsOnsetDate = component.get("v.Acnt.Date_of_when_symptoms_onset__c"); 
        var today = $A.localizationService.formatDate(new Date(), "YYYY-MM-DD");
        //const date2 = new Date(symptomsOnsetDate);        
        if(symptomsOnsetDate == today){
            component.set("v.showConditionDetails", true);
        }
        else{
            component.set("v.showConditionDetails", false);  
            component.set("v.ClinicalAssessment.How_are_you_feeling_today__c", "");  
        }            
        if(symptomsOnsetDate > today){
            helper.showErrorMessage(component, event, helper, 'Symptoms onset date cannot be in future.');
        }
        
    },
    
    onIsolationNoteAsk : function(component, event, helper) {
        if(!component.get("v.IsolationNoteRequested"))
            component.set("v.EmailToSendIsolationNote", "");
    },
    
    onDiagnosedWithCovid : function(component, event, helper) {
        if(component.find("covid19Diagnosed").get("v.value") == "Yes"){
            component.set("v.CovidDiagnosed", true);
        }
        else{
            component.set("v.CovidDiagnosed", false);
             component.set("v.ClinicalAssessment.How_long_ago_did_you_have_COVID_19__c", "");
        }
    },
    
    submitQS1 : function(component, event, helper) {
        debugger;
        var symptomsOnsetDate = component.get("v.Acnt.Date_of_when_symptoms_onset__c"); 
        var today = $A.localizationService.formatDate(new Date(), "YYYY-MM-DD");
        var AllValid = true;
        var controlselectAuraIds1 = [ "EmploymentDetails", "patientCare", "dayCare"];
        if(component.get("v.showSympOnsetDate") && component.get("v.Acnt.Date_of_when_symptoms_onset__c") == null){
            controlselectAuraIds1.push("SymptomOnsetDate");
        }
        for(var i = 0; i < controlselectAuraIds1.length; i++) {
            var fieldId1 = controlselectAuraIds1[i];
            var cmpFindFieldId1 = component.find(fieldId1);
            var fieldValue1 = cmpFindFieldId1.get("v.value");
            if(fieldValue1 == null || fieldValue1 == '') {
                AllValid = false;
                cmpFindFieldId1.showHelpMessageIfInvalid();
            }
        }
        if(!AllValid){
            helper.showErrorMessage(component, event, helper, 'You must fill in all of the required fields.');
        }
        else if(symptomsOnsetDate != null && symptomsOnsetDate > today){
            helper.showErrorMessage(component, event, helper, 'Symptoms onset date cannot be in future.');
       	}
        else{
            //disable Next button
            component.set("v.isActive", true);
            //show spinner
            $A.util.removeClass(component.find("spinner"), "slds-hide");
            helper.setCAssessment(component, event, helper);            
            var healthWorker = component.get("v.Acnt.Is_a_Healthcare_Worker__c") == "Yes" ? true : false;
            var conditionStatus = component.get("v.isSymptomatic") == true ? "Symptomatic" : "Asymptomatic"; 
            component.set("v.Acnt.Is_a_Healthcare_Worker__c", healthWorker);
            component.set("v.Acnt.HealthCloudGA__ConditionStatus__pc", conditionStatus);
            
            var action = component.get("c.insertCAssUpdateAccnt");
            action.setParams({ 
                acntId 				: component.get("v.AccountId"),
                CA 					: component.get("v.ClinicalAssessmentToMakeCall"),
                accoutToBeUpdate 	: component.get("v.Acnt")
            });
            
            action.setCallback(this,function(response){
                debugger;
                var state = response.getState();
                if (state === "SUCCESS"){
                    var resultData = response.getReturnValue();
                    //enable Next button
                    component.set("v.isActive", false);
                    //hide spinner
                    $A.util.addClass(component.find("spinner"), "slds-hide");
                    component.set("v.IsolationEndDate", resultData.IsolationEndDate);
                    component.set("v.ClinicalAssessmentToMakeCall", resultData.clincalAssessment);
                    component.set("v.QS1", false);
                    component.set("v.QS2", true);
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
        }
    },
    
    submitQS2 : function(component, event, helper) {
        debugger;
        var regExpEmailformat = /^[a-zA-Z0-9._-]+@[a-z0-9\-]+\.[a-z]{2,3}/; 
        var email = component.get("v.EmailToSendIsolationNote");
        if(component.get("v.IsolationNoteRequested")){
            if(email == ""){
                component.find("EmailToSendIN").showHelpMessageIfInvalid();
            }
            else{
                if(!regExpEmailformat.test(email)){
                    helper.showErrorMessage(component, event, helper, 'Please enter a valid email address.');
                }
                else{
                    //disable Next button
                    component.set("v.isActive", true);
                    //show spinner
                    $A.util.removeClass(component.find("spinner"), "slds-hide");
                    
                    var action = component.get("c.udpdateAccountEmail");
                    action.setParams({ 
                        acntId 	:	component.get("v.AccountId"),
                        email	:	component.get("v.EmailToSendIsolationNote")	
                    }); 
                    action.setCallback(this,function(response){
                        debugger;
                        var state = response.getState();
                        if (state === "SUCCESS"){
                            helper.sendIsolationNotes(component, event, helper);
                        }
                        if (state === "ERROR"){
                            let errors = response.getError();
                            helper.showErrorMessage(component, event, helper, errors[0].message);
                        }
                    });   
                    $A.enqueueAction(action);
                }
            }
        }
        else{
            component.set("v.QS2", false);
            component.set("v.QS3", true);
        }
    },
    
    submitQS3 : function(component, event, helper) {
        //disable Next button
        component.set("v.isActive", true);
        //show spinner
        $A.util.removeClass(component.find("spinner"), "slds-hide");
        var action = component.get("c.updateData");
        action.setParams({ 
            acntId 		  :  component.get("v.AccountId"),
            CA 			  :  component.get("v.ClinicalAssessmentToMakeCall"),
            IsOptInOptOut :  component.get("v.IsOptIn")
        }); 
        action.setCallback(this,function(response){
            debugger;
            var state = response.getState();
            if (state === "SUCCESS"){
                //enable Next button
                component.set("v.isActive", false);
                //hide spinner
                $A.util.addClass(component.find("spinner"), "slds-hide");
                var resultData = response.getReturnValue();
                component.set("v.QS3", false);
                component.set("v.Msg", true);
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
    
    handleContext: function(component, event, helper){
        event.preventDefault(); 
    },
})