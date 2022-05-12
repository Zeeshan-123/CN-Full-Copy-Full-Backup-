({
    doInit : function(component, event, helper){ 
        var  CVCase = component.get("v.CVCase");
        var action = component.get("c.getInfo");
        var searchTerm = component.get( "v.searchTerm" );
        var caseNum = '';
        var confMess = '';
        //helper.handleSearch( component, searchTerm );
        component.set("v.isLoading", true);
        component.set("v.showSuccessMessage", false);

        action.setCallback(this,function(response){
            var state = response.getState();
            debugger;
            if (state === "SUCCESS") {
                var resultData = response.getReturnValue(); 
                // request exist 
                debugger; 
                console.log(resultData);
                if (resultData.ScholarshipApp != undefined) {
                    debugger; 
                    
                    var result = response.getReturnValue();
                    
                   
                    
                   
                }//end
                else{
                    // set up dependent picklist
                    // 
                    debugger; 
                    console.log(resultData.mapOfDependentPL);
                    console.log(resultData);
                    
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
                    component.set("v.getPhysicalParentList", parentField);
                    console.log(resultData.acnt.Date_of_Birth__c);
                    debugger; 
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
                    
                    // set event map picklist value for Application
                     var eventMap = [];
                     var eventMapData = resultData.eventMap;
                    console.log(eventMapData);
                     for(var key in eventMapData){
                         eventMap.push({value:eventMapData[key], key:key});
                         
                     }
                     component.set("v.eventList", eventMap);
                    
                    // set relationship map picklist value for Sub Applicant Table
                     var relationshipMap = [];
                     var relationshipMapData = resultData.relationshipMap;
                    console.log(relationshipMapData);
                     for(var key in relationshipMapData){
                         relationshipMap.push({value:relationshipMapData[key], key:key});
                         
                     }
                     component.set("v.relationshipList", relationshipMap);


				// set employed map picklist value for Sub Applicant Table
                     var employedMap = [];
                     var employedMapData = resultData.employedMap;
                    console.log(employedMapData);
                     for(var key in employedMapData){
                         employedMap.push({value:employedMapData[key], key:key});
                         
                     }
                     component.set("v.employedList", employedMap);
                    
                    
                    
                    
                    var eventName = $A.get("$Label.c.Community_EmergencyAssistanceEvent");
                    component.set("v.eventName", eventName);
                    component.set("v.CVCase.Event__c", eventName);
                    console.log(eventName);
                    
                    
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
                        debugger; 
                        CVCase.Mailing_States__c = '';
                        debugger; 
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
                        debugger; 
                        CVCase.Mailing_States__c = resultData.acnt.PersonMailingState; 
                        debugger; 
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
                            debugger; 
                        CVCase.Mailing_States__c = resultData.acnt.PersonMailingState; 
                            debugger; 
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
                    debugger; 
                    var age = helper.getAge(component, event, resultData.acnt.Date_of_Birth__c);
                   /* if(age < 18  ){
                        //if applicant is under 18, show primary guardian section
                        component.set("v.showPrimaryGuardianSection", true);
                        controlselectAuraIds1.push("PriGuardianFirstName", "PriGuardianLastName", "PriGuardianPhone");
                    }*/
                    component.set("v.isLoading",false);
                    debugger; 
                    for(var i = 0; i < controlselectAuraIds1.length; i++) {
                        var fieldId1 = controlselectAuraIds1[i];
                        var cmpFindFieldId1 = component.find(fieldId1);
                        var fieldValue1 = cmpFindFieldId1.get("v.value");
                        if($A.util.isUndefinedOrNull(fieldValue1)) {
                            component.find(fieldId1).set("v.value", '');
                        }
                    } 
                     
                    debugger; 
                    

                    component.set('v.CVCase',CVCase);
                    component.set("v.CVCaseClone",JSON.parse(JSON.stringify(CVCase)));    
                    component.set('v.mailingStates',resultData.mapOfStates);
                    component.set('v.physicalStates',resultData.mapOfStates);
                    
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
    
     //handle update address toggle for Physical
    handlePhysicalAddreesUpdate : function(component, event, helper){
        var  CVCaseClone = component.get("v.CVCaseClone");
        if(component.get("v.physicalAddressUpdate")) {
            component.set("v.showPALookUp", true);
        }
        else  {
            component.set("v.showPALookUp", false);
            component.set("v.isPAManual", false);
            component.set("v.physicalAddressRequired", false);
            component.set("v.CVCase.Physical_Street__c", CVCaseClone.Physical_Street__c);
            component.set("v.CVCase.Physical_Address2__c", '');
            component.set("v.CVCase.Physical_City__c", CVCaseClone.Physical_City__c);
            component.set("v.CVCase.Physical_ZipPostal_Code__c", CVCaseClone.Physical_ZipPostal_Code__c); 
            component.set("v.CVCase.Physical_Suite__c", CVCaseClone.Physical_Suite__c); 
            component.set("v.CVCase.Physical_Countries__c", CVCaseClone.Physical_Countries__c); 
            helper.ObjFieldByPhysicalParent(component, event, CVCaseClone.Physical_Countries__c);
            component.set("v.CVCase.Physical_States__c", CVCaseClone.Physical_States__c); 
            
             // remove has errors
            $A.util.removeClass(component.find('PhysicalStreetInput'), 'slds-has-error');
            $A.util.removeClass(component.find('PhysicalCityInput'), 'slds-has-error');
            $A.util.removeClass(component.find('PhysicalStateInput'), 'slds-has-error');
            $A.util.removeClass(component.find('PhysicalCountryInput'), 'slds-has-error');
            $A.util.removeClass(component.find('PhysicalzipInput'), 'slds-has-error');
            $A.util.removeClass(component.find('PhysicalOtherState'), 'slds-has-error');
        }
       
    },
    
    onPhysicalCountryChange : function(component, event, helper){
        var CVCase = component.get('v.CVCase');
        helper.ObjFieldByPhysicalParent(component, event, CVCase.Physical_Countries__c);
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
   
     formatNumber:  function(component, event)   { 
        var fieldId = event.getSource().getLocalId();
        var fieldInput = component.find(fieldId);
        var val = fieldInput.get('v.value');
         console.log(fieldInput);
        debugger; 
        // Strip all characters from the input except digits
        var inputValue = val.replace(/\D/g,'');
         
         if(fieldId == 'satScore' || fieldId == 'expectedGradYear'){
            inputValue = inputValue.substring(0,4);
            
 
         }
         else if(fieldId == 'actScore' ){
             inputValue = inputValue.substring(0,2);
         }
             else if(fieldId == 'noHours'){
                 inputValue = inputValue.substring(0,3);

                     }
        
        fieldInput.set('v.value', inputValue);
         debugger; 
    },
    
    validateEmail:  function(component, event)   { 
        var regex = new RegExp("/^[a-zA-Z0-9._-]+@[a-z0-9\-]+\.[a-z]{2,3}/","g");
        debugger;
        var fieldId = event.getSource().getLocalId();
        debugger;
        var fieldInput = component.find(fieldId);
        debugger;
        var inputValue = fieldInput.get('v.value');
        debugger;
    	var validity = component.find(fieldId).get("v.validity");
        console.log(validity.valid);
        debugger; 
        if(validity.valid == false){
            $A.util.addClass(component.find(fieldId), 'slds-has-error');
        }
        debugger; 
        
    },
       
    //format phone fields
    formatPhone:  function(component, event)   { 
        var fieldId = event.getSource().getLocalId();
        var fieldInput = component.find(fieldId);
        var val = fieldInput.get('v.value');
        debugger; 
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
      //format phone fields
    
     formatDate:  function(component, event)   { 
        var fieldId = event.getSource().getLocalId();
        var fieldInput = component.find(fieldId);
        var val = fieldInput.get('v.value');
        
        // Strip all characters from the input except digits
        var inputValue = val.replace(/\D/g,'');
        
        // Trim the remaining input to ten characters, to preserve SSN format
        inputValue = inputValue.substring(0,8);

        // Based upon the length of the string, adding necessary formatting 
        var size = inputValue.length;
        if(size == 0)
                inputValue = inputValue;
        else if(size < 2)
            inputValue = inputValue+'/';
        else if(size < 4)
       		  inputValue = '/'+inputValue.substring(0,2)+'/'+inputValue.substring(2,4);
        else
            inputValue = inputValue.substring(0,2)+'/'+inputValue.substring(2,4)+'/'+inputValue.substring(4,8);
     
        fieldInput.set('v.value', inputValue);
    },
   
    picklistChange : function(component, event){
        debugger; 
        console.log('function runs');
    },
    clearErrors : function(component, event)    {
        debugger;
        var fieldId = event.getSource().getLocalId();
        debugger;
        var fieldInput = component.find(fieldId);
        debugger;
        var fieldValue = fieldInput.get("v.value");
        console.log('fieldId' + fieldValue);
        debugger; 
        if(fieldValue != '' || fieldValue != NULL)
            $A.util.removeClass(fieldInput, 'slds-has-error');
    },
        
    handleAddressChange: function(component, event, helper) {
        if(event.getSource().get("v.value").length % 3 == 0){
            debugger;
            component.set('v.mailingAddressClicked',false);
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
        component.set("v.mailingAddressClicked", true);
        
        var details = event.currentTarget;
        var melissaResult = component.get("v.predictions");
        var states = component.get("v.mailingStates");
        var index = details.dataset.placeid;
        var address = details.dataset.place;
        console.log("Melissa Address :" + address);
        component.set("v.selectedAddressIndex", index);
        component.set("v.location", address);
        component.set("v.selectedAddress", address);

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
        document.getElementById("addressResult").style.display = "none";
        //component.set("v.predictions", []);
    },
    
    handleToggleChange: function(component, event, helper){
        debugger
        var  addressClicked = component.get("v.mailingAddressClicked");
        var  CVCaseClone = component.get("v.CVCaseClone");
        var melissaResult = component.get("v.predictions");
        var states = component.get("v.mailingStates");
        debugger;
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
            
    
            debugger;
            if(melissaResult.length > 0 && addressClicked) {
                for (var i = 0; i < melissaResult.length; i++){
                    if(melissaResult[i].Address.SuiteCount > 0){
                        for (var j = 0; j < melissaResult[i].Address.SuiteCount; j++){
                            if((melissaResult[i].Address.AddressLine1+' '+melissaResult[i].Address.SuiteList[j]+', '+
                                melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                                component.set("v.CVCase.Mailing_Street__c", melissaResult[i].Address.AddressLine1);
                                debugger; 
                                component.set("v.CVCase.Mailing_City__c", melissaResult[i].Address.City);
                                debugger; 
                                component.set("v.CVCase.Mailing_Countries__c", "United States");
                                debugger; 
                                helper.ObjFieldByMailingParent(component, event, "United States");
                                debugger; 
                                console.log(melissaResult[i].Address.State);
                                console.log(states[0]);
                                console.log(states[0][melissaResult[i].Address.State]);
                                debugger; 
                                component.set("v.CVCase.Mailing_States__c", states[0][melissaResult[i].Address.State]);
                                debugger;
                                component.set("v.CVCase.Mailing_ZipPostal_Code__c", melissaResult[i].Address.PostalCode);
                                debugger; 
                                component.set("v.CVCase.mailing_suite__c", melissaResult[i].Address.SuiteList[j]);
                                debugger; 
                                component.set("v.CVCase.mailing_address2__c", '');
                            }
                        }
                    } 
                if(melissaResult[i].Address.SuiteCount < 1){
                    if((melissaResult[i].Address.AddressLine1+(melissaResult[i].Address.SuiteName != ''?' '+melissaResult[i].Address.SuiteName:'')+', '+
                        melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                        debugger;
                        component.set("v.CVCase.Mailing_Street__c", melissaResult[i].Address.AddressLine1);
                        debugger; 
                        component.set("v.CVCase.Mailing_City__c", melissaResult[i].Address.City);
                        debugger; 
                        component.set("v.CVCase.Mailing_Countries__c", "United States");
                        debugger; 
                        helper.ObjFieldByMailingParent(component, event, "United States");
                         debugger; 
                                console.log(melissaResult[i].Address.State);
                                console.log(states[0]);
                                console.log(states[0][melissaResult[i].Address.State]);
                                debugger; 
                        component.set("v.CVCase.Mailing_States__c", states[0][melissaResult[i].Address.State]);
                        debugger; 
                        component.set("v.CVCase.Mailing_ZipPostal_Code__c", melissaResult[i].Address.PostalCode);
                        debugger; 
                        component.set("v.CVCase.mailing_suite__c", melissaResult[i].Address.SuiteName);
                        debugger; 
                        component.set("v.CVCase.mailing_address2__c", '');
                    }
                }
            }  
            }
            else{
                helper.ObjFieldByMailingParent(component, event, CVCaseClone.Mailing_Countries__c);
                debugger; 
                component.set("v.CVCase.Mailing_Street__c", CVCaseClone.Mailing_Street__c);
                debugger; 
                component.set("v.CVCase.mailing_address2__c", '');
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
            $A.util.removeClass(ffAddress, 'slds-has-error');
        }
    },
    
    reviewInformation: function(component, event, helper){
        debugger;
        
        //var StudentsList = component.get("v.HHMembersList");
        var AccountList = '';
        var CVCase = component.get("v.CVCase");
        var isLookupValSelected = true;
        var isPhyLookupValSelected = true;
        var isAllValid = true;
        var isValidAddress = true;
        var isValidPhyAddress = true;
        var isOklahomaPhysicalAddress = true;
        var isAddressDataValid = true;
        var isPhyAddressDataValid = true;
        var phoneFieldError = '';
        var isMobileFieldsDataValid = true;
        var verifiedAddress = true;
        var SecConInfoRequired = false;
        var HHMembersList 	= 	component.get("v.HHMembersList");
        var isHHMDataValid = true; 
        var AccountList = '';
        var errorMessages = false; 
        
        var errorExist = false; 
        var HHMTblErrors = '';
        var NonVerifiedStudntErrors = '';
        var showPrimaryGuardianSection = component.get("v.showPrimaryGuardianSection");
        var HHMembersCitizen = component.get("v.HHMembersCitizen");
         console.log(HHMembersCitizen.length);
        debugger; 
        var isManual = component.get("v.isManual");
        var fileError = false; 
        var fileErrorMsg = '';
        var errorMessages = null;
        var errorMessagesForChild = null;
        var errorMessagesForInvalidRecords = null;
        
        
        debugger; 
         
        
        // check if user ticks the Update Address if required for Mailing Address
        if(!component.get("v.addressUpdate")  && component.get("v.UpdateAddressRequired")){
            isValidAddress= false;
            $A.util.addClass(component.find("addressUpdateCheckBox"), 'slds-has-error');
        }
         // check if user ticks the Update Address if required for Physical Address
       if(!component.get("v.physicalAddressUpdate")  && component.get("v.UpdatePhysicalAddressRequired") && isValidAddress){
            isValidPhyAddress= false;
            $A.util.addClass(component.find("addressUpdateCheckBoxPhysical"), 'slds-has-error');
        }
        console.log('Valid Address: ' + isValidAddress);
        console.log('Valid Physical Address: ' + isValidPhyAddress);
        if(isValidAddress && isValidPhyAddress){
            debugger; 
            var controlselectAuraIds = [];
            controlselectAuraIds.push("applicationType");
            //ConInfoRequired = helper.secConValidations(component, CVCase);
            
            //for Mailing Address
            if(component.get("v.showLookUp") && isManual){
                console.log('Lookup Address');
                if(component.get("v.CVCase.Mailing_Countries__c ") == "United States" || component.get("v.CVCase.Mailing_Countries__c ") == "Canada")
                    controlselectAuraIds.push("MailingStreetInput","MailingCityInput","MailingCountryInput","MailingStateInput" ,"MailingzipInput");
                else
                    controlselectAuraIds.push("MailingStreetInput","MailingCityInput","MailingCountryInput","MailingOtherState","MailingzipInput");
            }
            debugger; 
            if(component.get("v.showLookUp") && !isManual)
                controlselectAuraIds.push("AddressFreeFormInput");
            debugger; 
            if(component.get("v.showPALookUp") && component.get("v.isPAManual")){
                if(component.get("v.CVCase.Physical_Countries__c ") == "United States" || component.get("v.CVCase.Physical_Countries__c ") == "Canada"){
                   controlselectAuraIds.push("PhysicalStreetInput","PhysicalCityInput","PhysicalCountryInput","PhysicalStateInput" ,"PhysicalzipInput");
                debugger; 

                }
                else
                    controlselectAuraIds.push("PhysicalStreetInput","PhysicalCityInput","PhysicalCountryInput","PhysicalOtherState","PhysicalzipInput");
            }
            debugger; 
            console.log(controlselectAuraIds);

            debugger; 
            
            if(component.get("v.showPALookUp") && !component.get("v.isPAManual")){
                controlselectAuraIds.push("AddressFreeFormInputPhysical");
                console.log('true');
            }
                
            console.log(controlselectAuraIds);
            debugger;
            
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
        if(isAllValid && isLookupValSelected && isValidAddress && isPhyLookupValSelected && isValidPhyAddress) {            
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
            if(isAddressDataValid){
                //for physical street
                var forMobAddRegex = /^([a-zA-Z0-9\. \,\:\/\$\#\-]+)$/g;
                var addWithoutApostrophe = CVCase.Physical_Street__c.replace(new RegExp("\\\'","g"), '');
                if (!forMobAddRegex.test(addWithoutApostrophe)){
                    $A.util.addClass(component.find('PhysicalStreetInput'), 'slds-has-error');
                    isPhyAddressDataValid = false;
                }            
                
                //validate physical city value
                var forMobCityRegex = /^([a-zA-Z0-9\.\ \-]+)$/g;
                addWithoutApostrophe = CVCase.Physical_City__c.replace(new RegExp("\\\'","g"), '');
                if (!forMobCityRegex.test(addWithoutApostrophe)){
                    $A.util.addClass(component.find('PhysicalCityInput'), 'slds-has-error');
                    isPhyAddressDataValid = false;
                }
                
                //validate physical postal code value for  US address
                if(component.get("v.CVCase.Physical_Countries__c") == "United States"){
                    var forZipRegex = /^[0-9-]*$/; 
                    var count = (CVCase.Physical_ZipPostal_Code__c .match(/-/g) || []).length;
                    if (!forZipRegex.test(CVCase.Physical_ZipPostal_Code__c ) || count > 1  
                        || CVCase.Physical_ZipPostal_Code__c .substr(-1) == '-' || CVCase.Physical_ZipPostal_Code__c .charAt(0) == '-'){
                        $A.util.addClass(component.find('PhysicalzipInput'), 'slds-has-error');
                        isPhyAddressDataValid = false;
                    }
                }  
                
                //validate physical postal code value for  NON-US address
                if(component.get("v.CVCase.Physical_Countries__c") != "United States"){
                    var forZipRegex = /^[a-zA-Z0-9 -]*$/;                 
                    if (!forZipRegex.test(CVCase.Physical_ZipPostal_Code__c )  || CVCase.Physical_ZipPostal_Code__c .substr(-1) == '-' ||CVCase.Physical_ZipPostal_Code__c .charAt(0) == '-'){
                        $A.util.addClass(component.find('PhysicalzipInput'), 'slds-has-error');
                        isPhyAddressDataValid = false;
                    }
                }  
                
                if (!$A.util.isEmpty(CVCase.Physical_Address2__c)) {
                    //validate physical address Line 2 value
                    var forAdd2Regex = /^([a-zA-Z0-9\. \,\:\/\$\#\-]+)$/g;
                    addWithoutApostrophe = CVCase.Physical_Address2__c.replace(new RegExp("\\\'","g"), '');
                    if (!forAdd2Regex.test(addWithoutApostrophe)){
                        $A.util.addClass(component.find('PhysicalAddress2Input'), 'slds-has-error');
                        isPhyAddressDataValid = false;
                    }
                }
            }
           
        }        
        // validate phone fields
        if (isAllValid && isLookupValSelected && isValidAddress && isAddressDataValid){
            debugger; 
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
            debugger;
            
        
            if(!component.get("v.malingAddressCorrect")  &&  phoneFieldError == ''){
                verifiedAddress = false;
                $A.util.addClass(component.find("mAddressCheckBox"), 'slds-has-error');
            }
        }
        
        debugger; 
        if(HHMembersList.length > 0){
       var emptyOut = [];
       var HHMembersCitizen = [];
       component.set("v.HHMembersCitizen", emptyOut);
        HHMembersCitizen = component.get("v.HHMembersCitizen");
        
            
        var emptyOut2 = [];
       var HHMembersNonCitizen = [];
       component.set("v.HHMembersNonCitizen", emptyOut2);
        HHMembersNonCitizen = component.get("v.HHMembersNonCitizen");    
            
        for (var i = 0; i < HHMembersList.length; i++){
            debugger; 
            var citizenId = ''; 
            citizenId = HHMembersList[i].Citizen_ID__c; 
            if(citizenId === '' || citizenId === undefined){
                HHMembersNonCitizen.push({
                'sobjectType'		: 	'Sub_Applicant__c',
                'First_Name_Text__c'		:   HHMembersList[i].First_Name_Text__c, 
                'Last_Name_Text__c'		: 	HHMembersList[i].Last_Name_Text__c,
                'Date_of_Birth__c'	: 	HHMembersList[i].Date_of_Birth__c,
                'Citizen_ID__c'		: 	''
            });
            }
            else{
            
            if(HHMembersList[i].Citizen_ID__c.trim()  != '' ||  HHMembersList[i].Citizen_ID__c.trim()  != undefined){
               debugger; 
                
                HHMembersCitizen.push({
                'sobjectType'		: 	'Sub_Applicant__c',
                'First_Name_Text__c'		:   HHMembersList[i].First_Name_Text__c, 
                'Last_Name_Text__c'		: 	HHMembersList[i].Last_Name_Text__c,
                'Date_of_Birth__c'	: 	HHMembersList[i].Date_of_Birth__c,
                'Citizen_ID__c'		: 	HHMembersList[i].Citizen_ID__c
            });
              /*HHMembersCitizen.push({
                            'sobjectType'				: 	'Sub_Applicant__c',
                            'Citizen_ID__c'				:   HHMembersList[i].Citizen_ID__c,
                            'Date_of_Birth__c'			: 	HHMembersCitizen[i].Date_of_Birth__c
                            
                        });*/
                debugger; 
                console.log(HHMembersCitizen.length);
                debugger; 
            }
            }
                                            
                    
                    if(HHMembersList[i].First_Name_Text__c.trim()  == '' ||  HHMembersList[i].Last_Name_Text__c.trim()  == ''  || HHMembersList[i].Date_of_Birth__c  == '')
                            HHMTblErrors += 'Please fill in all fields for Row ' + (i + 1) +' of the Household table or remove if not being submitted.\n';                      
                    }
                    if(component.find('HHMList')){
                        isHHMDataValid = component.find('HHMList').reduce(function (validSoFar, inputCmp) {
                            inputCmp.showHelpMessageIfInvalid();
                            return validSoFar && inputCmp.get('v.validity').valid;
                        }, true);
                    }
                    debugger; 
                    // validate date of birth field values format
                    if(HHMTblErrors == '' && isHHMDataValid )  {
                        debugger; 
                        for (var i = 0; i < HHMembersList.length; i++)   {
                            //validation for date of birth format
                            debugger; 
                            var date_regex = /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/ ;
                            debugger; 
                            var checkDateFormate=  date_regex.test(HHMembersList[i].Date_of_Birth__c);  
                            //does date format is correct?
                            if (!checkDateFormate)
                                HHMTblErrors +='Invalid date format on Row ' + (i + 1)+' of the Household table.  Correct format is MM/DD/YYYY.\n';
                        }
                    }
        			debugger; 
                    //validate Name fields
                    if(HHMTblErrors == ''){
                 //       var nameRegex = new RegExp("[^a-zA-Z-]","g");
                        var nameRegex = /^[a-zA-Z -]*$/;
                        for (var i = 0; i < HHMembersList.length; i++){
                            if(!nameRegex.test(HHMembersList[i].First_Name__c)||  !nameRegex.test(HHMembersList[i].Last_Name__c))
                                HHMTblErrors += 'Name cannot contain special characters or numbers for Household table: Row ' + (i + 1) +'.\n';                      
                        }
                    }
        debugger; 
                    //show student table errors if any
                    if(HHMTblErrors != ''){
                        helper.showErrorMessage(component, event, helper, HHMTblErrors);
                        validDataforTables = false;
                    }
        debugger; 
            }
		if(errorExist){
                helper.showErrorMessage(component, event, helper, 'Please review invalid fields.');
        errorMessages = true;     
        }
        else if (!isAllValid) {
            helper.showErrorMessage(component, event, helper, 'You must fill in all of the required fields.');

            errorMessages = true;
        }
        
        else if (!isLookupValSelected){
                            helper.showErrorMessage(component, event, helper, 'Please make sure the Mailing Address provided is complete via the address lookup box.');
                errorMessages = true; 
            } 
        
       else if (!isValidAddress) {
                                helper.showErrorMessage(component, event, helper,'The Mailing Address provided is invalid. Please click the Update Mailing Address toggle to edit and provide a new mailing address.');
                    errorMessages = true; 
                }
           else if (!isPhyLookupValSelected) {
                           helper.showErrorMessage(component, event, helper, 'Please make sure the Physical Address provided is complete via the address lookup box.');
 errorMessages= true; 

           }
        
               else if (!isValidPhyAddress) {
                               helper.showErrorMessage(component, event, helper,'The Physical Address provided is invalid. Please click the Update Physical Address toggle to edit and provide a new physical address.');
 errorMessages= true; 

               }
      
         
        else if (!isMobileFieldsDataValid) 
        {
            helper.showErrorMessage(component, event, helper, phoneFieldError);
            errorMessages = true; 
        }
             

            else if(!isAddressDataValid) {
                             helper.showErrorMessage(component, event, helper, 'There are invalid characters in the Mailing Address fields. Please provide a valid Mailing Address.');

                errorMessages = true; 
            }
        
        else if (!isPhyAddressDataValid) 
        {
                        helper.showErrorMessage(component, event, helper,'There are invalid characters in the Physical Address fields. Please provide a valid Physical Address.');
 errorMessages= true; 
        }
        else if(!verifiedAddress)
        {
                         helper.showErrorMessage(component, event, helper, 'Must check the I have verified that my mailing address is correct checkbox.');

            errorMessages= true; 
        }
         else if(!component.get("v.physicalAddressCorrect")){
                $A.util.addClass(component.find("pAddressCheckBox"), 'slds-has-error');
             helper.showErrorMessage(component, event, helper, 'Must check the I have verified that my physical address is correct checkbox.');
         errorMessages = true;    
         }
       
   
            // check for student grid level error if grid has any record
         else if( HHMembersCitizen.length > 0)
            {
                debugger;
                let CidMap = new Map();
                
                // check for empty fields
                for (var i = 0; i < HHMembersCitizen.length; i++) 
                {
                    debugger; 
                    if ( HHMembersCitizen[i].Citizen_ID__c == '' || HHMembersCitizen[i].Date_of_Birth__c == '' ) 
                    {
                        debugger; 
                        if(errorMessagesForChild == null)
                        {
                            debugger; 
                            errorMessagesForChild='Please fill in all fields or remove if not being submitted: Row ' + (i + 1) +'.\n';                      
                        }
                        else
                        {
                            debugger; 
                            errorMessagesForChild+='Please fill in all fields or remove if not being submitted: Row ' + (i + 1) +'.\n';                      
                        } 
                    }
                }
                
                // check for date of bith fields validity
                if(errorMessagesForChild == null)
                {
                    debugger; 
                    for (var i = 0; i < HHMembersCitizen.length; i++) 
                    {
                        debugger; 
                        if(!$A.util.isEmpty(HHMembersCitizen[i].Date_of_Birth__c)) 
                        {
                            
                            //get student's age
                            var dob = new Date(HHMembersCitizen[i].Date_of_Birth__c);
                            //calculate month difference from current date in time
                            var month_diff = Date.now() - dob.getTime();
                            //convert the calculated difference in date format
                            var age_dt = new Date(month_diff); 
                            //extract year from date    
                            var year = age_dt.getUTCFullYear();
                            //now calculate the age of the user
                            var age = Math.abs(year - 1970);
                            
                            //validation for date of birth format
                            var date_regex = /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/ ;
                            var checkDateFormate=  date_regex.test(HHMembersList[i].Date_of_Birth__c);  
                            
                            //does date format is correct?
                            if (!checkDateFormate)
                            {
                                if(errorMessagesForChild == null)
                                {
                                    errorMessagesForChild='Invalid date format at row ' + (i + 1)+'. Correct format is MM/DD/YYYY.\n';
                                }
                                else
                                {
                                    errorMessagesForChild +='Invalid date format at row ' + (i + 1)+'. Correct format is MM/DD/YYYY.\n';
                                } 
                            }  else
                            {

                                /*if(age > 18)
                                {
                                    if(errorMessagesForChild == null)
                                    {
                                        errorMessagesForChild='Children must be under 18 years old.\n';   
                                    }
                                     else
                                    {
                                        errorMessagesForChild +='Children must be under 18 years old.\n';
                                    }
                                }*/
                            }
                            
                        } 
                    }
                }
                
                // check for duplicate citizen ids validity
                if(errorMessagesForChild == null)
                {
                    debugger;
                    for (var i = 0; i < HHMembersCitizen.length; i++) 
                    {
                        //validation for Citizen Id formate
                        if(!$A.util.isEmpty(HHMembersCitizen[i].Citizen_ID__c)) 
                        {
                            debugger; 
                            if(CidMap.get(HHMembersCitizen[i].Citizen_ID__c) == undefined)
                            {
                                CidMap.set(HHMembersCitizen[i].Citizen_ID__c, i);
                            }
                            
                            else
                            {
                                if(errorMessagesForChild == null)
                                {
                                    errorMessagesForChild='Duplicate Citizen ID for child at row ' + (i + 1)+'. Please review and try again.\n';                      
                                }
                                else
                                {
                                    errorMessagesForChild+='Duplicate Citizen ID for child at row ' + (i + 1)+'. Please review and try again.\n';                      
                                } 
                                
                            }
                            
                        } 
                    }
                }  
                
                //show child grid related errors if any
                if(errorMessagesForChild != null)
                {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'Error',
                        message: errorMessagesForChild,
                        duration:' 60000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'dismissible'
                    });
                    toastEvent.fire();
                }
                console.log(component.get("v.iAccept"));
          /* if (!component.get("v.iAccept")){
                helper.showErrorMessage(component, event, helper, 'Must check the I Accept checkbox.');
                $A.util.addClass(component.find("termsAndCons"), 'slds-has-error');
               errorMessages = true; 
            }
           if (component.get("v.iAccept")){
                //disable save button
                debugger; 
                component.set("v.isActive", true);
                //show spinner
               
               
                
				debugger; 
          component.set("v.showReviewScreen", true);
           
            
              
           }*/
            }
		 //make server call to validate cititzen ids
       
     else{
            debugger;
console.log(component.get("v.iAccept"));
           if (!component.get("v.iAccept")){
                helper.showErrorMessage(component, event, helper, 'Must check the I Accept checkbox.');
                $A.util.addClass(component.find("termsAndCons"), 'slds-has-error');
               errorMessages = true; 
            }
           if (component.get("v.iAccept")){
                //disable save button
                debugger; 
                component.set("v.isActive", true);
                //show spinner
               
               
                
				debugger; 
          component.set("v.showReviewScreen", true);
           
            
              
           }
        }
      if (errorMessagesForChild == null && !errorMessages && component.get("v.iAccept") )
        {
            debugger;
            if( HHMembersCitizen.length > 0)
            {
                //disable save button
                component.set("v.isActive", true);
                //show spinner
                var spinner = component.find("saveSpinner");
                $A.util.removeClass(spinner, "slds-hide");
                
                var emptyOut = [];
                 var StudentsListSendToApex = [];
                component.set("v.StudentsListSendToApex", emptyOut);
                StudentsListSendToApex = component.get("v.StudentsListSendToApex");
                
                for (var i = 0; i < HHMembersCitizen.length; i++) 
                {
                    debugger;
                    //validation for Citizen Id format
                    if(!$A.util.isEmpty(HHMembersCitizen[i].Citizen_ID__c)) 
                    {
                        debugger; 
                        // cleaning citizen id
                        var removedAlphabet 			= 	HHMembersCitizen[i].Citizen_ID__c.replace(/[^\d.-]/g, '');
                        var removedLeadingZeros 		=	removedAlphabet.replace(/^0+/, '');
                        var removeSigns					=	removedLeadingZeros.replace(/^-+/, '');
                        var citizenId 					=	removeSigns.replace(/^0+/, '');
                        debugger; 
                        console.log(citizenId);
                        console.log(HHMembersCitizen[i].Date_of_Birth__c);
                        debugger; 
                        StudentsListSendToApex.push({
                            'sobjectType'				: 	'Sub_Applicant__c',
                            'Citizen_ID__c'				:   citizenId,
                            'Date_of_Birth__c'			: 	HHMembersCitizen[i].Date_of_Birth__c
                            
                        });
                        debugger; 
                    }
                }
                debugger; 
                console.log(HHMembersCitizen);
                debugger; 
                console.log(StudentsListSendToApex);
                var errorMessagesForInvalidRecords = '';
              
                var action = component.get("c.validateStudentsList");
                debugger; 
                
                action.setParams({ 
                    HHMembersCitizen		:		StudentsListSendToApex
                });
              
                
                action.setCallback(this,function(response)
                                   {
                                       var state = response.getState(); 
                                       debugger; 
                                       if(state === 'SUCCESS')
                                       {
                                          var HHMembersCitizen = component.get("v.HHMembersCitizen");

                                           var result = response.getReturnValue();
                                           console.log(result);
                                           debugger; 
                                           console.log(HHMembersCitizen);
                                           var InvalidCitizenIds	 				= 	result.InvalidCitizenIds;
                                           var CitizenIdsOfAccntsWithDoDNotNull 	= 	result.CitizenIdsOfAccntsWithDoDNN;
                                           var CitizenIdsOfRelinquishedAccounts 	= 	result.CitizenIdsOfRelinquishedAccounts;
                                           AccountList					 		= 	result.accList;
                                           debugger; 
                                           //for invalide citizen ids
                                           if(result.InvalidCitizenIds.length > 0)
                                           {
                                               debugger; 
                                               for (var i = 0; i < InvalidCitizenIds.length; i++) 
                                               {
                                                   debugger; 
                                                   for (var j = 0; j < HHMembersCitizen.length; j++) 
                                                   {
                                                       debugger; 
                                                       var cId  = HHMembersCitizen[j].Citizen_ID__c.includes(InvalidCitizenIds[i]);
                                                       
                                                       if( cId == true)
                                                       {
                                                           debugger; 
                                                           if(errorMessagesForInvalidRecords == null)
                                                           {
                                                               debugger; 
                                                               errorMessagesForInvalidRecords='The record for Household Member with Citizen ID: ' + HHMembersCitizen[j].Citizen_ID__c + ' cannot be verified.  For additional assistance, please contact support by phone at 918-453-5058 or by email at support-gadugiportal@cherokee.org.';
                                                           }
                                                           else
                                                           {
                                                               debugger; 
                                                               errorMessagesForInvalidRecords='The record for Household Member with Citizen ID: ' + HHMembersCitizen[j].Citizen_ID__c + ' cannot be verified.  For additional assistance, please contact support by phone at 918-453-5058 or by email at support-gadugiportal@cherokee.org.';
                                                           }
                                                       }
                                                   }
                                                   
                                               }
                                               debugger; 
                                               //show errors for invalid citizen id records if any
                                               if(errorMessagesForInvalidRecords != null)
                                               {
                                                   debugger; 
                                                   //hide spinner
                                                   var spinner = component.find("saveSpinner");
                                                   $A.util.addClass(spinner, "slds-hide");
                                                   //enable button
                                                   component.set("v.isActive", false);
                                                   
                                                   var toastEvent = $A.get("e.force:showToast");
                                                   toastEvent.setParams({
                                                       title : 'Warning',
                                                       message: errorMessagesForInvalidRecords,
                                                       duration:' 60000',
                                                       key: 'info_alt',
                                                       type: 'error',
                                                       mode: 'dismissible'
                                                   });
                                                   toastEvent.fire();
                                               }
                                           }   
                                           
                                           
                                           //for citizen ids of accounts where DOD field is not null
                                           else if(result.CitizenIdsOfAccntsWithDoDNN.length > 0)
                                           {
                                               debugger;
                                               for (var i = 0; i < CitizenIdsOfAccntsWithDoDNotNull.length; i++) 
                                               {
                                                   for (var j = 0; j < HHMembersCitizen.length; j++) 
                                                   {
                                                       var rId  = HHMembersCitizen[j].Citizen_ID__c.includes(CitizenIdsOfAccntsWithDoDNotNull[i]);
                                                       
                                                       if( rId == true)
                                                       {
                                                           if(errorMessagesForInvalidRecords == null)
                                                           {
                                                               errorMessagesForInvalidRecords='The record for Household Member with Citizen ID: ' + HHMembersCitizen[j].Citizen_ID__c + ' cannot be verified.  For additional assistance, please contact support by phone at 918-453-5058 or by email at support-gadugiportal@cherokee.org.';
                                                           }
                                                           else
                                                           {
                                                               errorMessagesForInvalidRecords+="\n"+'The record for Household Member with Citizen ID: ' + HHMembersCitizen[j].Citizen_ID__c + ' cannot be verified.  For additional assistance, please contact support by phone at 918-453-5058 or by email at support-gadugiportal@cherokee.org.';
                                                           }
                                                       }
                                                       
                                                   } 
                                               }
                                               
                                               //show errors for invalid citizen id records if any
                                               if(errorMessagesForInvalidRecords != null)
                                               {
                                                   //hide spinner
                                                   var spinner = component.find("saveSpinner");
                                                   $A.util.addClass(spinner, "slds-hide");
                                                   //enable button
                                                   component.set("v.isActive", false);
                                                   
                                                   var toastEvent = $A.get("e.force:showToast");
                                                   toastEvent.setParams({
                                                       title : 'Warning',
                                                       message: errorMessagesForInvalidRecords,
                                                       duration:' 60000',
                                                       key: 'info_alt',
                                                       type: 'error',
                                                       mode: 'dismissible'
                                                   });
                                                   toastEvent.fire();
                                               }
                                               
                                           }
                                           
                                           //for citizen ids of Relinquished Accounts   
                                               else if(result.CitizenIdsOfRelinquishedAccounts.length > 0)
                                               {
                                                   for (var i = 0; i < CitizenIdsOfRelinquishedAccounts.length; i++) 
                                                   {
                                                       for (var j = 0; j < HHMembersCitizen.length; j++) 
                                                       {
                                                           var rId  = HHMembersCitizen[j].Citizen_ID__c.includes(CitizenIdsOfRelinquishedAccounts[i]);
                                                           
                                                           if( rId == true)
                                                           {
                                                               if(errorMessagesForInvalidRecords == null)
                                                               {
                                                                   errorMessagesForInvalidRecords='The record for Household Member with Citizen ID:  ' + StudentsList[j].Citizen_ID__c + ' cannot be verified.  For additional assistance, please contact support by phone at 918-453-5058 or by email at support-gadugiportal@cherokee.org.';
                                                               }
                                                               else
                                                               {
                                                                   errorMessagesForInvalidRecords+="\n"+'The record for Household Member with Citizen ID:  ' + StudentsList[j].Citizen_ID__c + ' cannot be verified.  For additional assistance, please contact support by phone at 918-453-5058 or by email at support-gadugiportal@cherokee.org.';
                                                               }
                                                           }
                                                           
                                                       } 
                                                   }
                                                   
                                                   //show errors for invalid citizen id records if any
                                                   if(errorMessagesForInvalidRecords != null)
                                                   {
                                                       //hide spinner
                                                       var spinner = component.find("saveSpinner");
                                                       $A.util.addClass(spinner, "slds-hide");
                                                       //enable button
                                                       component.set("v.isActive", false);
                                                       
                                                       var toastEvent = $A.get("e.force:showToast");
                                                       toastEvent.setParams({
                                                           title : 'Warning',
                                                           message: errorMessagesForInvalidRecords,
                                                           duration:' 60000',
                                                           key: 'info_alt',
                                                           type: 'error',
                                                           mode: 'dismissible'
                                                       });
                                                       toastEvent.fire();
                                                   }
                                                   
                                               }
                                           
                                                   else
                                                   {
                                                       debugger; 
                                                       //hide spinner
                                                       var spinner = component.find("saveSpinner");
                                                       $A.util.addClass(spinner, "slds-hide");
                                                       //enable button
                                                       component.set("v.isActive", false);
                                                       debugger; 
                                                       var emptyOut = [];
                                                       component.set("v.HHMembersCitizen", emptyOut);
                                                       var HHMembersCitizen = component.get("v.HHMembersCitizen");
                                                       debugger; 
                                                       for (var i = 0; i < AccountList.length; i++) 
                                                       {
                                                           var splitDate 	= 	 AccountList[i].Date_of_Birth__c.split('-');
                                                           var year 		= 	 splitDate[0];
                                                           var month 		=	 splitDate[1];
                                                           var day			=	 splitDate[2];
                                                           var StudentDob 	=	 month+'/'+day+'/'+year;
                                                           
                                                           debugger; 
                                                           HHMembersCitizen.push({
                                                               'sobjectType'				: 	'Sub_Applicant__c',
                                                               'Citizen_ID__c'				:   AccountList[i].Tribe_Id__c,
                                                               'Account__c'			    	:   AccountList[i].Id,
                                                               'Date_of_Birth__c'			: 	StudentDob,
                                                               'First_Name__c'				: 	AccountList[i].FirstName,
                                                               'Last_Name__c'				: 	AccountList[i].LastName,
                                                           });
                                                       }
                                                       debugger; 
                                                       for (var i = 0; i < HHMembersCitizen.length; i++) 
                                                       {
                                                           // cleaning citizen id
                                                           var removedAlphabet 			= 	HHMembersCitizen[i].Citizen_ID__c.replace(/[^\d.-]/g, '');
                                                           var removedLeadingZeros 		=	removedAlphabet.replace(/^0+/, '');
                                                           var removeSigns				=	removedLeadingZeros.replace(/^-+/, '');
                                                           var citizenId 				=	removeSigns.replace(/^0+/, '');
                                                           
                                                           
                                                       }
                                                       
                                                      /* component.set("v.mailingStreetVal", mailingStreet);
                                                       component.set("v.mailingCityVal", mailingCity);
                                                       component.set("v.mailingCountryVal", mailingCountry);
                                                       component.set("v.mailingStateVal", mailingState);
                                                       component.set("v.mailingOtherStateVal", mailingOtherState);
                                                       component.set("v.mailingZipVal", mailingZip);
                                                       component.set("v.mailingSuitVal", suite);
                                                       component.set("v.mailingAddreesL2Val", addressLine2);
                                                       debugger;*/
                                                       component.set("v.showReviewScreen", true);
                                                       debugger; 
                                                   }
                                           
                                       } else if (state === "ERROR") {
                                           
                                           //hide spinner
                                           var spinner = component.find("saveSpinner");
                                           $A.util.addClass(spinner, "slds-hide");
                                           //enable button
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
                
                // end server call for citizen ids validity
            } 
        }   
       
    },
  
    save: function(component, event, helper) {
        debugger;
        var confMess = '';
        var caseNum = '';
        var HHMembersList = [];
        var HHMembersCitizen 	= 	component.get("v.HHMembersCitizen");
        var HHMembersNonCitizen 	= 	component.get("v.HHMembersNonCitizen");
        var CVCase 					= 	component.get("v.CVCase");
        var Accnt = component.get("v.Acnt");
        var priConMobile  			=	CVCase.Ebt_Mobile_Phone__c.replace(/\D/g, '');
         CVCase.Ebt_Mobile_Phone__c  = 	priConMobile;
        
        debugger; 
       
        debugger; 
        
        debugger; 
        var addressFreeForm 		= 	component.get("v.location");
        var isManual 				= 	component.get("v.isManual");
        var isAddressChanged 		= 	false;
        var melissaResult 			=	component.get("v.predictions");
        var mailingStates 					= 	component.get("v.mailingStates");
        var physicalStates 					= 	component.get("v.physicalStates");
        var index					= 	component.get("v.selectedAddressIndex");
        var address 				= 	component.get("v.selectedAddress");
        var stateVal = ''; 
        
        var addressFreeFormPhy 		= 	component.get("v.locationPA");
        var isPAManual 				= 	component.get("v.isPAManual");
        var isPhyAddressChanged 	= 	false;
        var melissaResultPhy 		=	component.get("v.predictionsPA");
        var indexPhy				= 	component.get("v.selectedPhyAddressIndex");
        var addressPhy 				= 	component.get("v.selectedPhyAddress");
        
        debugger; 
        if(!component.get("v.showMailingState")){
            debugger;
            stateVal = component.find("MailingOtherState").get("v.value"); 
        }
        else if(component.get("v.showMailingState")){
            debugger; 
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
                               mailingStates[0][melissaResult[i].Address.State] != stateVal || 
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
                           mailingStates[0][melissaResult[i].Address.State] != stateVal ||
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
        if(component.get("v.isPAManual")){
            console.log('Begin PHY Evaluate');
            debugger; 
            for (var i = 0; i < melissaResultPhy.length; i++){
                debugger; 
                if(melissaResultPhy[i].Address.SuiteCount > 0){
                    debugger; 
                    for (var j = 0; j < melissaResultPhy[i].Address.SuiteCount; j++){
                        debugger; 
                        if((melissaResultPhy[i].Address.AddressLine1+' '+melissaResultPhy[i].Address.SuiteList[j]+', '+
                            melissaResultPhy[i].Address.City+', '+melissaResultPhy[i].Address.State) == address){
                            debugger; 
                            if(melissaResultPhy[i].Address.AddressLine1 != component.find("PhysicalStreetInput").get("v.value") || 
                               melissaResultPhy[i].Address.City != component.find("PhysicalCityInput").get("v.value") || 
                               states[0][melissaResultPhy[i].Address.State] != component.find("PhysicalStateInput").get("v.value") || 
                               melissaResultPhy[i].Address.PostalCode != component.find("PhysicalzipInput").get("v.value") || 
                               melissaResultPhy[i].Address.SuiteList[j] != component.find("Physical_Suite__c").get("v.value") || 
                               component.find("PhysicalCountryInput").get("v.value") != "United States" || 
                               component.find("PhysicalAddress2Input").get("v.value") != ""){
                                component.set("v.isPhyAddressChanged", true);
                                isPhyAddressChanged = true;
                                console.log('PHY Changed');
                            }
                        }
                    }
                } 
                if(melissaResultPhy[i].Address.SuiteCount < 1){
                    debugger; 
                    console.log(melissaResultPhy[i].Address.AddressLine1 != component.find("PhysicalStreetInput").get("v.value"));
                    debugger; 
                    console.log(melissaResultPhy[i].Address.City != component.find("PhysicalCityInput").get("v.value"));
                    debugger; 
                    console.log(physicalStates[0][melissaResultPhy[i].Address.State] != component.find("PhysicalStateInput").get("v.value"));
                    debugger; 
                    console.log(melissaResultPhy[i].Address.PostalCode != component.find("PhysicalzipInput").get("v.value"));
                    debugger; 
                    console.log(melissaResultPhy[i].Address.SuiteName);
                    debugger; 
                    console.log(component.find("PhysicalSuiteInput").get("v.value"));
                    debugger; 
                    console.log(melissaResultPhy[i].Address.SuiteName != component.find("PhysicalSuiteInput").get("v.value") );
                    debugger; 
                    console.log(component.find("PhysicalCountryInput").get("v.value") != "United States");
                    debugger; 
                    console.log(component.find("PhysicalAddress2Input").get("v.value") != "");
                    debugger; 
                    if((melissaResultPhy[i].Address.AddressLine1+(melissaResultPhy[i].Address.SuiteName != ''?' '+melissaResultPhy[i].Address.SuiteName:'')+', '+
                        melissaResultPhy[i].Address.City+', '+melissaResultPhy[i].Address.State) == address){
                       debugger; 
                        if(melissaResultPhy[i].Address.AddressLine1 != component.find("PhysicalStreetInput").get("v.value") || 
                           melissaResultPhy[i].Address.City != component.find("PhysicalCityInput").get("v.value") || 
                           physicalStates[0][melissaResultPhy[i].Address.State] != component.find("PhysicalStateInput").get("v.value") || 
                           melissaResultPhy[i].Address.PostalCode != component.find("PhysicalzipInput").get("v.value") || 
                           melissaResultPhy[i].Address.SuiteName != component.find("PhysicalSuiteInput").get("v.value") || 
                           component.find("PhysicalCountryInput").get("v.value") != "United States" || 
                           component.find("PhysicalAddress2Input").get("v.value") != ""){
                            debugger; 
                            component.set("v.isPhyAddressChanged", true);
                            debugger; 
                            isPhyAddressChanged = true;
                            debugger; 
                            console.log('PHY Changed');
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
            accnt : Accnt,
            addressFreeForm 	:	address,
            physAddressFreeForm : addressPhy, 
            isManual		 	:	isManual,
            isPAManual 			: isPAManual, 
            isAddressChanged 	:	isAddressChanged,
            isPhyAddressChanged : isPhyAddressChanged,
            citizens : HHMembersCitizen,
            noncitizens : HHMembersNonCitizen
            
            
        });
        
        action.setCallback(this,function(response) {
           var state = response.getState(); 
           if(state === 'SUCCESS') {
               debugger;
               var result = response.getReturnValue();
               component.set("v.showReviewScreen", false); 
               
              
               
               
               component.set("v.caseId", result.Id);
                       component.set("v.requestNumber", result.CaseNumber);
               		
                        
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
    
   /* viewRequest: function(component, event, helper){
        var recId = component.get("v.caseId");
        window.location.replace('/s/detail/'+recId);
    }, */
    
    handlePaste: function(component, event, helper){
        event.preventDefault(); 
    }, 
    
    handleContext: function(component, event, helper){
        event.preventDefault(); 
    },
    
    hideModal: function(component, event, helper) {
        component.set("v.showReviewScreen", false); 
        component.set("v.isActive", false);
               //enable button
               component.set("v.isActive2", false);
    },
            
    radioChange: function(component, event, helper) {
        debugger; 
        var fieldId = event.getSource().getLocalId();
        var fieldInput = component.find(fieldId);
        var val = fieldInput.get('v.value');
        
        
        debugger;
        var eventType = component.get("v.CVCase.Event__c"); 
        console.log(eventType);
        component.set("v.eventName", eventType);
    },
        //add row in HHMember table
    addHHMember: function(component, event, helper)  {
        helper.addHHMemberRecord(component, event, helper);
    },
    handlePhysicalAddressChange: function(component, event, helper) {
        debugger;
        
        if(event.getSource().get("v.value").length % 3 == 0){
            component.set('v.physicalAddressClicked',false);
            var params = {
                input : component.get("v.locationPA"),
                country : "United States"
            }
            helper.callServer(component, "c.getMelissaAddresses", function(response){
                var resp = JSON.parse(response);
                console.log(resp);
                component.set("v.showPAManualCB", true);
                if(resp.Results.length > 0){
                    component.set('v.predictionsPA',resp.Results);
                    document.getElementById("addressResultPA").style.display = "block";
                } else{
                    component.set('v.predictionsPA',[]);
                    document.getElementById("addressResultPA").style.display = "none";
                }
            }, params);
        }
    },
    
    handlePhysicalAddressClick: function(component, event, helper)  {
        var details = event.currentTarget;
        var melissaResult = component.get("v.predictionsPA");
        var states = component.get("v.physicalStates");
        var index = details.dataset.placeid;
        var address = details.dataset.place;
        
        component.set("v.physicalAddressClicked", true);
        component.set("v.selectedPhyAddressIndex", index);
        component.set("v.locationPA", address);
        component.set("v.selectedPhyAddress", address);

        for (var i = 0; i < melissaResult.length; i++){
            if(melissaResult[i].Address.SuiteCount > 0){
                for (var j = 0; j < melissaResult[i].Address.SuiteCount; j++){
                    if((melissaResult[i].Address.AddressLine1+' '+melissaResult[i].Address.SuiteList[j]+', '+
                        melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                        component.set("v.CVCase.Physical_Street__c", melissaResult[i].Address.AddressLine1);
                        component.set("v.CVCase.Physical_City__c", melissaResult[i].Address.City);
                        component.set("v.CVCase.Physical_Countries__c", "United States");
                        helper.ObjFieldByPhysicalParent(component, event, "United States");
                        
                        component.set("v.CVCase.Physical_ZipPostal_Code__c", melissaResult[i].Address.PostalCode);
                        component.set("v.CVCase.Physical_States__c", states[0][melissaResult[i].Address.State]);
                        component.set("v.CVCase.Physical_Suite__c", melissaResult[i].Address.SuiteList[j]);
                        component.set("v.CVCase.Physical_Address2__c", '');
                    }
                }
            } 
            if(melissaResult[i].Address.SuiteCount < 1){
                if((melissaResult[i].Address.AddressLine1+(melissaResult[i].Address.SuiteName != ''?' '+melissaResult[i].Address.SuiteName:'')+', '+
                    melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                    component.set("v.CVCase.Physical_Street__c", melissaResult[i].Address.AddressLine1);
                    component.set("v.CVCase.Physical_City__c", melissaResult[i].Address.City);
                    component.set("v.CVCase.Physical_Countries__c", "United States");
                    helper.ObjFieldByPhysicalParent(component, event, "United States");
                    component.set("v.CVCase.Physical_States__c", states[0][melissaResult[i].Address.State]);
                    component.set("v.CVCase.Physical_ZipPostal_Code__c", melissaResult[i].Address.PostalCode);
                    component.set("v.CVCase.Physical_Suite__c", melissaResult[i].Address.SuiteName);
                    component.set("v.CVCase.Physical_Address2__c", '');
                }
            }
        }
        document.getElementById("addressResultPA").style.display = "none";
    },
    
    handlePhysicalToggleChange: function(component, event, helper){
        debugger;
        var physicalAddressClicked = component.get("v.physicalAddressClicked");
        var  CVCaseClone = component.get("v.CVCaseClone");
        var melissaResult = component.get("v.predictionsPA");
        var states = component.get("v.physicalStates");
        var index = component.get("v.selectedPhyAddressIndex");
        var address = component.get("v.selectedPhyAddress");
                
        if(!component.get("v.isPAManual")){
            component.set("v.physicalAddressRequired", false);
            
        if(!helper.checkPhysicalAddFieldsCompleteness(component, event))
           component.set("v.FFPhysicalAddressRequired", true); 

            // remove has errors
            $A.util.removeClass(component.find('PhysicalStreetInput'), 'slds-has-error');
            $A.util.removeClass(component.find('PhysicalCityInput'), 'slds-has-error');
            $A.util.removeClass(component.find('PhysicalStateInput'), 'slds-has-error');
            $A.util.removeClass(component.find('PhysicalCountryInput'), 'slds-has-error');
            $A.util.removeClass(component.find('PhysicalzipInput'), 'slds-has-error');
            
            if(melissaResult.length > 0 && physicalAddressClicked) {
                for (var i = 0; i < melissaResult.length; i++){
                    if(melissaResult[i].Address.SuiteCount > 0){
                        for (var j = 0; j < melissaResult[i].Address.SuiteCount; j++){
                            if((melissaResult[i].Address.AddressLine1+' '+melissaResult[i].Address.SuiteList[j]+', '+
                                melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                                component.set("v.CVCase.Physical_Street__c", melissaResult[i].Address.AddressLine1);
                                component.set("v.CVCase.Physical_City__c", melissaResult[i].Address.City);
                                component.set("v.CVCase.Physical_Countries__c", "United States");
                                helper.ObjFieldByPhysicalParent(component, event, "United States");
                                component.set("v.CVCase.Physical_States__c", states[0][melissaResult[i].Address.State]);
                                component.set("v.CVCase.Physical_ZipPostal_Code__c ", melissaResult[i].Address.PostalCode);
                                component.set("v.CVCase.Physical_Suite__c", melissaResult[i].Address.SuiteList[j]);
                                component.set("v.CVCase.Physical_Address2__c", '');
                            }
                        }
                    } 
                if(melissaResult[i].Address.SuiteCount < 1){
                    if((melissaResult[i].Address.AddressLine1+(melissaResult[i].Address.SuiteName != ''?' '+melissaResult[i].Address.SuiteName:'')+', '+
                        melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                        
                        component.set("v.CVCase.Physical_Street__c", melissaResult[i].Address.AddressLine1);
                        component.set("v.CVCase.Physical_City__c", melissaResult[i].Address.City);
                        component.set("v.CVCase.Physical_Countries__c", "United States");
                        helper.ObjFieldByPhysicalParent(component, event, "United States");
                        component.set("v.CVCase.Physical_States__c", states[0][melissaResult[i].Address.State]);
                        component.set("v.CVCase.Physical_ZipPostal_Code__c ", melissaResult[i].Address.PostalCode);
                        component.set("v.CVCase.Physical_Suite__c", melissaResult[i].Address.SuiteName);
                        component.set("v.CVCase.Physical_Address2__c", '');
                    }
                }
            }  
            }
            else{
                helper.ObjFieldByPhysicalParent(component, event, CVCaseClone.Physical_Countries__c);
                component.set("v.CVCase.Physical_Street__c", CVCaseClone.Physical_Street__c);
                component.set("v.Physical_Address2__c", '');
                component.set("v.CVCase.Physical_City__c", CVCaseClone.Physical_City__c);
                component.set("v.CVCase.Physical_ZipPostal_Code__c", CVCaseClone.Physical_ZipPostal_Code__c); 
                component.set("v.CVCase.Physical_Suite__c", CVCaseClone.Physical_Suite__c); 
                component.set("v.CVCase.Physical_States__c", CVCaseClone.Physical_States__c); 
                component.set("v.CVCase.Physical_Countries__c", CVCaseClone.Physical_Countries__c); 
            }
        }
        else  {
            component.set("v.physicalAddressRequired", true);
            component.set("v.FFPhysicalAddressRequired", false);
            $A.util.removeClass(component.find('AddressFreeFormInputPhysical'), 'slds-has-error');
        }
    },
    removeHHMember: function(component, event, helper)  {
        var HHMembersList = component.get("v.HHMembersList");
        
            //Get the target object
            var selectedItem = event.currentTarget;
            //Get the selected item index
            var index = selectedItem.dataset.record;
            HHMembersList.splice(index, 1);
            component.set("v.HHMembersList", HHMembersList);
        
        
    },
    viewRequest: function(component, event, helper)
    {
        var recId = component.get("v.caseId");
        console.log(recId);
        window.location.replace('/s/emergency-assistance-detail?id='+recId);
    }, 
    editRequestModal: function(component, event, helper)
    {
        component.set("v.showSuccessMessage", false);
        component.set("v.showCAEdit", true);
    },

})