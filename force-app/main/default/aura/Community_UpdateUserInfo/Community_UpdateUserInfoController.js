({
    doInit : function(component, event, helper) {
		debugger;
        var Email = component.get("v.OrigEmail");
        component.set("v.Email",Email);
        var Accnt = component.get("v.Accnt");
        var orginalMailingAddress;
        var orginalPhysicalAddress;
        var orgAccnt;
        
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
        component.set("v.getPhysicalParentList", parentField);
        
        var controlselectAuraIds1 = [ "MailingStreetInput", "MailingCityInput", "MailingzipInput", "MailingStateInput", "MailingOtherState", "MailingSuiteInput", "MailingAddress2Input", "lName", "mobile", "hPhone", "PhysicalStreetInput","PhysicalCityInput","PhysicalStateInput", "PhysicalOtherState", "PhysicalCountryInput" ,"PhysicalZipInput", "PhysicalSuiteInput", "PhysicalAddress2Input"];
        for(var i = 0; i < controlselectAuraIds1.length; i++) {
            var fieldId1 = controlselectAuraIds1[i];
            var cmpFindFieldId1 = component.find(fieldId1);
            var fieldValue1 = cmpFindFieldId1.get("v.value");
            if($A.util.isUndefinedOrNull(fieldValue1)) {
                component.find(fieldId1).set("v.value", '');
            }
        }
        
        //if Mailing address is a bad address then make it null
        if(Accnt.PersonMailingStreet.toUpperCase().includes("BAD ADDRESS")  || Accnt.PersonMailingCity.includes("99") || Accnt.PersonMailingPostalCode.includes("00000")){
            component.set("v.Accnt.PersonMailingStreet", '');
            component.set("v.Accnt.PersonMailingCity", '');
            component.set("v.Accnt.PersonMailingState", '');
            component.set("v.Accnt.PersonMailingCountry", 'United States');
            component.set("v.Accnt.PersonMailingPostalCode", '');
            component.set("v.Accnt.Mailing_Suite__c", '');
            component.set("v.Accnt.Mailing_Address_Line_2__c", '');
            component.set("v.Accnt.Other_Mailing_State__c", '');
        }
        else{
            //if no country value found then set US as default
            if($A.util.isUndefinedOrNull(Accnt.PersonMailingCountry) || Accnt.PersonMailingCountry == ''){  
                component.find("MailingCountryInput").set("v.value", 'United States');
            }
          /*  else{
                //if non US/Canada resident
                if(Accnt.PersonMailingCountry != "United States" && Accnt.PersonMailingCountry != "Canada")
                    component.set("v.isUsORCadMailingAddress", false);                   
            }*/
        }
        
        //if Physical address is a bad address then make it null
        if(Accnt.PersonOtherStreet.toUpperCase().includes("BAD ADDRESS")  || Accnt.PersonOtherStreet.includes("99") || Accnt.PersonMailingPostalCode.includes("00000")){
            component.set("v.Accnt.PersonOtherStreet", '');
            component.set("v.Accnt.PersonOtherCity", '');
            component.set("v.Accnt.PersonOtherState", '');
            component.set("v.Accnt.Other_Physical_State__c", '');
            component.set("v.Accnt.PersonOtherCountry", 'United States');
            component.set("v.Accnt.PersonOtherPostalCode", '');
            component.set("v.Accnt.Physical_Suite__c", '');
            component.set("v.Accnt.Physical_Address_Line_2__c", '');
        }
       /* else{
            if((Accnt.PersonOtherCountry != "United States" && Accnt.PersonOtherCountry != "Canada") || Accnt.PersonOtherCountry == '')
                component.set("v.isUsORCadPhysicalAddress", false);                   
        }
       */
        
        // if not a female user 
        if(Accnt.HealthCloudGA__Gender__pc == 'Female')
            component.set("v.isFemaleUser", true);
        
        
        helper.ObjFieldByMailingParent(component, event, component.find("MailingCountryInput").get("v.value"));
        helper.ObjFieldByPhysicalParent(component, event, component.find("PhysicalCountryInput").get("v.value"));

        // Mailing State value
        if($A.util.isUndefinedOrNull(Accnt.PersonMailingState)) 
            component.find("MailingStateInput").set("v.value", '');
        else
            component.find("MailingStateInput").set("v.value",Accnt.PersonMailingState);		        

        // Physical State value
        if($A.util.isUndefinedOrNull(Accnt.PersonOtherState)) 
            component.find("PhysicalStateInput").set("v.value", '');
        else
            component.find("PhysicalStateInput").set("v.value",Accnt.PersonOtherState);		        
                
        orgAccnt = {
            mobile  			: 	Accnt.PersonMobilePhone,
            phone				:	Accnt.Phone,
            LName				: 	Accnt.LastName,
            mailingStreet  		: 	Accnt.PersonMailingStreet,
            mailingCity			: 	Accnt.PersonMailingCity,
            mailingState		: 	Accnt.PersonMailingState,
            mailingOtherState	: 	Accnt.Other_Mailing_State__c,
            mailingCountry		: 	Accnt.PersonMailingCountry,
            mailingPostalCode	: 	Accnt.PersonMailingPostalCode,
            mailingSuite		: 	Accnt.Mailing_Suite__c,
            mailingAddressL2	: 	Accnt.Mailing_Address_Line_2__c,
            physicalStreet  	:	Accnt.PersonOtherStreet,
            physicalCity		:	Accnt.PersonOtherCity,
            physicalState		:	Accnt.PersonOtherState,
            physicalOtherState	:	Accnt.Other_Physical_State__c,
            physicalCountry		:	Accnt.PersonOtherCountry,
            physicalPostalCode	:	Accnt.PersonOtherPostalCode,
            physicalSuite		:	Accnt.Physical_Suite__c,
            physicalAddressL2	: 	Accnt.Physical_Address_Line_2__c
        }
        
        component.set("v.orgAccnt", orgAccnt);
        
        if(!helper.checkMailingAddFieldsForUsCitizens(component, event)){
            component.set("v.FFAddressRequired", true); 
        }
        
    },
    
    onMailingCountryChange : function(component, event, helper){
        var Accnt = component.get('v.Accnt');
        var countryValue = Accnt.PersonMailingCountry;
        helper.ObjFieldByMailingParent(component, event, countryValue);
        $A.enqueueAction(component.get('c.phyAddSameAsMailingAdd'));
    }, 
    
    onPhysicalCountryChange : function(component, event, helper) {
        var Accnt = component.get('v.Accnt');
        var countryValue = Accnt.PersonOtherCountry;
        helper.ObjFieldByPhysicalParent(component, event, countryValue);
    }, 
    
    showWarning: function(component, event, helper) {
    	component.set('v.showMsg', true);
	}, 
        
    UpdateAccount : function(component, event, helper) {
        debugger;
        var Accnt = component.get('v.Accnt');
        var OrigEmail = component.get("v.OrigEmail");
        var Email = component.get("v.Email");
        var emailRegex = /^[a-zA-Z0-9._-]+@[a-z0-9\-]+\.[a-z]{2,3}/;
        var isEmailValid = true;
        
        var isManual = component.get("v.isManual");
        var isManualPA = component.get("v.isManualPA");
        var isAllValid = true;
        var isMAddDataValid = true;
        var isPhyAddDataValid = true;
        var isLookupValSelected = true;
        var isPALookupValSelected = true;
        var isPhysicalAddressValid = true;
        var isLNameValid = true;
        var isLNameFormatValid = true;
        var isMobileNoValid = true;
        var isHomeNoValid = true;
        var phoneFieldError = null;
        
        //if mailing address is entered manually
        if (isManual == true) {    
            var controlselectAuraIds1;
            if(component.get("v.isUsORCadMailingAddress")) {
                if(component.get("v.Accnt.PersonMailingCountry") == "United States")
                    controlselectAuraIds1 = ["email", "lName", "mobile", "MailingStreetInput","MailingCityInput","MailingCountryInput","MailingStateInput" ,"MailingzipInput"];
                else
                    controlselectAuraIds1 = ["email", "lName", "mobile", "MailingStreetInput","MailingCityInput","MailingCountryInput","MailingStateInput"];
            }
            else{
                controlselectAuraIds1 = ["email", "lName", "mobile", "MailingStreetInput","MailingCityInput","MailingCountryInput","MailingOtherState"];
            }
            
            for(var i = 0; i < controlselectAuraIds1.length; i++) {
                var fieldId1 = controlselectAuraIds1[i];
                var cmpFindFieldId1 = component.find(fieldId1);
                var fieldValue1 = cmpFindFieldId1.get("v.value");
                if($A.util.isUndefinedOrNull(fieldValue1) || fieldValue1.trim() == '') {
                    cmpFindFieldId1.showHelpMessageIfInvalid();
                    isAllValid = false;
                }
            }
        }//if melissa look up is used
        else {
            var controlselectAuraIds2 = ["email", "lName", "mobile", "AddressFreeFormInput"];
            for(var i = 0; i < controlselectAuraIds2.length; i++){
                var fieldId2 = controlselectAuraIds2[i];
                var cmpFindFieldId2 = component.find(fieldId2);
                var fieldValue2 = cmpFindFieldId2.get("v.value");
                if(fieldId2 == "AddressFreeFormInput"){
                    //if any required mailing address field is empty then mark address lookup field required
                    if($A.util.isUndefinedOrNull(Accnt.PersonMailingStreet)     ||   Accnt.PersonMailingStreet.trim() == ''   || 
                       $A.util.isUndefinedOrNull(Accnt.PersonMailingCity)       ||   Accnt.PersonMailingCity.trim() == ''     || 
                       ($A.util.isUndefinedOrNull(Accnt.PersonMailingState)     ||   Accnt.PersonMailingState.trim() == ''   && component.get("v.isUsORCadMailingAddress")) ||
                       ($A.util.isUndefinedOrNull(Accnt.Other_Mailing_State__c) ||   Accnt.Other_Mailing_State__c.trim() == '' && !component.get("v.isUsORCadMailingAddress")) ||
                       $A.util.isUndefinedOrNull(Accnt.PersonMailingCountry)    ||   Accnt.PersonMailingCountry.trim() == ''  || 
                       (Accnt.PersonMailingCountry == 'United States' && ($A.util.isUndefinedOrNull(Accnt.PersonMailingPostalCode) ||   Accnt.PersonMailingPostalCode.trim() == ''))){
                        
                        if($A.util.isUndefinedOrNull(fieldValue2) || fieldValue2.trim() == "") { 
                            component.set("v.FFAddressRequired", true); 
                            cmpFindFieldId2.showHelpMessageIfInvalid();
                            isAllValid = false;
                        }
                        //if mailing address is not selected via lookup field
                        else{
                            isLookupValSelected = false;
                        }
                    }
                }//check for the fields values
                else {
                    if(  $A.util.isUndefinedOrNull(fieldValue2) || fieldValue2.trim() == '' ) {
                        cmpFindFieldId2.showHelpMessageIfInvalid();
                        isAllValid = false;
                    }                        
                }
            }
        }
        //validate mailing address integrity 
        if(isAllValid && isLookupValSelected) {            
            //validate mailing street integrity
            var forMobAddRegex = /^([a-zA-Z0-9\. \,\:\/\$\#\-]+)$/g;
            var addWithoutApostrophe = Accnt.PersonMailingStreet.replace(new RegExp("\\\'","g"), '');
            if (!forMobAddRegex.test(addWithoutApostrophe)){
                $A.util.addClass(component.find('MailingStreetInput'), 'slds-has-error');
                isMAddDataValid = false;
            }            
            
            //validate mailing city integrity
            var forMobCityRegex = /^([a-zA-Z0-9\.\ \-]+)$/g;
            addWithoutApostrophe = Accnt.PersonMailingCity.replace(new RegExp("\\\'","g"), '');
            if (!forMobCityRegex.test(addWithoutApostrophe)){
                $A.util.addClass(component.find('MailingCityInput'), 'slds-has-error');
                isMAddDataValid = false;
            }

            //validate mailing postal code integrity for US addresses
            if(component.get("v.Accnt.PersonMailingCountry") == "United States"){
                var forZipRegex = /^[0-9-]*$/; 
                //  var numbers = /[1-9]/g; || !numbers.test(Accnt.PersonMailingPostalCode.charAt(0)) 
                var count = (Accnt.PersonMailingPostalCode.match(/-/g) || []).length;
                if (!forZipRegex.test(Accnt.PersonMailingPostalCode) || count > 1  
                    || Accnt.PersonMailingPostalCode.substr(-1) == '-' || Accnt.PersonMailingPostalCode.charAt(0) == '-'){
                    $A.util.addClass(component.find('MailingzipInput'), 'slds-has-error');
                    isMAddDataValid = false;
                }
            }  
            
            //validate mailing postal code integrity for Non-US addresses
            if(component.get("v.Accnt.PersonMailingCountry") != "United States"){
                var forZipRegex = /^[a-zA-Z0-9 -]*$/;                 
                if (!forZipRegex.test(Accnt.PersonMailingPostalCode)  || Accnt.PersonMailingPostalCode.substr(-1) == '-' || Accnt.PersonMailingPostalCode.charAt(0) == '-'){
                    $A.util.addClass(component.find('MailingzipInput'), 'slds-has-error');
                    isMAddDataValid = false;
                }
            }  
            
            if (!$A.util.isEmpty(Accnt.Mailing_Address_Line_2__c)) {
                //validate mailing address Line 2 integrity
                var forAdd2Regex = /^([a-zA-Z0-9\. \,\:\/\$\#\-]+)$/g;
                addWithoutApostrophe = Accnt.Mailing_Address_Line_2__c.replace(new RegExp("\\\'","g"), '');
                if (!forAdd2Regex.test(addWithoutApostrophe)){
                    $A.util.addClass(component.find('MailingAddress2Input'), 'slds-has-error');
                    isMAddDataValid = false;
                }
            }
        }

        if(isAllValid && isLookupValSelected && isMAddDataValid) {
            // if any physical address field is populated
            if(Accnt.PersonOtherStreet.trim() != ''    ||	Accnt.PersonOtherCity.trim() != ''  || 	Accnt.PersonOtherState != '' ||
               Accnt.Other_Physical_State__c != '' 		   ||   Accnt.PersonOtherCountry != '' 		||  Accnt.PersonOtherPostalCode.trim() != ''){
                debugger;
                //then address must be complete  
                if (component.get("v.isManualPA")) { 
                    component.set("v.physicalAddressRequired", true);
                    var controlPAselectAuraIds1;
                    if(component.get("v.isUsORCadPhysicalAddress")) {
                        if(component.get("v.Accnt.PersonOtherCountry") == "United States")
                            controlPAselectAuraIds1 = ["PhysicalStreetInput","PhysicalCityInput","PhysicalStateInput", "PhysicalCountryInput" ,"PhysicalZipInput"];
                        else						  
                            controlPAselectAuraIds1 = ["PhysicalStreetInput","PhysicalCityInput","PhysicalStateInput", "PhysicalCountryInput" ];
                    }
                    else{
                        controlPAselectAuraIds1 = ["PhysicalStreetInput","PhysicalCityInput", "PhysicalOtherState", "PhysicalCountryInput" ];
                    }
                    
                    for(var i = 0; i < controlPAselectAuraIds1.length; i++) {
                        var fieldId1 = controlPAselectAuraIds1[i];
                        var cmpFindFieldId1 = component.find(fieldId1);
                        var fieldValue1 = cmpFindFieldId1.get("v.value");
                        if($A.util.isUndefinedOrNull(fieldValue1) || fieldValue1.trim() == '') {
                            cmpFindFieldId1.showHelpMessageIfInvalid();
                            isPhysicalAddressValid  = false;
                        }
                    }
                } 
                //if melissa look up is used
                else {
                    var fieldValue = component.find("PhysicalAddressFreeFormInput").get("v.value");
                    //if any required mailing address field is empty then mark address lookup field required
                    if($A.util.isUndefinedOrNull(Accnt.PersonOtherStreet)     ||   Accnt.PersonOtherStreet.trim() == ''   || 
                       $A.util.isUndefinedOrNull(Accnt.PersonOtherCity)       ||   Accnt.PersonOtherCity.trim() == ''     || 
                       ($A.util.isUndefinedOrNull(Accnt.PersonOtherState)      ||   Accnt.PersonOtherState.trim() == ''   && component.get("v.isUsORCadPhysicalAddress")) ||
                       ($A.util.isUndefinedOrNull(Accnt.Other_Physical_State__c)   ||   Accnt.Other_Physical_State__c.trim() == '' && !component.get("v.isUsORCadPhysicalAddress")) ||
                       $A.util.isUndefinedOrNull(Accnt.PersonOtherCountry)    ||   Accnt.PersonOtherCountry.trim() == ''  || 
                       (Accnt.PersonOtherCountry == 'United States' && ($A.util.isUndefinedOrNull(Accnt.PersonOtherPostalCode) ||   Accnt.PersonOtherPostalCode.trim() == '') )){
                        
                        if($A.util.isUndefinedOrNull(fieldValue) || fieldValue.trim() == "") { 
                            component.set("v.FFPhysicalAddressRequired", true); 
                            component.find("PhysicalAddressFreeFormInput").showHelpMessageIfInvalid();
                            isPhysicalAddressValid  = false;
                        }
                        //if physical address is not selected via lookup field
                        else{
                            isPALookupValSelected = false;
                        }
                    }
                }
                //if physical address is populated completely then validate it's  integrity 
                if(isPhysicalAddressValid && isPALookupValSelected){                    
                    //validate physical street integrity
                    var forMobAddRegex = /^([a-zA-Z0-9\. \,\:\/\$\#\-]+)$/g;
                    var addWithoutApostrophe = Accnt.PersonOtherStreet.replace(new RegExp("\\\'","g"), '');
                    if (!forMobAddRegex.test(addWithoutApostrophe)){
                        $A.util.addClass(component.find('PhysicalStreetInput'), 'slds-has-error');
                        isPhyAddDataValid = false;
                    }
                    
                    //validate physical city integrity
                    var forMobCityRegex = /^([a-zA-Z0-9\.\ \-]+)$/g;
                    addWithoutApostrophe = Accnt.PersonOtherCity.replace(new RegExp("\\\'","g"), '');
                    if (!forMobCityRegex.test(addWithoutApostrophe)){
                        $A.util.addClass(component.find('PhysicalCityInput'), 'slds-has-error');
                        isPhyAddDataValid = false;
                    }
                    
                    //validate physical postal code integrity for US addresses
                    if(component.get("v.Accnt.PersonOtherCountry") == "United States"){
                        var forZipRegex = /^[0-9-]*$/; 
                        var count = (Accnt.PersonOtherPostalCode.match(/-/g) || []).length;
                        if (!forZipRegex.test(Accnt.PersonOtherPostalCode) || count > 1
                            || Accnt.PersonOtherPostalCode.substr(-1) == '-' || Accnt.PersonOtherPostalCode.charAt(0) == '-'){
                            $A.util.addClass(component.find('PhysicalZipInput'), 'slds-has-error');
                            isPhyAddDataValid = false;
                        }
                    }  
                    
                    //validate physical postal code integrity for Non-US addresses
                    if(component.get("v.Accnt.PersonOtherCountry") != "United States"){
                        var forZipRegex = /^[a-zA-Z0-9 -]*$/; 
                        if (!forZipRegex.test(Accnt.PersonOtherPostalCode)  || Accnt.PersonOtherPostalCode.substr(-1) == '-' || Accnt.PersonOtherPostalCode.charAt(0) == '-'){
                            $A.util.addClass(component.find('PhysicalZipInput'), 'slds-has-error');
                            isPhyAddDataValid = false;
                        }
                    }  
                    
                    if (!$A.util.isEmpty(Accnt.Physical_Address_Line_2__c)) {
                        //validate physical address Line 2 integrity
                        var forAdd2Regex = /^([a-zA-Z0-9\. \,\:\/\$\#\-]+)$/g;
                        addWithoutApostrophe = Accnt.Physical_Address_Line_2__c.replace(new RegExp("\\\'","g"), '');
                        if (!forAdd2Regex.test(addWithoutApostrophe)){
                            $A.util.addClass(component.find('PhysicalAddress2Input'), 'slds-has-error');
                            isPhyAddDataValid = false;
                        }
                    }
                }
            } 
        } 
        
        if(isPhysicalAddressValid && isPhyAddDataValid) {
            //Validate Email Address 
/*            if(Email.trim() != OrigEmail.trim()){
                if(!emailRegex.test(Email)) {
                    isEmailValid = false;
                }
            }
  */          
            //Validate Last Name for Female Users
            if(Accnt.HealthCloudGA__Gender__pc == 'Female'){
                var alphaChar = /^[a-zA-Z-]*$/;
                isLNameValid = alphaChar.test(Accnt.LastName).toString();
                if(!isLNameValid)
                    isLNameValid = false;
                else if ( Accnt.LastName.substr(-1) == '-' || Accnt.LastName.charAt(0) == '-')
                    isLNameFormatValid = false;
            }
            
            // Validate Mobile Phone
            if(Accnt.PersonMobilePhone != ''){
                var mPhone  = Accnt.PersonMobilePhone.replace(/\D/g, '');
                var firstCharValforMobile = mPhone.charAt(0);
                
                if(mPhone.length != 10) {
                    isMobileNoValid = false;
                    phoneFieldError='Mobile number must contain 10 digits.';
                }
                
                if(firstCharValforMobile == '1'  || firstCharValforMobile == '0') {
                    isMobileNoValid = false;
                    if(phoneFieldError == null) {
                        phoneFieldError='Mobile number should not begin with 1 or 0.';
                    }
                    else {
                        phoneFieldError +='\nMobile number should not begin with 1 or 0.';
                    }
                }
            }
            
            // Validate Home Phone if not null
            if(!$A.util.isUndefinedOrNull(Accnt.Phone) && Accnt.Phone.trim() != '' && isMobileNoValid){
                var hPhone  = Accnt.Phone.replace(/\D/g, '');
                var firstCharValforPhone = hPhone.charAt(0);
                
                if(hPhone.length != 10) {
                    isHomeNoValid = false;
                    phoneFieldError='Phone number must contain 10 digits.';
                }
                
                if(firstCharValforPhone == '1'  || firstCharValforPhone == '0')  {
                    isHomeNoValid = false;
                    if(phoneFieldError == null) {
                        phoneFieldError='Phone number should not begin with 1 or 0.';
                    }
                    else {
                        phoneFieldError +='\nPhone number should not begin with 1 or 0.';
                    }
                }
            }
        }
                
        if (!isAllValid) {
            helper.showErrorMessage(component, event, helper, 'You must fill in all of the required fields.');
        }
        else if (!isLNameValid) {
            helper.showErrorMessage(component, event, helper, 'Last name cannot contain special characters or numbers.');
        }
        else if(!isLNameFormatValid){
            helper.showErrorMessage(component, event, helper, 'Please provide a valid Last Name.');
        }
         else if (!isMobileNoValid || !isHomeNoValid) {
            helper.showErrorMessage(component, event, helper, phoneFieldError);
        }
        else if(!isMAddDataValid){
             helper.showErrorMessage(component, event, helper, 'There are invlaid characters in the Mailing Address fields. Please provide a valid Mailing Address.');
        }
        else if (!isLookupValSelected) {
            helper.showErrorMessage(component, event, helper, 'Please make sure the Mailing Address provided is complete via the address lookup box.');
        } 
        else if (!isPhysicalAddressValid) {
            helper.showErrorMessage(component, event, helper, 'You must fill in all of the Physical Address fields.');
        }
        else if(!isPALookupValSelected){
             helper.showErrorMessage(component, event, helper, 'Please make sure the Physical Address provided is complete via the address lookup box.');  
        }
        else if (!isPhyAddDataValid){
            helper.showErrorMessage(component, event, helper, 'There are invlaid characters in the Physical Address fields. Please provide a valid Physical Address.');
        }
        else if (!isEmailValid) {
            helper.showErrorMessage(component, event, helper, 'Please enter a valid email address.');
        }
       else{
             helper.UpdatePersonAccount(component, event, helper);
        }
        
    },
    
    //handle setting up physical address same as mailing address
    phyAddSameAsMailingAdd: function(component, event, helper) {
        var checked= component.find("samecheckbox").get('v.checked');
        helper.checkboxSelect(component, event, helper, checked);
    },
   
    // get response from Melissa for Mailing Address 
    handleMailingAddressChange: function(component, event, helper){
       
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
    
    //handle Mailing Address click from results/predictions
    handleMailingAddressClick: function(component, event, helper){
        var checked= component.find("samecheckbox").get('v.checked');
        var Accnt = component.get('v.Accnt');
        var details = event.currentTarget;
        var melissaResult = component.get("v.predictions");
        var states = component.get("v.StatesWithStateCodes");
        var index = details.dataset.placeid;
        var address = details.dataset.place;
        component.set("v.selectedAddressIndex", index);
        component.set("v.location", address);
      
        for (var i = 0; i < melissaResult.length; i++){
            if(melissaResult[i].Address.SuiteCount > 0){
                for (var j = 0; j < melissaResult[i].Address.SuiteCount; j++){
                    if((melissaResult[i].Address.AddressLine1+' '+melissaResult[i].Address.SuiteList[j]+', '+
                        melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                        
                        Accnt.PersonMailingStreet = melissaResult[i].Address.AddressLine1;
                        Accnt.PersonMailingCity = melissaResult[i].Address.City;
                        Accnt.PersonMailingCountry = "United States";
                        helper.ObjFieldByMailingParent(component, event, "United States");
                        Accnt.PersonMailingState = states[0][melissaResult[i].Address.State];
                        Accnt.PersonMailingPostalCode = melissaResult[i].Address.PostalCode;
                        Accnt.Mailing_Suite__c =  melissaResult[i].Address.SuiteList[j];
                        Accnt.Mailing_Address_Line_2__c = '';
                        
                        var selectMMAddress = {
                            street 		: melissaResult[i].Address.AddressLine1,
                            city		: melissaResult[i].Address.City,
                            state		: states[0][melissaResult[i].Address.State],
                            country		: "United States",
                            postalCode	: melissaResult[i].Address.PostalCode,
                            suite		: melissaResult[i].Address.SuiteList[j]
                        }
                        component.set("v.selectedAddress", selectMMAddress);
                    }
                }
            } 
            if(melissaResult[i].Address.SuiteCount < 1){
                if((melissaResult[i].Address.AddressLine1+(melissaResult[i].Address.SuiteName != ''?' '+melissaResult[i].Address.SuiteName:'')+', '+
                    melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                    
                    Accnt.PersonMailingStreet = melissaResult[i].Address.AddressLine1;
                    Accnt.PersonMailingCity = melissaResult[i].Address.City;
                    Accnt.PersonMailingCountry = "United States";
                    helper.ObjFieldByMailingParent(component, event, "United States");
                    Accnt.PersonMailingState = states[0][melissaResult[i].Address.State];
                    Accnt.PersonMailingPostalCode = melissaResult[i].Address.PostalCode;
                    Accnt.Mailing_Suite__c =  melissaResult[i].Address.SuiteName;
                    Accnt.Mailing_Address_Line_2__c = '';
                    
                    var selectMMAddress = {
                            street 		: melissaResult[i].Address.AddressLine1,
                            city		: melissaResult[i].Address.City,
                            state		: states[0][melissaResult[i].Address.State],
                            country 	: "United States",
                            postalCode	: melissaResult[i].Address.PostalCode,
                            suite		: melissaResult[i].Address.SuiteName
                        }
                    component.set("v.selectedAddress", selectMMAddress);
                }
            }
        }
        if(checked)
        helper.checkboxSelect(component, event, helper, checked);
        
        document.getElementById("addressResult").style.display = "none";
         component.set("v.Accnt" ,Accnt );
    },
    
    // handle enter Mailing Address manually
    handleMailingToggleChange: function(component, event, helper){
        var checked= component.find("samecheckbox").get('v.checked');
        var Accnt = component.get('v.Accnt');
        var melissaResult = component.get("v.predictions");
        var states = component.get("v.StatesWithStateCodes");
        var index = component.get("v.selectedAddressIndex");
        var address = component.get("v.selectedAddress");
        var orgAccnt = component.get("v.orgAccnt");
        debugger;
        //for Melissa Look up
        if(!component.get("v.isManual")){
            component.set("v.mailingAddressRequired", false);
            if(!helper.checkMailingAddFieldsForUsCitizens(component, event)){
                component.set("v.FFAddressRequired", true); 
            }
            
            // set country to US and populate states w.r.t it
            if(component.get("v.location") != ""){
            //    Accnt.PersonMailingCountry = 'United States';
                helper.ObjFieldByMailingParent(component, event, (address.country == '' || $A.util.isUndefinedOrNull(address.country)) ? component.get("v.Accnt.PersonMailingCountry") : address.country);
            }       
            
            component.set("v.disableMState", true); 
            component.set("v.disableOtherMState", true); 
            
            // revert back to melissa mailing address
            if(address != ''){
                Accnt.PersonMailingStreet 		=	address.street;
                Accnt.PersonMailingCity 		= 	address.city;
                Accnt.PersonMailingCountry 		= 	address.country;
                Accnt.PersonMailingState 		= 	address.state;
                Accnt.PersonMailingPostalCode 	= 	address.postalCode;
                Accnt.Mailing_Suite__c			= 	address.suite;
                Accnt.Mailing_Address_Line_2__c =   '';
                component.set("v.Accnt" ,Accnt );
            }
            else{
                // revert back to original mailing address
                Accnt.PersonMailingStreet		=	orgAccnt.mailingStreet;
                Accnt.PersonMailingCity 		= 	orgAccnt.mailingCity;
                Accnt.PersonMailingState 		=	orgAccnt.mailingState;
                Accnt.Other_Mailing_State__c 	= 	orgAccnt.mailingOtherState;
                Accnt.PersonMailingCountry 		= 	orgAccnt.mailingCountry;
                Accnt.PersonMailingPostalCode 	= 	orgAccnt.mailingPostalCode;
                Accnt.Mailing_Suite__c 			= 	orgAccnt.mailingSuite;
                Accnt.Mailing_Address_Line_2__c 	= 	orgAccnt.mailingAddressL2; 
                component.set("v.Accnt" ,Accnt );
            }
            
            var street = component.find('MailingStreetInput');
            street.setCustomValidity('');
            street.reportValidity();
            
            var city = component.find('MailingCityInput');
            city.setCustomValidity('');
            city.reportValidity();
                        
            
            var zip = component.find('MailingzipInput');
            zip.setCustomValidity('');
            zip.reportValidity();
            
            var otherState = component.find('MailingOtherState');
            otherState.setCustomValidity('');
            otherState.reportValidity();
            
            var state = component.find('MailingStateInput');
            $A.util.removeClass(state, 'slds-has-error');
            
            var country = component.find('MailingCountryInput');
            $A.util.removeClass(country, 'slds-has-error');
           
            if(checked)
                helper.checkboxSelect(component, event, helper, checked);
        }
        else
        {
            component.set("v.mailingAddressRequired", true);
            component.set("v.FFAddressRequired", false);
            
            var ff = component.find('AddressFreeFormInput');
            ff.setCustomValidity('');
            ff.reportValidity();
            
            if(component.get("v.isUsORCadMailingAddress")){
                component.set("v.disableOtherMState", true); 
                component.set("v.disableMState", false);
            }
            else{
                component.set("v.disableOtherMState", false); 
                component.set("v.disableMState", true);
            }
        }
    },
    
    // get response from Melissa for Physical Address 
    handlePhysicalAddressChange: function(component, event, helper){
        if(event.getSource().get("v.value").length % 3 == 0){
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
    
    //handle Physical Address click from results/predictions
    handlePhysicalAddressClick: function(component, event, helper){
        var Accnt = component.get('v.Accnt');
        var details = event.currentTarget;
        var melissaResult = component.get("v.predictionsPA");
        var states = component.get("v.StatesWithStateCodes");
        var index = details.dataset.placeid;
        var address = details.dataset.place;
        component.set("v.selectedPhyAddressIndex", index);
        component.set("v.locationPA", address);
      
        for (var i = 0; i < melissaResult.length; i++){
            if(melissaResult[i].Address.SuiteCount > 0){
                for (var j = 0; j < melissaResult[i].Address.SuiteCount; j++){
                    if((melissaResult[i].Address.AddressLine1+' '+melissaResult[i].Address.SuiteList[j]+', '+
                        melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                        
                        Accnt.PersonOtherStreet		 =  melissaResult[i].Address.AddressLine1;
                        Accnt.PersonOtherCity		 =  melissaResult[i].Address.City;
                        Accnt.PersonOtherCountry	 =  "United States";
                        helper.ObjFieldByPhysicalParent(component, event, "United States");
                        Accnt.PersonOtherState 		=  states[0][melissaResult[i].Address.State];
                        Accnt.PersonOtherPostalCode =  melissaResult[i].Address.PostalCode;
                        Accnt.Physical_Suite__c 	=  melissaResult[i].Address.SuiteList[j];
                        Accnt.Physical_Address_Line_2__c  =  '';
                        var selectPhyAddress = {
                            street 		: melissaResult[i].Address.AddressLine1,
                            city		: melissaResult[i].Address.City,
                            state		: states[0][melissaResult[i].Address.State],
                            country 	: "United States",
                            postalCode	: melissaResult[i].Address.PostalCode,
                            suite		: melissaResult[i].Address.SuiteList[j]
                        }
                        component.set("v.selectedPhyAddress", selectPhyAddress);
                    }
                }
            } 
            if(melissaResult[i].Address.SuiteCount < 1){
                if((melissaResult[i].Address.AddressLine1+(melissaResult[i].Address.SuiteName != ''?' '+melissaResult[i].Address.SuiteName:'')+', '+
                    melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                    
                    Accnt.PersonOtherStreet = melissaResult[i].Address.AddressLine1;
                    Accnt.PersonOtherCity = melissaResult[i].Address.City;
                    Accnt.PersonOtherCountry = "United States";
                    helper.ObjFieldByPhysicalParent(component, event, "United States");
                    Accnt.PersonOtherState = states[0][melissaResult[i].Address.State];
                    Accnt.PersonOtherPostalCode = melissaResult[i].Address.PostalCode;
                    Accnt.Physical_Suite__c =  melissaResult[i].Address.SuiteName;
                    Accnt.Physical_Address_Line_2__c  =  '';
                    
                    var selectPhyAddress = {
                        street  	: melissaResult[i].Address.AddressLine1,
                        city		: melissaResult[i].Address.City,
                        state		: states[0][melissaResult[i].Address.State],
                        country 	: "United States",
                        postalCode	: melissaResult[i].Address.PostalCode,
                        suite		: melissaResult[i].Address.SuiteName
                    }
                    component.set("v.selectedPhyAddress", selectPhyAddress);
                }
            }
        }
        document.getElementById("addressResultPA").style.display = "none";
        component.set("v.Accnt" ,Accnt );
        
    },
    
    // handle enter Physical Address manually
    handlePhysicalToggleChange: function(component, event, helper){
        var Accnt = component.get('v.Accnt');
        var melissaResult = component.get("v.predictionsPA");
        var states = component.get("v.StatesWithStateCodes");
        var index = component.get("v.selectedPhyAddressIndex");
        var address = component.get("v.selectedPhyAddress");
        var orgAccnt = component.get("v.orgAccnt");
        
        //for Melissa Look up
        if(!component.get("v.isManualPA")){
            debugger;
            component.set("v.physicalAddressRequired", false);
            /*
            if(!helper.checkMailingAddressFields(component, event)){
                component.set("v.FFPhysicalAddressRequired", true); 
            }
            */
            // set country to US and populate states w.r.t it
            if(component.get("v.locationPA") != ""){
                //Accnt.PersonOtherCountry = 'United States';
                helper.ObjFieldByPhysicalParent(component, event, (address.country == '' || $A.util.isUndefinedOrNull(address.country)) ? component.get("v.Accnt.PersonOtherCountry") : address.country);
            }       
            
            component.set("v.disableOtherPhyState", true); 
            component.set("v.disablePhyState", true); 
            
            // revert back to melissa physical address
            if(address != ''){
                Accnt.PersonOtherStreet 		=	address.street;
                Accnt.PersonOtherCity 			= 	address.city;
                Accnt.PersonOtherCountry 		= 	address.country;
                Accnt.PersonOtherState 			= 	address.state;
                Accnt.PersonOtherPostalCode 	= 	address.postalCode;
                Accnt.Physical_Suite__c			= 	address.suite;
                Accnt.Physical_Address_Line_2__c =  '';
                component.set("v.Accnt" ,Accnt );
            }
            else{
                // revert back to original physical address
                Accnt.PersonOtherStreet			=	orgAccnt.physicalStreet;
                Accnt.PersonOtherCity 			= 	orgAccnt.physicalCity;
                Accnt.PersonOtherState 			=	orgAccnt.physicalState;
                Accnt.Other_Physical_State__c 	= 	orgAccnt.physicalOtherState;
                Accnt.PersonOtherCountry 		= 	orgAccnt.physicalCountry;
                Accnt.PersonOtherPostalCode 	= 	orgAccnt.physicalPostalCode;
                Accnt.Physical_Suite__c 		= 	orgAccnt.physicalSuite;
                Accnt.Physical_Address_Line_2__c 	= 	orgAccnt.physicalAddressL2;
                component.set("v.Accnt" ,Accnt );
            }
            
            var street = component.find('PhysicalStreetInput');
            street.setCustomValidity('');
            street.reportValidity();
            
            var city = component.find('PhysicalCityInput');
            city.setCustomValidity('');
            city.reportValidity();
                        
            
            var zip = component.find('PhysicalZipInput');
            zip.setCustomValidity('');
            zip.reportValidity();
            
            var otherState = component.find('PhysicalOtherState');
            otherState.setCustomValidity('');
            otherState.reportValidity();
            
            var state = component.find('PhysicalStateInput');
            $A.util.removeClass(state, 'slds-has-error');
            
             var country = component.find('PhysicalCountryInput');
            $A.util.removeClass(country, 'slds-has-error');
           
        }
        else
        {
            component.set("v.physicalAddressRequired", true);
            component.set("v.FFPhysicalAddressRequired", false);
            
            var ff = component.find('PhysicalAddressFreeFormInput');
            ff.setCustomValidity('');
            ff.reportValidity();
            
            if(component.get("v.Accnt.PersonOtherCountry") != ''){
                if(component.get("v.isUsORCadPhysicalAddress")){
                    component.set("v.disableOtherPhyState", true); 
                    component.set("v.disablePhyState", false);
                }
                else{
                    component.set("v.disableOtherPhyState", false); 
                    component.set("v.disablePhyState", true);
                }  
            }
           
        }
        
    },
    
    //format user's last name field
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
        if(size == 0){
                inputValue = inputValue;
        }
        else if(size < 4){
            inputValue = '('+inputValue;
        }
        else if(size < 7){
       		  inputValue = '('+inputValue.substring(0,3)+') '+inputValue.substring(3,6);
       }
        else{
            inputValue = '('+inputValue.substring(0,3)+') '+inputValue.substring(3,6)+'-'+inputValue.substring(6,10);
       }
      fieldInput.set('v.value', inputValue);

    },
    

    AlphanumericWithSpecCharCheck : function(component, event, helper)
    {
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
    
    AddressCityValidationCheck : function(component, event, helper)
    {
        debugger
        var code = (event.which) ? event.which : event.keyCode;
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123) && // lower alpha (a-z)
            !(code > 44 && code < 47) && // -.
            !(code == 39) && !(code == 32)) {  // 'space
            event.preventDefault();
        }
    }
})