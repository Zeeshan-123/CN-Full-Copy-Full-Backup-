({
	hideChangePasswordModal: function(component, event, helper)
    {
      	component.set("v.changePassword", false);
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
    
    
        setNewPassword : function(component, event) 
    {
        debugger;
		
        //stores error messages
        var errorMessages = ''; 
        
        var currentPasswordFId = component.find('currentPswrd');
        var newConfirmPasswordFId = component.find('confirmPassword');
        var newPasswordFId = component.find('password');
        
        var currentPassword = component.get('v.currentPassword');
        var newConfirmPassword = component.get('v.verifyNewPassword');
        var newPassword = component.get('v.newPassword');
       
        // password validation
        var upperCaseLetters = /[A-Z]/g;
        var lowerCaseLetters = /[a-z]/g;
        var numbers = /[0-9]/g;
		var specialCharacters =/^[A-Za-z0-9]+$/;
        		
        var containsSpecialCharater = (specialCharacters.test(newPassword))
        var containsUpperCase = upperCaseLetters.test(newPassword).toString();
        var containsLowerCase = lowerCaseLetters.test(newPassword).toString();
        var containsNumbers = numbers.test(newPassword).toString();
     
        //if any field on form is empty
        if($A.util.isEmpty(newPassword) || $A.util.isEmpty(newConfirmPassword) || $A.util.isEmpty(currentPassword)) 
        {
                errorMessages='You must fill in all of the required fields.';
            debugger;
            //is Confirm Email field is empty?
            if($A.util.isEmpty(newPassword)) 
            {
                newPasswordFId.setCustomValidity("New Password required.");
                newPasswordFId.reportValidity();
            }
            
            //is Citizen/Tribe Id field is empty?
            if($A.util.isEmpty(newConfirmPassword)) 
            {
                newConfirmPasswordFId.setCustomValidity("Verify New Password required.");
                newConfirmPasswordFId.reportValidity();
            }
            
             //is Citizen/Tribe Id field is empty?
            if($A.util.isEmpty(currentPassword)) 
            {
                currentPasswordFId.setCustomValidity("Current Password required.");
                currentPasswordFId.reportValidity();
            }
        }
        else
        {
            if(newPassword != newConfirmPassword)
            {
                
                if(errorMessages == '')
                {
                    errorMessages='Password and Confirm Password do not match.';
                }
                else
                {
                    errorMessages +='\nPassword and Confirm Password do not match.';
                }
                
            }   
        }
        
        // if password matched
        if(newPassword == newConfirmPassword && !$A.util.isEmpty(newPassword)  && !$A.util.isEmpty(newConfirmPassword) && !$A.util.isEmpty(currentPassword))
        {
            if(newPassword.length < 8) 
            {
                if(errorMessages == '')
                {
                    errorMessages = 'Password must be of minimum 8 characters.';
                }
                else
                {
                    errorMessages +='\nPassword must be of minimum 8 characters.';
                }
                
            }  
            
            //check for special character   
            if(containsSpecialCharater == true ) 
            {
                if(errorMessages == '')
                {
                    errorMessages = 'Password must contain a special character.';
                }
                else
                {
                    errorMessages += '\nPassword must contain a special character.';
                }
                
            }
            
            //check for capital letter   
            if(containsUpperCase == 'false')
            {
                if(errorMessages == '')
                {
                    errorMessages = 'Password must contain an uppercase letter.';
                }
                else
                {
                    errorMessages += '\nPassword must contain an uppercase letter.';
                }
            }
            
            //check for lower case letter   
            if(containsLowerCase == 'false')
            {
                if(errorMessages == '')
                {
                    errorMessages = 'Password must contain a lowercase letter.';
                }
                else
                {
                    errorMessages += '\nPassword must contain a lowercase letter.';
                }
            }
            
            //check for numeric
            if(containsNumbers == 'false') 
            {
                if(errorMessages == '')
                {
                    errorMessages = 'Password must contain a number from 0-9.';
                }
                else
                {
                    errorMessages += '\nPassword must contain a number from 0-9.';
                }
                
            }
        }
        
        
        //  display error if any
        if(errorMessages != '')
        {
          
            var toastEvent = $A.get("e.force:showToast");
        	toastEvent.setParams({
                        title : 'Error',
                        message: errorMessages,
                        duration:' 5000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'dismissible'
                    });
                   toastEvent.fire();
        }
        
        // else make a server call
        else
        {
                //disable the button
            component.set("v.changePswrdBtn", true);
            //show spinner
            var spinner = component.find("mySpinner");
            $A.util.removeClass(spinner, "slds-hide");
        

           var action = component.get("c.ChangePassword");
            action.setParams({ 
                
                currentPassword		: 	currentPassword,     
                newPassword			: 	newPassword
            });
            
            
        	action.setCallback(this,function(response)
            {
                 var state = response.getState();  
                if(response.getReturnValue() == 'SUCCESS')
                {
                //enable the button
                component.set("v.changePswrdBtn", false);
                    
                //hide spinner
                var spinner = component.find("mySpinner");
        		$A.util.addClass(spinner, "slds-hide");
                    
            	//showing toast event on success
                var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'Success',
                        message: 'Password Changed Successfully.',
                        duration:' 1000',
                        key: 'info_alt',
                        type: 'success',
                        mode: 'dismissible'
                    });
                toastEvent.fire();
                    
                //close modal
                component.set("v.changePassword", false);    
                }
                
            else
            {
                var result = response.getReturnValue();
				var check1 = result.includes("invalid");
                var check2 = result.includes("old password");
                
                 //enable the button
                component.set("v.changePswrdBtn", false);
                //hide spinner
                var spinner = component.find("mySpinner");
        		$A.util.addClass(spinner, "slds-hide");
                
                if(check1 == true && check2 == true)
                {
                    var toastEvent = $A.get("e.force:showToast");
                	toastEvent.setParams({
                        title : 'Error',
                        message: 'You have entered an incorrect old password.',
                        duration:' 5000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'dismissible'
                    });
                   toastEvent.fire();
                }
                else
                {
                     var toastEvent = $A.get("e.force:showToast");
                	 toastEvent.setParams({
                        title : 'Error',
                        message: result,
                        duration:' 5000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'dismissible'
                    });
                   toastEvent.fire();
                }
        }
            
        });       
        $A.enqueueAction(action);
        } 
        
    },

})