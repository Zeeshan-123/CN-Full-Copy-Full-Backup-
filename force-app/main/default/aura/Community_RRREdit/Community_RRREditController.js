({
    doInit : function(component, event, helper) {
        debugger;
        var  CVCase = component.get("v.CVCase");
        var  Acnt = component.get("v.Acnt");
        var pickListMap = component.get("v.getPickListMap");
        var parentkeys = [];
        var parentField = [];                
        
        for (var pickKey in pickListMap) {
            parentkeys.push(pickKey);
        }
        
        for (var i = 0; i < parentkeys.length; i++) {
            parentField.push(parentkeys[i]);
        }  
        
        component.set("v.getMailingParentList", parentField);
        
        component.set("v.isAddendumApplication", CVCase.Add_on__c);
        var COVID19_Impact = CVCase.COVID19_Impact_on_the_Household__c;
        var selectedValues = COVID19_Impact.split(';');
        
        //check applicant age
        var dob = new Date(Acnt.Date_of_Birth__c);
        var month_diff = Date.now() - dob.getTime();
        var age_dt = new Date(month_diff); 
        var year = age_dt.getUTCFullYear();
        var age = Math.abs(year - 1970);
        
        if(age < 18)
            component.set("v.showAddHMBtn", false);
        
        // if gender is female then enable the last name field
        if(Acnt.HealthCloudGA__Gender__pc == 'Female')  
            component.set("v.IsApplicantFemale", true);
        
        //set household member list
        if(!$A.util.isUndefined(CVCase.Household_Members__r))   {
            component.set("v.OldHHM_ProcessedList", CVCase.Household_Members__r); 
            var Hlist = component.get("v.OldHHM_ProcessedList");
            component.set("v.Old_HHMList",JSON.parse(JSON.stringify(Hlist))); 
        }

        // change date format for household member list
        var OldHHM_ProcessedList = component.get("v.OldHHM_ProcessedList");
        if(OldHHM_ProcessedList.length > 0)  {
            for (var i = 0; i < OldHHM_ProcessedList.length; i++)   {
                var HmDob = OldHHM_ProcessedList[i].Date_of_Birth__c;	
                var splitDate = HmDob.split('-');
                var year = splitDate[0];
                var month = splitDate[1];
                var day = splitDate[2];
                OldHHM_ProcessedList[i].Date_of_Birth__c = month+'/'+day+'/'+year;
            }
            component.set("v.showTableHeader", true);
        }
        
        
        // format primary contact/applicant date of birth 
        var splitDate = Acnt.Date_of_Birth__c.split('-');
        var year = splitDate[0];
        var month = splitDate[1];
        var day = splitDate[2];
        var uDob = month+'/'+day+'/'+year;
        component.set("v.Acnt.Date_of_Birth__c",uDob);
        
        // set primary information by default
        var phone = CVCase.Ebt_Mobile_Phone__c;
        if(!$A.util.isEmpty(phone) && !$A.util.isUndefined(phone)){
            var number = phone.replace(/\D/g, '').slice(-10);
            component.set("v.CVCase.Ebt_Mobile_Phone__c", '('+number.substring(0,3)+')'+number.substring(3,6)+'-'+number.substring(6,10));
        } 
        
        //set default primary household member values
        if(Acnt.HealthCloudGA__Gender__pc == 'Female') {
            component.set("v.lastNameEdit", false);
            component.set("v.IsFemale", true);
        }
        component.set("v.OLN", CVCase.Primary_Contact_Last_Name__c);
        component.set("v.selectedValue", selectedValues);
        
        helper.ObjFieldByMailingParent(component, event, CVCase.Mailing_Countries__c);
        CVCase.Mailing_States__c = CVCase.Mailing_States__c; 
        CVCase.Other_Mailing_State__c = CVCase.Other_Mailing_State__c; 
        component.set('v.CVCase',CVCase);
        component.set("v.CVCaseClone",JSON.parse(JSON.stringify(component.get('v.CVCase'))));  
        //  $A.enqueueAction(component.get('c.addRow')); 
      	
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
    addRow: function(component, event, helper)  {
         component.set("v.showTableHeader",true); 
        helper.addHouseholdRecord(component, event);
    },
    
    //remove new household member row from grid table
    removeRow: function(component, event, helper)  {
        var NewHMlist = component.get("v.HMlist");
        var OldHMlist = component.get("v.OldHHM_ProcessedList");
        
        if(!component.get("v.isAddendumApplication")){
            helper.deleteNewHHM(component, event);
        }
        else{
            if((NewHMlist.length == 1 && OldHMlist.length == 0 ) || (NewHMlist.length == 0 && OldHMlist.length == 1)){
                helper.showErrorMessage(component, event, helper, 'You must add at least one Household Member record.');
            }
            else{
                helper.deleteNewHHM(component, event);
            }
        }
    },
    
     //delete old household member row from grid table
    deleteHouseholdMember : function(component, event, helper)  {
        var NewHMlist = component.get("v.HMlist");
        var OldHMlist = component.get("v.OldHHM_ProcessedList");
        
        if(!component.get("v.isAddendumApplication")){
             helper.deleteExistingHHM(component, event);
        }
        else{
            if((NewHMlist.length == 1 && OldHMlist.length == 0 ) || (NewHMlist.length == 0 && OldHMlist.length == 1)){
                helper.showErrorMessage(component, event, helper, 'You must add at least one Household Member record.');
            }
            else{
                helper.deleteExistingHHM(component, event);
            }
        }
    },
 
    clearErrors : function(component, event)   {
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
    
    handleAddressChange: function(component, event, helper) {
        if(event.getSource().get("v.value").length % 3 == 0){
            var params = {
                input : component.get("v.location"),
                country : "United States"
            }
            helper.callServer(component, "c.getMelissaAddresses", function(response){
                var resp = JSON.parse(response);
                console.log(resp);
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
      
    reviewInformation : function(component, event, helper)  {
        debugger;
        var  CVCase = component.get("v.CVCase");
        var HMlist = component.get("v.HMlist");
        var OldHHM_ProcessedList = component.get("v.OldHHM_ProcessedList");
        var Old_HHMList = component.get("v.Old_HHMList");
        var NewHHM_ProcessedList = component.get("v.NewHHM_ProcessedList");
        var showInfo = 'False';
        var AccountList = '';
        
        var recId = component.get("v.caseId");

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
        else  {
            // check for child grid level error if grid has any record
            if( HMlist.length > 0 || OldHHM_ProcessedList.length > 0) {
                var CidMap = [];
                var Cid=component.get("v.Acnt.Tribe_Id__c");
                
                for (var i = 0; i < OldHHM_ProcessedList.length; i++) {
                    if (OldHHM_ProcessedList[i].First_Name__c.trim() == '' || OldHHM_ProcessedList[i].Last_Name__c.trim() == '')
                        HHMTblErrors+= 'Missing required fields on Citizen Household Member Under 18 row.  Please fill in all fields or remove if not being submitted: Row ' + (i + 1 ) +'.\n';                      
                }
                
                if(component.find('HMOldList')){
                    isDataValid = component.find('HMOldList').reduce(function (validSoFar, inputCmp) {
                        inputCmp.showHelpMessageIfInvalid();
                        return validSoFar && inputCmp.get('v.validity').valid;
                    }, true);
                }
                if(component.find('HMOldListSScreen')){
                    isDataValid = component.find('HMOldListSScreen').reduce(function (validSoFar, inputCmp) {
                        inputCmp.showHelpMessageIfInvalid();
                        return validSoFar && inputCmp.get('v.validity').valid;
                    }, true);
                }
                
                // check for empty fields
                for (var i = 0; i < HMlist.length; i++){
                    var citizenId  = helper.getCleanedCitizenId(component, event, HMlist[i].Citizen_Id__c);
                    if (HMlist[i].First_Name__c.trim() == '' || HMlist[i].Last_Name__c.trim() == '' || HMlist[i].Citizen_Id__c.trim() == '' || HMlist[i].Date_of_Birth__c.trim() == ''){
                        HHMTblErrors+= 'Missing required fields on Citizen Household Member Under 18 row.  Please fill in all fields or remove if not being submitted: Row ' + (i + 1 + OldHHM_ProcessedList.length) +'.\n';                      
                    }
                    else if(citizenId == '')  {
                        HHMTblErrors+= 'Invalid Citizen ID format. It should contain numbers/digits only at row ' + (i + 1) +'.\n';                      
                    }
                }
                
                if(component.find('HMNewList')){
                    isDataValid = component.find('HMNewList').reduce(function (validSoFar, inputCmp) {
                        inputCmp.showHelpMessageIfInvalid();
                        return validSoFar && inputCmp.get('v.validity').valid;
                    }, true);
                }
                if(component.find('HMNewListSScreen')){
                    isDataValid = component.find('HMNewListSScreen').reduce(function (validSoFar, inputCmp) {
                        inputCmp.showHelpMessageIfInvalid();
                        return validSoFar && inputCmp.get('v.validity').valid;
                    }, true);
                }
                
                // check for last name field validity
                if(HHMTblErrors == ''){
                    // last name field validity for older records
                    for (var i = 0; i < OldHHM_ProcessedList.length; i++)   {
                        if(!$A.util.isEmpty(OldHHM_ProcessedList[i].Last_Name__c) && OldHHM_ProcessedList[i].Gender__c == 'Female'){
                            var alphaChar = /^[a-zA-Z -]*$/;
                            var nameFormatCheck = alphaChar.test(OldHHM_ProcessedList[i].Last_Name__c).toString();
                            if(nameFormatCheck == 'false')
                                HHMTblErrors+='Last Name of HH member cannot contain special characters or numbers: Row ' + (i + 1)+'.\n';
                        }
                    }
                    
                    // last name field validity for new records
                    for (var i = 0; i < HMlist.length; i++) {
                        var alphaChar = /^[a-zA-Z -]*$/;
                        var nameFormatCheck = alphaChar.test(HMlist[i].Last_Name__c).toString();
                        if(nameFormatCheck == 'false') 
                            HHMTblErrors+='Last Name of HH member cannot contain special characters or numbers: Row ' + (i + 1 + OldHHM_ProcessedList.length)+'.\n';
                    }
                }                
                
                // check for date of birth fields validity for new records
                if(HHMTblErrors == ''){
                    for (var i = 0; i < HMlist.length; i++) {
                        //get HH Member's age
                        var age = helper.getAge(component, event, HMlist[i].Date_of_Birth__c);
                        //validation for date of birth format
                        var date_regex = /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/ ;
                        var checkDateFormate=  date_regex.test(HMlist[i].Date_of_Birth__c);  
                        
                        //does date format is correct?
                        if (!checkDateFormate) {
                            HHMTblErrors+= 'Invalid date format at row ' + (i + 1 + OldHHM_ProcessedList.length) +', correct format is MM/DD/YYYY.\n';
                        }
                        // check if household member is 18+
                        else {
                            if(age >= 18)
                                HHMTblErrors +='Household members aged 18+ must create their own COVID-19 Assistance applications.\n';   
                        }
                    }
                }
                
                // add old household member citizen ids in map
                if(OldHHM_ProcessedList.length > 0) {
                    for (var j = 0; j < OldHHM_ProcessedList.length; j++)   {
                        CidMap.push(OldHHM_ProcessedList[j].Citizen_Id__c);
                    }
                }

                // check for duplicate citizen ids validity
                if(HHMTblErrors == ''){
                    for (var i = 0; i < HMlist.length; i++) {
                        //validation for Citizen Id formate
                        var citizenId  = helper.getCleanedCitizenId(component, event, HMlist[i].Citizen_Id__c);
                        
                        // check for applicant citizen id duplicate
                        if(Cid  ==  citizenId)  {
                            HHMTblErrors += 'The Citizen ID: ' + HMlist[i].Citizen_Id__c+ ' entered at row ' + (i + 1 + OldHHM_ProcessedList.length)+ ' is the same as the applicant’s ID. Please review and try again.\n';                      
                        }
                        // check for old household members citizen ids duplicate
                        else if(CidMap.includes(citizenId)) {
                            HHMTblErrors +='Duplicate Citizen ID for Citizen Household Member Under 18 at row ' + (i + 1 + OldHHM_ProcessedList.length) +'. Please review and try again.\n';                      
                        }
                        //check for new ones
                            else if(!CidMap.includes(HMlist[i].Citizen_Id__c))  {
                                CidMap.push(HMlist[i].Citizen_Id__c);
                            }
                                else {
                                    HHMTblErrors +='Duplicate Citizen ID value in the Household Member table at row ' + (i + 1 + OldHHM_ProcessedList.length) +'. Please review and try again.\n';                                                      
                                }
                    }
                }  
                
                //show HH Member table errors if any
                if(HHMTblErrors != ''){
                    helper.showErrorMessage(component, event, helper, HHMTblErrors);
                }
            } 
             //make server call to validate cititzen ids
            if (HHMTblErrors == '') {
                component.set("v.isActive", true);
                $A.util.removeClass(component.find("saveSpinner"), "slds-hide");
                
                var emptyOut = [];
                component.set("v.NewHHM_ProcessedList", emptyOut);
                var NewHHMs_ProcessedList = component.get("v.NewHHM_ProcessedList");
                
                for (var i = 0; i < HMlist.length; i++) {
                    //validation for Citizen Id format
                    var citizenId  = helper.getCleanedCitizenId(component, event, HMlist[i].Citizen_Id__c);
                    NewHHMs_ProcessedList.push({
                        'sobjectType'				: 	'Household_Member__c',
                        'First_Name__c'				: 	HMlist[i].First_Name__c,
                        'Last_Name__c'				: 	HMlist[i].Last_Name__c,
                        'Citizen_Id__c'				:   citizenId,
                        'Date_of_Birth__c'			: 	HMlist[i].Date_of_Birth__c
                        
                    });
                }

                var action = component.get("c.validateHMList");
                action.setParams({ 
                    HMlist		:		NewHHMs_ProcessedList
                });
                
                action.setCallback(this,function(response)   {
                    var state = response.getState(); 
                    if(state === 'SUCCESS')   {
                        var result = response.getReturnValue();
                        
                        var NonVerifiedHHMList	= 	result.NonVerifiedHHMList;
                        var ExistingHHMList 	= 	result.ExistingHHMList;
                        AccountList				= 	result.legitHHMAccountsList;
                        
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
                            else  { // server call to update the case
                                debugger;
                                
                                //enable button
                                component.set("v.isActive", false);
                                //hide spinner
                                $A.util.addClass(component.find("saveSpinner"), "slds-hide");
                                
                                var emptyOut = [];
                                component.set("v.AllHHM_NewerAndExisting", emptyOut);
                                var AllHHM_NewerAndExisting = component.get("v.AllHHM_NewerAndExisting");
                                var emptyOut2 = [];
                                component.set("v.NewHHM_ProcessedList", emptyOut2);
                                NewHHM_ProcessedList = component.get("v.NewHHM_ProcessedList");
                                
                                for (var i = 0; i < AccountList.length; i++) {
                                    // check if gender is  not female then set last name from account
                                    if(AccountList[i].HealthCloudGA__Gender__pc != 'Female') {
                                        NewHHM_ProcessedList.push({
                                            'sobjectType'				: 	'Household_Member__c',
                                            'First_Name__c'				: 	AccountList[i].FirstName,
                                            'Last_Name__c'				: 	AccountList[i].LastName,
                                            'Citizen_Id__c'				:   AccountList[i].Tribe_Id__c,
                                            'Date_of_Birth__c'			: 	AccountList[i].Date_of_Birth__c
                                            
                                        });
                                    }
                                    else {
                                        for (var j = 0; j < HMlist.length; j++)  {
                                            var citizenId = helper.getCleanedCitizenId(component, event, HMlist[j].Citizen_Id__c);
                                            if( AccountList[i].Tribe_Id__c == citizenId) {   
                                                // to handle new female HM record name change
                                                var OLN		=	AccountList[i].LastName.trim().toLowerCase();
                                                var NLN		=	HMlist[j].Last_Name__c.trim().toLowerCase();
                                                var notmatch	=	OLN!=NLN;
                                                
                                                NewHHM_ProcessedList.push({
                                                    'sobjectType'			: 'Household_Member__c',
                                                    'First_Name__c'			: AccountList[i].FirstName,
                                                    'Last_Name__c'			: HMlist[j].Last_Name__c,
                                                    'Citizen_Id__c'			: AccountList[i].Tribe_Id__c,
                                                    'Date_of_Birth__c'		: AccountList[i].Date_of_Birth__c,
                                                    'LastNameChangedCheck__c'  :	notmatch
                                                });
                                            }
                                        } 
                                    }
                                }
                                
                                // add new Hm records to list
                                if(NewHHM_ProcessedList.length > 0)  {
                                    for (var kj = 0; kj < NewHHM_ProcessedList.length; kj++) {
                                        AllHHM_NewerAndExisting.push({
                                            'sobjectType'				: 	'Household_Member__c',
                                            'First_Name__c'				: 	NewHHM_ProcessedList[kj].First_Name__c,
                                            'Last_Name__c'				: 	NewHHM_ProcessedList[kj].Last_Name__c,
                                            'Citizen_Id__c'				:   NewHHM_ProcessedList[kj].Citizen_Id__c,
                                            'Date_of_Birth__c'			: 	NewHHM_ProcessedList[kj].Date_of_Birth__c,
                                            'LastNameChangedCheck__c'  	:	NewHHM_ProcessedList[kj].LastNameChangedCheck__c
                                            
                                        });
                                    }
                                }
                                
                                // add old Hm records to list
                                if(OldHHM_ProcessedList.length > 0)    {
                                    for (var i = 0; i < OldHHM_ProcessedList.length; i++){
                                        for (var j = 0; j < Old_HHMList.length; j++)  {
                                            if( OldHHM_ProcessedList[i].Citizen_Id__c == Old_HHMList[j].Citizen_Id__c){
                                                
                                                var OLN		=	Old_HHMList[i].Last_Name__c.trim().toLowerCase();
                                                var NLN		=	OldHHM_ProcessedList[i].Last_Name__c.trim().toLowerCase();
                                                var notmatch	=	OLN	!=	NLN;
                                                AllHHM_NewerAndExisting.push({
                                                    'sobjectType'					: 	'Household_Member__c',
                                                    'First_Name__c'				: 	OldHHM_ProcessedList[i].First_Name__c,
                                                    'Last_Name__c'				: 	OldHHM_ProcessedList[i].Last_Name__c,
                                                    'Citizen_Id__c'				:   OldHHM_ProcessedList[i].Citizen_Id__c,
                                                    'Date_of_Birth__c'			: 	OldHHM_ProcessedList[i].Date_of_Birth__c,
                                                    'LastNameChangedCheck__c'  	:	notmatch
                                                });
                                            }
                                        }
                                    }
                                }
                                
                                if(AllHHM_NewerAndExisting.length > 0) {
                                    if(AllHHM_NewerAndExisting.length  != Old_HHMList.length) {
                                        showInfo = 'True';
                                        if(!component.get("v.isAddendumApplication"))
                                            helper.addPrimaryHouseholdMember(component, event);
                                    }
                                    else {
                                        for (var i = 0; i < AllHHM_NewerAndExisting.length; i++){
                                            if( AllHHM_NewerAndExisting[i].Citizen_Id__c != Old_HHMList[i].Citizen_Id__c || AllHHM_NewerAndExisting[i].Last_Name__c != Old_HHMList[i].Last_Name__c) {
                                                showInfo = 'True';
                                            }
                                        }
                                        if(!component.get("v.isAddendumApplication")){
                                            helper.addPrimaryHouseholdMember(component, event);
                                        }
                                    }
                                }
                                
                                if (showInfo == 'True') 
                                    component.set("v.showIntermediaryScreen", true);
                                else
                                    helper.handleSubmit(component, event);
                            }
                        
                    }
                    
                    if(state === 'ERROR')	{
                        //enable button
                        component.set("v.isActive", false);
                        //hide spinner
                        $A.util.addClass(component.find("saveSpinner"), "slds-hide");
                        
                        let errors = response.getError();
                        helper.showErrorMessage(component, event, helper, errors[0].message);
                    }
                });       
                $A.enqueueAction(action);
            } 
            
        }
        
    },
    
 
    save: function(component, event, helper) {
        helper.handleSubmit(component, event);
        
    },
    
    //show rrr request created by user(navigate to case detail page)
    viewRequest: function(component, event, helper) {
        var recId = component.get("v.caseId");
        window.location.replace('/s/detail/'+recId);
    },  
    
    editRequestModal: function(component, event, helper)  {
        window.location.replace('/s/covid19-assistance');
    }, 
    
    handlePaste: function(component, event, helper){
        event.preventDefault(); 
    }, 
    
    handleContext: function(component, event, helper){
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
    
    AddressCityValidationCheck : function(component, event, helper){
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