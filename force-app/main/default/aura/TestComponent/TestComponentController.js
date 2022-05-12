({
    doInit : function(component, event, helper){
        var  CVCase = component.get("v.CVCase");
        //check does RRR request exist for this user
        var actionCheck = component.get("c.validateApplicantEligibility");
        
        actionCheck.setCallback(this,function(response) {
            debugger;
            var state = response.getState();
            if (state === "SUCCESS") {
                 var resultData = response.getReturnValue();

                 if (resultData.acnt.If_CN_Citizen__c == 'No'){
                     // show message
                     component.set("v.showMessageDiv", true);
                     component.set("v.showRelinquishmentStatus", true);
                 }
                 // request exist 
                 //else if (resultData.RRRApplication !== undefined && resultData.IsAddOneAllowed  (resultData.RRRApplication.RRR_Request_Edit_Status__c || resultData.RRRApplication.Status == 'ADDRESS CORRECTION REQUIRED' || resultData.RRRApplication.Status == 'NAME CORRECTION REQUIRED')) {
                    else if (resultData.RRRApplication !== undefined && !resultData.IsAddOneAllowed) {  
                 debugger;
                        component.set('v.CVCase',resultData.RRRApplication);
                        component.set("v.getPickListMap",resultData.mapOfDependentPL);
                        component.set("v.Acnt", resultData.acnt);
                        component.set('v.states',resultData.mapOfStates);
                        component.set("v.caseId", resultData.RRRApplication.Id);
                        component.set("v.requestNumber", resultData.RRRApplication.CaseNumber);
                     
                     // if application is editable for all aspects
                     if( resultData.RRRApplication.RRR_Request_Edit_Status__c == true && resultData.RRRApplication.Status == 'New')
                         component.set("v.showEditBtn", true);
                     
                     // if application is editable only for address or name updates
                     if (resultData.RRRApplication.Status == 'ADDRESS CORRECTION REQUIRED' || resultData.RRRApplication.Status == 'NAME CORRECTION REQUIRED') {
                         component.set("v.showEditCorrectionBtn", true); 
                         
                         //if application is editable for address correction
                         if (resultData.RRRApplication.Status == 'ADDRESS CORRECTION REQUIRED' )
                             component.set("v.IsAddressCorrectionReq", true);
                         
                         //if application is editable for last name correction
                         if (resultData.RRRApplication.Status == 'NAME CORRECTION REQUIRED' )
                             component.set("v.IsLNameCorrectionReq", true);
                     }
                     // show success message
                     component.set("v.showMessageDiv", true);
                     component.set("v.showRequestCreated", true);
                 }//end
                 
                 //applicant exist on another application
                 else if(resultData.throwWaring){
                     component.set("v.showMessageDiv", true);
                     component.set("v.showWarning", true);
                 }
                 
                 //show RRR form
                 else if((resultData.mapOfDependentPL && resultData.mapOfStates) || resultData.IsAddOneAllowed ) {
                     component.set("v.showRequestForm", true);
                     component.set("v.showEditBtn", true);
                     
                     //applicant is under 18, hide Add HM button
                     if(resultData.IsApplicationMinor)
                         component.set("v.showAddHMBtn", false);
                     
                     if(resultData.IsAddOneAllowed)
                         component.set("v.isAddendumApplication", true);
                     
                      // set up dependent picklist
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
                     
                     // set phone number
                     if (!$A.util.isUndefined(resultData.acnt.PersonMobilePhone)) {       
                         phone = resultData.acnt.PersonMobilePhone;
                         var number = phone.replace(/\D/g, '').slice(-10);                         
                         CVCase.Ebt_Mobile_Phone__c = '('+number.substring(0,3)+') '+number.substring(3,6)+'-'+number.substring(6,10);
                     }
                     else {
                         CVCase.Ebt_Mobile_Phone__c = '';
                     }
                     
                     CVCase.Primary_Contact_First_Name__c = resultData.acnt.FirstName;
                     CVCase.Primary_Contact_Last_Name__c  = resultData.acnt.LastName;
                     component.set("v.OLN",resultData.acnt.LastName);
                     // if gender is female then enable the last name field
                     if(resultData.acnt.HealthCloudGA__Gender__pc == 'Female')  
                         component.set("v.IsApplicantFemale", true);
                                          
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
                     
                      //====================================SET MAILING ADDRESS INFORMATION==========================//
                     //if Mailing address is a bad address then make it null and set US as default country
                     if(replacedValues.PersonMailingStreet.toUpperCase().includes("BAD ADDRESS")  || replacedValues.PersonMailingCity.includes("99") || replacedValues.PersonMailingPostalCode.includes("00000") 
                        || $A.util.isUndefined(resultData.acnt.PersonMailingCountry)){
                         if(replacedValues.PersonOtherStreet.toUpperCase().includes("BAD ADDRESS")  || replacedValues.PersonOtherCity.includes("99") || replacedValues.PersonOtherPostalCode.includes("00000") || $A.util.isUndefined(resultData.acnt.PersonOtherCountry) ){
                             CVCase.Mailing_Street__c = '';
                             CVCase.Mailing_City__c = '';
                             CVCase.Mailing_ZipPostal_Code__c = '';
                             CVCase.mailing_suite__c = '';
                             CVCase.Mailing_Countries__c = 'United States';
                             helper.ObjFieldByMailingParent(component, event, CVCase.Mailing_Countries__c);
                             CVCase.Mailing_States__c = '';
                         }
                         else{
                             CVCase.Mailing_Street__c = resultData.acnt.PersonOtherStreet;
                             CVCase.Mailing_City__c = resultData.acnt.PersonOtherCity;
                             CVCase.Mailing_ZipPostal_Code__c = resultData.acnt.PersonOtherPostalCode;
                             CVCase.mailing_suite__c = resultData.acnt.Physical_Suite__c;
                             CVCase.Mailing_Countries__c = resultData.acnt.PersonOtherCountry;
                             helper.ObjFieldByMailingParent(component, event, CVCase.Mailing_Countries__c);
                             CVCase.Mailing_States__c = resultData.acnt.PersonOtherState; 
                         }
                     }
                     else{
                         CVCase.Mailing_Street__c = resultData.acnt.PersonMailingStreet;
                         CVCase.Mailing_City__c = resultData.acnt.PersonMailingCity;
                         CVCase.Mailing_ZipPostal_Code__c = resultData.acnt.PersonMailingPostalCode;
                         CVCase.mailing_suite__c = resultData.acnt.Mailing_Suite__c;
                         CVCase.Mailing_Countries__c = resultData.acnt.PersonMailingCountry;
                         helper.ObjFieldByMailingParent(component, event, CVCase.Mailing_Countries__c);
                         CVCase.Mailing_States__c = resultData.acnt.PersonMailingState; 
                     }
                                                          
                     component.set('v.CVCase',CVCase);
                     component.set("v.CVCaseClone",JSON.parse(JSON.stringify(CVCase)));  
                     component.set('v.states',resultData.mapOfStates);
                     if(component.get("v.isAddendumApplication"))
                        $A.enqueueAction(component.get('c.addRow')); 
                     
                     var controlselectAuraIds1 = [ "MailingStreetInput", "MailingCityInput", "MailingzipInput", "MailingStateInput", "MailingSuiteInput", "MailingAddress2Input", "priConCellPhone"];
                     for(var i = 0; i < controlselectAuraIds1.length; i++) {
                         var fieldId1 = controlselectAuraIds1[i];
                         var cmpFindFieldId1 = component.find(fieldId1);
                         var fieldValue1 = cmpFindFieldId1.get("v.value");
                         if(!fieldValue1) {
                             component.find(fieldId1).set("v.value", '');
                         }
                     }     
                 }
             } 
            if (state === "ERROR"){
                var errors = response.getError();
                helper.showErrorMessage(component, event, helper, errors[0].message);
            }
        });   
        
        $A.enqueueAction(actionCheck);	
                                
       },
    
    // date validator
    validateAndReplace: function (component, event)  {
        const input = event.getSource();
        const inputValue = input.get('v.value');
        const validValue = inputValue.replace(/^(\d\d)(\d)$/g,'$1/$2')
        .replace(/^(\d\d\/\d\d)(\d+)$/g,'$1/$2')
        .replace(/[^\d\/]/g,'');
        input.set('v.value', validValue);
    },
    
    //add row in grid table
    addRow: function(component, event, helper) {
        component.set("v.showTableHeader",true); 
        helper.addHouseholdRecord(component, event);
    },
    
    //add row from grid table
    removeRow: function(component, event, helper) {
        //Get the HMlist
        var HMlist = component.get("v.HMlist");
        //Get the target object
        var selectedItem = event.currentTarget;
        //Get the selected item index
        var index = selectedItem.dataset.record;
        
        if(!component.get("v.isAddendumApplication")){
            HMlist.splice(index, 1);
            component.set("v.HMlist", HMlist);
            
            // if household member list is zero then hide table headers
            var tableCheck =  component.get("v.HMlist");
            if (tableCheck.length == 0)
                component.set("v.showTableHeader", false);
        }
        else{
            if(HMlist.length == 1){
                helper.showErrorMessage(component, event, helper, 'You must add at least one Household Member record.');
            }
            else{
                HMlist.splice(index, 1);
                component.set("v.HMlist", HMlist);
            }
        }
        
    },
    
    
    onBlur: function(component, event, helper) {
        var elem = document.getElementById(event.currentTarget.id);
        if(elem.value != '')
            $A.util.removeClass(elem, 'slds-has-error');
    },
    
    clearErrors : function(component, event)  {
        var fieldId = event.getSource().getLocalId();
        $A.util.removeClass(fieldId, 'slds-has-error');
    },
    
    clearErrorPicklist : function(component, event)  {
        var fieldId = event.getSource().getLocalId();
        
        if (fieldId == 'MailingStateInput')
       		$A.util.removeClass(component.find('MailingStateInput'), 'slds-has-error');
        
        if (fieldId == 'MailingCountryInput')
       		$A.util.removeClass(component.find('MailingCountryInput'), 'slds-has-error');
        
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
     
    onMailingCountryChange : function(component, event, helper){
        var CVCase = component.get('v.CVCase');
        helper.ObjFieldByMailingParent(component, event, CVCase.Mailing_Countries__c);
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
            $A.util.removeClass(ffAddress, 'slds-has-error');
        }
    },
  
    reviewInformation: function(component, event, helper){
        debugger;
        var CVCase = component.get("v.CVCase");
        var HMlist = component.get("v.HMlist");
        var AccountList = '';
        var ProcessedHHMList = '';
        var HMlistToSend = '';
        
        var isLookupValSelected = true;
        var isAllValid = true;
        var isAddressDataValid = true;
        var isMobileFieldsDataValid = true;
        var isDataValid = true;
        
        var phoneFieldError = '';
        var HHMTblErrors = '';
        var NonVerifiedHHMErrors = '';  
        
        var controlselectAuraIds = ["priConCellPhone"];
        
        if(!component.get("v.isAddendumApplication"))
             controlselectAuraIds.push("HLastName");
        
        if(component.get("v.isManual")){
            if(component.get("v.CVCase.Mailing_Countries__c ") == "United States" || component.get("v.CVCase.Mailing_Countries__c ") == "Canada")
                controlselectAuraIds.push("MailingStreetInput","MailingCityInput","MailingCountryInput","MailingStateInput" ,"MailingzipInput");
            else
                controlselectAuraIds.push("MailingStreetInput","MailingCityInput","MailingCountryInput","MailingOtherState","MailingzipInput");
        }
        else{
            controlselectAuraIds.push("AddressFreeFormInput");
        }
        
        for(var i = 0; i < controlselectAuraIds.length; i++) {
            var fieldId = controlselectAuraIds[i];
            var cmpFindFieldId = component.find(fieldId);
            var fieldValue = cmpFindFieldId.get("v.value");
            if(fieldId == "AddressFreeFormInput" && !helper.checkMailingAddFieldsCompleteness(component, event)){
                if(fieldValue  === undefined  || fieldValue.trim() == "") { 
                    component.set("v.FFAddressRequired", true); 
                    $A.util.addClass(cmpFindFieldId, 'slds-has-error');
                    isAllValid = false;
                }
                //if mailing address is not selected via lookup field
                else{
                    isLookupValSelected = false;
                }
            }
            else {
                if( fieldValue == undefined || fieldValue.trim() == '' &&(fieldId != "AddressFreeFormInput")) {
                    $A.util.addClass(cmpFindFieldId, 'slds-has-error');
                    isAllValid = false;
                }                        
            }
        }
        if(component.find("program").get("v.value") == ''){
            $A.util.addClass(component.find("program"), 'slds-has-error');
            isAllValid = false;
        }
        //validate mailing  address integrity 
        if (isAllValid && isLookupValSelected) {
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
        
        // validate phone field
        if (isAllValid && isLookupValSelected && isAddressDataValid) {
            var priConPhone  = CVCase.Ebt_Mobile_Phone__c.replace(/\D/g, '');
            var firstCharValforPriCon = priConPhone.charAt(0);
            if(priConPhone.length != 10) {
                isMobileFieldsDataValid = false;
                phoneFieldError+='Mobile number must contain 10 digits only.\n';
            }
            if(firstCharValforPriCon == '1'  || firstCharValforPriCon == '0') {
                isMobileFieldsDataValid = false;
                phoneFieldError +='Mobile number should not begin with 1 or 0.\n';
            }
        }
                
         if (!isAllValid) 
            helper.showErrorMessage(component, event, helper, 'You must fill in all of the required fields.');
        
        else if (!isLookupValSelected) 
            helper.showErrorMessage(component, event, helper, 'Please make sure the Mailing Address provided is complete via the address lookup box.');
        
        else if(!isAddressDataValid)
             helper.showErrorMessage(component, event, helper, 'There are invalid characters in the Mailing Address fields. Please provide a valid Mailing Address.');
        
        else if (!isMobileFieldsDataValid) 
             helper.showErrorMessage(component, event, helper, phoneFieldError);
		
        else if(!component.get("v.iAccept")) {
                helper.showErrorMessage(component, event, helper, 'Must check the My mailing address is correct checkbox.');
                $A.util.addClass(component.find("mailingAddCorrectCB"), 'slds-has-error');
            }
        
        else {
            if( HMlist.length > 0) {
                let CidMap = new Map();
                var Cid=component.get("v.Acnt.Tribe_Id__c");
                
                // check for empty fields
                for (var i = 0; i < HMlist.length; i++){
                    var citizenId  = helper.getCleanedCitizenId(component, event, HMlist[i].Citizen_Id__c);
                    if (HMlist[i].First_Name__c.trim() == '' || HMlist[i].Last_Name__c.trim() == '' || HMlist[i].Citizen_Id__c.trim() == '' || HMlist[i].Date_of_Birth__c == '') {
                        HHMTblErrors += 'Missing required fields on Citizen Household Member Under 18 row.  Please fill in all fields or remove if not being submitted: Row ' + (i + 1) +'.\n'; 
                    }
                    else if(citizenId == ''){
                        HHMTblErrors +='Invalid Citizen ID format. It should contain numbers/digits only at row ' + (i + 1) +'.\n';                      
                    }
                }
                if(component.find('HMsList')){
                    isDataValid = component.find('HMsList').reduce(function (validSoFar, inputCmp) {
                        inputCmp.showHelpMessageIfInvalid();
                        return validSoFar && inputCmp.get('v.validity').valid;
                    }, true);
                }
                if(component.find('HMListSScreen')){
                    isDataValid = component.find('HMListSScreen').reduce(function (validSoFar, inputCmp) {
                        inputCmp.showHelpMessageIfInvalid();
                        return validSoFar && inputCmp.get('v.validity').valid;
                    }, true);
                }
                // check for last name field validity
                if(HHMTblErrors == ''){
                    for (var i = 0; i < HMlist.length; i++) {
                        var alphaChar = /^[a-zA-Z -]*$/;
                        var nameFormatCheck = alphaChar.test(HMlist[i].Last_Name__c).toString();
                        if(nameFormatCheck == 'false')
                            HHMTblErrors +='Last Name of HH member cannot contain special characters or numbers: Row ' + (i + 1)+'.\n';
                    }
                }
                
                // check for date of bith fields validity
               if(HHMTblErrors == ''){
                   for (var i = 0; i < HMlist.length; i++){
                       //get HH Member's age
                       var age = helper.getAge(component, event, HMlist[i].Date_of_Birth__c);
                       //validation for date of birth format
                       var date_regex = /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/ ;
                       var checkDateFormate=  date_regex.test(HMlist[i].Date_of_Birth__c);  
                       
                       //does date format is correct?
                       if (!checkDateFormate){
                           HHMTblErrors +='Invalid date format at row ' + (i + 1)+', correct format is MM/DD/YYYY.\n'; 
                       }
                       // check if household member is 18+
                       else {
                           if(age >= 18)
                               HHMTblErrors +='Household members aged 18+ must create their own COVID-19 Assistance applications.\n';   
                       }
                   }
                }
                
                // check for duplicate citizen ids validity
                if(HHMTblErrors == ''){
                    for (var i = 0; i < HMlist.length; i++) {
                        var citizenId  = helper.getCleanedCitizenId(component, event, HMlist[i].Citizen_Id__c);
                        if(Cid  ==  citizenId) {
                            HHMTblErrors+='The Citizen ID: ' + HMlist[i].Citizen_Id__c+ ' entered at row ' + (i + 1 )+ ' is the same as the applicant’s ID. Please review and try again.\n';
                            CidMap.set(HMlist[i].Citizen_Id__c, i);
                        }
                        
                        else if(CidMap.get(HMlist[i].Citizen_Id__c) == undefined) {
                            CidMap.set(HMlist[i].Citizen_Id__c, i);
                        }
                        
                       else{
                           HHMTblErrors+='Duplicate Citizen ID for Citizen Household Member Under 18 at row ' + (i + 1)+'. Please review and try again.\n';                      
                        }
                    }
                }  
                
                //show HH Member table errors if any
                if(HHMTblErrors != ''){
                    helper.showErrorMessage(component, event, helper, HHMTblErrors);
                }
            }
           
            if (HHMTblErrors == '') {
                debugger;
                //make server call to validate cititzen ids
            if( HMlist.length > 0) {
                //disable save button
                component.set("v.isActive", true);
                //show spinner
                $A.util.removeClass(component.find("saveSpinner"), "slds-hide");          
                
                var emptyOut = [];
                component.set("v.ProcessedHHMList", emptyOut);
                ProcessedHHMList = component.get("v.ProcessedHHMList");
                
                for (var i = 0; i < HMlist.length; i++){
                    if(!$A.util.isEmpty(HMlist[i].Citizen_Id__c)){
                        var citizenId = helper.getCleanedCitizenId(component, event, HMlist[i].Citizen_Id__c);
                        ProcessedHHMList.push({
                            'sobjectType'				: 	'Household_Member__c',
                            'First_Name__c'				: 	HMlist[i].First_Name__c,
                            'Last_Name__c'				: 	HMlist[i].Last_Name__c,
                            'Citizen_Id__c'				:   citizenId,
                            'Date_of_Birth__c'			: 	HMlist[i].Date_of_Birth__c
                        });
                    }
                }

            var action = component.get("c.validateHMList");
            action.setParams({ 
                HMlist		:		ProcessedHHMList
            });
            action.setCallback(this,function(response) {
               var state = response.getState(); 
               if(state === 'SUCCESS') {
                 var result = response.getReturnValue();
                 var NonVerifiedHHMList	= 	result.NonVerifiedHHMList;
                 var ExistingHHMList 	= 	result.ExistingHHMList;
                 AccountList			= 	result.legitHHMAccountsList;
                   
                   //for invalide citizen ids
                   if(result.NonVerifiedHHMList != undefined && result.NonVerifiedHHMList.length > 0){
                       for (var i = 0; i < NonVerifiedHHMList.length; i++) {
                           for (var j = 0; j < HMlist.length; j++){
                               var citizenId  = helper.getCleanedCitizenId(component, event, HMlist[j].Citizen_Id__c);
                               var cId  = citizenId.includes(NonVerifiedHHMList[i]);
                               if( cId == true)
                                   NonVerifiedHHMErrors+='The record for household member with Citizen ID: ' + HMlist[j].Citizen_Id__c + ' cannot be verified.  For additional assistance, please contact support by phone at 918-453-5058 or by email at support-gadugiportal@cherokee.org.\n';
                           }
                           
                       }
                       //show errors if any
                       if(NonVerifiedHHMErrors != ''){
                           $A.util.addClass(component.find("saveSpinner"), "slds-hide");
                           component.set("v.isActive", false);
                           helper.showErrorMessage(component, event, helper, NonVerifiedHHMErrors);
                           
                       }
                   }   
                   
                   //for citizen ids that already exists on a existing case record
                   else if(result.ExistingHHMList != undefined &&result.ExistingHHMList.length > 0) {
                       for (var i = 0; i < ExistingHHMList.length; i++){
                           for (var j = 0; j < HMlist.length; j++){
                               var citizenId  = helper.getCleanedCitizenId(component, event, HMlist[j].Citizen_Id__c);
                               var rId  = citizenId.includes(ExistingHHMList[i]);
                               if( rId == true)
                                   NonVerifiedHHMErrors+='The record for household member with Citizen ID: ' + HMlist[j].Citizen_Id__c + ' already exists on another application. For further assistance, please contact support by phone at 918-453-5058 or by email at support-gadugiportal@cherokee.org.\n';
                           } 
                       }
                       //show errors if any
                       if(NonVerifiedHHMErrors != ''){
                           $A.util.addClass(component.find("saveSpinner"), "slds-hide");
                           component.set("v.isActive", false);
                           helper.showErrorMessage(component, event, helper, NonVerifiedHHMErrors);
                           
                       }
                   }             
                       else    {
                           //hide spinner
                           $A.util.addClass(component.find("saveSpinner"), "slds-hide");
                           //enable button
                           component.set("v.isActive", false);
                           
                           var emptyOut = [];
                           component.set("v.ProcessedHHMList", emptyOut);
                           var ProcessedHHMList = component.get("v.ProcessedHHMList");
                           //add other HH Members
                           for (var i = 0; i < AccountList.length; i++){
                               var splitDate 	= 	 AccountList[i].Date_of_Birth__c.split('-');
                               // if HM is not female
                               if(AccountList[i].HealthCloudGA__Gender__pc != 'Female'){
                                   ProcessedHHMList.push({
                                       'sobjectType'				: 	'Household_Member__c',
                                       'First_Name__c'				: 	AccountList[i].FirstName,
                                       'Last_Name__c'				: 	AccountList[i].LastName,
                                       'Citizen_Id__c'				:   AccountList[i].Tribe_Id__c,
                                       'Date_of_Birth__c'			: 	splitDate[1]+'/'+splitDate[2]+'/'+splitDate[0]
                                   });
                               }
                               else{
                                   for (var j = 0; j < HMlist.length; j++){
                                       var citizenId = helper.getCleanedCitizenId(component, event, HMlist[j].Citizen_Id__c);
                                       if( AccountList[i].Tribe_Id__c == citizenId){ 
                                           var OLN		=	AccountList[i].LastName.trim().toLowerCase();
                                           var NLN		=	HMlist[j].Last_Name__c.trim().toLowerCase();
                                           var notmatch	=	OLN!=NLN;
                                           
                                           ProcessedHHMList.push({
                                               'sobjectType'				: 	'Household_Member__c',
                                               'First_Name__c'				: 	AccountList[i].FirstName,
                                               'Last_Name__c'				: 	HMlist[j].Last_Name__c,
                                               'Citizen_Id__c'				:   AccountList[i].Tribe_Id__c,
                                               'Date_of_Birth__c'			: 	splitDate[1]+'/'+splitDate[2]+'/'+splitDate[0],
                                               'LastNameChangedCheck__c'  	:	notmatch
                                           });
                                       }
                                   } 
                               }
                           }
                           
                           component.set("v.ProcessedHHMList", ProcessedHHMList);
                           component.set("v.ProcessedHHMList2",JSON.parse(JSON.stringify(ProcessedHHMList))); 
                           if(!component.get("v.isAddendumApplication")){
                               helper.addPrimaryHouseholdMember(component, event);
                           }
                           component.set("v.showIntermediaryScreen", true);
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
                // end server call for citizen ids validity
            } 
                //when no household member is added in grid        
                else  {
                    debugger;
                    var emptyOut = [];
                    component.set("v.ProcessedHHMList", emptyOut);
                    if(!component.get("v.isAddendumApplication")){
                        helper.addPrimaryHouseholdMember(component, event);
                    }
                    component.set("v.showIntermediaryScreen", true);
                }
            }
        }
      
    },
    
    save: function(component, event, helper)  {
        debugger;
        var ProcessedHHMList2 = component.get("v.ProcessedHHMList2");
        var CVCase 					= 	component.get("v.CVCase");
        var priConMobile  			=	CVCase.Ebt_Mobile_Phone__c.replace(/\D/g, '');
        CVCase.Ebt_Mobile_Phone__c  = 	priConMobile;
   
        var suite = component.find("MailingSuiteInput").get("v.value");
        var addressLine2 = component.find("MailingAddress2Input").get("v.value");
        var addressFreeForm = component.get("v.location");
        var isAddressChanged = false;
        
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
                                component.set("v.isAddressChanged", true);
                                isAddressChanged = true;
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
                            component.set("v.isAddressChanged", true);
                            isAddressChanged = true;
                        }
                    }
                }
            }
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
        
        var action = component.get("c.saveRequest");
        action.setParams({ 
            HMslist				:	ProcessedHHMList2,
            RRR_Request			:   CVCase
        });
                                               
        action.setCallback(this,function(response)  {
             var state2 = response.getState(); 
             if(state2 === 'SUCCESS') {
                 helper.showSuccessMessage(component, event, helper, 'Application Created Successfully.');
                 window.location.replace('/s/covid19-assistance');
                 /*
                  component.set("v.isActive2", false);
                 $A.util.addClass(component.find("Spinner2"), "slds-hide");
                 var result = response.getReturnValue();
                 component.set("v.showIntermediaryScreen", false); 
                 component.set("v.caseId", result.Id);
                 component.set("v.requestNumber", result.CaseNumber);
                 component.set("v.showRequestForm", false);
                 component.set("v.showMessageDiv", true);
                 component.set("v.showRequestCreated", true);
                 */
             }
             if (state2 === "ERROR"){
                 var errors = response.getError();
                 helper.showErrorMessage(component, event, helper, errors[0].message);
             }
         });       
        
        $A.enqueueAction(action);

    },    
    
    //show rrr request created by user(navigate to case detail page)
    viewRequest: function(component, event, helper) {
        var recId = component.get("v.caseId");
        window.location.replace('/s/detail/'+recId);
    },  
    
    editRequestModal: function(component, event, helper) {
       component.set("v.showMessageDiv", false);
       component.set("v.RRREditForm", true);
    },  
    
     editAddressUpdateModal: function(component, event, helper) {
       component.set("v.showMessageDiv", false);
       component.set("v.RRRAddressUpdateForm", true);
    },  
    
    handlePaste: function(component, event, helper)  {
    	event.preventDefault(); 
	}, 
    
    handleContext: function(component, event, helper) {
   		 event.preventDefault(); 
	},
    
    hideModal: function(component, event, helper)  {
      component.set("v.showIntermediaryScreen", false); 
   },
    
    AlphanumericWithSpecCharCheck : function(component, event, helper) {
        debugger
        var code = (event.which) ? event.which : event.keyCode;
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123) && // lower alpha (a-z)
            !(code > 43 && code < 48) && // ,-./
            !(code == 32) && !(code == 35) && !(code == 36) && !(code == 39) && !(code == 58)) {  // #$':
            event.preventDefault();
        }
    },
    
    AddressCityValidationCheck : function(component, event, helper) {
        debugger
        var code = (event.which) ? event.which : event.keyCode;
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123) && // lower alpha (a-z)
            !(code > 44 && code < 47) && // -.
            !(code == 39) && !(code == 32)) {  // 'space
            event.preventDefault();
        }
    },
    
    characterCheck: function(component, event, helper)
    {
        var inputValue = event.which;
        if(!(inputValue >= 65 && inputValue <= 90 || inputValue == 45 || (inputValue >= 97 && inputValue <= 122)) && (inputValue != 32 && inputValue != 0))
        {
            event.preventDefault(); 
        }
    },
})