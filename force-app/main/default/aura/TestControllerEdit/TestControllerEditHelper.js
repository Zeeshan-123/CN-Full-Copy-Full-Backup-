({
     
	 addHouseholdRecord: function(component, event)    {
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
    
    deleteNewHHM: function(component, event) {
        //Get old HMlist
        var OldHMlist = component.get("v.OldHHM_ProcessedList");
        //Get the HMlist
        var HMlist = component.get("v.HMlist");
        //Get the target object
        var selectedItem = event.currentTarget;
        //Get the selected item index
        var index = selectedItem.dataset.record;
        HMlist.splice(index, 1);
        component.set("v.HMlist", HMlist);
        
        // if household member list is zero then hide table headers
        var tableCheck =  component.get("v.HMlist");
        if (tableCheck.length == 0 && OldHMlist.length == 0)
            component.set("v.showTableHeader", false);
    },
    
    deleteExistingHHM: function(component, event){
        //Get new HMlist
        var NewHMlist = component.get("v.HMlist");
        //Get old HMlist
        var OldHMlist = component.get("v.OldHHM_ProcessedList");
        //get record id to delete
        var HmRecId = event.currentTarget;
        var HmRecIdToDelete = HmRecId.dataset.record;
        // get index
        var index = event.target.dataset.id;
        
        if(confirm("Confirm deleting this household member?")) {
            OldHMlist.splice(index, 1);
            component.set("v.OldHHM_ProcessedList", OldHMlist);
            
            var action = component.get("c.dltHouseholdMember");
            action.setParams({ 
                HmRecIdToDelete : HmRecIdToDelete,
                caseId			: component.get("v.caseId")
            });
            
            action.setCallback(this,function(response)  {
                var state = response.getState(); 
                var result = response.getReturnValue();
                if(state === 'SUCCESS') {
                    if(result != null)  {
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            title : 'SUCCESS',
                            message: 'Household Member Deleted.',
                            duration:' 60000',
                            key: 'info_alt',
                            type: 'success',
                            mode: 'dismissible'
                        });
                        toastEvent.fire();
                    }
                    else {
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            title : 'Success',
                            message: 'The timeline (2 working days after submission) to update the request has passed.',
                            duration:' 9000',
                            key: 'info_alt',
                            type: 'error',
                            mode: 'pester'
                        });
                        toastEvent.fire();
                        setTimeout(
                            $A.getCallback(function() {
                                window.location.replace('/s/covid19-assistance');
                            }), 4000);
                    } 
                }
                
                if (state === "ERROR") {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'ERROR',
                        message: response.getReturnValue(),
                        duration:' 60000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'pester'
                    });
                    toastEvent.fire();
                }
            });       
            $A.enqueueAction(action);
        }
        
        // if household member list is zero then hide table headers
        var OldHMlistUpdated =  component.get("v.OldHHM_ProcessedList");
        if (OldHMlistUpdated.length == 0 && NewHMlist.length == 0)
            component.set("v.showTableHeader", false);
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
        debugger;
        var AllHHM_NewerAndExisting = component.get("v.AllHHM_NewerAndExisting");        
        var OLN=component.get("v.OLN");
        OLN=OLN.trim().toLowerCase();
        var NLN=component.find("HLastName").get("v.value");
        NLN=NLN.trim().toLowerCase();
        var notmatch=OLN!=NLN;
        
        AllHHM_NewerAndExisting.push({
            'sobjectType'				: 	'Household_Member__c',
            'First_Name__c'				: 	component.find("HFirstName").get("v.value"),
            'Last_Name__c'				: 	component.find("HLastName").get("v.value"),
            'Citizen_Id__c'				:   component.find("HRegID").get("v.value"),
            'Date_of_Birth__c'			: 	component.find("HDob").get("v.value"),
            'LastNameChangedCheck__c'  	:	notmatch
        });
        
        component.set("v.AllHHM_NewerAndExisting", AllHHM_NewerAndExisting);
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
    
    handleSubmit: function(component,event,helper){
        debugger;
        var  CVCase = component.get("v.CVCase");
        var priConMobile  			=	CVCase.Ebt_Mobile_Phone__c.replace(/\D/g, '');
        CVCase.Ebt_Mobile_Phone__c  = 	priConMobile;
        var OldHHM_ProcessedList = component.get("v.OldHHM_ProcessedList");
        var NewHHM_ProcessedList = component.get("v.NewHHM_ProcessedList");
        
        var addressFreeForm = component.get("v.location");
        var isManual = component.get("v.isManual");
        var isAddressChanged = component.get("v.isAddressChanged");
        var isChanged = false;
        
        var melissaResult = component.get("v.predictions");
        var states = component.get("v.states");
        var index = component.get("v.selectedAddressIndex");
        var address = component.get("v.selectedAddress");
        var programParticipated = component.find("program").get("v.value");
        
        var  impacts='';
        for(var i=0 ; i < programParticipated.length ; i++)  {
            impacts += programParticipated[i]+ ';';
        }
        
        if(component.get("v.isManual")){
            for (var i = 0; i < melissaResult.length; i++){
                if(melissaResult[i].Address.SuiteCount > 0){
                    for (var j = 0; j < melissaResult[i].Address.SuiteCount; j++){
                        if((melissaResult[i].Address.AddressLine1+' '+melissaResult[i].Address.SuiteList[j]+', '+
                            melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                            if(melissaResult[i].Address.AddressLine1 != component.find("MailingStreetInput").get("v.value") || 
                               melissaResult[i].Address.City != component.find("MailingCityInput").get("v.value") || 
                               states[0][melissaResult[i].Address.State] != component.find("MailingStateInput").get("v.value") || 
                               melissaResult[i].Address.PostalCode != component.find("MailingzipInput").get("v.value") || 
                               melissaResult[i].Address.SuiteList[j] != component.find("MailingSuiteInput").get("v.value") || 
                               component.find("MailingCountryInput").get("v.value") != "United States" || 
                               component.find("MailingAddress2Input").get("v.value") != ""){
                                isChanged = true;
                            }
                        }
                    }
                } 
                if(melissaResult[i].Address.SuiteCount < 1){
                    if((melissaResult[i].Address.AddressLine1+(melissaResult[i].Address.SuiteName != ''?' '+melissaResult[i].Address.SuiteName:'')+', '+
                        melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                        if(melissaResult[i].Address.AddressLine1 != component.find("MailingStreetInput").get("v.value") || 
                           melissaResult[i].Address.City != component.find("MailingCityInput").get("v.value") || 
                           states[0][melissaResult[i].Address.State] != component.find("MailingStateInput").get("v.value") || 
                           melissaResult[i].Address.PostalCode != component.find("MailingzipInput").get("v.value") || 
                           melissaResult[i].Address.SuiteName != component.find("MailingSuiteInput").get("v.value") || 
                           component.find("MailingCountryInput").get("v.value") != "United States" || 
                           component.find("MailingAddress2Input").get("v.value") != ""){
                            isChanged = true;
                        }
                    }
                }
            }
            
            if(melissaResult.length==0){
                debugger;
                var cse=component.get("v.CVCaseClone");
                if(cse.mailing_address2__c == undefined){
                    cse.mailing_address2__c = "";
                }
                if(cse.Mailing_Street__c != component.find("MailingStreetInput").get("v.value") ||
                   cse.Mailing_City__c != component.find("MailingCityInput").get("v.value") ||
                   cse.Mailing_States__c != component.find("MailingStateInput").get("v.value") ||
                   cse.Mailing_ZipPostal_Code__c != component.find("MailingzipInput").get("v.value") ||
                   cse.mailing_suite__c != component.find("MailingSuiteInput").get("v.value") ||
                   cse.Mailing_Countries__c != component.find("MailingCountryInput").get("v.value") ||
                   cse.mailing_address2__c != component.find("MailingAddress2Input").get("v.value"))
                {
                    isChanged = true;
                }
            }
            
            if(isChanged){
                component.set("v.isAddressChanged", true);
                    isAddressChanged = true;
            } else if(isAddressChanged != true){
                component.set("v.isAddressChanged", false);
                    isAddressChanged = false;
            }
            
            /*else if(melissaResult.length!=0){
                component.set("v.isAddressChanged", false);
                isAddressChanged = false;
            }*/
        }
     
  
        //disable save button
        component.set("v.isActive2", true);
        //show spinner
        $A.util.removeClass(component.find("Spinner2"), "slds-hide");
			
        CVCase.Melissa_Address__c = address;
        CVCase.Is_Address_Changed__c = isAddressChanged;
        CVCase.Is_Manual_Address__c = component.get("v.isManual");
        CVCase.Add_on__c = component.get("v.isAddendumApplication");
        CVCase.COVID19_Impact_on_the_Household__c = impacts;
        // case updated server request
        var action = component.get("c.updateRequest");
        
        action.setParams({ 
            caseId				:	component.get("v.caseId"),
            HMslist				:	NewHHM_ProcessedList,
            HMslistToUpdate		:	OldHHM_ProcessedList,
			RRR_Request			:   CVCase
        });
        
        
        action.setCallback(this,function(response) {
             var state = response.getState(); 
            var result = response.getReturnValue();
            if(state === 'SUCCESS')  {
                if(result != null)  {
                    this.showSuccessMessage(component,event,helper,'Updated Successfully.');
                    window.location.replace('/s/covid19-assistance');
                }
                else {
                    this.showErrorMessage(component,event,helper,'The timeline (2 working days after submission) to update the request has passed.');
                    setTimeout(
                        $A.getCallback(function() {
                            window.location.replace('/s/covid19-assistance');
                        }), 4000);
                } 
            } 
            if(state === 'ERROR')  {
                 var err='';
                       var errors = response.getError();
                       errors.forEach( function (error)  {
                            //top-level error.  there can be only one
                            if (error.message)
                                err=err+' '+error.message;					
                            
                            //page-level errors (validation rules, etc)
                            if (error.pageErrors)  {
                                error.pageErrors.forEach( function(pageError)   {
                                        err=err+' '+pageError.message;					
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
                            } //end of fieldErrors if
                        }); //end Errors forEach
                
                component.set("v.showIntermediaryScreen", false);
                component.set("v.isActive2", false);
                $A.util.addClass(component.find("Spinner2"), "slds-hide");
                this.showErrorMessage(component, event, helper, err);
            }
        });       
        
        $A.enqueueAction(action);
        
    },
    
    // state ISO code
    callServer : function(component,method,callback,params) {
        var action = component.get(method);
        if (params){        
            action.setParams(params);
        }
        action.setCallback(this,function(response)   {            
            var state = response.getState();
            if (state === "SUCCESS")   { 
                // pass returned value to callback function
                callback.call(this,response.getReturnValue());   
            }
           else if (state === "ERROR")  {
                // generic error handler
                var errors = response.getError();
                if (errors)   {
                    console.log("Errors", errors);
                    if (errors[0] && errors[0].message) 
                        throw new Error("Error" + errors[0].message);
                } 
               else   {
                    throw new Error("Unknown Error");
               }
            }
        });
        $A.enqueueAction(action);
    },
        
     //handle error messages
    showErrorMessage : function(component, event, helper, message){
        debugger;
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