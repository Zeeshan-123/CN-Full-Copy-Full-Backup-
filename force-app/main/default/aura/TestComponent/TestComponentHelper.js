({
	 addHouseholdRecord: function(component, event) {
        //get the Household Member List from component  
        var HMlist = component.get("v.HMlist");
        //Add New Household Member Record
        HMlist.push({
            'sobjectType'				: 	'Household_Member__c',
            'First_Name__c'				: 	'',
            'Last_Name__c'				: 	'',
            'Citizen_Id__c'				:   '',
            'Date_of_Birth__c'			: 	''
            
        });
        component.set("v.HMlist", HMlist);
    },
    
    callServer : function(component,method,callback,params) {
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
                        throw new Error("Error" + errors[0].message);
                    }
                } else {
                    throw new Error("Unknown Error");
                }
            }
        });
        
        $A.enqueueAction(action);
    },
    
    getAge : function(component, event, dob)  {
        var dob = new Date(dob);
        var month_diff = Date.now() - dob.getTime();
        var age_dt = new Date(month_diff); 
        var year = age_dt.getUTCFullYear();
        var age = Math.abs(year - 1970);
        return age;
    },
    
    getCleanedCitizenId : function(component, event, cId){
        // cleaning citizen id
        var removedAlphabet 			= 	cId.replace(/[^\d.-]/g, '');
        var removedLeadingZeros 		=	removedAlphabet.replace(/^0+/, '');
        var removeSpecialChars			=	removedLeadingZeros.replace(/^-+/, '');
        var citizenId 					=	removeSpecialChars.replace(/^0+/, '');
        return  citizenId;
    },
    
    //add primary applicant as HH Member
    addPrimaryHouseholdMember : function(component, event){
        var ProcessedHHMList = component.get("v.ProcessedHHMList");      
        var OLN=component.get("v.OLN");
        OLN=OLN.trim().toLowerCase();
        var NLN=component.find("HLastName").get("v.value");
        NLN=NLN.trim().toLowerCase();
        var notmatch=OLN!=NLN;
        
        ProcessedHHMList.push({
            'sobjectType'				: 	'Household_Member__c',
            'First_Name__c'				: 	component.find("HFirstName").get("v.value"),
            'Last_Name__c'				: 	component.find("HLastName").get("v.value"),
            'Citizen_Id__c'				:   component.find("HRegID").get("v.value"),
            'Date_of_Birth__c'			: 	component.find("HDob").get("v.value"),
            'LastNameChangedCheck__c' 	:	notmatch
        });
        component.set("v.ProcessedHHMList", ProcessedHHMList);
    },
    
    ObjFieldByMailingParent : function(component, event, mailingCountry) {
        var countryValue = mailingCountry;
        var pickListMap = component.get("v.getPickListMap");
        
        if (countryValue != '') {     
            //get state values against country
            var stateValues = pickListMap[countryValue];            
            var stateValueList = [];
            
            for (var i = 0; i < stateValues.length; i++) {
                stateValueList.push(stateValues[i]);
            }
            //set mailing state picklist
            component.set("v.getMailingChildList", stateValueList);
            
            if(stateValues.length > 0) {
                // hide other state/Territory field
                component.set("v.showMailingOtherState", false); 
                // show  state picklist
                component.set("v.showMailingState", true);
                // set state field value to empty
                component.set("v.CVCase.Other_Mailing_State__c", '');
            }
            else {
                // show other state/Territory field
                component.set("v.showMailingOtherState", true); 
                // hide  state picklist
                component.set("v.showMailingState", false); 
                // set other state/Territory field value to empty
                component.set("v.CVCase.Mailing_States__c", '');
            }
            
        } 
        else  {
            component.set("v.CVCase.Mailing_States__c", '');
            component.set("v.CVCase.Other_Mailing_State__c", '');
        }
    }, 
    
      // validate Mailing Address Completeness
    checkMailingAddFieldsCompleteness : function(component, event)  {
        var isMailingAddressValid = true;
        var CVCase = component.get('v.CVCase');
        if(component.get("v.CVCase.Mailing_Countries__c") == "United States"){
            if(CVCase.Mailing_Street__c   === undefined 	||   CVCase.Mailing_Street__c.trim() == ''   || 
               CVCase.Mailing_City__c     === undefined		||   CVCase.Mailing_City__c.trim() == ''     || 
               CVCase.Mailing_States__c   === undefined 	||   CVCase.Mailing_States__c == ''    ||
               CVCase.Mailing_Countries__c  === undefined	 ||   CVCase.Mailing_Countries__c.trim() == ''  || 
               CVCase.Mailing_ZipPostal_Code__c	 === undefined ||   CVCase.Mailing_ZipPostal_Code__c.trim() == '' ){
                isMailingAddressValid = false;
            }
        }
        return isMailingAddressValid;
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