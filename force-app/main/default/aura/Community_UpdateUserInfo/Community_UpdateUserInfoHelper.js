({
    UpdatePersonAccount : function(component,event,helper){
         debugger;
        component.set("v.isLoading", true);
        var Accnt = component.get('v.Accnt');
        var orgAccnt = component.get('v.orgAccnt');
        var Email = component.get('v.Email');
        var OrigEmail = component.get('v.OrigEmail');
        var checked= component.find("samecheckbox").get('v.checked');
    //     var CloneAccnt = component.get('v.CloneAccnt');
        
        var isManual = component.get("v.isManual");
        var isMailingAddressMVerfied = false;
        var melissaResult = component.get("v.predictions");
        var address = component.get("v.selectedAddress");
        
        var isManualPA = component.get("v.isManualPA");
        var isPhysicalAddressMVerfied = false;
        var melissaPAResult = component.get("v.predictionsPA");
        var addressPA = component.get("v.selectedPhyAddress");
        
        var isMailingAddressChanged = false;
        var isPhysicalAddressChanged = false;
         
        //check if Mailing Address is changed?
         if(Accnt.PersonMailingStreet.trim() != orgAccnt.mailingStreet || Accnt.PersonMailingCity.trim() != orgAccnt.mailingCity || Accnt.PersonMailingCountry != orgAccnt.mailingCountry
            || Accnt.PersonMailingPostalCode.trim() != orgAccnt.mailingPostalCode || Accnt.Mailing_Suite__c.trim() != orgAccnt.mailingSuite || Accnt.Mailing_Address_Line_2__c.trim() != orgAccnt.mailingAddressL2 ||
            ((Accnt.PersonMailingCountry == 'United States' || Accnt.PersonMailingCountry == 'Canada') &&  Accnt.PersonMailingState != orgAccnt.mailingState) ||
            (Accnt.PersonMailingCountry != 'United States' && Accnt.PersonMailingCountry != 'Canada' &&   Accnt.Other_Mailing_State__c != orgAccnt.mailingOtherState)){
             isMailingAddressChanged = true;
         }
        //check if Physical Address is changed?
         if( Accnt.PersonOtherStreet.trim() != orgAccnt.physicalStreet || Accnt.PersonOtherCity.trim() != orgAccnt.physicalCity || Accnt.PersonOtherCountry != orgAccnt.physicalCountry ||
            Accnt.PersonOtherPostalCode.trim() != orgAccnt.physicalPostalCode || Accnt.Physical_Suite__c.trim() != orgAccnt.physicalSuite || Accnt.Physical_Address_Line_2__c.trim() != orgAccnt.physicalAddressL2 ||  
            ((Accnt.PersonOtherCountry == 'United States' || Accnt.PersonOtherCountry == 'Canada') &&  Accnt.PersonOtherState != orgAccnt.physicalState) ||
            (Accnt.PersonOtherCountry != 'United States' && Accnt.PersonOtherCountry != 'Canada' &&   Accnt.Other_Physical_State__c != orgAccnt.physicalOtherState)){
             isPhysicalAddressChanged = true;
         }
        //check If data is changed?
         //Email != OrigEmail ||
         if( Accnt.Phone.trim() != orgAccnt.phone || Accnt.PersonMobilePhone.trim() != orgAccnt.mobile || 
            Accnt.LastName.trim() != orgAccnt.LName || isPhysicalAddressChanged || isMailingAddressChanged){
             if(isMailingAddressChanged && Accnt.PersonMailingCountry == "United States"){
                 if(component.get("v.isManual")){
                     if(address.street == Accnt.PersonMailingStreet && address.city == Accnt.PersonMailingCity && address.state == Accnt.PersonMailingState 
                        && address.country == Accnt.PersonMailingCountry && address.postalCode == Accnt.PersonMailingPostalCode && address.suite == Accnt.Mailing_Suite__c){
                         isMailingAddressMVerfied = true;
                     }
                     else{
                         isMailingAddressMVerfied = false;
                     }
                 }
                 else{ 
                     isMailingAddressMVerfied = true;
                 }
                 Accnt.Mailing_Add_Melissa_Verified__c = isMailingAddressMVerfied;   
             }
             
             if(isPhysicalAddressChanged && Accnt.PersonOtherCountry == "United States" && Accnt.PersonOtherStreet.trim() != ''   &&	Accnt.PersonOtherCity.trim() != '' &&
                Accnt.PersonOtherState != '' && Accnt.PersonOtherCountry != '' 	&& 	Accnt.PersonOtherPostalCode.trim() != ''){
                 if(component.get("v.isManualPA") || checked){
                     if(addressPA != '' && (addressPA.street == Accnt.PersonMailingStreet && addressPA.city == Accnt.PersonMailingCity && addressPA.state == Accnt.PersonMailingState 
                        && addressPA.country == Accnt.PersonMailingCountry && addressPA.postalCode == Accnt.PersonMailingPostalCode && address.suite == Accnt.Physical_Suite__c)){
                         isPhysicalAddressMVerfied = true;
                     }
                     else if(isMailingAddressMVerfied && checked && addressPA == ''){
                         isPhysicalAddressMVerfied = true;
                     }
                     else{
                         isPhysicalAddressMVerfied = false;
                     }
                 }
                 else{
                     isPhysicalAddressMVerfied = true;
                 } 
                 Accnt.Physical_Add_Melissa_Verified__c = isPhysicalAddressMVerfied;
             }
             
             if(Accnt.Phone != ''){
                 var hPhone  = Accnt.Phone.replace(/\D/g, '');
                 Accnt.Phone = hPhone;
             }
             
             var mPhone  = Accnt.PersonMobilePhone.replace(/\D/g, '');
             Accnt.PersonMobilePhone = mPhone;
             
             if(Accnt.HealthCloudGA__Gender__pc == 'Female')
                 Accnt.LastName = Accnt.LastName.toUpperCase();
             
             var action = component.get("c.UpdateAccnt");
             action.setParams({
                 userAccount : 	Accnt,
               //  Email		:	Email
             });
             
             action.setCallback(this, function(response) {
                 var state = response.getState();
                 if (state == 'SUCCESS') {
                     helper.showSuccessMessage(component,event,helper,'Profile changes are updated successfully.');
                     var result = response.getReturnValue();
                     console.log(result);
                     
                     // Re-format Date of Birth
                     var splitDate = result.Date_of_Birth__c.split('-');
                     var year = splitDate[0];
                     var month = splitDate[1];
                     var day = splitDate[2];
                     var uDob = month+'/'+day+'/'+year;
                     result.Date_of_Birth__c = uDob;
                     result.Date_of_Birth__c = uDob;
                     
                     //Re-format mobile phone
                     var number = result.PersonMobilePhone.replace(/\D/g, '').slice(-10);
                     result.PersonMobilePhone = '('+number.substring(0,3)+') '+number.substring(3,6)+'-'+number.substring(6,10);
                     
                     //Re-format home phone
                     if (!$A.util.isUndefinedOrNull(result.Phone)) {
                         var number = result.Phone.replace(/\D/g, '').slice(-10);
                         result.Phone = '('+number.substring(0,3)+') '+number.substring(3,6)+'-'+number.substring(6,10);
                     }
                     
                     component.set("v.isLoading", false);
                     var ReturnAccountObj = component.getEvent("ReturnAccountObj");
                     debugger;
                     
                     ReturnAccountObj.setParams({
                         "Accnt" : result,
                     });
                     ReturnAccountObj.fire();
                     debugger; 
                 }
                 else if (state == 'ERROR'){
                     component.set("v.isLoading", false);
                     let errors = response.getError();
                     helper.showErrorMessage(component, event, helper, errors[0].message);
                 }
             })
             $A.enqueueAction(action); 
         }
         else{ // else show message
             component.set("v.isLoading", false);
             helper.showSuccessMessage(component,event,helper,'No changes to save.');
         } 
     },
    
    ObjFieldByMailingParent : function(component, event, mailingCountry)
    {
        debugger;
        var Accnt = component.get('v.Accnt');
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
                component.set("v.isUsORCadMailingAddress", true);
                if(component.get("v.isManual")){
                    //disable Other Mailing State and enable  Mailing State
                    component.set("v.disableOtherMState", true); 
                    component.set("v.disableMState", false);
                }
                Accnt.Other_Mailing_State__c = '';
            }
            else{
                component.set("v.isUsORCadMailingAddress", false);
                if(component.get("v.isManual")){
                    //enable Other Mailing State and disable  Mailing State
                    component.set("v.disableOtherMState", false); 
                    component.set("v.disableMState", true);
                }
                Accnt.PersonMailingState = '';
            }
            
        } //disable both Other Mailing State and Mailing State fields
        else{
            component.set("v.disableOtherMState", true); 
            component.set("v.disableMState", true);
            Accnt.Other_Mailing_State__c = '';
            Accnt.PersonMailingState = '';
        } 
        component.set("v.Accnt" ,Accnt );
        
    }, 
    
    ObjFieldByPhysicalParent : function(component, event, physicalCountry)
    {
        debugger;
        var Accnt = component.get('v.Accnt');
        var countryValue = physicalCountry;
        var pickListMap = component.get("v.getPickListMap");
        
        if (countryValue != '') {     
            //get state values against country
            var stateValues = pickListMap[countryValue];            
            var stateValueList = [];
            
            for (var i = 0; i < stateValues.length; i++) {
                stateValueList.push(stateValues[i]);
            }
            //set physical state picklist
            component.set("v.getPhysicalChildList", stateValueList);
            
            //disable Other Physical State and enable  Physical State fields
            if(stateValues.length > 0) {
                component.set("v.isUsORCadPhysicalAddress", true);
                if(component.get("v.isManualPA")){
                    component.set("v.disableOtherPhyState", true); 
                    component.set("v.disablePhyState", false);
                }
                Accnt.Other_Physical_State__c = '';
            }//enable Other Physical State and disable  Physical State fields
            else{
                component.set("v.isUsORCadPhysicalAddress", false);
                if(component.get("v.isManualPA")){
                    component.set("v.disableOtherPhyState", false); 
                    component.set("v.disablePhyState", true);
                }
                Accnt.PersonOtherState = '';
            }
            
        } //disable both Other Physical State and Physical State fields
        else{
            component.set("v.disableOtherPhyState", true); 
            component.set("v.disablePhyState", true);
            Accnt.Other_Physical_State__c = '';
            Accnt.PersonOtherState = '';
        } 
        component.set("v.Accnt" ,Accnt );
        
    }, 
    
    checkboxSelect: function(component, event, helper, val) {
        debugger;
        var checked= val;
        var Accnt = component.get("v.Accnt");
        var orgAccnt = component.get('v.orgAccnt');
        
        if(checked) {
            component.set("v.Accnt.PersonOtherStreet",Accnt.PersonMailingStreet);
            component.set("v.Accnt.PersonOtherCity",Accnt.PersonMailingCity);
            component.set("v.Accnt.PersonOtherCountry",Accnt.PersonMailingCountry);
            helper.ObjFieldByPhysicalParent(component, event, Accnt.PersonMailingCountry);
            component.set("v.Accnt.PersonOtherState",Accnt.PersonMailingState);
            component.set("v.Accnt.Other_Physical_State__c",Accnt.Other_Mailing_State__c);
            component.set("v.Accnt.PersonOtherPostalCode",Accnt.PersonMailingPostalCode);
            component.set("v.Accnt.Physical_Suite__c",Accnt.Mailing_Suite__c);
            component.set("v.Accnt.Physical_Address_Line_2__c",Accnt.Mailing_Address_Line_2__c);
            
            //handle use case
            // same as mailing address is check along with enter address manually set to true for physical address
            if(component.get("v.isManualPA")){
                if ((Accnt.PersonMailingCountry != "United States" && Accnt.PersonMailingCountry != "Canada") || Accnt.PersonMailingCountry == ''){
                    component.set("v.disablePhyState", true); 
                    component.set("v.disableOtherPhyState", false);
                }
                else{
                    component.set("v.disablePhyState", false); 
                    component.set("v.disableOtherPhyState", true);
                }
            }
            else{
                component.set("v.disablePhyState", true); 
                component.set("v.disableOtherPhyState", true);
            }
        }
        else{            
            component.set("v.Accnt.PersonOtherStreet", orgAccnt.physicalStreet);
            component.set("v.Accnt.PersonOtherCity", orgAccnt.physicalCity);
            component.set("v.Accnt.PersonOtherState", orgAccnt.physicalState);
            component.set("v.Accnt.Other_Physical_State__c", orgAccnt.physicalOtherState);
            component.set("v.Accnt.PersonOtherCountry", orgAccnt.physicalCountry);
            component.set("v.Accnt.PersonOtherPostalCode", orgAccnt.physicalPostalCode);
            component.set("v.Accnt.Physical_Suite__c", orgAccnt.physicalSuite);
            component.set("v.Accnt.Physical_Address_Line_2__c", orgAccnt.physicalAddressL2);
        }  
        
    },
    
    // validate Mailing Address Completeness
    checkMailingAddFieldsForUsCitizens : function(component, event)
    {
        var isMailingAddressValid = true;
        var Accnt = component.get('v.Accnt');
        if(component.get("v.Accnt.PersonMailingCountry") == "United States"){
            if($A.util.isUndefinedOrNull(Accnt.PersonMailingStreet)     ||   Accnt.PersonMailingStreet.trim() == ''   || 
               $A.util.isUndefinedOrNull(Accnt.PersonMailingCity)       ||   Accnt.PersonMailingCity.trim() == ''     || 
               $A.util.isUndefinedOrNull(Accnt.PersonMailingState)      ||   Accnt.PersonMailingState.trim() == ''    ||
               $A.util.isUndefinedOrNull(Accnt.PersonMailingCountry)    ||   Accnt.PersonMailingCountry.trim() == ''  || 
               $A.util.isUndefinedOrNull(Accnt.PersonMailingPostalCode) ||   Accnt.PersonMailingPostalCode.trim() == '' ){
                isMailingAddressValid = false;
            }
        }
        return isMailingAddressValid;
        
    }, 
    
    callServer : function(component, method, callback, params, helper) {
        debugger;
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
                         this.showErrorMessage(component, event, helper, errors[0].message);
                    }
                } else {
                     this.showErrorMessage(component, event, helper, 'Unknown Error');
                }
            }
        });
        
        $A.enqueueAction(action);
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
        debugger;
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title : 'Success',
            message: message,
            duration:' 3000',
            key: 'info_alt',
            type: 'success',
            mode: 'dismissible'
        });
        toastEvent.fire();
    }
    
})