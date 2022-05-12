({
	doInit : function(component, event, helper) 
    {
        var action = component.get("c.customDependablePicklist");
        action.setParams({
            strObjectName : component.get("v.getObjectName"),
            strparentField : component.get("v.getParentFieldAPI"),
            strchildField : component.get("v.getChildFieldAPI")
        });
        
        action.setCallback(this, function(response)
      {
         	var status = response.getState();
            if(status === "SUCCESS")
            {
                var pickListResponse = response.getReturnValue();                
                
                component.set("v.getPickListMap",pickListResponse.pickListMap);
                
                var pickListMap = component.get("v.getPickListMap");
               
                var parentkeys = [];
                var parentField = [];                
                
                for (var pickKey in pickListResponse.pickListMap)
                {
                    parentkeys.push(pickKey);
                }
               
                if (parentkeys != undefined && parentkeys.length > 0) 
                {
                    parentField.push('--- None ---');
                }
                
                for (var i = 0; i < parentkeys.length; i++) 
                {
                    parentField.push(parentkeys[i]);
                }  
               
                component.set("v.getParentList", parentField);
                component.set("v.getMailingParentList", parentField);
                
            }
        });
        
        $A.enqueueAction(action);
        
		// get  case/request picklist values       
        var actionOne = component.get("c.getCaseTypeValues");
        	actionOne.setCallback(this,function(response)
            {
                var state = response.getState();   
                if (state === "SUCCESS")
                {
                var result = response.getReturnValue();
            
                var mplValues = [];
                for (var i = 0; i < result.length; i++) {
                    mplValues.push({
                        label: result[i],
                        value: result[i]
                    });
                }
                component.set("v.availableReasonList", mplValues);
            }
    
        });       
        
        $A.enqueueAction(actionOne);
       
        // get  is applicant under 18 picklist values 
        var actionTwo = component.get("c.getIsUnderEighteenPicklist");
        	actionTwo.setCallback(this,function(response)
            {
                var state = response.getState();   
                if (state === "SUCCESS")
                {
                var result = response.getReturnValue();
                var plValues = [];
                for (var i = 0; i < result.length; i++) {
                    plValues.push({
                        label: result[i],
                        value: result[i]
                    });
                }
                component.set("v.isUnderEighteenList", plValues);
            }
    
        });     
        
        $A.enqueueAction(actionTwo);
        
        
       // get  Requesting Person picklist values  
           var actionThree = component.get("c.getRequestingPersonPicklist");
        	actionThree.setCallback(this,function(response)
            {
                var state = response.getState();   
                if (state === "SUCCESS")
                {
                var result = response.getReturnValue();
                var plValues = [];
                for (var i = 0; i < result.length; i++) {
                    plValues.push({
                        label: result[i],
                        value: result[i]
                    });
                }
                component.set("v.requestingPersonList", plValues);
            }
    
        });       
        $A.enqueueAction(actionThree);
        
        },
     
    //this method handles making fields required on form as per user selection in request reason picklist
      handleReasonChange : function(component, event, helper) 
    { 
		var caseType =  component.get("v.selectedReasonList");
		       
        var reasons = caseType.toString(); 
   		var reasonArray = reasons.split(',');

			// for other reason required field
            if(reasonArray.includes("Other"))
            {
                component.set("v.markOtherReasonRequired", true );
            }
            
            if(!reasonArray.includes("Other"))
            {
                component.set("v.markOtherReasonRequired", false );
            }     
        
        // for new last name required field
            if(reasonArray.includes("Marriage Last Name Change"))
            {
                component.set("v.markNewLastNameRequired", true );
            }
            
            if(!reasonArray.includes("Marriage Last Name Change"))
            {
                component.set("v.markNewLastNameRequired", false );
            }
        
          // for new email address required field
            if(reasonArray.includes("Change Email"))
            {
                component.set("v.markNewEmailRequired", true );
            }
            
            if(!reasonArray.includes("Change Email"))
            {
                component.set("v.markNewEmailRequired", false );
            }
        
          // for phone required field
            if(reasonArray.includes("Change Phone"))
            {
                component.set("v.markPhoneFieldsRequired", true );
            }
            
            if(!reasonArray.includes("Change Phone"))
            {
                component.set("v.markPhoneFieldsRequired", false );
            }
        
            // for physical address required fields
            if(reasonArray.includes("Change Physical Address"))
            {
                component.set("v.physicalAddressRequired", true );
            }
            
            if(!reasonArray.includes("Change Physical Address"))
            {
                component.set("v.physicalAddressRequired", false );
            }
         
         // for mailing address required fields
            if(reasonArray.includes("Change Mailing Address"))
            {
                component.set("v.mailingAddressRequired", true );
            }
            
            if(!reasonArray.includes("Change Mailing Address"))
            {
                component.set("v.mailingAddressRequired", false );
            }
        
    },
    
    
    // submit case request
      submitForm : function(component, event, helper) 
    { 
  		var errorMessages = null;
        var requiredFields = $A.get("$Label.c.CommunityFillRequiredFields");
        
        var caseType =  component.get("v.selectedReasonList");
   		
        var newName = component.find("newName").get('v.value');
        var newEmail = component.find("newEmail").get('v.value');
        var newHomePhone = component.find("newHomePhone").get('v.value');
        var newMobilePhone = component.find("newMobilePhone").get('v.value');
        var otherReason = component.find("otherReason").get('v.value');
        
        
        var physicalAddress = component.find("PhysicalStreetInput").get("v.value");
        var physicalCity = component.find("PhysicalCityInput").get("v.value");
        var physicalState = component.find("PhysicalStateInput").get("v.value");
        var physicalCounty = component.find("physicalCounty").get("v.value");
        var physicalZip = component.find("PhysicalzipInput").get("v.value");
        var physicalCountry = component.find("PhysicalCountryInput").get("v.value");  
        
        var mailingAddress = component.find("MailingStreetInput").get("v.value");
        var mailingCity = component.find("MailingCityInput").get("v.value");
        var mailingState = component.find("MailingStateInput").get("v.value");
        var mailingCounty = component.find("mailingCounty").get("v.value");
        var mailingZip = component.find("MailingzipInput").get("v.value");
        var mailingCountry = component.find("MailingCountryInput").get("v.value");
        
        var yesNo = component.find("yN").get("v.value");
        var rPerson = component.find("requestingPerson").get("v.value");
        var iAccept = component.get("v.iAccept");
        
        var physicalAddressRequiredField = component.get("v.physicalAddressRequired");
        var mailingAddressRequiredField = component.get("v.mailingAddressRequired");	
        var markNewLastNameRequiredField = component.get("v.markNewLastNameRequired");
		var markNewEmailRequiredField = component.get("v.markNewEmailRequired");	
        var markPhoneRequiredField = component.get("v.markPhoneFieldsRequired"); 
        var markOtherReasonRequiredField = component.get("v.markOtherReasonRequired"); 
        
         // Store Regular Expression
        var regExpEmailformat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
		var validEmailRequired = $A.get("$Label.c.Community_InvalidEmailMessages");
       
        // if case/request reason field is empty
        if($A.util.isEmpty(caseType) )
            {
              errorMessages = requiredFields;  
            }
        
         // if any required physical address field is required and empty
        if( physicalAddressRequiredField == true)
        {
            if($A.util.isEmpty(physicalAddress) || $A.util.isEmpty(physicalCity) || $A.util.isEmpty(physicalState) 
              || $A.util.isEmpty(physicalZip) || $A.util.isEmpty(physicalCountry))
            {
              errorMessages = requiredFields;  
            }
        }
        
        // if any required mailing address field is required and empty
        if( mailingAddressRequiredField == true)
        {
            if($A.util.isEmpty(mailingAddress) || $A.util.isEmpty(mailingCity) || $A.util.isEmpty(mailingState) 
              || $A.util.isEmpty(mailingZip) || $A.util.isEmpty(mailingCountry))
            {
              errorMessages = requiredFields;  
            }
        }
        
       // if new last name field is required and empty
         if( markNewLastNameRequiredField == true)
        {
        	 if($A.util.isEmpty(newName) )
            {
              errorMessages = requiredFields;  
            }
        }
        
        //is email address field is required and empty
         if( markNewEmailRequiredField == true)
        {
        	 if($A.util.isEmpty(newEmail) )
            {
              errorMessages = requiredFields;  
            }
        }
        
          //if email address formate is not valid
        if(!$A.util.isEmpty(newEmail))
        {
           if(!newEmail.match(regExpEmailformat))
           {
               if(errorMessages == null)
            {
                errorMessages=validEmailRequired;
            }
            else
            {
                errorMessages +=" "+validEmailRequired;
            }
               
            }
       
        }
        
          //if other reason field is required and empty
           if( markOtherReasonRequiredField == true)
        {
        	 if($A.util.isEmpty(otherReason) )
            {
              errorMessages = requiredFields;  
            }
        }
        
         //if request reason is change phone then one phone number field must be filled
         if( markPhoneRequiredField == true)
        {
            if($A.util.isEmpty(newHomePhone) && $A.util.isEmpty(newMobilePhone))
            {
             if(errorMessages == null)
            {
                errorMessages='Fill New Home Phone or New Mobile Phone field.';
            }
            else
            {
            	errorMessages +=" "+'Fill New Home Phone or New Mobile Phone field.';
            }
            }
        }
        
         if($A.util.isEmpty(rPerson) )
            {
              errorMessages = requiredFields;  
            }
        
          if( iAccept == false)
          {
               if(errorMessages == null)
            {
                errorMessages='Must check the I Accept checkbox.';
            }
            else
            {
            	errorMessages +=" "+'Must check the I Accept checkbox.';
            }
          }
        
        
         // is there any error message?
        if(errorMessages != null)
        {
            var toastEvent = $A.get("e.force:showToast");
        	toastEvent.setParams({
                        title : 'Warning',
                        message: errorMessages,
                        duration:' 3000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'dismissible'
                    });
                   toastEvent.fire();
        }
        
      // if no error then make server call 
        else
        { 
            component.set("v.isActive", true);
                //show spinner
       		helper.showSpinner(component); 
            var action = component.get("c.createCase");
            action.setParams({ 
                
                caseType		: caseType, 
                otherReason		: otherReason,
                newName 		: newName,
                newHomePhone	: newHomePhone,
                newMobilePhone	: newMobilePhone,
                newEmail		: newEmail,
                physicalStreet  : physicalAddress,
                physicalCity	: physicalCity,
                physicalState 	: physicalState,
                physicalCounty	: physicalCounty,
                physicalZip 	: physicalZip,
                physicalCountry	: physicalCountry,
                mailingStreet   : mailingAddress,
                mailingCity		: mailingCity,
                mailingState 	: mailingState,
                mailingCounty	: mailingCounty,
                mailingZip 		: mailingZip,
                mailingCountry	: mailingCountry,
                yesNo  			: yesNo,
                rPerson			: rPerson
                
            });
            
            
        	action.setCallback(this,function(response)
            {
                var state = response.getState();  
               if(state === 'SUCCESS')
                {
              //hide spinner
              helper.hideSpinner(component); 
              //set apex return record id to parentId attribute
              component.set('v.parentId',response.getReturnValue());
              // check in under 18 picklist value is yes then show the attachment modal
                    if(yesNo == 'Yes')
                    {
                	 component.set("v.ShowFileModal", true);    
                    }
              // call helper method to end request
                    else
                    {
                       helper.endRequest(component, event, helper);
                    }
          
                }
                
          if(state === 'ERROR')
                {
            var error=response.getReturnValue();
            var toastEvent = $A.get("e.force:showToast");
        	toastEvent.setParams({
                        title : 'ERROR',
                        message: error,
                        duration:' 3000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'dismissible'
                    });
                   toastEvent.fire();
                }
   
        });       
        $A.enqueueAction(action);
        }
        
    
    },
    
    // called by onuploadfinished attribute of lightning file upload
       addFiles: function(component, event, helper)
    {
      helper.endRequest(component, event, helper);
   },

    // called by finish button on files modal
    endRequestWithOutFiles: function(component, event, helper)
    {
      helper.endRequest(component, event, helper);
   },
    
    
 ObjFieldByPhysicalParent : function(component, event, helper)
    {
    	var controllerValue = component.find("PhysicalCountryInput").get("v.value");
        var pickListMap = component.get("v.getPickListMap");
         
        if (controllerValue != '--- None ---') 
        {             
            var childValues = pickListMap[controllerValue];            
            var childValueList = [];
            childValueList.push('--- None ---');
            for (var i = 0; i < childValues.length; i++)
            {
                childValueList.push(childValues[i]);
            }
            
            component.set("v.getChildList", childValueList);
            
            if(childValues.length > 0)
            {
                component.set("v.getDisabledChildField" , false);  
            }
            else
            {
                component.set("v.getDisabledChildField" , true); 
            }
            
        } 
        else 
        {
            component.set("v.getChildList", ['--- None ---']);
            component.set("v.getDisabledChildField" , true);
        }
	},   
    
     ObjFieldByMailingParent : function(component, event, helper)
    {
    	var controllerValue = component.find("MailingCountryInput").get("v.value");
        var pickListMap = component.get("v.getPickListMap");
         
        if (controllerValue != '--- None ---') 
        {             
            var childValues = pickListMap[controllerValue];            
            var childValueList = [];
            childValueList.push('--- None ---');
            for (var i = 0; i < childValues.length; i++)
            {
                childValueList.push(childValues[i]);
            }
            
            component.set("v.getMailingChildList", childValueList);
            
            if(childValues.length > 0)
            {
                component.set("v.getMailingDisabledChildField" , false);  
            }
            else
            {
                component.set("v.getMailingDisabledChildField" , true); 
            }
            
        } 
        else 
        {
            component.set("v.getMailingChildList", ['--- None ---']);
            component.set("v.getMailingDisabledChildField" , true);
        }
	}       
	
})