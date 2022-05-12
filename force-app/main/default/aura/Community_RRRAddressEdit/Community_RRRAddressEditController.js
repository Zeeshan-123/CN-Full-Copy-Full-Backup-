({
	 doInit : function(component, event, helper) 
    {
        var  IsLNameCorrectionReq = component.get("v.IsLNameCorrectionReq");
        var  IsAddressCorrectionReq = component.get("v.IsAddressCorrectionReq");
        var  caseID = component.get("v.caseId");
        
        var action = component.get("c.getData");
        action.setParams({
                                            
                    strObjectName 			: component.get("v.getObjectName"),
                    strparentField 			: component.get("v.getParentFieldAPI"),
                    strchildField 			: component.get("v.getChildFieldAPI"),
            		IsAddressCorrectionReq 	: component.get("v.IsAddressCorrectionReq"),
            		caseId 	: caseID
                                            
       });
                 
       action.setCallback(this,function(response)
        {
            var state = response.getState();
            
            if (state === "SUCCESS")
            {
                debugger;
                var HHMrecords = [];
                var resultData = response.getReturnValue();
                component.set("v.caseId", resultData.RRRCase.Id);
                
                // format primary contact/applicant date of birth 
                var splitDate = resultData.acnt.Date_of_Birth__c.split('-');
                var year = splitDate[0];
                var month = splitDate[1];
                var day = splitDate[2];
                var uDob = month+'/'+day+'/'+year;
                
                if(IsLNameCorrectionReq == true)
                {
                    // set HH member records
                    if(!$A.util.isUndefined(resultData.RRRCase.Household_Members__r))
                    {
                        HHMrecords = resultData.RRRCase.Household_Members__r; 
                    }
                    
                    if(HHMrecords.length > 0)
                    {
                        var HMlist = component.get("v.HMlist");
                        for (var i = 0; i < HHMrecords.length; i++) 
                        {
                            // HH Members record where name correction is required excluding the applicant record
                            if(HHMrecords[i].Status__c == 'NAME CORRECTION REQUIRED'  && HHMrecords[i].Citizen_Id__c != resultData.RRRCase.Citizen_ID__c)
                            {
                               
                                var HmDob = HHMrecords[i].Date_of_Birth__c;	
                                var splitDate = HmDob.split('-');
                                var year = splitDate[0];
                                var month = splitDate[1];
                                var day = splitDate[2];
                                
                                HHMrecords[i].Date_of_Birth__c = month+'/'+day+'/'+year;
                                
                                HMlist.push({
                                    'sobjectType'			: 	'Household_Member__c',
                                    'Id'					: 	HHMrecords[i].Id,
                                    'First_Name__c'			: 	HHMrecords[i].First_Name__c,
                                    'Last_Name__c'			: 	HHMrecords[i].Last_Name__c,
                                    'Citizen_Id__c'			:   HHMrecords[i].Citizen_Id__c,
                                    'Date_of_Birth__c'		: 	HHMrecords[i].Date_of_Birth__c,
                                    'Status__c'				:	HHMrecords[i].Status__c
                                    
                                });
                            }
                            //if name correction is required for applicant
                            if(HHMrecords[i].Status__c == 'NAME CORRECTION REQUIRED' && HHMrecords[i].Citizen_Id__c == resultData.RRRCase.Citizen_ID__c)
                            {
                                component.set("v.disableNameField", false);
                            }
                        }
                        
                        if(HMlist.length > 0)
                        {
                            component.set("v.showHHMemberTable", true);
                        }
                        
                    } 
                }
  
                
                // set primary information by default
                component.find("priConCellPhone").set("v.value", resultData.RRRCase.Ebt_Mobile_Phone__c);
                component.find("priConFirstName").set("v.value", resultData.acnt.FirstName);
                component.find("priConMiddleName").set("v.value", resultData.acnt.Middle_Name__c);
                component.find("priConLastName").set("v.value", resultData.RRRCase.Primary_Contact_Last_Name__c);
                component.find("RegID").set("v.value", resultData.acnt.Tribe_Id__c);
                component.find("priConEmail").set("v.value", resultData.userEmail);
                component.find("priConDob").set("v.value", uDob);
                
                if(IsAddressCorrectionReq == true)
                {
                    component.set("v.getPickListMap",resultData.pickListMap);
                    
                    var pickListMap = component.get("v.getPickListMap");
                    var parentkeys = [];
                    var parentField = [];                
                    
                    for (var pickKey in resultData.pickListMap)
                    {
                        parentkeys.push(pickKey);
                    }
                    
                    for (var i = 0; i < parentkeys.length; i++) 
                    {
                        parentField.push(parentkeys[i]);
                    }  
                    
                    component.set("v.getMailingParentList", parentField);
                    
                    //hide spinner
                    var spinner = component.find("fSpinner");
                    $A.util.addClass(spinner, "slds-hide");
                    
                    // set default values for picklists
                    window.setTimeout(
                        $A.getCallback( function() 
                                       {
                                           component.find("MailingCountryInput").set("v.value", 'United States');
                                           $A.enqueueAction(component.get('c.ObjFieldByMailingParent'));
                                       }));
                    component.set('v.states',resultData.statesMap);
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

                // disable other state/Territory field
                component.set("v.mailingOtherStateDisabled" , true);
                 // set other state/Territory field value to empty
                component.find("MailingOtherState").set("v.value",'');

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
    
    characterCheck: function(component, event, helper)
    {
        var inputValue = event.which;
        if(!(inputValue >= 65 && inputValue <= 90 || inputValue == 45 || (inputValue >= 97 && inputValue <= 122)) && (inputValue != 32 && inputValue != 0))
        {
            event.preventDefault(); 
        }
    },

    handleAddressChange: function(component, event, helper){
        if(event.getSource().get("v.value").length % 3 == 0){
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
    
    handleAddressClick: function(component, event, helper){
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
    
    validateData: function(component, event, helper)
    {
        debugger;
        var errorMessages = null;
        var IsAddressCorrectionReq	= component.get("v.IsAddressCorrectionReq");
        var disableNameField 		= component.get("v.disableNameField");
        var HMlist					= 	component.get("v.HMlist");
        
        // if it's address update request
        if(IsAddressCorrectionReq == true)
        {
            var iAccept = component.get("v.iAccept");
            var ffAddress = component.find("AddressFreeFormInput");
            var ffAddressValue = ffAddress.get("v.value");
            
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
            var addressFreeForm = component.get("v.location");
            var isManual = component.get("v.isManual");
            var isAddressChanged = false;
            
            var melissaResult = component.get("v.predictions");
            var states = component.get("v.states");
            var index = component.get("v.selectedAddressIndex");
            var address = component.get("v.selectedAddress");
            
            var showMailingState = component.get("v.showMailingState");
            var showMailingOtherState = component.get("v.showMailingOtherState");  
            
            if(showMailingState == true)
            {
                mailingState = component.find("MailingStateInput").get("v.value");
            }
            
            if(showMailingOtherState == true)
            {
                mailingOtherState = component.find("MailingOtherState").get("v.value");
            }
            
            // if address is entered manually then check for required mailing address fields
            if (isManual == true)
            {
                // if Mailing Other State/Territory is used
                if( showMailingOtherState == true)
                {
                    if(mailingStreet == '' ||  mailingCity == '' || mailingOtherState == '' || mailingCountry == ''  || mailingZip == '' )
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
                    if(mailingStreet == '' ||  mailingCity == '' || mailingState == '' || mailingCountry == '' || mailingZip == '' )
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
            else
            {
                if((mailingStreet == '' ||  mailingCity == ''  || mailingCountry == '' || mailingState == '' || $A.util.isUndefined(mailingState)  || mailingZip == '') && ffAddressValue == '') 
                {
                    errorMessages  = 'You must fill in all of the required fields.'; 
                    
                    //is Free Form Address field is empty?
                    if($A.util.isEmpty(ffAddressValue)) 
                    {
                        component.set("v.FFAddressRequired", true);
                        $A.util.addClass(ffAddress, 'slds-has-error');
                    }
                }
                
                if(ffAddressValue != '' && (mailingStreet == '' ||  mailingCity == ''  || mailingCountry == '' || mailingState == ''  || $A.util.isUndefined(mailingState)  || mailingZip == '') ) 
                {    
                    if(errorMessages == null)
                    {
                        errorMessages='Please make sure the address provided is complete via the address lookup box.';
                    }
                }
                
            }
            
            // check if user check My mailing address is correct
            if( iAccept == false && errorMessages == null)
            {
                errorMessages='Must check the My mailing address is correct checkbox.';
                
                var cb = component.find("acceptCheckBox");
                $A.util.addClass(cb, 'slds-has-error');
            }
        }
		 // if it's name update request
        if (disableNameField == false)
        {
            var applicantLNameInput = component.find("priConLastName");
            var applicantLName = applicantLNameInput.get("v.value");
            
            if( applicantLName =='')
            {
                errorMessages  = 'Primary contact Last Name is a required field.'; 
                
                $A.util.addClass(applicantLNameInput, 'slds-has-error');
            }
            
            //is Applicant Last name is not empty
            if(!$A.util.isEmpty(applicantLName)) 
            {
                var alphaChar = /^[a-zA-Z -]*$/;
                var nameFormatCheck = alphaChar.test(applicantLName).toString();
                
                if(nameFormatCheck == 'false')
                {
                    errorMessages='Primary contact Last Name cannot contain special characters or numbers.';
                }
            }   
                if( errorMessages == null)
                {
                    // check for HH Members record errors if table has any record
                    if( HMlist.length > 0)
                    {                        
                        // check for empty fields
                        for (var i = 0; i < HMlist.length; i++) 
                        {
                            if ( HMlist[i].Last_Name__c == '' ) 
                            {
                                if(errorMessages == null)
                                {
                                    errorMessages='Last name field missing: Row ' + (i + 1) +'.\n';                      
                                }
                                else
                                {
                                    errorMessages+='Last name field missing: Row ' + (i + 1) +'.\n';                      
                                } 
                            }
                        }
                        
                        // check for last name field validity
                        if(errorMessages == null)
                        {
                            for (var i = 0; i < HMlist.length; i++) 
                            {
                                if(!$A.util.isEmpty(HMlist[i].Last_Name__c)) 
                                {
                                    var alphaChar = /^[a-zA-Z -]*$/;
                                    var nameFormatCheck = alphaChar.test(HMlist[i].Last_Name__c).toString();
                                    
                                    if(nameFormatCheck == 'false')
                                    {
                                        if(errorMessages == null)
                                        {
                                            errorMessages='Last Name of HH member cannot contain special characters or numbers: Row ' + (i + 1)+'.\n';
                                        }
                                        else
                                        {
                                            errorMessages +='Last Name of HH member cannot contain special characters or numbers: Row ' + (i + 1)+'.\n';
                                        }  
                                    }
                                }
                            }
                        }
                        
                    }
                }
        }
       
        // show primary contact level error if any
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
		// make server call
        else
        {
             component.set("v.showCDB", true);
        }
      
    },
    
    hideModal: function(component, event, helper) 
    {
        component.set("v.showCDB", false); 
    },
    
    save: function(component, event, helper)
    {
        debugger;
        var IsAddressCorrectionReq = component.get("v.IsAddressCorrectionReq");
        var disableNameField = component.get("v.disableNameField");
        
        //disable save button
        component.set("v.isActive2", true);
        //show spinner
        var spinner = component.find("Spinner2");
        $A.util.removeClass(spinner, "slds-hide");
        
        if(IsAddressCorrectionReq == true)
        {
            helper.updateAddressOnRequest(component, event);
        }
        else
        {
            helper.updateNameOnRequest(component, event);
        }
        
    },
        
})