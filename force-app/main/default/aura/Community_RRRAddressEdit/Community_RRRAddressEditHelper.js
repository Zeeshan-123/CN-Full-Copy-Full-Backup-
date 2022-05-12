({
	 // state ISO code
       callServer : function(component,method,callback,params)
    {
        var action = component.get(method);
        if (params)
        {        
            action.setParams(params);
        }
        
        action.setCallback(this,function(response) 
       {            
            var state = response.getState();
            if (state === "SUCCESS") 
            { 
                // pass returned value to callback function
                callback.call(this,response.getReturnValue());   
            }
           else if (state === "ERROR") 
           {
                // generic error handler
                var errors = response.getError();
                if (errors) 
                {
                    console.log("Errors", errors);
                    if (errors[0] && errors[0].message) 
                    {
                        throw new Error("Error" + errors[0].message);
                    }
                } 
               else 
               {
                    throw new Error("Unknown Error");
               }
            }
        });
        
        $A.enqueueAction(action);
    },
    
    updateAddressOnRequest: function(component, event, helper)
    {
        debugger;
        var requestId = component.get("v.caseId");
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
        
        var action = component.get("c.updateAddress");
        
        action.setParams({ 
            requestId					:		requestId,
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
            isAddressChanged			:		isAddressChanged
        });
                                               
        action.setCallback(this,function(response)
                           {
                               var state = response.getState(); 
                               if(state === 'SUCCESS')
                               {
                                   var toastEvent = $A.get("e.force:showToast");
                                   toastEvent.setParams({
                                       title : 'Success',
                                       message: 'Address Updated Successfully.',
                                       duration:' 5000',
                                       key: 'info_alt',
                                       type: 'success',
                                       mode: 'pester'
                                   });
                                   toastEvent.fire();
                                   
                                   window.location.replace('/s/covid19-assistance');
                               } 
                               if(state === 'ERROR')
                               {
                                   //enable button
                                   component.set("v.isActive", false);
                                   //hide spinner
                                   var spinner = component.find("saveSpinner");
                                   $A.util.addClass(spinner, "slds-hide");
                                   
                                   alert('Unknown Error '+response.getReturnValue());
                                   
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
                               }
                           });       
        
        $A.enqueueAction(action);

    },
    
     updateNameOnRequest: function(component, event, helper)
    {
        debugger;
        var HMlist					= 	component.get("v.HMlist");
        var requestId 				= 	component.get("v.caseId");
        var IsApplicantLNUpdated	= 	false;
        var applicantCitizenId		= 	component.find("RegID").get("v.value");
        var applicantLName 			= 	component.find("priConLastName").get("v.value");
       
        if(!component.get("v.disableNameField"))
        {
            IsApplicantLNUpdated = true;
        }
    
        var action = component.get("c.updateName");
        
        action.setParams({ 
            requestId				:		requestId,
            HMlist					:		HMlist,
            applicantLName			:		applicantLName,
            IsApplicantLNUpdated	:		IsApplicantLNUpdated,
            applicantCitizenId  	:		applicantCitizenId
            
           
        });
                                               
        action.setCallback(this,function(response)
          {
              var state = response.getState(); 
              if(state === 'SUCCESS')
              {
                  var toastEvent = $A.get("e.force:showToast");
                  toastEvent.setParams({
                      title : 'Success',
                      message: 'Name Updated Successfully.',
                      duration:' 5000',
                      key: 'info_alt',
                      type: 'success',
                      mode: 'pester'
                  });
                  toastEvent.fire();
                  
                  window.location.replace('/s/covid19-assistance');
              } 
              if(state === 'ERROR')
              {
                  //enable button
                  component.set("v.isActive2", false);
                  //hide spinner
                  var spinner = component.find("Spinner2");
                  $A.util.addClass(spinner, "slds-hide");
                  
                  alert('Unknown Error '+response.getReturnValue());
                  
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
              }
          });       
        
        $A.enqueueAction(action);

    },
})