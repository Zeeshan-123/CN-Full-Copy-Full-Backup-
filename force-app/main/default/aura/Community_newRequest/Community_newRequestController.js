({
    doInit : function(component, event, helper) {
        var action = component.get("c.getData");
        action.setCallback(this, function(response) {
            debugger;
            var status = response.getState();
            if(status === "SUCCESS") {
                var resultData = response.getReturnValue();
               /* 
                var optionsMap = [];
                var optionsMapData = resultData.requestReasons;
                for(var key in optionsMapData)
                {
                    optionsMap.push({value:optionsMapData[key], key:key});
                }
                component.set("v.availableReasonList", optionsMap);
                */
                                
                var requestingPersonListMap = [];
                var requestingPersonListMapData = resultData.requestingPerson;
                for(var key in requestingPersonListMapData){
                    requestingPersonListMap.push({value:requestingPersonListMapData[key], key:key});
                }
                component.set("v.requestingPersonList", requestingPersonListMap);
                
                var isUnderEighteenListMap = [];
                var isUnderEighteenListMapData = resultData.IsUnderEighteen;
                for(var key in isUnderEighteenListMapData) {
                    isUnderEighteenListMap.push({value:isUnderEighteenListMapData[key], key:key});
                }
                component.set("v.isUnderEighteenList", isUnderEighteenListMap);
            }
            else if (status == 'ERROR'){
                component.set("v.isLoading", false);
                let errors = response.getError();
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title : 'SUCCESS',
                    message: errors,
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'error',
                    mode: 'pester'
                });
                toastEvent.fire();
            }
        });
        
        $A.enqueueAction(action);
    },
        
    handleReasonChange : function(component, event, helper)  { 
        var  caseType = component.find("selectReason").get("v.value");            
        var reasons = caseType.toString(); 
        var reasonArray = reasons.split(',');

        // for other reason required field
        if(reasonArray.includes("Other"))
            component.set("v.markOtherReasonRequired", true );
        
        if(!reasonArray.includes("Other"))
            component.set("v.markOtherReasonRequired", false );

        // for new email address required field
        if(reasonArray.includes("Change Email"))
            component.set("v.markNewEmailRequired", true );
        
        if(!reasonArray.includes("Change Email"))
            component.set("v.markNewEmailRequired", false );
    },
    
    clearError : function(component, event)   {
        var fieldId = event.getSource().getLocalId();
        var fieldInput = component.find(fieldId);
        var fieldValue = fieldInput.get("v.value");
        
        if(fieldValue != '')
            $A.util.removeClass(fieldInput, 'slds-has-error');
    },
    
    // submit case request
    submitForm : function(component, event, helper){ 
        debugger;
        var errorMessages = null;
        var caseTypeInput = component.find("selectReason");
        var caseType = caseTypeInput.get("v.value");
        var requiredFields = $A.get("$Label.c.CommunityFillRequiredFields");
       
        if(component.find("newEmail") != null){
            var newEmailInput = component.find("newEmail");
            var newEmail = newEmailInput.get('v.value');
        }
        
        if(component.find("otherReason") != null)  {
            var otherReasonInput = component.find("otherReason");
            var otherReason = otherReasonInput.get('v.value');
        }

        var yesNo = component.find("yN").get("v.value");
        var rPersonInput = component.find("requestingPerson");
        var rPerson = rPersonInput.get("v.value");
        var iAccept = component.get("v.iAccept");
        
        var markNewEmailRequiredField = component.get("v.markNewEmailRequired");	
        var markOtherReasonRequiredField = component.get("v.markOtherReasonRequired"); 
                
        // Store Regular Expression
        var regExpEmailformat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
        var validEmailRequired = $A.get("$Label.c.Community_InvalidEmailMessages");
        
        // if case/request reason field is empty
        if($A.util.isEmpty(caseType) )  {
            errorMessages = requiredFields;  
            $A.util.addClass(caseTypeInput, 'slds-has-error');
        }

        //is email address field is required and empty
        if( markNewEmailRequiredField == true) {
            if($A.util.isEmpty(newEmail) ) {
                errorMessages = requiredFields;  
                $A.util.addClass(newEmailInput, 'slds-has-error');
            }
        }
        
        //if email address formate is not valid
        if(!$A.util.isEmpty(newEmail)) {
            if(!newEmail.match(regExpEmailformat)) {
                if(errorMessages == null)
                    errorMessages=validEmailRequired;
                else
                    errorMessages +="\n"+validEmailRequired;
            }
        }
        
        //if other reason field is required and empty
        if( markOtherReasonRequiredField == true) {
            if($A.util.isEmpty(otherReason) ) {
                errorMessages = requiredFields;  
                $A.util.addClass(otherReasonInput, 'slds-has-error');
            }
        }
        
        if($A.util.isEmpty(rPerson) ) {
            errorMessages = requiredFields;  
            $A.util.addClass(rPersonInput, 'slds-has-error');
        }
        
        if( iAccept == false) {
            if(errorMessages == null)
                errorMessages='Must check the I Accept checkbox.';
            else
                errorMessages +="\n"+'Must check the I Accept checkbox.';
            
            var cb = component.find("acceptCheckBox");
            $A.util.addClass(cb, 'slds-has-error');
        }
        
        
        // is there any error message?
        if(errorMessages != null) {
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
        else {  
            debugger;
            component.set("v.isActive", true);
            //show spinner
            helper.showSpinner(component);
                       
            var action = component.get("c.createCase");
            action.setParams({ 
                caseType			 : 		caseType, 
                otherReason			 :		otherReason,
                newEmail		 	 : 		newEmail,
                yesNo  				 : 		yesNo,
                rPerson				 :		rPerson
                
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
    
    
    handlePaste: function(component, event, helper) 
    {
        event.preventDefault(); 
    }, 
    
    handleContext: function(component, event, helper)
    {
   		 event.preventDefault(); 
	},
    
})