({
    doInit : function(component, event) 
    {
      		//get user email
        	var action = component.get("c.getUserInfo");
        	action.setCallback(this,function(response)
            {
            
 			var state = response.getState();
             if (state === "SUCCESS")
             {
               var resultData = response.getReturnValue();
               component.set("v.currentEmail",resultData.Email); 
              }
                
              if (state === "ERROR")
             {
                  var toastEvent = $A.get("e.force:showToast");
        			toastEvent.setParams({
                        title : 'SUCCESS',
                        message: response.getReturnValue(),
                        duration:' 5000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'dismissible'
                    });
                   toastEvent.fire();
             }
        });   

        $A.enqueueAction(action);
                   
    },
	
    hideChangeEmailModal: function(component, event, helper)
    {
      	component.set("v.changeEmail", false);
   },

    handlePaste: function(component, event, helper) 
    {
    	event.preventDefault(); 
	}, 
    
    handleContext: function(component, event, helper)
    {
   		event.preventDefault(); 
	},
    
    clearError : function(component, event)  
    {
        var fieldId = event.getSource().getLocalId();
        var fieldInput = component.find(fieldId);
        var fieldValue = fieldInput.get("v.value");
        
        if(fieldValue != '')
        {
            fieldInput.setCustomValidity('');
            fieldInput.reportValidity();
        }
        
        
    },
    
     setNewEmail: function(component, event, helper) 
    {
         debugger;
		
        //stores error messages
        var errorMessages = ''; 
        // Store Regular Expression
        var regExpEmailformat = /^[a-zA-Z0-9._-]+@[a-z0-9\-]+\.[a-z]{2,3}/; 
        
        var currentEmail = component.get('v.currentEmail');
        var newEmail = component.get('v.newEmail');
        var verifyNewEmail = component.get('v.verifyNewEmail');
        
        //if any field on form is empty
        if($A.util.isEmpty(newEmail) || $A.util.isEmpty(verifyNewEmail)) 
        {
                errorMessages='You must fill in all of the required fields.';

            //is New Email field is empty?
            if($A.util.isEmpty(newEmail)) 
            {
                var emailFieldValueFId = component.find('emailField');
                emailFieldValueFId.setCustomValidity("New Email required.");
                emailFieldValueFId.reportValidity(); 
            }
            
            //is Verify New Email field is empty?
            if($A.util.isEmpty(verifyNewEmail)) 
            {
                var verifyNewEmailId = component.find('VerifyEmailField');
                verifyNewEmailId.setCustomValidity("Verify New Email required.");
                verifyNewEmailId.reportValidity();
            }
        }
        else
        {
            //if new email and verify new email are not equal
            if(newEmail != verifyNewEmail) 
            {
                errorMessages +=" "+'New Email and Verify New Email do not match.';
            }
           else
            {
                //is email address is in valid formate?
                if(!$A.util.isEmpty(newEmail))
                {
                    if(!newEmail.match(regExpEmailformat))
                    {
                        errorMessages='Please enter a valid email address.';
                    }
                }            
            }
         }
        
        
        //  display error if any
        if(errorMessages != '')
        {
            helper.showError(component, event, errorMessages);
        }
        
        // else make a server call
        else
        {

            //disable the button
            component.set("v.changeEmailBtn", true);
            //show spinner
            var spinner = component.find("mySpinner");
            $A.util.removeClass(spinner, "slds-hide");
            
            var action = component.get("c.changeUserEmail");
            action.setParams({ 
                
                newEmail	: 	newEmail
            });
            
            
        	action.setCallback(this,function(response)
            {
                var state = response.getState();  
                if(state == 'SUCCESS')
                {
                    //enable the button
                    component.set("v.changeEmailBtn", false);
                    
                    //hide spinner
                    var spinner = component.find("mySpinner");
                    $A.util.addClass(spinner, "slds-hide");
                    
                    //showing toast event on success
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'Success',
                        message: 'Email Change Successfully.',
                        duration:' 1000',
                        key: 'info_alt',
                        type: 'success',
                        mode: 'dismissible'
                    });
                    toastEvent.fire();
                    component.set("v.changeEmail", false);
                }
                if(state === 'ERROR')
                {
                     //hide spinner
                    var spinner = component.find("mySpinner");
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
                    
                    helper.showError(component, event, err);
                }
            });       
        $A.enqueueAction(action);
        } 
        
    }
})