({
    doInit : function(component, event, helper) 
    {
         var recordId = component.get('v.recordId');
        console.log(recordId);
        var action = component.get("c.CaseDetails");
        action.setParams({
            recordId: recordId
        });
        action.setCallback(this,function(response)
                           {
                               var state = response.getState();
                               debugger;
                               
                               if (state === "SUCCESS")
                               {
                                   var resultData = response.getReturnValue(); 
                                   console.log(resultData.CVCase);
                                   if(resultData.CVCase != null && resultData.CVCase != undefined){
                                       console.log(resultData.Sub_ApplicantList);
                                       component.set("v.CVCase", resultData.CVCase);
                                       component.set("v.HHMembersList", resultData.Sub_ApplicantList);
                                       //component.set("v.StudentsListToReview", resultData.Sub_ApplicantList);
                                       component.set("v.showCAForm", true);
                                       //component.set("v.selectedGenreList", resultData.CVCase.Devices_available_to_connect__c);
                                       /*if(resultData.CVCase.PG_First_Name__c !='' && resultData.CVCase.PG_First_Name__c !=undefined){
                                           component.set("v.showPrimaryGuardianSection", true);
                                       }*/
                                   }else{
                                     component.set("v.shownoteligibleMessage", true);   
                                   }
                                   
                               } 
                               
                               if (state === "ERROR")
                               {
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
    
    handleAddreesUpdate : function(component, event, helper) 
    {
        if(component.get("v.addressUpdate"))
        {
            component.set("v.showLookUp", true);
        }
        else
        {
            component.set("v.showLookUp", false);
            component.set("v.isManual", false);
            component.set("v.mailingAddressRequired", false);
            component.find("MailingStreetInput").set("v.value", component.get("v.mailingStreetOLV"));
            component.find("MailingAddress2Input").set("v.value", '');
            component.find("MailingCityInput").set("v.value", component.get("v.mailingCityOLV"));
            component.find("MailingzipInput").set("v.value", component.get("v.mailingZipOLV")); 
            component.find("MailingSuiteInput").set("v.value", component.get("v.mailingSuitOLV")); 
            component.find("MailingStateInput").set("v.value", component.get("v.mailingStateOLV")); 
            component.find("MailingCountryInput").set("v.value", component.get("v.mailingCountryOLV")); 
            
            // remove has errors
            var street = component.find('MailingStreetInput');
            $A.util.removeClass(street, 'slds-has-error');
            
            var city = component.find('MailingCityInput');
            $A.util.removeClass(city, 'slds-has-error');
            
            var state = component.find('MailingStateInput');
            $A.util.removeClass(state, 'slds-has-error');
            
            var country = component.find('MailingCountryInput');
            $A.util.removeClass(country, 'slds-has-error');
            
            var zip = component.find('MailingzipInput');
            $A.util.removeClass(zip, 'slds-has-error');
            
            var otherState = component.find('MailingOtherState');
            $A.util.removeClass(otherState, 'slds-has-error');
        }
        
    },
    mobileNumberFormater: function(component, event, helper){
        var phoneNumber = component.get('v.mobile');
        var cleaned = ('' + phoneNumber).replace(/\D/g, '');
        var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            var finalOne ='(' + match[1] + ') ' + match[2] + '-' + match[3];
            component.set("v.mobile", finalOne);
        }
        return null;
        
    },
    mobileNumberFormatters: function(component, event, helper){
        debugger;
        var phoneNumber = component.find('priConCellPhone').get("v.value");
        var cleaned = ('' + phoneNumber).replace(/\D/g, '');
        if(cleaned.length == 10){
            var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
            if (match) {
                var finalOne ='(' + match[1] + ')' + match[2] + '-' + match[3];
                debugger;
                component.find("priConCellPhone").set("v.value", finalOne);
            }
            return null;
        }
    },
    // fetches state picklist values with respect to country picklist value
    ObjFieldByMailingParent : function(component, event, helper)
    {
        //get mailing country value
        var controllerValue = component.find("MailingCountryInput").get("v.value");
        // get country state map
        var pickListMap = component.get("v.getPickListMap");
        
        //country field is not empty
        if (controllerValue != '') 
        {     
            // pass country state map key(country value) to get state values
            var childValues = pickListMap[controllerValue];            
            var childValueList = [];
            
            for (var i = 0; i < childValues.length; i++)
            {
                childValueList.push(childValues[i]);
            }
            
            component.set("v.getMailingChildList", childValueList);
            
            //get state values against country
            if(childValues.length > 0)
            {
                // hide other state/Territory field
                component.set("v.showMailingOtherState", false); 
                // show  state picklist
                component.set("v.showMailingState", true);
                // enable state picklist
                component.set("v.getMailingDisabledChildField" , false); 
                // set state field value to empty
                component.find("MailingStateInput").set("v.value",'');
                
            }
            
            //no state values found against country
            else
            {
                // show other state/Territory field
                component.set("v.showMailingOtherState", true); 
                // hide  state picklist
                component.set("v.showMailingState", false); 
                // disable state picklist
                component.set("v.getMailingDisabledChildField" , true); 
                // enable other state/Territory field
                component.set("v.mailingOtherStateDisabled" , false);
                // set other state/Territory field value to empty
                component.find("MailingOtherState").set("v.value",'');
            }
            
        } 
        //country field is empty
        else 
        {
            // set state picklist value to empty
            component.set("v.getMailingChildList", '');
            // disable state  picklist
            component.set("v.getMailingDisabledChildField" , true);
            // disable state/Territory field
            component.set("v.mailingOtherStateDisabled" , true);
            // set other state field value to empty
            component.find("MailingOtherState").set("v.value",'');
            
        }
    },       
    
    // date validator
    validateAndReplace: function (component, event)
    {
        const input = event.getSource();
        const inputValue = input.get('v.value');
        const validValue = inputValue.replace(/^(\d\d)(\d)$/g,'$1/$2')
        .replace(/^(\d\d\/\d\d)(\d+)$/g,'$1/$2')
        .replace(/[^\d\/]/g,'');
        input.set('v.value', validValue);
    },
    
    NumberCheck: function(component, event, helper)
    { 
        var charCode = (event.which) ? event.which : event.keyCode;
        if (!(charCode >= 48 && charCode <= 57))
        {
            event.preventDefault();
        }
        
        var fieldId = event.currentTarget.id;
        var fieldInput = component.find(fieldId);
        
        var phoneNumber = fieldInput.get("v.value");
        var cleaned = ('' + phoneNumber).replace(/\D/g, '');
        if(cleaned.length == 10){
            var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
            if (match) {
                var finalOne ='(' + match[1] + ')' + match[2] + '-' + match[3];
                debugger;
                component.find(fieldId).set("v.value", finalOne);
            }
            return null;
        }
        
    },
    
    formatPhoneXX: function(component, event, helper)
    {
        debugger;
        var input = component.find("priConCellPhone");
        var num = input.get("v.value").replace(/[^0-9]/g, "");
        
        component.find("priConCellPhone").set("v.value", '('+num.substring(0,3)+')'+num.substring(3,6)+'-'+num.substring(6,10));
    },
      //format phone fields
    formatPhone2:  function(component, event)   { 
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
                inputValue = '('+inputValue.substring(0,3)+')'+inputValue.substring(3,6);
                else
                    inputValue = '('+inputValue.substring(0,3)+')'+inputValue.substring(3,6)+'-'+inputValue.substring(6,10);
        
        fieldInput.set('v.value', inputValue);
    },
    FormatPhone: function(component, event, helper)
    {
        
        var input = component.find("priConCellPhone");
        var inputValue = input.get("v.value");
        var num = inputValue.replace(/([a-zA-Z ])/g, "");
        var num2 = num.replace(/[^0-9]/g, "");
        var match = num2.match(/^(\d{3})(\d{3})(\d{4})$/);
        
        input.set('v.value','(' + match[1] + ')' + match[2] + '-' + match[3]); 
    },
    
    characterCheck: function(component, event, helper)
    {
        var inputValue = event.which;
        if(!(inputValue >= 65 && inputValue <= 90 || inputValue == 45 || (inputValue >= 97 && inputValue <= 122)) && (inputValue != 32 && inputValue != 0))
        {
            event.preventDefault(); 
        }
    },
    
    //add row in Student table
    addRow: function(component, event, helper) 
    {
        helper.addStudentRecord(component, event);
    },
    
     //add row from Student table
    removeRow: function(component, event, helper) 
    {
      
        //Get the Students List
        var StudentsList = component.get("v.StudentsList");
        
          if(StudentsList.length == 1)
        {
             var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title : 'Warning',
                message: 'At least one single child record must be added.',
                duration:' 60000',
                key: 'info_alt',
                type: 'error',
                mode: 'dismissible'
            });
            toastEvent.fire();
        }
        else
        {
            //Get the target object
            var selectedItem = event.currentTarget;
            //Get the selected item index
            var index = selectedItem.dataset.record;
            StudentsList.splice(index, 1);
            component.set("v.StudentsList", StudentsList);
        }
            
    },
    
    //add row from Student table
    removeRow1: function(component, event, helper) 
    {
        
        //Get the Students List
        var StudentsList = component.get("v.StudentsList");
        
     
            //Get the target object
            var selectedItem = event.currentTarget;
            //Get the selected item index
            var index = selectedItem.dataset.record;
            StudentsList.splice(index, 1);
            component.set("v.StudentsList", StudentsList);
        
        
    },
    
    
    clearErrors : function(component, event) 
    {
        var fieldId = event.getSource().getLocalId();
        var fieldInput = component.find(fieldId);
        var fieldValue = fieldInput.get("v.value");
        if(fieldValue != '')
        {
            $A.util.removeClass(fieldInput, 'slds-has-error');
        }
        
    },
    
    handleAddressChange: function(component, event, helper)
    {
        if(event.getSource().get("v.value").length % 3 == 0)
        {
            var params = {
                input : component.get("v.location"),
                country : component.find("MailingCountryInput").get("v.value")
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
    
    handleAddressClick: function(component, event, helper)
    {
        
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
                        component.find("MailingStreetInput").set("v.value", melissaResult[i].Address.AddressLine1);
                        component.find("MailingCityInput").set("v.value", melissaResult[i].Address.City);
                        if(component.get("v.isManual") && component.find("MailingCountryInput").get("v.value") != "United States"){
                            component.find("MailingCountryInput").set("v.value", "United States");
                            //get mailing country value
                            var controllerValue = component.find("MailingCountryInput").get("v.value");
                            // get country state map
                            var pickListMap = component.get("v.getPickListMap");
                            
                            // pass country state map key(country value) to get state values
                            var childValues = pickListMap[controllerValue];            
                            var childValueList = [];
                            
                            for (var k = 0; k < childValues.length; k++)
                            {
                                childValueList.push(childValues[k]);
                            }
                            
                            component.set("v.getMailingChildList", childValueList);
                            
                            //get state values against country
                            if(childValues.length > 0)
                            {
                                component.set("v.showMailingOtherState", false);
                                component.set("v.showMailingState", true);
                                component.set("v.getMailingDisabledChildField" , false); 
                                
                                component.set("v.mailingOtherStateDisabled" , true);
                                if(component.find("MailingOtherState") != null){
                                    component.find("MailingOtherState").set("v.value",'');
                                }
                            }
                        }
                        component.find("MailingStateInput").set("v.value", states[0][melissaResult[i].Address.State]);
                        component.find("MailingzipInput").set("v.value", melissaResult[i].Address.PostalCode);
                        component.find("MailingSuiteInput").set("v.value", melissaResult[i].Address.SuiteList[j]);
                    }
                }
            } 
            if(melissaResult[i].Address.SuiteCount < 1){
                if((melissaResult[i].Address.AddressLine1+(melissaResult[i].Address.SuiteName != ''?' '+melissaResult[i].Address.SuiteName:'')+', '+
                    melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                    component.find("MailingStreetInput").set("v.value", melissaResult[i].Address.AddressLine1);
                    component.find("MailingCityInput").set("v.value", melissaResult[i].Address.City);
                    if(component.find("MailingCountryInput").get("v.value") != "United States"){
                        component.find("MailingCountryInput").set("v.value", "United States");
                        //get mailing country value
                        var controllerValue = component.find("MailingCountryInput").get("v.value");
                        // get country state map
                        var pickListMap = component.get("v.getPickListMap");
                        
                        // pass country state map key(country value) to get state values
                        var childValues = pickListMap[controllerValue];            
                        var childValueList = [];
                        
                        for (var k = 0; k < childValues.length; k++)
                        {
                            childValueList.push(childValues[k]);
                        }
                        
                        component.set("v.getMailingChildList", childValueList);
                        
                        //get state values against country
                        if(childValues.length > 0)
                        {
                            component.set("v.showMailingOtherState", false);
                            component.set("v.showMailingState", true);
                            component.set("v.getMailingDisabledChildField" , false); 
                            
                            component.set("v.mailingOtherStateDisabled" , true);
                            if(component.find("MailingOtherState") != null){
                                component.find("MailingOtherState").set("v.value",'');
                            }
                        }
                    }
                    component.find("MailingStateInput").set("v.value", states[0][melissaResult[i].Address.State]);
                    component.find("MailingzipInput").set("v.value", melissaResult[i].Address.PostalCode);
                    component.find("MailingSuiteInput").set("v.value", melissaResult[i].Address.SuiteName);
                }
            }
        }
        document.getElementById("addressResult").style.display = "none";
        //component.set("v.predictions", []);
    },
    
    handleToggleChange: function(component, event, helper){
        var melissaResult = component.get("v.predictions");
        var states = component.get("v.states");
        var index = component.get("v.selectedAddressIndex");
        var address = component.get("v.selectedAddress");
        
        var mailingStreetInput = component.find("MailingStreetInput");
        var mailingStreet = mailingStreetInput.get("v.value");
        var mailingCityInput = component.find("MailingCityInput");
        var mailingCity = mailingCityInput.get("v.value");
        var mailingCountryInput = component.find("MailingCountryInput");
        var mailingCountry = mailingCountryInput.get("v.value");
        var mailingZipInput = component.find("MailingzipInput");
        var mailingZip = mailingZipInput.get("v.value");
        
        if(!component.get("v.isManual")){
            component.set("v.mailingAddressRequired", false);
            if (mailingStreet == '' ||  mailingCity == ''  || mailingCountry == '' || mailingZip == '')
            {
                //mark free form address field required
                component.set("v.FFAddressRequired", true); 
            }
            
            if(component.get("v.location") != ""){
                component.find("MailingCountryInput").set("v.value", 'United States');
                
                // get country state map
                var pickListMap = component.get("v.getPickListMap");//get mailing country value
                var controllerValue = component.find("MailingCountryInput").get("v.value");
                
                // pass country state map key(country value) to get state values
                var childValues = pickListMap[controllerValue];            
                var childValueList = [];
                
                for (var k = 0; k < childValues.length; k++)
                {
                    childValueList.push(childValues[k]);
                }
                
                component.set("v.getMailingChildList", childValueList);
                
                //get state values against country
                if(childValues.length > 0)
                {
                    component.set("v.showMailingOtherState", false);
                    component.set("v.showMailingState", true);
                    component.set("v.getMailingDisabledChildField" , false); 
                    
                    component.set("v.mailingOtherStateDisabled" , true);
                    if(component.find("MailingOtherState") != null){
                        component.find("MailingOtherState").set("v.value",'');
                    }                            
                }
            }
            // remove has errors
            var street = component.find('MailingStreetInput');
            $A.util.removeClass(street, 'slds-has-error');
            
            var city = component.find('MailingCityInput');
            $A.util.removeClass(city, 'slds-has-error');
            
            var state = component.find('MailingStateInput');
            $A.util.removeClass(state, 'slds-has-error');
            
            var country = component.find('MailingCountryInput');
            $A.util.removeClass(country, 'slds-has-error');
            
            var zip = component.find('MailingzipInput');
            $A.util.removeClass(zip, 'slds-has-error');
            
            var otherState = component.find('MailingOtherState');
            $A.util.removeClass(otherState, 'slds-has-error');
            
            if(melissaResult.length > 0 )
            {
                for (var i = 0; i < melissaResult.length; i++){
                    if(melissaResult[i].Address.SuiteCount > 0){
                        for (var j = 0; j < melissaResult[i].Address.SuiteCount; j++){
                            if((melissaResult[i].Address.AddressLine1+' '+melissaResult[i].Address.SuiteList[j]+', '+
                                melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                                component.find("MailingStreetInput").set("v.value", melissaResult[i].Address.AddressLine1);
                                component.find("MailingCityInput").set("v.value", melissaResult[i].Address.City);
                                if(component.find("MailingCountryInput").get("v.value") != "United States"){
                                    component.find("MailingCountryInput").set("v.value", "United States");
                                    //get mailing country value
                                    var controllerValue = component.find("MailingCountryInput").get("v.value");
                                    // get country state map
                                    var pickListMap = component.get("v.getPickListMap");
                                    
                                    // pass country state map key(country value) to get state values
                                    var childValues = pickListMap[controllerValue];            
                                    var childValueList = [];
                                    
                                    for (var k = 0; k < childValues.length; k++)
                                    {
                                        childValueList.push(childValues[k]);
                                    }
                                    
                                    component.set("v.getMailingChildList", childValueList);
                                    
                                    //get state values against country
                                    if(childValues.length > 0)
                                    {
                                        component.set("v.showMailingOtherState", false);
                                        component.set("v.showMailingState", true);
                                        component.set("v.getMailingDisabledChildField" , false); 
                                        
                                        component.set("v.mailingOtherStateDisabled" , true);
                                        if(component.find("MailingOtherState") != null){
                                            component.find("MailingOtherState").set("v.value",'');
                                        }
                                    }
                                }
                                component.find("MailingStateInput").set("v.value", states[0][melissaResult[i].Address.State]);
                                component.find("MailingzipInput").set("v.value", melissaResult[i].Address.PostalCode);
                                component.find("MailingSuiteInput").set("v.value", melissaResult[i].Address.SuiteList[j]);
                                component.find("MailingAddress2Input").set("v.value", '');
                            }
                        }
                    } 
                    if(melissaResult[i].Address.SuiteCount < 1){
                        if((melissaResult[i].Address.AddressLine1+(melissaResult[i].Address.SuiteName != ''?' '+melissaResult[i].Address.SuiteName:'')+', '+
                            melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                            component.find("MailingStreetInput").set("v.value", melissaResult[i].Address.AddressLine1);
                            component.find("MailingCityInput").set("v.value", melissaResult[i].Address.City);
                            //component.find("MailingCountryInput").set("v.value", "United States");
                            if(component.find("MailingCountryInput").get("v.value") != "United States"){
                                component.find("MailingCountryInput").set("v.value", "United States");
                                //get mailing country value
                                var controllerValue = component.find("MailingCountryInput").get("v.value");
                                // get country state map
                                var pickListMap = component.get("v.getPickListMap");
                                
                                // pass country state map key(country value) to get state values
                                var childValues = pickListMap[controllerValue];            
                                var childValueList = [];
                                
                                for (var k = 0; k < childValues.length; k++)
                                {
                                    childValueList.push(childValues[k]);
                                }
                                
                                component.set("v.getMailingChildList", childValueList);
                                
                                //get state values against country
                                if(childValues.length > 0)
                                {
                                    component.set("v.showMailingOtherState", false);
                                    component.set("v.showMailingState", true);
                                    component.set("v.getMailingDisabledChildField" , false); 
                                    
                                    component.set("v.mailingOtherStateDisabled" , true);
                                    if(component.find("MailingOtherState") != null){
                                        component.find("MailingOtherState").set("v.value",'');
                                    }
                                }
                            }
                            component.find("MailingStateInput").set("v.value", states[0][melissaResult[i].Address.State]);
                            component.find("MailingzipInput").set("v.value", melissaResult[i].Address.PostalCode);
                            component.find("MailingSuiteInput").set("v.value", melissaResult[i].Address.SuiteName);
                            component.find("MailingAddress2Input").set("v.value", '');
                        }
                    }
                }  
            }
            
        }
        else
        {
            component.set("v.mailingAddressRequired", true);
            component.set("v.FFAddressRequired", false);
            
            var ffAddress = component.find('AddressFreeFormInput');
            $A.util.removeClass(ffAddress, 'slds-has-error');
        }
    },
    
    ShowInfoToReview: function(component, event, helper)
    {
        var StudentsList = component.get("v.StudentsList");
        var AccountList = '';
        var StudentsListSendToApex = '';
        var ffAddressValue = '';
        var SecConInfoRequired = false;
        var errorMessages = null;
        var errorMessagesForChild = null;
        var errorMessagesForInvalidRecords = null;
        var showPrimaryGuardianSection = component.get("v.showPrimaryGuardianSection");
        
        var priConCellPhoneInput = component.find("priConCellPhone");
        //  var phone = (priConCellPhoneInput.length > 0)?priConCellPhoneInput[0].get("v.value"):priConCellPhoneInput.get("v.value");
        var priConCellFieldValue = priConCellPhoneInput.get("v.value");
        var priConCellPhone = priConCellFieldValue.replace(/\D/g, '').slice(-10);
        
        var SecConFirstNameInput = component.find("SecConFirstName");
        var SecConFirstName = component.get("v.SecConFirstNameVal");
        var SecConLastNameInput = component.find("SecConLastName");
        var SecConLastName = component.get("v.SecConLastNameVal");
        var SecConPhoneInput = component.find("SecConPhone");
        var SecConPhoneFieldValue = component.get("v.SecConPhoneVal");
        var SecConPhone = SecConPhoneFieldValue.replace(/\D/g, '');
        var SecConRelationInput = component.find("SecConRelation");
        var SecConRelation = component.get("v.SecConRelationVal");
        
        var PriGuardianFirstNameInput = component.find("PriGuardianFirstName");
        var PriGuardianFirstName = component.get("v.PriGuardianFirstNameVal");
        var PriGuardianLastNameInput = component.find("PriGuardianLastName");
        var PriGuardianLastName = component.get("v.PriGuardianLastNameVal");
        
        var PriGuardianPhoneInput = component.find("PriGuardianPhone");
        var PriGuardianFieldValue = component.get("v.PriGuardianPhoneVal");
        var PriGuardianPhone = PriGuardianFieldValue.replace(/\D/g, '').slice(-10);
        
        var IsLookUpVisible = component.get("v.showLookUp");
        if(IsLookUpVisible == true)
        {
            var ffAddress = component.find("AddressFreeFormInput");
            ffAddressValue = ffAddress.get("v.value");
        }
        
        var mailingStreetInput = component.find("MailingStreetInput");
        var mailingStreet = mailingStreetInput.get("v.value");
        var mailingCityInput = component.find("MailingCityInput");
        var mailingCity = mailingCityInput.get("v.value");
        var mailingCountryInput = component.find("MailingCountryInput");
        var mailingCountry = mailingCountryInput.get("v.value");
        var mailingState = '';
        var mailingOtherState = '';
        var mailingZipInput = component.find("MailingzipInput");
        var mailingZip = mailingZipInput.get("v.value");
        var suite = component.find("MailingSuiteInput").get("v.value");
        var addressLine2 = component.find("MailingAddress2Input").get("v.value");
        var isManual = component.get("v.isManual");
        
        var showMailingState = component.get("v.showMailingState");
        var showMailingOtherState = component.get("v.showMailingOtherState");
        
        var iAccept = component.get("v.iAccept");
        var mAddressCheckbox = component.get("v.malingAddressCorrect");
        var UpdateAddressRequired = component.get("v.UpdateAddressRequired");
        var addressUpdate = component.get("v.addressUpdate");
        
        if(showMailingState == true)
        {
            mailingState = component.find("MailingStateInput").get("v.value");
        }
        
        if(showMailingOtherState == true)
        {
            mailingOtherState = component.find("MailingOtherState").get("v.value");
        }
        
        if(IsLookUpVisible == true)
        {
            // if address is entered manually then check for required mailing address fields
            if (isManual == true)
            {
                // if Mailing Other State/Territory is used
                if( showMailingOtherState == true)
                {
                    if(mailingStreet == '' ||  mailingCity == '' || mailingOtherState == '' || mailingCountry == '' 
                       || mailingZip == ''  || priConCellPhone == '' )
                    {
                        errorMessages  = 'You must fill in all of the required fields.'; 
                    }
                    
                    var mailingOtherStateInput = component.find("MailingOtherState");
                    
                    //is Mailing Other State field is empty?
                    if($A.util.isEmpty(mailingOtherState)) 
                    {
                        $A.util.addClass(mailingOtherStateInput, 'slds-has-error');
                    }
                }
                
                // if Mailing State is used
                if( showMailingState == true)
                {
                    if(mailingStreet == '' ||  mailingCity == '' || mailingState == '' || mailingCountry == '' 
                       || mailingZip == ''  || priConCellPhone == '')
                    {
                        errorMessages  = 'You must fill in all of the required fields.'; 
                    }
                    
                    var mailingStateInput = component.find("MailingStateInput");
                    
                    //is Mailing State field is empty?
                    if($A.util.isEmpty(mailingState)) 
                    {
                        $A.util.addClass(mailingStateInput, 'slds-has-error');
                    }
                }
                
                //is Mailing Street field is empty?
                if($A.util.isEmpty(mailingStreet)) 
                {
                    $A.util.addClass(mailingStreetInput, 'slds-has-error');
                }
                
                //is Mailing City field is empty?
                if($A.util.isEmpty(mailingCity)) 
                {
                    $A.util.addClass(mailingCityInput, 'slds-has-error');
                }
                
                //is Mailing Country field is empty?
                if($A.util.isEmpty(mailingCountry)) 
                {
                    $A.util.addClass(mailingCountryInput, 'slds-has-error');
                }
                
                //is Mailing Zip field is empty?
                if($A.util.isEmpty(mailingZip)) 
                {
                    $A.util.addClass(mailingZipInput, 'slds-has-error');
                }
                
            }
            //if address is not manual
            else
            {
                if((mailingStreet == '' ||  mailingCity == ''  || mailingCountry == '' || mailingState == '' || mailingZip == '') && ffAddressValue == '') 
                {
                    errorMessages  = 'You must fill in all of the required fields.'; 
                    
                    //is Free Form Address field is empty?
                    if($A.util.isEmpty(ffAddressValue)) 
                    {
                        component.set("v.FFAddressRequired", true);
                        $A.util.addClass(ffAddress, 'slds-has-error');
                    }
                }
                
                if(ffAddressValue != '' && (mailingStreet == '' ||  mailingCity == ''  || mailingCountry == '' || mailingState == '' || mailingZip == '') ) 
                {    
                    if(errorMessages == null)
                    {
                        errorMessages='Please make sure the address provided is complete via the address lookup box.';
                    }
                }
                
            }
            
        }
        
        // check if user check Update Address, if required
        if( addressUpdate == false && UpdateAddressRequired == true)
        {
            errorMessages='The mailing address provided is invalid. Please click the Update Address toggle to edit and provide a new mailing address.';
            
            var cb = component.find("addressUpdateCheckBox");
            $A.util.addClass(cb, 'slds-has-error');
            
        }
        
        if(errorMessages == null && priConCellFieldValue  == '' )
        {
            errorMessages  = 'You must fill in all of the required fields.'; 
            
        } 
        
        // check for primary guardian information 
        if (errorMessages == null && showPrimaryGuardianSection == true)
        {            
            if(PriGuardianFirstName  == '' ||  PriGuardianLastName  == ''  || PriGuardianFieldValue  == '' )
            {
                errorMessages  = 'You must fill in all of the required fields.'; 
            }
            
        }
        debugger;
        // check for connectivity form information  
        if (errorMessages == null){
            var controlselectAuraIds = ["Numberofpeoplelivinginthehousehold","ChildrenlivinginthehouseholdK12","Doyouhaveinternetatyourhouse","Householdusesamobilehotspot"];
            if(component.find("ChildrenhaveaccesstotheInternet")){controlselectAuraIds.push("ChildrenhaveaccesstotheInternet", "ChildrenattendingK12school");}
            if(component.find("CompanyprovidesInternet")){controlselectAuraIds.push("WhydoyoumainlyuseInternet","Deviceuseforbrowsingtheinternet","CompanyprovidesInternet", "Internetservicecostpermonth","Internetservicemeettheneeds");}
            if(component.find("Internetdoesntmeetyourneedswhy")){controlselectAuraIds.push("Internetdoesntmeetyourneedswhy");}
            if(component.find("WhyistherenoInternetinthehome")){controlselectAuraIds.push("WhyistherenoInternetinthehome");}
            
            for(var i = 0; i < controlselectAuraIds.length; i++) {
                var fieldId = controlselectAuraIds[i];
                var cmpFindFieldId = component.find(fieldId);
                var fieldValue = cmpFindFieldId.get("v.value");
                if( $A.util.isUndefinedOrNull(fieldValue) || fieldValue.trim() == '' ) {
                    $A.util.addClass(cmpFindFieldId, 'slds-has-error');
                    errorMessages  = 'You must fill in all of the required fields.'; 
                }  
                
            }
        }
        
        
        // Primary Guardian and Secondary Contact name fields validations
        if (errorMessages == null)
        {
            if(showPrimaryGuardianSection == true && (!$A.util.isEmpty(PriGuardianFirstName) || !$A.util.isEmpty(PriGuardianLastName)) )
            {
                var alphaChar = /^[a-zA-Z -]*$/;
                var FNameFormatCheck = alphaChar.test(PriGuardianFirstName).toString();
                var LNameFormatCheck = alphaChar.test(PriGuardianLastName).toString();
                
                if(FNameFormatCheck == 'false' || LNameFormatCheck == 'false')
                {
                    errorMessages='Primary Guardian name fields cannot contain special characters or numbers.';
                }
            }
            
            if(!$A.util.isEmpty(SecConFirstName) || !$A.util.isEmpty(SecConLastName)) 
            {
                var alphaChar = /^[a-zA-Z -]*$/;
                
                var FNameFormatCheck = alphaChar.test(SecConFirstName).toString();
                var LNameFormatCheck = alphaChar.test(SecConLastName).toString();
                
                if(FNameFormatCheck == 'false' || LNameFormatCheck == 'false')
                {
                    if(errorMessages == null)
                    {
                        errorMessages='Alternate Contact name fields cannot contain special characters or numbers.';
                    }
                    else
                    {
                        errorMessages +='\Alternate Contact name fields cannot contain special characters or numbers.';
                    }
                    
                }
            }
        }
        // Phone field validations
        if (errorMessages == null)
        {           
            debugger;
            if(showPrimaryGuardianSection == true && !$A.util.isEmpty(PriGuardianFieldValue) && !$A.util.isEmpty(priConCellFieldValue))
            {
                
                var numbers = /^[0-9-)(]*$/;
                var firstCharValforPriCon = priConCellPhone.charAt(0);
                var specialCharTestforPriCon	 = numbers.test(priConCellFieldValue).toString();
                
                var firstCharValforPriGuardian = PriGuardianPhone.charAt(0);
                var specialCharTestforPriGuardian	 = numbers.test(PriGuardianFieldValue).toString();
                
                if(specialCharTestforPriCon == 'false')
                {
                    errorMessages='Mobile number should not contain alphabets or special characters for primary contact.';
                }
                
                if(specialCharTestforPriGuardian == 'false')
                {
                    if(errorMessages == null)
                    {
                        errorMessages='Mobile number should not contain alphabets or special characters for primary guardian contact.';
                    }
                    else
                    {
                        errorMessages +='\nMobile number should not contain alphabets or special characters for primary guardian contact.';
                    }
                }
                else
                {
                    if(priConCellPhone.length != 10 )
                    {
                        if(errorMessages == null)
                        {
                            errorMessages='Mobile number must contain 10 digits only for primary contact.';
                        }
                        else
                        {
                            errorMessages +='\nMobile number must contain 10 digits only for primary contact.';
                        }
                    }
                    
                    if( PriGuardianPhone.length != 10)
                    {
                        if(errorMessages == null)
                        {
                            errorMessages='Mobile number must contain 10 digits only for primary guardian contact.';
                        }
                        else
                        {
                            errorMessages +='\nMobile number must contain 10 digits only for primary guardian contact.';
                        }
                    }
                    
                    if(firstCharValforPriCon == '1'  || firstCharValforPriCon == '0')
                    {
                        if(errorMessages == null)
                        {
                            errorMessages='Mobile number should not begin with 1 or 0 for primary contact.';
                        }
                        else
                        {
                            errorMessages +='\nMobile number should not begin with 1 or 0 for primary contact.';
                        }
                    }     
                    
                    if( firstCharValforPriGuardian == '1'  || firstCharValforPriGuardian == '0')
                    {
                        if(errorMessages == null)
                        {
                            errorMessages='Mobile number should not begin with 1 or 0 for primary guardian contact.';
                        }
                        else
                        {
                            errorMessages +='\nMobile number should not begin with 1 or 0 for primary guardian contact.';
                        }
                    }     
                }
                
                
            }
            else
            {
                var numbers = /^[0-9-)(]*$/;
                var firstCharVal = priConCellPhone.charAt(0)
                var specialCharTestforPriCon	 = numbers.test(priConCellFieldValue).toString();
                
                if(specialCharTestforPriCon == 'false')
                {
                    errorMessages='Mobile number should not contain alphabets or special characters for Primary Contact.';
                }
                else
                {
                    if(priConCellPhone.length != 10)
                    {
                        if(errorMessages == null)
                        {
                            errorMessages='Mobile number must contain 10 digits only for Primary Contact.';
                        }
                        else
                        {
                            errorMessages +='\nMobile number must contain 10 digits only for Primary Contact.';
                        }
                    }
                    
                    if(firstCharVal == '1'  || firstCharVal == '0')
                    {
                        if(errorMessages == null)
                        {
                            errorMessages='Mobile number should not begin with 1 or 0 for Primary Contact.';
                        }
                        else
                        {
                            errorMessages +='\nMobile number should not begin with 1 or 0 for Primary Contact.';
                        }
                    }
                }
            }
            //if Mobile field is not empty for secondary contact
            
        }
        
        if (errorMessages == null)
        {
            
            var CVCase =	component.get("v.CVCase");
            var numRow= CVCase.Children_attending_K_12_school__c;
            
            if(StudentsList.length > CVCase.Children_attending_K_12_school__c  && CVCase.Children_attending_K_12_school__c != undefined)
            {
                errorMessages='A maximum of '+numRow+' child records can be added.';
            }
            if(StudentsList.length < CVCase.Children_attending_K_12_school__c  && CVCase.Children_attending_K_12_school__c != undefined)
            {
                errorMessages='At least add '+numRow+' child records.';
            }
            
        }
        
        // check boxes validations
        if (errorMessages == null)
        {
            // check if user check I have verified that my address is correct
            if( mAddressCheckbox == false)
            {
                errorMessages='Must check the I have verified that my address is correct checkbox.';
                
                var cb = component.find("mAddressCheckBox");
                $A.util.addClass(cb, 'slds-has-error');
            }
            
        }
        
        //is Mobile field is empty?
        if($A.util.isEmpty(priConCellFieldValue) && !(addressUpdate == false && UpdateAddressRequired == true)) 
        {
            $A.util.addClass(priConCellPhoneInput, 'slds-has-error');
        }
        
        if ( showPrimaryGuardianSection == true && !(addressUpdate == false && UpdateAddressRequired == true))
        {
            //is Primary Guardian first name field is empty?
            if($A.util.isEmpty(PriGuardianFirstName)) 
            {
                $A.util.addClass(PriGuardianFirstNameInput , 'slds-has-error');
            }
            
            //is Primary Guardian last name field is empty?
            if($A.util.isEmpty(PriGuardianLastName)) 
            {
                $A.util.addClass(PriGuardianLastNameInput , 'slds-has-error');
            }
            
            //is Primary Guardian phone field is empty?
            if($A.util.isEmpty(PriGuardianFieldValue)) 
            {
                $A.util.addClass(PriGuardianPhoneInput , 'slds-has-error');
            }
            
        } 
        
        // show primary level error if any
        if(errorMessages != null)
        {
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title : 'Warning',
                message: errorMessages,
                duration:' 60000',
                key: 'info_alt',
                type: 'error',
                mode: 'dismissible'
            });
            toastEvent.fire();
        }
        
        else
        {
             if( StudentsList.length == 0)
            {    var emptyOut = [];
                 var StudentsListToReview = [];
                component.set("v.StudentsListToReview", emptyOut);
                component.set("v.mailingStreetVal", mailingStreet);
                                                       component.set("v.mailingCityVal", mailingCity);
                                                       component.set("v.mailingCountryVal", mailingCountry);
                                                       component.set("v.mailingStateVal", mailingState);
                                                       component.set("v.mailingOtherStateVal", mailingOtherState);
                                                       component.set("v.mailingZipVal", mailingZip);
                                                       component.set("v.mailingSuitVal", suite);
                                                       component.set("v.mailingAddreesL2Val", addressLine2);
                                                       
                                                       component.set("v.showReviewScreen", true);
                                                   
            }
            // check for student grid level error if grid has any record
            if( StudentsList.length > 0)
            {
                debugger;
                let CidMap = new Map();
                
                // check for empty fields
                for (var i = 0; i < StudentsList.length; i++) 
                {
                    if ( StudentsList[i].Citizen_ID__c == '' || StudentsList[i].Date_of_Birth__c == '' ) 
                    {
                        if(errorMessagesForChild == null)
                        {
                            errorMessagesForChild='Please fill in all fields or remove if not being submitted: Row ' + (i + 1) +'.\n';                      
                        }
                        else
                        {
                            errorMessagesForChild+='Please fill in all fields or remove if not being submitted: Row ' + (i + 1) +'.\n';                      
                        } 
                    }
                }
                
                // check for date of bith fields validity
                if(errorMessagesForChild == null)
                {
                    for (var i = 0; i < StudentsList.length; i++) 
                    {
                        if(!$A.util.isEmpty(StudentsList[i].Date_of_Birth__c)) 
                        {
                            //get student's age
                            var dob = new Date(StudentsList[i].Date_of_Birth__c);
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
                            var checkDateFormate=  date_regex.test(StudentsList[i].Date_of_Birth__c);  
                            
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

                                if(age > 18)
                                {
                                    if(errorMessagesForChild == null)
                                    {
                                        errorMessagesForChild='Children must be under 18 years old.\n';   
                                    }
                                     else
                                    {
                                        errorMessagesForChild +='Children must be under 18 years old.\n';
                                    }
                                }
                            }
                            
                        } 
                    }
                }
                
                // check for duplicate citizen ids validity
                if(errorMessagesForChild == null)
                {
                    for (var i = 0; i < StudentsList.length; i++) 
                    {
                        //validation for Citizen Id formate
                        if(!$A.util.isEmpty(StudentsList[i].Citizen_ID__c)) 
                        {
                            
                            if(CidMap.get(StudentsList[i].Citizen_ID__c) == undefined)
                            {
                                CidMap.set(StudentsList[i].Citizen_ID__c, i);
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
            }
            
            // check if user check My mailing address is correct
            if( iAccept == false && errorMessagesForChild == null)
            {
                errorMessages='Must check the I Accept checkbox.';
                
                
                var cb = component.find("acceptCheckBox");
                $A.util.addClass(cb, 'slds-has-error');
                
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title : 'Warning',
                    message: errorMessages,
                    duration:' 10000',
                    key: 'info_alt',
                    type: 'error',
                    mode: 'dismissible'
                });
                toastEvent.fire();
            }
        }
        //make server call to validate cititzen ids
        if (errorMessagesForChild == null && errorMessages == null )
        {
            debugger;
            if( StudentsList.length > 0)
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
                
                for (var i = 0; i < StudentsList.length; i++) 
                {
                    debugger;
                    //validation for Citizen Id format
                    if(!$A.util.isEmpty(StudentsList[i].Citizen_ID__c)) 
                    {
                        // cleaning citizen id
                        var removedAlphabet 			= 	StudentsList[i].Citizen_ID__c.replace(/[^\d.-]/g, '');
                        var removedLeadingZeros 		=	removedAlphabet.replace(/^0+/, '');
                        var removeSigns					=	removedLeadingZeros.replace(/^-+/, '');
                        var citizenId 					=	removeSigns.replace(/^0+/, '');
                        
                        StudentsListSendToApex.push({
                            'sobjectType'				: 	'Sub_Applicant__c',
                            'Citizen_ID__c'				:   citizenId,
                            'Date_of_Birth__c'			: 	StudentsList[i].Date_of_Birth__c
                            
                        });
                    }
                }
                console.log(StudentsList);
                console.log(StudentsListSendToApex);
                
              
                var action = component.get("c.validateStudentsList");
                
                action.setParams({ 
                    StudentsList		:		StudentsListSendToApex
                });
                action.setCallback(this,function(response)
                                   {
                                       var state = response.getState(); 
                                       if(state === 'SUCCESS')
                                       {
                                           var result = response.getReturnValue();
                                           
                                           var InvalidCitizenIds	 				= 	result.InvalidCitizenIds;
                                           var CitizenIdsOfAccntsWithDoDNotNull 	= 	result.CitizenIdsOfAccntsWithDoDNN;
                                           var CitizenIdsOfRelinquishedAccounts 	= 	result.CitizenIdsOfRelinquishedAccounts;
                                           AccountList					 		= 	result.accList;
                                           
                                           //for invalide citizen ids
                                           if(result.InvalidCitizenIds.length > 0)
                                           {
                                               for (var i = 0; i < InvalidCitizenIds.length; i++) 
                                               {
                                                   
                                                   for (var j = 0; j < StudentsList.length; j++) 
                                                   {
                                                       var cId  = StudentsList[j].Citizen_ID__c.includes(InvalidCitizenIds[i]);
                                                       
                                                       if( cId == true)
                                                       {
                                                           if(errorMessagesForInvalidRecords == null)
                                                           {
                                                               errorMessagesForInvalidRecords='The record for Child with Citizen ID: ' + StudentsList[j].Citizen_ID__c + ' cannot be verified.  For additional assistance, please contact support by phone at 918-453-5058 or by email at support-gadugiportal@cherokee.org.';
                                                           }
                                                           else
                                                           {
                                                               errorMessagesForInvalidRecords+="\n"+'The record for Child with Citizen ID: ' + StudentsList[j].Citizen_ID__c + ' cannot be verified.  For additional assistance, please contact support by phone at 918-453-5058 or by email at support-gadugiportal@cherokee.org.';
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
                                           
                                           
                                           //for citizen ids of accounts where DOD field is not null
                                           else if(result.CitizenIdsOfAccntsWithDoDNN.length > 0)
                                           {
                                               for (var i = 0; i < CitizenIdsOfAccntsWithDoDNotNull.length; i++) 
                                               {
                                                   for (var j = 0; j < StudentsList.length; j++) 
                                                   {
                                                       var rId  = StudentsList[j].Citizen_ID__c.includes(CitizenIdsOfAccntsWithDoDNotNull[i]);
                                                       
                                                       if( rId == true)
                                                       {
                                                           if(errorMessagesForInvalidRecords == null)
                                                           {
                                                               errorMessagesForInvalidRecords='The record for Child with Citizen ID: ' + StudentsList[j].Citizen_ID__c + ' cannot be verified.  For additional assistance, please contact support by phone at 918-453-5058 or by email at support-gadugiportal@cherokee.org.';
                                                           }
                                                           else
                                                           {
                                                               errorMessagesForInvalidRecords+="\n"+'The record for Child with Citizen ID: ' + StudentsList[j].Citizen_ID__c + ' cannot be verified.  For additional assistance, please contact support by phone at 918-453-5058 or by email at support-gadugiportal@cherokee.org.';
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
                                                       for (var j = 0; j < StudentsList.length; j++) 
                                                       {
                                                           var rId  = StudentsList[j].Citizen_ID__c.includes(CitizenIdsOfRelinquishedAccounts[i]);
                                                           
                                                           if( rId == true)
                                                           {
                                                               if(errorMessagesForInvalidRecords == null)
                                                               {
                                                                   errorMessagesForInvalidRecords='The record for Child with Citizen ID:  ' + StudentsList[j].Citizen_ID__c + ' cannot be verified.  For additional assistance, please contact support by phone at 918-453-5058 or by email at support-gadugiportal@cherokee.org.';
                                                               }
                                                               else
                                                               {
                                                                   errorMessagesForInvalidRecords+="\n"+'The record for Child with Citizen ID:  ' + StudentsList[j].Citizen_ID__c + ' cannot be verified.  For additional assistance, please contact support by phone at 918-453-5058 or by email at support-gadugiportal@cherokee.org.';
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
                                                       //hide spinner
                                                       var spinner = component.find("saveSpinner");
                                                       $A.util.addClass(spinner, "slds-hide");
                                                       //enable button
                                                       component.set("v.isActive", false);
                                                       
                                                       var emptyOut = [];
                                                       component.set("v.StudentsListToReview", emptyOut);
                                                       var StudentsListToReview = component.get("v.StudentsListToReview");
                                                       
                                                       for (var i = 0; i < AccountList.length; i++) 
                                                       {
                                                           var splitDate 	= 	 AccountList[i].Date_of_Birth__c.split('-');
                                                           var year 		= 	 splitDate[0];
                                                           var month 		=	 splitDate[1];
                                                           var day			=	 splitDate[2];
                                                           var StudentDob 	=	 month+'/'+day+'/'+year;
                                                           
                                                           
                                                           StudentsListToReview.push({
                                                               'sobjectType'				: 	'Sub_Applicant__c',
                                                               'Citizen_ID__c'				:   AccountList[i].Tribe_Id__c,
                                                               'Account__c'			    	:   AccountList[i].Id,
                                                               'Date_of_Birth__c'			: 	StudentDob,
                                                               'First_Name__c'				: 	AccountList[i].FirstName,
                                                               'Last_Name__c'				: 	AccountList[i].LastName,
                                                           });
                                                       }
                                                       
                                                       for (var i = 0; i < StudentsList.length; i++) 
                                                       {
                                                           // cleaning citizen id
                                                           var removedAlphabet 			= 	StudentsList[i].Citizen_ID__c.replace(/[^\d.-]/g, '');
                                                           var removedLeadingZeros 		=	removedAlphabet.replace(/^0+/, '');
                                                           var removeSigns				=	removedLeadingZeros.replace(/^-+/, '');
                                                           var citizenId 				=	removeSigns.replace(/^0+/, '');
                                                           
                                                           
                                                       }
                                                       
                                                       component.set("v.mailingStreetVal", mailingStreet);
                                                       component.set("v.mailingCityVal", mailingCity);
                                                       component.set("v.mailingCountryVal", mailingCountry);
                                                       component.set("v.mailingStateVal", mailingState);
                                                       component.set("v.mailingOtherStateVal", mailingOtherState);
                                                       component.set("v.mailingZipVal", mailingZip);
                                                       component.set("v.mailingSuitVal", suite);
                                                       component.set("v.mailingAddreesL2Val", addressLine2);
                                                       
                                                       component.set("v.showReviewScreen", true);
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
    
    validateOTP: function(component, event, helper)
    {
        debugger;
        component.set("v.isActiveVerify",true);
        var accid = component.get("v.accid");
        var priConCellPhoneInput = component.find("priConCellPhone");
        var priConCellPhone = priConCellPhoneInput.get("v.value"); 
        var OTPcomp = component.find("Input_OTP");
        var otp = OTPcomp.get("v.value"); 
        var errorMessages;
        
        if(otp == '')
        {
            errorMessages  = 'You must fill in the Verification code field.'; 
        }
        else if(!$A.util.isEmpty(otp)) 
        {
            var numbers = /^[0-9]*$/;
            var firstCharVal = otp.charAt(0)
            var numericTest	 = numbers.test(otp).toString();
            
            if(numericTest == 'false')
            {
                if(errorMessages == null)
                {
                    errorMessages='Verification code should not contain alphabets or special characters.';
                }
                else
                {
                    errorMessages +='\Verification code should not contain alphabets or special characters.';
                }
            }
            
            if(otp.length != 6)
            {
                if(errorMessages == null)
                {
                    errorMessages='Verification code must contain 6 digits only.';
                }
                else
                {
                    errorMessages +='\nVerification code must contain 6 digits only.';
                }
            }
        }
        if(errorMessages!=null){
            $A.util.addClass(OTPcomp, 'slds-has-error');
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title : 'Warning',
                message: errorMessages,
                duration:' 60000',
                key: 'info_alt',
                type: 'error',
                mode: 'dismissible'
            });
            toastEvent.fire();
            component.set("v.isActiveVerify",false);
        }else{
            var actionV = component.get("c.validateEnteredOTP");
            actionV.setParams({ 
                accountId				:		accid,
                otp						:		otp 
            });
            actionV.setCallback(this,function(response)
                                {
                                    debugger;
                                    var state = response.getState(); 
                                    var resp=response.getReturnValue();
                                    
                                    if(state === 'SUCCESS')
                                    {
                                        if(resp=='success'){
                                            var toastEvent = $A.get("e.force:showToast");
                                            toastEvent.setParams({
                                                title : 'Success',
                                                message: 'Verification Code Validated Successfully.',
                                                duration:' 5000',
                                                key: 'info_alt',
                                                type: 'success',
                                                mode: 'dismissible'
                                            });
                                            toastEvent.fire();
                                            component.set("v.showVerifyMobileScreen", false);
                                            component.set("v.mobileverifiedSuccess", true);
                                        }
                                        else if(resp=='wrong otp'){
                                            var toastEvent = $A.get("e.force:showToast");
                                            toastEvent.setParams({
                                                title : 'ERROR',
                                                message: 'Incorrect Verification code entered.',
                                                duration:' 5000',
                                                key: 'info_alt',
                                                type: 'error',
                                                mode: 'dismissible'
                                            }); 
                                            toastEvent.fire();
                                            $A.util.addClass(OTPcomp, 'slds-has-error');
                                        }else{
                                            var toastEvent = $A.get("e.force:showToast");
                                            toastEvent.setParams({
                                                title : 'ERROR',
                                                message: 'Incorrect Verification code entered. Verification failed.',
                                                duration:' 5000',
                                                key: 'info_alt',
                                                type: 'error',
                                                mode: 'dismissible'
                                            });
                                            toastEvent.fire();
                                            component.set("v.showVerifyMobileScreen", false);
                                        }
                                    } 
                                    if(state === 'ERROR')
                                    {                                       
                                        var error=response.getReturnValue();
                                        var toastEvent = $A.get("e.force:showToast");
                                        toastEvent.setParams({
                                            title : 'ERROR',
                                            message: error,
                                            duration:' 10000',
                                            key: 'info_alt',
                                            type: 'error',
                                            mode: 'dismissible'
                                        });
                                        toastEvent.fire();
                                        component.set("v.showVerifyMobileScreen", false);
                                    }
                                    component.set("v.isActiveVerify",false);
                                });    
            $A.enqueueAction(actionV);
        }
    },
    
    verify: function(component, event, helper){
        debugger;
        component.set("v.mobileVer",true);
        var accid = component.get("v.accid");
        var priConCellPhoneInput = component.find("priConCellPhone");
        var priConCellPhone = priConCellPhoneInput.get("v.value");   
        var errorMessages;
        if(priConCellPhone == '')
        {
            errorMessages  = 'You must fill in the Mobile field.'; 
        }
        else if(!$A.util.isEmpty(priConCellPhone)) 
        {
            var numbers = /^[0-9]*$/;
            var firstCharVal = priConCellPhone.charAt(0)
            var numericTest	 = numbers.test(priConCellPhone).toString();
            
            if(numericTest == 'false')
            {
                if(errorMessages == null)
                {
                    errorMessages='Mobile number should not contain alphabets or special characters for primary guardian contact.';
                }
                else
                {
                    errorMessages +='\nMobile number should not contain alphabets or special characters for primary guardian contact.';
                }
            }
            
            if(priConCellPhone.length != 10)
            {
                if(errorMessages == null)
                {
                    errorMessages='Mobile number must contain 10 digits only for primary guardian contact.';
                }
                else
                {
                    errorMessages +='\nMobile number must contain 10 digits only for primary guardian contact.';
                }
            }
            if(firstCharVal == '1'  || firstCharVal == '0')
            {
                if(errorMessages == null)
                {
                    errorMessages='Mobile number should not begin with 1 or 0 for primary guardian contact.';
                }
                else
                {
                    errorMessages +='\nMobile number should not begin with 1 or 0 for primary guardian contact.';
                }
            }
        }
        if(errorMessages==null){
            component.set("v.showVerifyMobileScreen",true);  
            var action = component.get("c.sendOTP");
            action.setParams({ 
                accountId				:		accid,
                Mobile					:		priConCellPhone
                
            });
            action.setCallback(this,function(response)
                               {
                                   debugger;
                                   var state = response.getState(); 
                                   if(state === 'SUCCESS')
                                   {
                                       var toastEvent = $A.get("e.force:showToast");
                                       toastEvent.setParams({
                                           title : 'Success',
                                           message: 'Verification code sent successfully.',
                                           duration:' 5000',
                                           key: 'info_alt',
                                           type: 'success',
                                           mode: 'pester'
                                       });
                                       toastEvent.fire();
                                   } 
                                   if(state === 'ERROR')
                                   {                                       
                                       var error=response.getReturnValue();
                                       var toastEvent = $A.get("e.force:showToast");
                                       toastEvent.setParams({
                                           title : 'ERROR',
                                           message: error,
                                           duration:' 10000',
                                           key: 'info_alt',
                                           type: 'error',
                                           mode: 'dismissible'
                                       });
                                       toastEvent.fire();
                                       component.set("v.showVerifyMobileScreen", false);
                                   }
                               });       
            
            $A.enqueueAction(action);
        }
        else{
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title : 'Warning',
                message: errorMessages,
                duration:' 60000',
                key: 'info_alt',
                type: 'error',
                mode: 'dismissible'
            });
            toastEvent.fire();
        }
    },
    
    save: function(component, event, helper)
    {
        debugger;
        var StudentsListToReview 		= 	component.get("v.StudentsListToReview");
        var priConCellPhone 			= 	component.get("v.PriConPhoneVal").replace(/\D/g, '');
        // var priConPhonerVerStatus		= 	component.get("v.mobileverifiedSuccess");
        
        var CVCase          			=	component.get("v.CVCase");
        
        var PriGuardianFirstName 		= 	component.get("v.PriGuardianFirstNameVal");
        var PriGuardianLastName 		= 	component.get("v.PriGuardianLastNameVal");
        var PriGuardianPhone 			= 	component.get("v.PriGuardianPhoneVal").replace(/\D/g, '');
        
        var mailingStreetInput 			= 	component.find("MailingStreetInput");
        var mailingStreet 				=	mailingStreetInput.get("v.value");
        var mailingCityInput 			= 	component.find("MailingCityInput");
        var mailingCity 				= 	mailingCityInput.get("v.value");
        var mailingCountryInput 		= 	component.find("MailingCountryInput");
        var mailingCountry 				= 	mailingCountryInput.get("v.value");
        var mailingState 				=	 '';
        var mailingOtherState 			= 	'';
        var mailingZipInput				= 	component.find("MailingzipInput");
        var mailingZip 					= 	mailingZipInput.get("v.value");
        var suite 						= 	component.find("MailingSuiteInput").get("v.value");
        var addressLine2				= 	component.find("MailingAddress2Input").get("v.value");
        var addressFreeForm 			= 	component.get("v.location");
        var isManual 					= 	component.get("v.isManual");
        var isAddressChanged 			= 	false;
        
        var melissaResult 				=	component.get("v.predictions");
        var states 						= 	component.get("v.states");
        var index						= 	component.get("v.selectedAddressIndex");
        var address 					= 	component.get("v.selectedAddress");
        
        var showMailingState 			= 	component.get("v.showMailingState");
        var showMailingOtherState 		= 	component.get("v.showMailingOtherState");
        
        if(showMailingState == true)
        {
            mailingState = component.find("MailingStateInput").get("v.value");
        }
        
        if(showMailingOtherState == true)
        {
            mailingOtherState = component.find("MailingOtherState").get("v.value");
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
        var spinner = component.find("Spinner2");
        $A.util.removeClass(spinner, "slds-hide");
        
        
        var action = component.get("c.saveCARequest");
        action.setParams({ 
            StudentsList				:		StudentsListToReview,
            mailingStreet				:		mailingStreet,
            mailingCity					:		mailingCity,
            mailingCountry				:		mailingCountry,
            mailingState				:		mailingState,
            mailingOtherState			:		mailingOtherState,
            mailingZip					:		mailingZip,
            priMobilePhone				:		priConCellPhone,
            suite						:		suite,
            addressLine2				:		addressLine2,
            addressFreeForm				:		address,
            isManual					:		isManual,
            isAddressChanged			:		isAddressChanged,
            PriGuardianFirstName		:		PriGuardianFirstName,
            PriGuardianLastName			:		PriGuardianLastName,
            PriGuardianPhone 			:		PriGuardianPhone,
            CVCase 		              	:		CVCase,
            recordId                    :       null
        });
        
        action.setCallback(this,function(response)
                           {
                               var state = response.getState(); 
                               if(state === 'SUCCESS')
                               {
                                   debugger;
                                   var result = response.getReturnValue();
                                   component.set("v.showReviewScreen", false); 
                                   component.set("v.caseId", result.Id);
                                   component.set("v.requestNumber", result.CaseNumber);
                                   component.set("v.showCAForm", false);
                                   component.set("v.showSuccessMessage", true);
                               }
                               if(state === 'ERROR')
                               {
                                   component.set("v.showReviewScreen", false);
                                   component.set("v.isActive", false);
                                   //enable button
                                   component.set("v.isActive2", false);
                                   //hide spinner
                                   var spinner = component.find("Spinner2");
                                   $A.util.addClass(spinner, "slds-hide");
                                   var err='';
                                   var errors = response.getError();
                                   errors.forEach( function (error)
                                                  {
                                                      //top-level error.  there can be only one
                                                      if (error.message)
                                                      {
                                                          err=err+' '+error.message;					
                                                      }
                                                      
                                                      //page-level errors (validation rules, etc)
                                                      if (error.pageErrors)
                                                      {
                                                          error.pageErrors.forEach( function(pageError) 
                                                                                   {
                                                                                       err=err+' '+pageError.message;					
                                                                                   });					
                                                      }
                                                      
                                                      if (error.fieldErrors)
                                                      {
                                                          //field specific errors--we'll say what the field is					
                                                          for (var fieldName in error.fieldErrors)
                                                          {
                                                              //each field could have multiple errors
                                                              error.fieldErrors[fieldName].forEach( function (errorList)
                                                                                                   {	
                                                                                                       err=err+' '+errorList.message, "Field Error on " + fieldName + " : ";						
                                                                                                   });                                
                                                          };  //end of field errors forLoop					
                                                      } //end of fieldErrors if
                                                  }); //end Errors forEach
                                   
                                   var toastEvent = $A.get("e.force:showToast");
                                   toastEvent.setParams({
                                       title : 'ERROR',
                                       message: err,
                                       duration:' 10000',
                                       key: 'info_alt',
                                       type: 'error',
                                       mode: 'dismissible'
                                   });
                                   toastEvent.fire();
                               }
                           });       
        
        $A.enqueueAction(action);
        
    },
    
    viewRequest: function(component, event, helper)
    {
        var recId = component.get("v.caseId");
        window.location.replace('/s/detail/'+recId);
    }, 
    
    handlePaste: function(component, event, helper) 
    {
        event.preventDefault(); 
    }, 
    
    handleContext: function(component, event, helper)
    {
        event.preventDefault(); 
    },
    
    hideModal: function(component, event, helper) 
    {
        component.set("v.showReviewScreen", false); 
        component.set("v.showVerifyMobileScreen", false);
    },
    editRequestModal: function(component, event, helper)
    {
        component.set("v.showSuccessMessage", false);
        component.set("v.showCAEdit", true);
    },
    onChangeSelect1: function (component, event, helper) {
        debugger;
        
        var fieldId = event.getSource().getLocalId(); 
        var fieldInput = component.find(fieldId); 
        var val = fieldInput.get('v.value'); 
        if(val=='Yes'){
            $A.enqueueAction(component.get('c.addRow')); 
        }else{
           
                 var emptyOut = [];
                component.set("v.StudentsList", emptyOut);
            
        }
        
    },
    handleGenreChange: function (component, event, helper) {
        //Get the Selected values   
        var selectedValues = event.getParam("value");
         
        //Update the Selected Values  
        component.set("v.selectedGenreList", selectedValues);
         component.set("v.CVCase.Devices_available_to_connect__c", selectedValues);
    },
})