({
    doInit : function(component, event, helper){ 
        var  CVCase = component.get("v.CVCase");
        var action = component.get("c.validateApplicantEligibility");
        action.setCallback(this,function(response){
            var state = response.getState();
            debugger;
            if (state === "SUCCESS") {
                var resultData = response.getReturnValue(); 
                // request exist 
                if (resultData.ClothingVoucherApp != undefined) {
                    var result = response.getReturnValue();
                    component.set("v.caseId", result.ClothingVoucherApp.Id);
                    component.set("v.requestNumber", result.ClothingVoucherApp.CaseNumber);
                    // show success message
                    component.set("v.showSuccessMessage", true);
                }//end
                else{
                    // set up dependent picklist
                    console.log(resultData.mapOfDependentPL);
                    debugger; 
                    component.set("v.getPickListMap",resultData.mapOfDependentPL);
                    var pickListMap = component.get("v.getPickListMap");
                    var parentkeys = [];
                    var parentField = [];                
                    for (var pickKey in pickListMap){
                        parentkeys.push(pickKey);
                    }
                    for (var i = 0; i < parentkeys.length; i++) {
                        parentField.push(parentkeys[i]);
                    }  
                    component.set("v.getMailingParentList", parentField);
                    
                     var phone = '';
                     component.set("v.Acnt", resultData.acnt);
                     var Accnt=component.get("v.Acnt");
                     //format Date of birth
                     if(!$A.util.isUndefinedOrNull(resultData.acnt.Date_of_Birth__c)){
                         var splitDate = resultData.acnt.Date_of_Birth__c.split('-');
                         var year = splitDate[0];
                         var month = splitDate[1];
                         var day = splitDate[2];
                         var uDob = splitDate[1]+'/'+splitDate[2]+'/'+splitDate[0];
                         Accnt.Date_of_Birth__c = uDob;
                     }
                     component.set("v.Acnt",Accnt); 
                    if(resultData.acnt.Eligible_For_Housing_Stipend__c){
                         component.set("v.showHousingStipend", true);
                    }
                    
                                  
                    // set phone number
                     if (!$A.util.isUndefined(resultData.acnt.PersonMobilePhone)) {       
                         phone = resultData.acnt.PersonMobilePhone;
                         var number = phone.replace(/\D/g, '').slice(-10);                         
                     	 CVCase.Ebt_Mobile_Phone__c = '('+number.substring(0,3)+') '+number.substring(3,6)+'-'+number.substring(6,10);;
                     }
                     else {
                         CVCase.Ebt_Mobile_Phone__c = '';
                     }
                     
                     CVCase.Primary_Contact_First_Name__c = resultData.acnt.FirstName;
                     CVCase.Primary_Contact_Last_Name__c  = resultData.acnt.LastName;
                    
                    // set relation picklist value for Student Table
                     var relationMap = [];
                     var relationMapData = resultData.relationMap;
                     for(var key in relationMapData){
                         relationMap.push({value:relationMapData[key], key:key});
                     }
                     component.set("v.relationList", relationMap);
                    
                     //replace potential undefined values with empty string
                     var replaceBadValues = {
                         PersonMailingStreet : resultData.acnt.PersonMailingStreet,
                         PersonMailingCity : resultData.acnt.PersonMailingCity,
                         PersonMailingPostalCode : resultData.acnt.PersonMailingPostalCode,
                         PersonOtherStreet : resultData.acnt.PersonOtherStreet,
                         PersonOtherCity : resultData.acnt.PersonOtherCity,
                         PersonOtherPostalCode : resultData.acnt.PersonOtherPostalCode
                     }
                     var replacedValues = JSON.parse(JSON.stringify(replaceBadValues, function (key, value) {return (value === undefined) ? "" : value}));
                     
                     							/*=============SET MAILING ADDRESS===========*/ 
                    //if Mailing address is a bad address then make it null and set US as default country
                    if(replacedValues.PersonMailingStreet.toUpperCase().includes("BAD ADDRESS")  || replacedValues.PersonMailingCity.includes("99") || replacedValues.PersonMailingPostalCode.includes("00000") || $A.util.isUndefined(resultData.acnt.PersonMailingCountry) ){
                        CVCase.Mailing_Street__c = '';
                        CVCase.Mailing_City__c = '';
                        CVCase.Mailing_ZipPostal_Code__c = '';
                        CVCase.mailing_suite__c = '';
                        CVCase.Mailing_Countries__c = 'United States';
                        helper.ObjFieldByMailingParent(component, event, CVCase.Mailing_Countries__c);
                        CVCase.Mailing_States__c = '';
                        component.set("v.UpdateAddressRequired", true);
                    }// Not a Bad Address but partially filled then populate the fields and mark update address required for Mailing
                    else if((!replacedValues.PersonMailingStreet.toUpperCase().includes("BAD ADDRESS") && !replacedValues.PersonMailingCity.includes("99") &&
                            !replacedValues.PersonMailingPostalCode.includes("00000")) && ($A.util.isUndefined(resultData.acnt.PersonMailingStreet) 
                            || $A.util.isUndefined(resultData.acnt.PersonMailingCity) || $A.util.isUndefined(resultData.acnt.PersonMailingState) 
                            || $A.util.isUndefined(resultData.acnt.PersonMailingCountry) ||   $A.util.isUndefined(resultData.acnt.PersonMailingPostalCode))){
                        component.set("v.UpdateAddressRequired", true);
                        CVCase.Mailing_Street__c = resultData.acnt.PersonMailingStreet;
                        CVCase.Mailing_City__c = resultData.acnt.PersonMailingCity;
                        CVCase.Mailing_ZipPostal_Code__c = resultData.acnt.PersonMailingPostalCode;
                        CVCase.mailing_suite__c = resultData.acnt.Mailing_Suite__c;
                        CVCase.Mailing_Countries__c = resultData.acnt.PersonMailingCountry;
                        helper.ObjFieldByMailingParent(component, event, CVCase.Mailing_Countries__c);
                        CVCase.Mailing_States__c = resultData.acnt.PersonMailingState; 
                     }
                    else{// Not a Badd Address and completely filled
						if(!$A.util.isUndefined(resultData.acnt.PersonMailingStreet)  || !$A.util.isUndefined(resultData.acnt.PersonMailingCity) 
                           || !$A.util.isUndefined(resultData.acnt.PersonMailingState)   || !$A.util.isUndefined(resultData.acnt.PersonMailingCountry) 
                           || !$A.util.isUndefined(resultData.acnt.PersonMailingPostalCode)){
                        CVCase.Mailing_Street__c = resultData.acnt.PersonMailingStreet;
                        CVCase.Mailing_City__c = resultData.acnt.PersonMailingCity;
                        CVCase.Mailing_ZipPostal_Code__c = resultData.acnt.PersonMailingPostalCode;
                        CVCase.mailing_suite__c = resultData.acnt.Mailing_Suite__c;
                        CVCase.Mailing_Countries__c = resultData.acnt.PersonMailingCountry;
                        helper.ObjFieldByMailingParent(component, event, CVCase.Mailing_Countries__c);
                        CVCase.Mailing_States__c = resultData.acnt.PersonMailingState; 
                     }						                        
                    }

                   							 /*=============SET PHYSICAL ADDRESS===========*/ 
                    //if Physical address is a bad address then make it null and set US as default country
                    if(replacedValues.PersonOtherStreet.toUpperCase().includes("BAD ADDRESS")  || replacedValues.PersonOtherStreet.includes("99") || replacedValues.PersonOtherPostalCode.includes("00000") || $A.util.isUndefined(resultData.acnt.PersonOtherCountry)){
                        component.set("v.UpdatePhysicalAddressRequired", true);
                        CVCase.Physical_Street__c = '';
                        CVCase.Physical_City__c = '';
                        //CVCase.Physical_ZipPostal_Code__c = '';
                        CVCase.Physical_Suite__c = '';
                        CVCase.Physical_Countries__c = 'United States';
                        helper.ObjFieldByPhysicalParent(component, event, CVCase.Physical_Countries__c);
                        CVCase.Physical_States__c = '';
                    }// Not a Bad Address but partially filled then populate the fields and mark update address required for Physical
                    else if( (!replacedValues.PersonOtherStreet.toUpperCase().includes("BAD ADDRESS")  && !replacedValues.PersonOtherCity.includes("99") &&
                            !replacedValues.PersonOtherPostalCode.includes("00000")) && ($A.util.isUndefined(resultData.acnt.PersonOtherStreet) 
                            ||  $A.util.isUndefined(resultData.acnt.PersonOtherCity) || $A.util.isUndefined(resultData.acnt.PersonOtherState)   
                            ||  $A.util.isUndefined(resultData.acnt.PersonOtherCountry) ||  $A.util.isUndefined(resultData.acnt.PersonOtherPostalCode))){ 
                        component.set("v.UpdatePhysicalAddressRequired", true);
                        CVCase.Physical_Street__c = resultData.acnt.PersonOtherStreet;
                        CVCase.Physical_City__c = resultData.acnt.PersonOtherCity;
                        CVCase.Physical_ZipPostal_Code__c = resultData.acnt.PersonOtherPostalCode;
                        CVCase.Physical_Suite__c = resultData.acnt.Physical_Suite__c;
                        CVCase.Physical_Countries__c = resultData.acnt.PersonOtherCountry;
                        helper.ObjFieldByPhysicalParent(component, event, CVCase.Physical_Countries__c);
                        CVCase.Physical_States__c = resultData.acnt.PersonOtherState;
                    }                                                                                                                                                                                                   //if mailing address is empty, set physical address
                    else{
                         if(!$A.util.isUndefined(resultData.acnt.PersonOtherStreet)   ||  !$A.util.isUndefined(resultData.acnt.PersonOtherCity)
                            || !$A.util.isUndefined(resultData.acnt.PersonOtherState) ||  !$A.util.isUndefined(resultData.acnt.PersonOtherCountry)
                            ||  !$A.util.isUndefined(resultData.acnt.PersonOtherPostalCode)){
                             CVCase.Physical_Street__c = resultData.acnt.PersonOtherStreet;
                             CVCase.Physical_City__c = resultData.acnt.PersonOtherCity;
                             CVCase.Physical_ZipPostal_Code__c = resultData.acnt.PersonOtherPostalCode;
                             CVCase.Physical_Suite__c = resultData.acnt.Physical_Suite__c;
                             CVCase.Physical_Countries__c = resultData.acnt.PersonOtherCountry;
                             helper.ObjFieldByPhysicalParent(component, event, CVCase.Physical_Countries__c);
                             CVCase.Physical_States__c = resultData.acnt.PersonOtherState;
                         }
                      }
                    
                    var controlselectAuraIds1 = [ "MailingStreetInput", "MailingCityInput", "MailingzipInput", "MailingStateInput", "MailingSuiteInput", "MailingAddress2Input",
                                                
                                                 "priConCellPhone"];
                    var age = helper.getAge(component, event, resultData.acnt.Date_of_Birth__c);
                    if(age < 18  ){
                        //if applicant is under 18, show primary guardian section
                        component.set("v.showPrimaryGuardianSection", true);
                        controlselectAuraIds1.push("PriGuardianFirstName", "PriGuardianLastName", "PriGuardianPhone");
                    }
                    for(var i = 0; i < controlselectAuraIds1.length; i++) {
                        var fieldId1 = controlselectAuraIds1[i];
                        var cmpFindFieldId1 = component.find(fieldId1);
                        var fieldValue1 = cmpFindFieldId1.get("v.value");
                        if($A.util.isUndefinedOrNull(fieldValue1)) {
                            component.find(fieldId1).set("v.value", '');
                        }
                    }     
                    
           	
                    component.set('v.CVCase',CVCase);
                    component.set("v.CVCaseClone",JSON.parse(JSON.stringify(CVCase)));    
                    component.set('v.states',resultData.mapOfStates);
                 }   
                
            }
            if (state === "ERROR"){
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title : 'SUCCESS',
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
      	
    },
    
    //handle update address toggle for Mailing
    handleAddreesUpdate : function(component, event, helper){
        var  CVCaseClone = component.get("v.CVCaseClone");
        if(component.get("v.addressUpdate")) {
            component.set("v.showLookUp", true);
        }
        else  {
            component.set("v.showLookUp", false);
            component.set("v.isManual", false);
            component.set("v.mailingAddressRequired", false);
            component.set("v.CVCase.Mailing_Street__c", CVCaseClone.Mailing_Street__c);
            component.set("v.CVCase.mailing_address2__c", '');
            component.set("v.CVCase.Mailing_City__c", CVCaseClone.Mailing_City__c);
            component.set("v.CVCase.Mailing_ZipPostal_Code__c", CVCaseClone.Mailing_ZipPostal_Code__c); 
            component.set("v.CVCase.mailing_suite__c", CVCaseClone.mailing_suite__c); 
            component.set("v.CVCase.Mailing_Countries__c", CVCaseClone.Mailing_Countries__c); 
            helper.ObjFieldByMailingParent(component, event, CVCaseClone.Physical_Countries__c);
            component.set("v.CVCase.Mailing_States__c", CVCaseClone.Mailing_States__c); 
            
             // remove has errors
            $A.util.removeClass(component.find('MailingStreetInput'), 'slds-has-error');
            $A.util.removeClass(component.find('MailingCityInput'), 'slds-has-error');
            $A.util.removeClass(component.find('MailingStateInput'), 'slds-has-error');
            $A.util.removeClass(component.find('MailingCountryInput'), 'slds-has-error');
            $A.util.removeClass(component.find('MailingzipInput'), 'slds-has-error');
            $A.util.removeClass(component.find('MailingOtherState'), 'slds-has-error');
        }
       
    },
    
    
    
    onMailingCountryChange : function(component, event, helper){
        var CVCase = component.get('v.CVCase');
        helper.ObjFieldByMailingParent(component, event, CVCase.Mailing_Countries__c);
    },     
    
    // date validator
    validateAndReplace: function (component, event) {
        const input = event.getSource();
        const inputValue = input.get('v.value');
        const validValue = inputValue.replace(/^(\d\d)(\d)$/g,'$1/$2')
        .replace(/^(\d\d\/\d\d)(\d+)$/g,'$1/$2')
        .replace(/[^\d\/]/g,'');
        input.set('v.value', validValue);
    },
    
    //Name fields validator
    validateLName:  function(component, event)   { 
        var regex = new RegExp("[^a-zA-Z-]","g");
        var fieldId = event.getSource().getLocalId();
        var fieldInput = component.find(fieldId);
        var inputValue = fieldInput.get('v.value');
        var validValue = inputValue.replace(regex, "");
        fieldInput.set('v.value', validValue);
    },
    
     //Income field validator
    validateIncome:  function(component, event)   { 
        var regex = new RegExp("[^0-9]","g");
        var fieldId = event.getSource().getLocalId();
        var fieldInput = component.find(fieldId);
        var inputValue = fieldInput.get('v.value');
        var validValue = inputValue.replace(regex, "");
        fieldInput.set('v.value', validValue);
    },
       
    //format phone fields
    formatPhone:  function(component, event)   { 
        var fieldId = event.getSource().getLocalId();
        var fieldInput = component.find(fieldId);
        var val = fieldInput.get('v.value');
        
        // Strip all characters from the input except digits
        var inputValue = val.replace(/\D/g,'');
        
        // Trim the remaining input to ten characters, to preserve phone number format
        inputValue = inputValue.substring(0,10);

        // Based upon the length of the string, adding necessary formatting 
        var size = inputValue.length;
        if(size == 0)
                inputValue = inputValue;
        else if(size < 4)
            inputValue = '('+inputValue;
        else if(size < 7)
       		  inputValue = '('+inputValue.substring(0,3)+') '+inputValue.substring(3,6);
        else
            inputValue = '('+inputValue.substring(0,3)+') '+inputValue.substring(3,6)+'-'+inputValue.substring(6,10);
     
        fieldInput.set('v.value', inputValue);
    },
     
   
 
    clearErrors : function(component, event)    {
        var fieldId = event.getSource().getLocalId();
        var fieldInput = component.find(fieldId);
        var fieldValue = fieldInput.get("v.value");
        if(fieldValue != '')
            $A.util.removeClass(fieldInput, 'slds-has-error');
    },
        
    handleAddressChange: function(component, event, helper) {
        if(event.getSource().get("v.value").length % 3 == 0){
            var params = {
                input : component.get("v.location"),
                country : "United States"
            }
            helper.callServer(component, "c.getMelissaAddresses", function(response){
                var resp = JSON.parse(response);
                console.log(resp);
                component.set("v.showManualCB", true);
                if(resp.Results.length > 0){
                    component.set('v.predictions',resp.Results);
                    console.log(resp.Results); 
                    debugger;
                    document.getElementById("addressResult").style.display = "block";
                } else{
                    component.set('v.predictions',[]);
                    document.getElementById("addressResult").style.display = "none";
                }
            }, params);
        }
    },
    
      handleAddressClick: function(component, event, helper)  {
        debugger;
        var details = event.currentTarget;
        var melissaResult = component.get("v.predictions");
        var states = component.get("v.states");
        var index = details.dataset.placeid;
        var address = details.dataset.place;
        component.set("v.selectedAddressIndex", index);
        component.set("v.location", address);
        component.set("v.selectedAddress", address);
       	console.log(address); 
        console.log(address.PostalCode);
        console.log(states);
        debugger; 

        for (var i = 0; i < melissaResult.length; i++){
            if(melissaResult[i].Address.SuiteCount > 0){
                for (var j = 0; j < melissaResult[i].Address.SuiteCount; j++){
                    if((melissaResult[i].Address.AddressLine1+' '+melissaResult[i].Address.SuiteList[j]+', '+
                        melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                        component.set("v.CVCase.Mailing_Street__c", melissaResult[i].Address.AddressLine1);
                        component.set("v.CVCase.Mailing_City__c", melissaResult[i].Address.City);
                        component.set("v.CVCase.Mailing_Countries__c", "United States");
                        helper.ObjFieldByMailingParent(component, event, "United States");
                        component.set("v.CVCase.Mailing_States__c", states[0][melissaResult[i].Address.State]);
                        console.log(melissaResult[i].Address.PostalCode);
                        debugger; 
                        component.set("v.CVCase.Mailing_ZipPostal_Code__c", melissaResult[i].Address.PostalCode);
                        component.set("v.CVCase.mailing_suite__c", melissaResult[i].Address.SuiteList[j]);
                        component.set("v.CVCase.mailing_address2__c", '');
                    }
                }
            } 
            if(melissaResult[i].Address.SuiteCount < 1){
                if((melissaResult[i].Address.AddressLine1+(melissaResult[i].Address.SuiteName != ''?' '+melissaResult[i].Address.SuiteName:'')+', '+
                    melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                    component.set("v.CVCase.Mailing_Street__c", melissaResult[i].Address.AddressLine1);
                    component.set("v.CVCase.Mailing_City__c", melissaResult[i].Address.City);
                    component.set("v.CVCase.Mailing_Countries__c", "United States");
                    helper.ObjFieldByMailingParent(component, event, "United States");
                    console.log(melissaResult[i].Address.PostalCode);
                    debugger; 
                    component.set("v.CVCase.Mailing_States__c", states[0][melissaResult[i].Address.State]);
                    component.set("v.CVCase.Mailing_ZipPostal_Code__c", melissaResult[i].Address.PostalCode);
                    component.set("v.CVCase.mailing_suite__c", melissaResult[i].Address.SuiteName);
                    component.set("v.CVCase.mailing_address2__c", '');
                }
            }
        }
        document.getElementById("addressResult").style.display = "none";
        //component.set("v.predictions", []);
    },
    
    
    handleToggleChange: function(component, event, helper){
        var  CVCaseClone = component.get("v.CVCaseClone");
        var melissaResult = component.get("v.predictions");
        var states = component.get("v.states");
        var index = component.get("v.selectedAddressIndex");
        var address = component.get("v.selectedAddress");
                
        if(!component.get("v.isManual")){
            component.set("v.mailingAddressRequired", false);
            
        if(!helper.checkMailingAddFieldsCompleteness(component, event))
           component.set("v.FFAddressRequired", true); 
            
            // remove has errors
            $A.util.removeClass(component.find('MailingStreetInput'), 'slds-has-error');
            $A.util.removeClass(component.find('MailingCityInput'), 'slds-has-error');
            $A.util.removeClass(component.find('MailingStateInput'), 'slds-has-error');
            $A.util.removeClass(component.find('MailingCountryInput'), 'slds-has-error');
            $A.util.removeClass(component.find('MailingzipInput'), 'slds-has-error');
            
            if(melissaResult.length > 0 ) {
                for (var i = 0; i < melissaResult.length; i++){
                    if(melissaResult[i].Address.SuiteCount > 0){
                        for (var j = 0; j < melissaResult[i].Address.SuiteCount; j++){
                            if((melissaResult[i].Address.AddressLine1+' '+melissaResult[i].Address.SuiteList[j]+', '+
                                melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                                component.set("v.CVCase.Mailing_Street__c", melissaResult[i].Address.AddressLine1);
                                component.set("v.CVCase.Mailing_City__c", melissaResult[i].Address.City);
                                component.set("v.CVCase.Mailing_Countries__c", "United States");
                                helper.ObjFieldByMailingParent(component, event, "United States");
                                component.set("v.CVCase.Mailing_States__c", states[0][melissaResult[i].Address.State]);
                                component.set("v.CVCase.Mailing_ZipPostal_Code__c", melissaResult[i].Address.PostalCode);
                                component.set("v.CVCase.mailing_suite__c", melissaResult[i].Address.SuiteList[j]);
                                component.set("v.CVCase.mailing_address2__c", '');
                            }
                        }
                    } 
                if(melissaResult[i].Address.SuiteCount < 1){
                    if((melissaResult[i].Address.AddressLine1+(melissaResult[i].Address.SuiteName != ''?' '+melissaResult[i].Address.SuiteName:'')+', '+
                        melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                        
                        component.set("v.CVCase.Mailing_Street__c", melissaResult[i].Address.AddressLine1);
                        component.set("v.CVCase.Mailing_City__c", melissaResult[i].Address.City);
                        component.set("v.CVCase.Mailing_Countries__c", "United States");
                        helper.ObjFieldByMailingParent(component, event, "United States");
                        component.set("v.CVCase.Mailing_States__c", states[0][melissaResult[i].Address.State]);
                        component.set("v.CVCase.Mailing_ZipPostal_Code__c", melissaResult[i].Address.PostalCode);
                        component.set("v.CVCase.mailing_suite__c", melissaResult[i].Address.SuiteName);
                        component.set("v.CVCase.mailing_address2__c", '');
                    }
                }
            }  
            }
            else{
                helper.ObjFieldByMailingParent(component, event, CVCaseClone.Mailing_Countries__c);
                component.set("v.CVCase.Mailing_Street__c", CVCaseClone.Mailing_Street__c);
                component.set("v.mailing_address2__c", '');
                component.set("v.CVCase.Mailing_City__c", CVCaseClone.Mailing_City__c);
                component.set("v.CVCase.Mailing_ZipPostal_Code__c", CVCaseClone.Mailing_ZipPostal_Code__c); 
                component.set("v.CVCase.mailing_suite__c", CVCaseClone.mailing_suite__c); 
                component.set("v.CVCase.Mailing_States__c", CVCaseClone.Mailing_States__c); 
                component.set("v.CVCase.Mailing_Countries__c", CVCaseClone.Mailing_Countries__c); 
            }
        }
        else  {
            component.set("v.mailingAddressRequired", true);
            component.set("v.FFAddressRequired", false);
            var ffAddress = component.find('AddressFreeFormInput');
            console.log(ffAddress);
            $A.util.removeClass(ffAddress, 'slds-has-error');
        }
    },
    

    
    reviewInformation: function(component, event, helper){
        debugger;
        var CVCase = component.get("v.CVCase");
        var isLookupValSelected = true;
        var isAllValid = true;
        var isValidAddress = true;
        var isValidPhyAddress = true;
        var isAddressDataValid = true;
        var phoneFieldError = '';
        var isMobileFieldsDataValid = true;
        var verifiedAddress = true;
        var SecConInfoRequired = false;
        
        
        var StudentsList = component.get("v.StudentsList");
        var AccountList = '';
        var ProcessedStudentsList = '';
        
        var StudntTblErrors = '';
        var HHMTblErrors = '';
        var NonVerifiedStudntErrors = '';
        var showPrimaryGuardianSection = component.get("v.showPrimaryGuardianSection");
          
        var isManual = component.get("v.isManual");
        
        // check if user ticks the Update Address if required for Mailing Address
        if(!component.get("v.addressUpdate")  && component.get("v.UpdateAddressRequired")){
            isValidAddress= false;
            $A.util.addClass(component.find("addressUpdateCheckBox"), 'slds-has-error');
        }
         // check if user ticks the Update Address if required for Physical Address
       
        if(isValidAddress){
            debugger; 
            var controlselectAuraIds = ["priConCellPhone"];
            //ConInfoRequired = helper.secConValidations(component, CVCase);
            if(showPrimaryGuardianSection)
                controlselectAuraIds.push("PriGuardianFirstName", "PriGuardianLastName", "PriGuardianPhone");
            /*if(SecConInfoRequired)
                controlselectAuraIds.push("SecConFirstName", "SecConLastName", "SecConPhone", "SecConRelation");
            */
            //for Mailing Address
            if(component.get("v.showLookUp") && isManual){
                console.log('Lookup Address');
                if(component.get("v.CVCase.Mailing_Countries__c ") == "United States" || component.get("v.CVCase.Mailing_Countries__c ") == "Canada")
                    controlselectAuraIds.push("MailingStreetInput","MailingCityInput","MailingCountryInput","MailingStateInput" ,"MailingzipInput");
                else
                    controlselectAuraIds.push("MailingStreetInput","MailingCityInput","MailingCountryInput","MailingOtherState","MailingzipInput");
            }
            if(component.get("v.showLookUp") && !isManual)
                controlselectAuraIds.push("AddressFreeFormInput");
            
            
            for(var i = 0; i < controlselectAuraIds.length; i++) {
                console.log(i);
                debugger; 
                var fieldId = controlselectAuraIds[i];
                var cmpFindFieldId = component.find(fieldId);
                var fieldValue = cmpFindFieldId.get("v.value");
                console.log(cmpFindFieldId + ' ' + fieldValue);
                debugger; 
                if(fieldId == "AddressFreeFormInput" && !helper.checkMailingAddFieldsCompleteness(component, event)){
                    if($A.util.isUndefinedOrNull(fieldValue) || fielhandleAddressChangedValue.trim() == "") { 
                        component.set("v.FFAddressRequired", true); 
                        $A.util.addClass(cmpFindFieldId, 'slds-has-error');
                        isAllValid = false;
                        debugger; 
                    }
                    //if mailing address is not selected via lookup field
                    else{
                        isLookupValSelected = false;
                    }
                }

                else {
                    console.log(cmpFindFieldId + ' ' + fieldValue);
                    debugger; 
                    if(fieldValue === undefined || fieldValue === ''){
                        
                        $A.util.addClass(cmpFindFieldId, 'slds-has-error');
                        isAllValid = false;
                    
                    }                      
                }
            }
        }

        //validate mailing address integrity 
        if(isAllValid && isLookupValSelected && isValidAddress) {            
            //for mailing street
            var forMobAddRegex = /^([a-zA-Z0-9\. \,\:\/\$\#\-]+)$/g;
            var addWithoutApostrophe = CVCase.Mailing_Street__c.replace(new RegExp("\\\'","g"), '');
            if (!forMobAddRegex.test(addWithoutApostrophe)){
                $A.util.addClass(component.find('MailingStreetInput'), 'slds-has-error');
                isAddressDataValid = false;
            }            
            
            //validate mailing city value
            var forMobCityRegex = /^([a-zA-Z0-9\.\ \-]+)$/g;
            addWithoutApostrophe = CVCase.Mailing_City__c.replace(new RegExp("\\\'","g"), '');
            if (!forMobCityRegex.test(addWithoutApostrophe)){
                $A.util.addClass(component.find('MailingCityInput'), 'slds-has-error');
                isAddressDataValid = false;
            }

            //validate mailing postal code value for  US address
            if(component.get("v.CVCase.Mailing_Countries__c") == "United States"){
                var forZipRegex = /^[0-9-]*$/; 
                var count = (CVCase.Mailing_ZipPostal_Code__c.match(/-/g) || []).length;
                if (!forZipRegex.test(CVCase.Mailing_ZipPostal_Code__c) || count > 1  
                    || CVCase.Mailing_ZipPostal_Code__c.substr(-1) == '-' || CVCase.Mailing_ZipPostal_Code__c.charAt(0) == '-'){
                    $A.util.addClass(component.find('MailingzipInput'), 'slds-has-error');
                    isAddressDataValid = false;
                }
            }  
            
            //validate mailing postal code value for  NON-US address
            if(component.get("v.CVCase.Mailing_Countries__c") != "United States"){
                var forZipRegex = /^[a-zA-Z0-9 -]*$/;                 
                if (!forZipRegex.test(CVCase.Mailing_ZipPostal_Code__c)  || CVCase.Mailing_ZipPostal_Code__c.substr(-1) == '-' ||CVCase.Mailing_ZipPostal_Code__c.charAt(0) == '-'){
                    $A.util.addClass(component.find('MailingzipInput'), 'slds-has-error');
                    isAddressDataValid = false;
                }
            }  
            
            if (!$A.util.isEmpty(CVCase.mailing_address2__c)) {
                //validate mailing address Line 2 value
                var forAdd2Regex = /^([a-zA-Z0-9\. \,\:\/\$\#\-]+)$/g;
                addWithoutApostrophe = CVCase.mailing_address2__c.replace(new RegExp("\\\'","g"), '');
                if (!forAdd2Regex.test(addWithoutApostrophe)){
                    $A.util.addClass(component.find('MailingAddress2Input'), 'slds-has-error');
                    isAddressDataValid = false;
                }
            }
           
        }        
        // validate phone fields
        if (isAllValid && isLookupValSelected && isValidAddress && isAddressDataValid){
            // for Primary Contact
            var priConPhone  = CVCase.Ebt_Mobile_Phone__c.replace(/\D/g, '');
            var firstCharValforPriCon = priConPhone.charAt(0);
            if(priConPhone.length != 10) {
                isMobileFieldsDataValid = false;
                phoneFieldError+='Mobile number must contain 10 digits only for Primary Contact.\n';
            }
            if(firstCharValforPriCon == '1'  || firstCharValforPriCon == '0') {
                isMobileFieldsDataValid = false;
                phoneFieldError +='Mobile number should not begin with 1 or 0 for Primary Contact.\n';
            }
            // for Primary Guardian Contact
            if(showPrimaryGuardianSection){
                var pgPhone  = CVCase.PG_Mobile_Phone__c.replace(/\D/g, '');
                var firstCharValforPriGuardian = pgPhone.charAt(0);
                if(pgPhone.length != 10) {
                    isMobileFieldsDataValid = false;
                    phoneFieldError +='Mobile number must contain 10 digits only for Primary Guardian Contact.\n';
                }
                if(firstCharValforPriGuardian == '1'  || firstCharValforPriGuardian == '0') {
                    isMobileFieldsDataValid = false;
                    phoneFieldError +='Mobile number should not begin with 1 or 0 for Primary Guardian Contact.\n';
                }
            }
            // for Alternate Contact
            /*if(CVCase.Sec_First_Name__c  != '' &&  CVCase.Sec_Last_Name__c  != ''  && CVCase.Sec_Phone__c  != '' && CVCase.Relation__c != ''){
                var secConPhone  = CVCase.Sec_Phone__c.replace(/\D/g, '');
                var firstCharValforSecCon = secConPhone.charAt(0);
                if(secConPhone.length != 10) {
                    isMobileFieldsDataValid = false;
                    phoneFieldError +='Mobile number must contain 10 digits only for Alternate Contact.\n';
                }
                if(firstCharValforSecCon == '1'  || firstCharValforSecCon == '0') {
                    isMobileFieldsDataValid = false;
                    phoneFieldError +='Mobile number should not begin with 1 or 0 for Alternate Contact.\n';
                }
            }
         */
        
            if(!component.get("v.malingAddressCorrect")  &&  phoneFieldError == ''){
                verifiedAddress = false;
                $A.util.addClass(component.find("mAddressCheckBox"), 'slds-has-error');
            }
        }
        
      /*  if(!SecConInfoRequired){
            $A.util.removeClass(component.find('SecConFirstName'), 'slds-has-error');
            $A.util.removeClass(component.find('SecConLastName'), 'slds-has-error');
            $A.util.removeClass(component.find('SecConPhone'), 'slds-has-error');
            $A.util.removeClass(component.find('SecConRelation'), 'slds-has-error');
        }*/
                
        if (!isAllValid) 
            helper.showErrorMessage(component, event, helper, 'You must fill in all of the required fields.');
        
        else if (!isLookupValSelected) 
            helper.showErrorMessage(component, event, helper, 'Please make sure the Mailing Address provided is complete via the address lookup box.');
        
        else if (!isValidAddress) 
            helper.showErrorMessage(component, event, helper,'The Mailing Address provided is invalid. Please click the Update Mailing Address toggle to edit and provide a new mailing address.');
         
       
        
        else if (!isMobileFieldsDataValid) 
             helper.showErrorMessage(component, event, helper, phoneFieldError);

        else if(!isAddressDataValid)
             helper.showErrorMessage(component, event, helper, 'There are invalid characters in the Mailing Address fields. Please provide a valid Mailing Address.');
        
        
        else if(!verifiedAddress)
             helper.showErrorMessage(component, event, helper, 'Must check the I have verified that my mailing address is correct checkbox.');
        
		
        else{
            debugger;

           if (!component.get("v.iAccept")){
                helper.showErrorMessage(component, event, helper, 'Must check the I Accept checkbox.');
                $A.util.addClass(component.find("termsAndCons"), 'slds-has-error');
            }
           if (component.get("v.iAccept")){
                //disable save button
                debugger; 
                component.set("v.isActive", true);
                //show spinner
                var spinner = component.find("saveSpinner");
                $A.util.removeClass(spinner, "slds-hide");
                
                var emptyOut = [];
                component.set("v.ProcessedStudentsList", emptyOut);
                ProcessedStudentsList = component.get("v.ProcessedStudentsList");
                
                for (var i = 0; i < StudentsList.length; i++){
                    if(!$A.util.isEmpty(StudentsList[i].Citizen_ID__c)){
                        var citizenId = helper.getCleanedCitizenId(component, event, StudentsList[i].Citizen_ID__c);
                        ProcessedStudentsList.push({
                            'sobjectType'				: 	'CA_Student2__c',
                            'First_Name__c'				: 	StudentsList[i].First_Name__c,
                            'Last_Name__c'				: 	StudentsList[i].Last_Name__c,
                            'Citizen_ID__c'				:   citizenId,
                            'Date_of_Birth__c'			: 	StudentsList[i].Date_of_Birth__c
                        });
                    }
                }

           var action = component.get("c.validateStudentsList");
            action.setParams({ 
                StudentsList	:	ProcessedStudentsList
            });
            
               action.setCallback(this,function(response){
                   var state = response.getState(); 
                   if(state === 'SUCCESS'){
                       //hide spinner
                       var spinner = component.find("saveSpinner");
                       $A.util.addClass(spinner, "slds-hide");
                       //enable button
                       component.set("v.isActive", false);
                       
                       var result = response.getReturnValue();
                       var NonVerifiedStudentIds	= result.NonVerifiedStudentIds;
                       AccountList			= result.legitStudentsAccounts;
                       
                       //for invalide citizen ids
                       if(result.NonVerifiedStudentIds.length > 0) {
                           for (var i = 0; i < NonVerifiedStudentIds.length; i++){
                               for (var j = 0; j < StudentsList.length; j++){
                                   var cId  = StudentsList[j].Citizen_ID__c.includes(NonVerifiedStudentIds[i]);
                                   if( cId == true)  
                                       NonVerifiedStudntErrors+='The record for Student with Citizen ID: ' + StudentsList[j].Citizen_ID__c + ' cannot be verified.  For additional assistance, please contact support by phone at 918-453-5058 or by email at support-gadugiportal@cherokee.org.\n';
                               }
                           }
                           //show errors if any
                           if(NonVerifiedStudntErrors != '')
                               helper.showErrorMessage(component, event, helper, NonVerifiedStudntErrors);
                       }   
                       else {
                           var emptyOut = [];
                           component.set("v.ProcessedStudentsList", emptyOut);
                           var ProcessedStudentsList = component.get("v.ProcessedStudentsList");
                           
                           for (var i = 0; i < AccountList.length; i++){
                               var splitDate 	= 	 AccountList[i].Date_of_Birth__c.split('-');
                               ProcessedStudentsList.push({
                                   'sobjectType'				: 	'CA_Student2__c',
                                   'First_Name__c'				: 	AccountList[i].FirstName,
                                   'Last_Name__c'				: 	AccountList[i].LastName,
                                   'Citizen_ID__c'				:   AccountList[i].Tribe_Id__c,
                                   'Date_of_Birth__c'			: 	splitDate[1]+'/'+splitDate[2]+'/'+splitDate[0]
                               });
                           }
                           
                           for (var i = 0; i < StudentsList.length; i++){
                               var citizenId = helper.getCleanedCitizenId(component, event, StudentsList[i].Citizen_ID__c);
                               for (var j = 0; j < ProcessedStudentsList.length; j++) {
                                   if(ProcessedStudentsList[j].Citizen_ID__c == citizenId) {
                                       ProcessedStudentsList[j].Grade__c 	   		 =	StudentsList[i].Grade__c;
                                       ProcessedStudentsList[j].Category__c	  		 =	StudentsList[i].Category__c;
                                       ProcessedStudentsList[j].School_District__c	 =	StudentsList[i].School_District__c;
                                   }
                               }
                           }                       
                           component.set("v.showReviewScreen", true);
                       }
                       
                   }
                   else if (state == 'ERROR'){
                       //hide spinner
                       var spinner = component.find("saveSpinner");
                       $A.util.addClass(spinner, "slds-hide");
                       //enable button
                       component.set("v.isActive", false);
                       let errors = response.getError();
                       helper.showErrorMessage(component, event, helper, errors[0].message);
                   }
               });       
            	$A.enqueueAction(action);      
           }
        }
    },
  
    save: function(component, event, helper) {
        debugger;
        var ProcessedStudentsList 	= 	component.get("v.ProcessedStudentsList");
        var CVCase 					= 	component.get("v.CVCase");
        var priConMobile  			=	CVCase.Ebt_Mobile_Phone__c.replace(/\D/g, '');
        CVCase.Ebt_Mobile_Phone__c  = 	priConMobile;
        debugger; 
        /*if(CVCase.Sec_Phone__c != ''){
            var secConMobile  			=	CVCase.Sec_Phone__c.replace(/\D/g, '');
            CVCase.Sec_Phone__c  		= 	secConMobile;
        }*/
        if(component.get("v.showPrimaryGuardianSection")){
            debugger; 
            var pgConMobile  			=	CVCase.PG_Mobile_Phone__c.replace(/\D/g, '');
            CVCase.PG_Mobile_Phone__c  		= 	pgConMobile;
        }
        debugger; 
        var addressFreeForm 		= 	component.get("v.location");
        var isManual 				= 	component.get("v.isManual");
        var isAddressChanged 		= 	false;
        var melissaResult 			=	component.get("v.predictions");
        var states 					= 	component.get("v.states");
        var index					= 	component.get("v.selectedAddressIndex");
        var address 				= 	component.get("v.selectedAddress");
        var stateVal = ''; 
        if(!component.get("v.showMailingState")){
            stateVal = component.find("MailingOtherState").get("v.value"); 
        }
        else if(component.get("v.showMailingState")){
            stateVal = component.find("MailingStateInput").get("v.value");
        }
        console.log(melissaResult);
        debugger; 
             if(component.get("v.isManual")){
            for (var i = 0; i < melissaResult.length; i++){
                if(melissaResult[i].Address.SuiteCount > 0){
                     console.log(melissaResult[i].Address.State);
                    
                    
                    

                    debugger; 
                    for (var j = 0; j < melissaResult[i].Address.SuiteCount; j++){
                        if((melissaResult[i].Address.AddressLine1+' '+melissaResult[i].Address.SuiteList[j]+', '+
                            melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                            if(melissaResult[i].Address.AddressLine1 != component.find("MailingStreetInput").get("v.value") || 
                               melissaResult[i].Address.City != component.find("MailingCityInput").get("v.value") || 
                               states[0][melissaResult[i].Address.State] != stateVal || 
                               melissaResult[i].Address.PostalCode != component.find("MailingzipInput").get("v.value") || 
                               melissaResult[i].Address.SuiteList[j] != component.find("MailingSuiteInput").get("v.value") || 
                               component.find("MailingCountryInput").get("v.value") != "United States" || 
                               component.find("MailingAddress2Input").get("v.value") != ""){
                                component.set("v.isAddressChanged", true);
                                isAddressChanged = true;
                            }
                        }
                    }
                } 
                if(melissaResult[i].Address.SuiteCount < 1){
            
					
                    debugger; 
                    if((melissaResult[i].Address.AddressLine1+(melissaResult[i].Address.SuiteName != ''?' '+melissaResult[i].Address.SuiteName:'')+', '+
                        melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                        if(melissaResult[i].Address.AddressLine1 != component.find("MailingStreetInput").get("v.value") || 
                           melissaResult[i].Address.City != component.find("MailingCityInput").get("v.value") || 
                           states[0][melissaResult[i].Address.State] != stateVal ||
                           melissaResult[i].Address.PostalCode != component.find("MailingzipInput").get("v.value") || 
                           melissaResult[i].Address.SuiteName != component.find("MailingSuiteInput").get("v.value") || 
                           component.find("MailingCountryInput").get("v.value") != "United States" || 
                           component.find("MailingAddress2Input").get("v.value") != ""){
                            debugger; 
                            component.set("v.isAddressChanged", true);
                            isAddressChanged = true;
                        }
                    }
                }
            }
        }
        
          
        //disable save button
        component.set("v.isActive2", true);
        debugger; 
        //show spinner
        var spinner = component.find("Spinner2");
        $A.util.removeClass(spinner, "slds-hide");
        debugger; 
        
        
        var action = component.get("c.saveCARequest");
        debugger; 
        action.setParams({ 
            CVRequest			:  CVCase,
            addressFreeForm 	:	address,
            isManual		 	:	isManual,
            isAddressChanged 	:	isAddressChanged,
            
        });
        
        action.setCallback(this,function(response) {
           var state = response.getState(); 
           if(state === 'SUCCESS') {
               debugger;
               var result = response.getReturnValue();
               component.set("v.showReviewScreen", false); 
               component.set("v.caseId", result.Id);
               component.set("v.requestNumber", result.CaseNumber);
               component.set("v.showHousingStipend", false);
               component.set("v.showSuccessMessage", true);
           }
           if(state === 'ERROR')  {
               component.set("v.showReviewScreen", false);
               component.set("v.isActive", false);
               //enable button
               component.set("v.isActive2", false);
               //hide spinner
               var spinner = component.find("Spinner2");
               $A.util.addClass(spinner, "slds-hide");
               var err='';
               var errors = response.getError();
               errors.forEach( function (error)  {
                    //top-level error.  there can be only one
                    if (error.message)
                        err=err+' '+error.message;					
                    
                    //page-level errors (validation rules, etc)
                    if (error.pageErrors)  {
                        error.pageErrors.forEach( function(pageError)  {
                                err=err+' '+pageError.message;					
                           });					
                    }
                    
                    if (error.fieldErrors){
                        //field specific errors--we'll say what the field is					
                        for (var fieldName in error.fieldErrors) {
                            //each field could have multiple errors
                            error.fieldErrors[fieldName].forEach( function (errorList) {	
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
    
    viewRequest: function(component, event, helper){
        var recId = component.get("v.caseId");
        window.location.replace('/s/detail/'+recId);
    }, 
    
    handlePaste: function(component, event, helper){
        event.preventDefault(); 
    }, 
    
    handleContext: function(component, event, helper){
        event.preventDefault(); 
    },
    
    hideModal: function(component, event, helper) {
        component.set("v.showReviewScreen", false); 
    },
    


                   
 

})