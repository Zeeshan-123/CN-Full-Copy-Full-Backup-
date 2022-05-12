//doInit
({
    doInit : function(component, event, helper)
    {
        component.set("v.isActive", true);
        var action = component.get("c.getPicklistValues");
        action.setParams({
            
            strObjectName 	: component.get("v.getObjectName"),
            strparentField 	: component.get("v.getParentFieldAPI"),
            strchildField 	: component.get("v.getChildFieldAPI"),
            recordId 		: component.get("v.recordId")
        });
        
        action.setCallback(this,function(response)
                           {
                               var state = response.getState();
                               
                               if (state === "SUCCESS")
                               {
                                   var resultData = response.getReturnValue();
                                   //set the address on the component
                                   /*component.find("MailingStreetInput").set("v.value", resultData.RRRCase.Mailing_Street__c);
                                   component.set("v.address1", resultData.RRRCase.Mailing_Street__c);
                                   component.find("MailingCityInput").set("v.value", resultData.RRRCase.Mailing_City__c);
                                   component.set("v.city", resultData.RRRCase.Mailing_City__c);
                                   component.find("MailingzipInput").set("v.value", resultData.RRRCase.Mailing_ZipPostal_Code__c);
                                   component.set("v.zipcode", resultData.RRRCase.Mailing_ZipPostal_Code__c);
                                   component.find("MailingAddress2Input").set("v.value", resultData.RRRCase.mailing_address2__c);
                                   component.set("v.address2", resultData.RRRCase.mailing_address2__c);
                                   component.find("MailingSuiteInput").set("v.value", resultData.RRRCase.mailing_suite__c);
                                   component.set("v.suite", resultData.RRRCase.mailing_suite__c);
                                   component.set("v.isAddressChanged", resultData.RRRCase.Is_Address_Changed__c);
                                   component.set("v.isManual", resultData.RRRCase.Is_Manual_Address__c);
                                   component.set("v.location", resultData.RRRCase.Melissa_Address__c);
                                   component.set("v.selectedAddress", resultData.RRRCase.Melissa_Address__c);
                                   */
                                   if(resultData.RRRCase.Account.Age_Numeric__c<=17)
                                       component.set("v.adult", true);
                                   component.set("v.Case", resultData.RRRCase);
                                   
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
                                   
                                   // set default values for picklists
                                   window.setTimeout(
                                       $A.getCallback( function() 
                                                      {
                                                          
                                                          //component.find("MailingCountryInput").set("v.value", 'United States');
                                                          //component.set("v.country", 'United States');
                                                          var mailingCountryVal = resultData.RRRCase.Mailing_Countries__c; 
                                                          if ($A.util.isUndefined(mailingCountryVal))
                                                          {
                                                              component.set("v.country", 'United States');
                                                          }
                                                          else
                                                          {
                                                              component.find("MailingCountryInput").set("v.value", resultData.RRRCase.Mailing_Countries__c);
                                                              component.set("v.country", 'United States');
                                                          }
                                                          
                                                          $A.enqueueAction(component.get('c.ObjFieldByMailingParent'));
                                                          var mailingStateVal = resultData.RRRCase.Mailing_States__c;
                                                          var mailingOtherStateVal	=	resultData.RRRCase.Other_Mailing_State__c;
                                                          
                                                          if ($A.util.isUndefined(mailingStateVal))
                                                          {
                                                              setTimeout(function()
                                                                         {
                                                                             component.find("MailingStateInput").set("v.value", ''); 
                                                                             component.set("v.state", '');
                                                                         }, 1000);
                                                          }
                                                          else
                                                          {
                                                              setTimeout(function()
                                                                         {
                                                                             component.find("MailingStateInput").set("v.value", mailingStateVal);
                                                                             component.set("v.state", '');
                                                                         }, 1000);            
                                                          }
                                                          
                                                          if ($A.util.isUndefined(mailingOtherStateVal))
                                                          {
                                                              setTimeout(function()
                                                                         {
                                                                             if(component.find("MailingOtherState") != null){
                                                                             component.find("MailingOtherState").set("v.value", '');
                                                                             component.set("v.OState", '');
                                                                             }
                                                                         }, 1000);
                                                          }
                                                          else
                                                          {
                                                              setTimeout(function()
                                                                         {
                                                                             if(component.find("MailingOtherState") != null){
                                                                             component.find("MailingOtherState").set("v.value", mailingOtherStateVal);
                                                                             component.set("v.OState", '');
                                                                             }
                                                                         }, 1000);            
                                                          }
                                                          
                                                          
                                                          /*setTimeout(function()
                                                                     {
                                                                         component.find("MailingStateInput").set("v.value", ''); 
                                                          				 component.set("v.state", '');
                                                                     }, 1000);*/
                                                          
                                                      }));
                                   component.set("v.isActive", false);
                                   
                               }
                               
                               if (state === "ERROR")
                               {
                                   var toastEvent = $A.get("e.force:showToast");
                                   toastEvent.setParams({
                                       title : 'SUCCESS',
                                       message: response.getReturnValue(),
                                       duration:' 10000',
                                       key: 'info_alt',
                                       type: 'error',
                                       mode: 'pester'
                                   });
                                   toastEvent.fire();
                               }
                           });   
        $A.enqueueAction(action);
        
        helper.callServer(component, "c.getStates", function(response){
            component.set('v.states',response);
        });
        
    },
    
    // fetches state picklist values with respect to country picklist value
    ObjFieldByMailingParent : function(component, event, helper)
    {
        //get mailing country value
        var controllerValue = component.get("v.Country");
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
                component.set("v.State",'');
                
                // disable other state/Territory field
                component.set("v.mailingOtherStateDisabled" , true);
                // set other state/Territory field value to empty
                component.set("v.OState",'');
                
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
                component.set("v.OState",'');
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
            component.set("v.OState",'');
            
        }
    },   
    
    onBlur: function(component, event, helper)
    {
        var elem = document.getElementById(event.currentTarget.id);
        if(elem.value != '')
        {
            $A.util.removeClass(elem, 'slds-has-error');
        }
    },
    
    clearErrors : function(component, event) 
    {
        var fieldId = event.getSource().getLocalId();
        $A.util.removeClass(fieldId, 'slds-has-error');
    },
    
    clearErrorPicklist : function(component, event) 
    {
        var fieldId = event.getSource().getLocalId();
        
        if (fieldId == 'CountyResidence')
        {
            var cmpTarget = component.find('CountyResidence');
            $A.util.removeClass(cmpTarget, 'slds-has-error');
        }
        
        if (fieldId == 'MailingStateInput')
        {
            var cmpTarget = component.find('MailingStateInput');
            $A.util.removeClass(cmpTarget, 'slds-has-error');
        }
        
        if (fieldId == 'MailingCountryInput')
        {
            var cmpTarget = component.find('MailingCountryInput');
            $A.util.removeClass(cmpTarget, 'slds-has-error');
        }
        
        if (fieldId == 'GrossIncome')
        {
            var cmpTarget = component.find('GrossIncome');
            $A.util.removeClass(cmpTarget, 'slds-has-error');
        }
    },
    
    handleAddressChangenew: function(component, event, helper){
        
        //if(event.getSource().get("v.value").length > 3){
        if(event.getSource().get("v.value").length % 3 == 0){
            var params = {
                input : component.get("v.location"),
                country : component.get("v.Country")
            }
            helper.callServer(component, "c.getMelissaAddresses", function(response){
                var resp = JSON.parse(response);
                console.log(resp);
                /*if(resp.Results.length > 0){
                    component.set('v.predictions',resp.Results);
                    if(document.getElementById("addressResult") != null){
                    	document.getElementById("addressResult").style.display = "block";
                    }
                }*/
                
                if(resp.Results.length > 0){
                    component.set('v.predictions',resp.Results);
                    if(document.getElementById("addressResult") != null){
                    	document.getElementById("addressResult").style.display = "block";
                    }
                } else{
                    component.set('v.predictions',[]);
                    if(document.getElementById("addressResult") != null){
                    	document.getElementById("addressResult").style.display = "none";
                    }
                }
            }, params);
        }
    },
    handleAddressClick: function(component, event, helper){
        component.set("v.Suite", '');
        component.set("v.Ad2", '');
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
                        component.set("v.Street", melissaResult[i].Address.AddressLine1);
                        component.set("v.City", melissaResult[i].Address.City);
                        if(component.get("v.isManual") && component.get("v.Country") != "United States"){
                            component.set("v.Country", "United States");
                            //get mailing country value
                            var controllerValue = component.get("v.Country");
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
                                component.set("v.OState",'');
                            }
                        }
                        component.set("v.State", states[0][melissaResult[i].Address.State]);
                        component.set("v.Zip", melissaResult[i].Address.PostalCode);
                        component.set("v.Suite", melissaResult[i].Address.SuiteList[j]);
                    }
                }
            } 
            if(melissaResult[i].Address.SuiteCount < 1){
                if((melissaResult[i].Address.AddressLine1+(melissaResult[i].Address.SuiteName != ''?' '+melissaResult[i].Address.SuiteName:'')+', '+
                    melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                    component.set("v.Street", melissaResult[i].Address.AddressLine1);
                    component.set("v.City", melissaResult[i].Address.City);
                    if(component.get("v.isManual") && component.get("v.Country") != "United States"){
                        component.set("v.Country", "United States");
                        //get mailing country value
                        var controllerValue = component.get("v.Country");
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
                            component.set("v.OState",'');
                        }
                    }
                    component.set("v.State", states[0][melissaResult[i].Address.State]);
                    component.set("v.Zip", melissaResult[i].Address.PostalCode);
                    component.set("v.Suite", melissaResult[i].Address.SuiteName);
                }
            }
        }
        document.getElementById("addressResult").style.display = "none";
        //component.set("v.predictions", []);
    },
    
    handleToggleChange: function(component, event, helper){
        debugger;
        var melissaResult = component.get("v.predictions");
        var states = component.get("v.states");
        var index = component.get("v.selectedAddressIndex");
        var address = component.get("v.selectedAddress");
        if(!component.get("v.isManual") ){
            if(component.get("v.location") == ""){
                component.set("v.Country", 'United States');
                
                // get country state map
                var pickListMap = component.get("v.getPickListMap");//get mailing country value
                var controllerValue = component.get("v.Country");
                
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
                    component.set("v.OState",'');
                }
            }
            debugger;
            var lengthMR = melissaResult.length;
            if(lengthMR==0 || address==''){
                component.set("v.City",'');
                component.set("v.Street",'');
                component.set("v.Ad2",'');
                component.set("v.Country",'United States');
                component.set("v.Zip",'');
                component.set("v.Suite",'');
                component.set("v.State",'');
                component.set("v.OState",'');
            }
            for (var i = 0; i < melissaResult.length; i++){
                if(melissaResult[i].Address.SuiteCount > 0){
                    for (var j = 0; j < melissaResult[i].Address.SuiteCount; j++){
                        if((melissaResult[i].Address.AddressLine1+' '+melissaResult[i].Address.SuiteList[j]+', '+
                            melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                            component.set("v.Street", melissaResult[i].Address.AddressLine1);
                            component.set("v.City", melissaResult[i].Address.City);
                            if(component.get("v.Country") != "United States"){
                                component.set("v.Country", "United States");
                                //get mailing country value
                                var controllerValue = component.get("v.Country");
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
                                    component.set("v.OState",'');
                                }
                            }
                            component.set("v.State", states[0][melissaResult[i].Address.State]);
                            component.set("v.Zip", melissaResult[i].Address.PostalCode);
                            component.set("v.Suite", melissaResult[i].Address.SuiteList[j]);
                            component.set("v.Ad2", '');
                        }
                    }
                } 
                if(melissaResult[i].Address.SuiteCount < 1){
                    if((melissaResult[i].Address.AddressLine1+(melissaResult[i].Address.SuiteName != ''?' '+melissaResult[i].Address.SuiteName:'')+', '+
                        melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                        component.set("v.Street", melissaResult[i].Address.AddressLine1);
                        component.set("v.City", melissaResult[i].Address.City);
                        //component.find("MailingCountryInput").set("v.value", "United States");
                        if(component.get("v.Country") != "United States"){
                            component.set("v.Country", "United States");
                            //get mailing country value
                            var controllerValue = component.get("v.Country");
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
                                component.set("v.OState",'');
                            }
                        }
                        component.set("v.State", states[0][melissaResult[i].Address.State]);
                        component.set("v.Zip", melissaResult[i].Address.PostalCode);
                        component.set("v.Suite", melissaResult[i].Address.SuiteName);
                        component.set("v.Ad2", '');
                    }
                }
            }
        }
    },
    
    savePrimary: function(component, event, helper)
    {
        //debugger;
        component.set("v.isActive", true);
        var mailingStreetInput = component.find("MailingStreetInput");
        var mailingStreet = component.get("v.Street");
        var mailingCityInput = component.find("MailingCityInput");
        var mailingCity = component.get("v.City");
        var mailingCountryInput = component.find("MailingCountryInput");
        var mailingCountry = component.get("v.Country");
        var mailingState = '';
        var mailingOtherState = '';
        var mailingZipInput = component.find("MailingzipInput");
        var mailingZip = component.get("v.Zip");
        var suite = component.get("v.Suite");
        var addressLine2 = component.get("v.Ad2");
        var addressFreeForm = component.get("v.location");
        var isManual = component.get("v.isManual");
        var isAddressChanged = component.get("v.isAddressChanged");
        
        var melissaResult = component.get("v.predictions");
        var states = component.get("v.states");
        var index = component.get("v.selectedAddressIndex");
        var address = component.get("v.selectedAddress");
        var recordId = component.get("v.recordId");
        
        var showMailingState = component.get("v.showMailingState");
        var showMailingOtherState = component.get("v.showMailingOtherState");
        
        if(showMailingState == true)
        {
            mailingState = component.get("v.State");
        }
        
        if(showMailingOtherState == true)
        {
            mailingOtherState = component.get("v.OState");
        }
        if(mailingStreet=="" || mailingCity=="" || mailingCountry=="" || mailingZip=="" 
           || (showMailingState && mailingState=="") || (showMailingOtherState && mailingOtherState==""))
        {
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title : 'ERROR',
                message: 'Please fill in all the required fields.',
                duration:' 10000',
                key: 'info_alt',
                type: 'error',
                mode: 'dismissible'
            });
            toastEvent.fire();
            component.set("v.isActive", false);
            return;
        }
        var size=melissaResult.length;
        if(true){ //component.get("v.isManual") ){
            for (var i = 0; i < melissaResult.length; i++){
                if(melissaResult[i].Address.SuiteCount > 0){
                    for (var j = 0; j < melissaResult[i].Address.SuiteCount; j++){
                        if((melissaResult[i].Address.AddressLine1+' '+melissaResult[i].Address.SuiteList[j]+', '+
                            melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                            if(melissaResult[i].Address.AddressLine1 != component.get("v.Street") || 
                               melissaResult[i].Address.City != component.get("v.City") || 
                               states[0][melissaResult[i].Address.State] != component.get("v.State") || 
                               melissaResult[i].Address.PostalCode != component.get("v.Zip") || 
                               melissaResult[i].Address.SuiteList[j] != component.get("v.Suite") || 
                               component.get("v.Country") != "United States" || 
                               component.get("v.Ad2") != ""){
                                component.set("v.isAddressChanged", true);
                                isAddressChanged = true;
                            }else{
                                component.set("v.isAddressChanged", false);
                                isAddressChanged = false;
                            }
                        }
                    }
                } 
                if(melissaResult[i].Address.SuiteCount < 1){
                    if((melissaResult[i].Address.AddressLine1+(melissaResult[i].Address.SuiteName != ''?' '+melissaResult[i].Address.SuiteName:'')+', '+
                        melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                        if(melissaResult[i].Address.AddressLine1 != component.get("v.Street") || 
                           melissaResult[i].Address.City != component.get("v.City") || 
                           states[0][melissaResult[i].Address.State] != component.get("v.State") || 
                           melissaResult[i].Address.PostalCode != component.get("v.Zip") || 
                           melissaResult[i].Address.SuiteName != component.get("v.Suite") || 
                           component.get("v.Country") != "United States" || 
                           component.get("v.Ad2") != ""){
                            component.set("v.isAddressChanged", true);
                            isAddressChanged = true;
                        }else{
                            component.set("v.isAddressChanged", false);
                            isAddressChanged = false;
                        }
                    }
                }
            }
            if(melissaResult.length==0){
                var cse=component.get("v.Case");
                if(cse.Mailing_Street__c != component.get("v.Street") ||
                   cse.Mailing_City__c != component.get("v.City") ||
                   cse.Mailing_States__c != component.get("v.State") ||
                   cse.Mailing_ZipPostal_Code__c != component.get("v.Zip") ||
                   (cse.mailing_suite__c != component.get("v.Suite")  && component.get("v.Suite") !='') ||
                   cse.Mailing_Countries__c != component.get("v.Country") ||
                   (cse.mailing_address2__c != component.get("v.Ad2") && component.get("v.Ad2") !=''))
                {
                    component.set("v.isAddressChanged", true);
                    isAddressChanged = true;
                }
            }
        } 
        
        var action2 = component.get("c.savePRequest");
        
        
        action2.setParams({ 
            
            mailingStreet				:		mailingStreet,
            mailingCity					:		mailingCity,
            mailingCountry				:		mailingCountry,
            mailingState				:		mailingState,
            mailingOtherState			:		mailingOtherState,
            mailingZip					:		mailingZip,
            suite						:		suite,
            addressLine2				:		addressLine2,
            addressFreeForm				:		address,
            isManual					:		isManual,
            isAddressChanged			:		isAddressChanged,
            recordId					:		recordId,
        });
        
        
        action2.setCallback(this,function(response2)
                            {
                                //debugger;
                                var state = response2.getState(); 
                                if(state === 'SUCCESS')
                                {
                                    var result2 = response2.getReturnValue();
                                    component.set("v.caseId", result2.Id);
                                    component.set("v.requestNumber", result2.CaseNumber);
                                    component.set("v.showEBTForm", false);
                                    component.set("v.showSuccessMessage", true);
                                    var toastEvent = $A.get("e.force:showToast");
                                    toastEvent.setParams({
                                        title : 'Success',
                                        message: 'Applicant address updated successfully!',
                                        duration:' 10000',
                                        key: 'info_alt',
                                        type: 'Success',
                                        mode: 'dismissible'
                                    });
                                    toastEvent.fire();
                                    window.location.reload();
                                }
                                if(state === "ERROR"){
                                    var err='';
                                    var errors = response2.getError();
                                    errors.forEach( function (error){
                                        
                                        //top-level error.  there can be only one
                                        if (error.message){
                                            err=err+' '+error.message;	
                                        }
                                        
                                        //page-level errors (validation rules, etc)
                                        if (error.pageErrors){
                                            error.pageErrors.forEach( function(pageError) {
                                                err=err+' '+pageError.message;
                                            });					
                                        }
                                        
                                        if (error.fieldErrors){
                                            //field specific errors--we'll say what the field is					
                                            for (var fieldName in error.fieldErrors) {
                                                //each field could have multiple errors
                                                error.fieldErrors[fieldName].forEach( function (errorList){	
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
                                $A.get('e.force:refreshView').fire();
                                component.set("v.isActive", false);
                            });       
        
        $A.enqueueAction(action2);
        
        
        
        
    },
    saveSecondary: function(component, event, helper)
    {
        component.set("v.isActive", true);
        var mailingStreetInput = component.find("MailingStreetInput");
        var mailingStreet = component.get("v.Street");
        var mailingCityInput = component.find("MailingCityInput");
        var mailingCity = component.get("v.City");
        var mailingCountryInput = component.find("MailingCountryInput");
        var mailingCountry = component.get("v.Country");
        var mailingState = '';
        var mailingOtherState = '';
        var mailingZipInput = component.find("MailingzipInput");
        var mailingZip = component.get("v.Zip");
        var suite = component.get("v.Suite");
        var addressLine2 = component.get("v.Ad2");
        var addressFreeForm = component.get("v.location");
        var isManual = component.get("v.isManual");
        var isAddressChanged = component.get("v.isAddressChanged");
        
        var melissaResult = component.get("v.predictions");
        var states = component.get("v.states");
        var index = component.get("v.selectedAddressIndex");
        var address = component.get("v.selectedAddress");
        var recordId = component.get("v.recordId");
        
        var showMailingState = component.get("v.showMailingState");
        var showMailingOtherState = component.get("v.showMailingOtherState");
        
        if(showMailingState == true)
        {
            mailingState = component.get("v.State");
        }
        
        if(showMailingOtherState == true)
        {
            mailingOtherState = component.get("v.OState");
        }
        if(mailingStreet=="" || mailingCity=="" || mailingCountry=="" || mailingZip=="" 
           || (showMailingState && mailingState=="") || (showMailingOtherState && mailingOtherState==""))
        {
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title : 'ERROR',
                message: 'Please fill in all the required fields.',
                duration:' 10000',
                key: 'info_alt',
                type: 'error',
                mode: 'dismissible'
            });
            toastEvent.fire();
            component.set("v.isActive", false);
            return;
        }
        if(true){ //component.get("v.isManual") ){
            for (var i = 0; i < melissaResult.length; i++){
                if(melissaResult[i].Address.SuiteCount > 0){
                    for (var j = 0; j < melissaResult[i].Address.SuiteCount; j++){
                        if((melissaResult[i].Address.AddressLine1+' '+melissaResult[i].Address.SuiteList[j]+', '+
                            melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                            if(melissaResult[i].Address.AddressLine1 != component.get("v.Street") || 
                               melissaResult[i].Address.City != component.get("v.City") || 
                               states[0][melissaResult[i].Address.State] != component.get("v.State") || 
                               melissaResult[i].Address.PostalCode != component.get("v.Zip") || 
                               melissaResult[i].Address.SuiteList[j] != component.get("v.Suite") || 
                               component.get("v.Country") != "United States" || 
                               component.get("v.Ad2") != ""){
                                component.set("v.isAddressChanged", true);
                                isAddressChanged = true;
                            }else{
                                component.set("v.isAddressChanged", false);
                                isAddressChanged = false;
                            }
                        }
                    }
                } 
                if(melissaResult[i].Address.SuiteCount < 1){
                    if((melissaResult[i].Address.AddressLine1+(melissaResult[i].Address.SuiteName != ''?' '+melissaResult[i].Address.SuiteName:'')+', '+
                        melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                        if(melissaResult[i].Address.AddressLine1 != component.get("v.Street") || 
                           melissaResult[i].Address.City != component.get("v.City") || 
                           states[0][melissaResult[i].Address.State] != component.get("v.State") || 
                           melissaResult[i].Address.PostalCode != component.get("v.Zip") || 
                           melissaResult[i].Address.SuiteName != component.get("v.Suite") || 
                           component.get("v.Country") != "United States" || 
                           component.get("v.Ad2") != ""){
                            component.set("v.isAddressChanged", true);
                            isAddressChanged = true;
                        }else{
                            component.set("v.isAddressChanged", false);
                            isAddressChanged = false;
                        }
                    }
                }
            }
            if(melissaResult.length==0){
                var cse=component.get("v.Case");
                if(cse.Mailing_Street__c != component.get("v.Street") ||
                   cse.Mailing_City__c != component.get("v.City") ||
                   cse.Mailing_States__c != component.get("v.State") ||
                   cse.Mailing_ZipPostal_Code__c != component.get("v.Zip") ||
                   (cse.mailing_suite__c != component.get("v.Suite")  && component.get("v.Suite") !='') ||
                   cse.Mailing_Countries__c != component.get("v.Country") ||
                   (cse.mailing_address2__c != component.get("v.Ad2") && component.get("v.Ad2") !=''))
                {
                    component.set("v.isAddressChanged", true);
                    isAddressChanged = true;
                }
            }
        } 
        
        var action2 = component.get("c.saveSRequest");
        
        
        action2.setParams({ 
            
            mailingStreet				:		mailingStreet,
            mailingCity					:		mailingCity,
            mailingCountry				:		mailingCountry,
            mailingState				:		mailingState,
            mailingOtherState			:		mailingOtherState,
            mailingZip					:		mailingZip,
            suite						:		suite,
            addressLine2				:		addressLine2,
            addressFreeForm				:		address,
            isManual					:		isManual,
            isAddressChanged			:		isAddressChanged,
            recordId					:		recordId,
        });
        
        
        action2.setCallback(this,function(response2)
                            {
                                var state = response2.getState(); 
                                if(state === 'SUCCESS')
                                {
                                    var result2 = response2.getReturnValue();
                                    component.set("v.caseId", result2.Id);
                                    component.set("v.requestNumber", result2.CaseNumber);
                                    component.set("v.showEBTForm", false);
                                    component.set("v.showSuccessMessage", true);
                                    var toastEvent = $A.get("e.force:showToast");
                                    toastEvent.setParams({
                                        title : 'Success',
                                        message: 'Guardian address updated successfully!',
                                        duration:' 10000',
                                        key: 'info_alt',
                                        type: 'Success',
                                        mode: 'dismissible'
                                    });
                                    toastEvent.fire();
                                    window.location.reload();
                                }
                                if(state === "ERROR"){
                                    var err='';
                                    var errors = response2.getError();
                                    errors.forEach( function (error){
                                        
                                        //top-level error.  there can be only one
                                        if (error.message){
                                            err=err+' '+error.message;	
                                        }
                                        
                                        //page-level errors (validation rules, etc)
                                        if (error.pageErrors){
                                            error.pageErrors.forEach( function(pageError) {
                                                err=err+' '+pageError.message;
                                            });					
                                        }
                                        
                                        if (error.fieldErrors){
                                            //field specific errors--we'll say what the field is					
                                            for (var fieldName in error.fieldErrors) {
                                                //each field could have multiple errors
                                                error.fieldErrors[fieldName].forEach( function (errorList){	
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
                                $A.get('e.force:refreshView').fire();
                                component.set("v.isActive", false);
                            });       
        
        $A.enqueueAction(action2);
        
        
        
        
    },
    
})