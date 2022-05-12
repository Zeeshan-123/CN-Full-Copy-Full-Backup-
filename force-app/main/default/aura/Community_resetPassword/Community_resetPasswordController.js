({
    doInit : function(component, event) 
    {
        var userCheck = $A.get("$SObjectType.CurrentUser.Id");
        //if not a guest user
        if (!$A.util.isUndefined(userCheck) || userCheck != null )
        {
            window.location.replace('/s/');
        }
        else
        {
            component.set("v.showResetPassWindow", true);
            // get id from url
            var queryString = window.location.search;
            var rid = location.search.split('Id=')[1];
            // set user id
            component.set("v.userid",rid);
            
            //server call to get user name associated with user id
            var action = component.get("c.getUserName");
            action.setParams({ 
                userid 		: rid
            });
            
            
            action.setCallback(this,function(response)
                               {
                                   var state = response.getState();
                                   if (state === "SUCCESS")
                                   {
                                       var resultData = response.getReturnValue();
                                       component.set("v.userName",resultData);   
                                   }
                               });       
            $A.enqueueAction(action);
        }
            
        },
       clearError : function(component, event)  
    {
        debugger;
		var fieldId = event.getSource().getLocalId();
        var fieldInput = component.find(fieldId);
        var fieldValue = fieldInput.get("v.value");
        var newConfirmPassword = component.get('v.userConfirmPassword');
        var newPassword = component.get('v.userPassword');
        
        if(fieldValue != '')
        {
            fieldInput.setCustomValidity('');
         	fieldInput.reportValidity();
        }
        
        if(newConfirmPassword != '')
        {
            var cmpTarget = component.find('nCPswrd');
            $A.util.addClass(cmpTarget, 'mpI');
        }
        if(newPassword != '')
        {
            var cmpTarget = component.find('npswrd');
            $A.util.addClass(cmpTarget, 'mpI');
        }
        
        
    },
    
     handlePaste: function(component, event, helper) 
    {
    	event.preventDefault(); 
	}, 
    
    handleContext: function(component, event, helper)
    {
   		 event.preventDefault(); 
	},
    
       show: function(component, event, helper) 
    {
    	component.set('v.showMsg', true);
	}, 
    
    setPassword : function(component, event) 
    {
       
       debugger;
        //stores error messages
       var errorMessages = ''; 
       var userId = component.get("v.userid");
        var newConfirmPassword = component.get('v.userConfirmPassword');
        var newPassword = component.get('v.userPassword');
        
        var newConfirmPasswordFId = component.find('confirmPassword');
        var newPasswordFId = component.find('password');
       
        // password validation
        var upperCaseLetters = /[A-Z]/g;
        var lowerCaseLetters = /[a-z]/g;
        var numbers = /[0-9]/g;
		var specialCharacters =/^[A-Za-z0-9]+$/;
        
        var containsSpecialCharater = (specialCharacters.test(newPassword))
        var containsUpperCase = upperCaseLetters.test(newPassword).toString();
        var containsLowerCase = lowerCaseLetters.test(newPassword).toString();
        var containsNumbers = numbers.test(newPassword).toString();
        
        
         if($A.util.isEmpty(newPassword) || $A.util.isEmpty(newConfirmPassword)) 
        {
           errorMessages='You must fill in all of the required fields.';
            
            //is Confirm Email field is empty?
            if($A.util.isEmpty(newPassword)) 
            {
                var cmpTarget = component.find('npswrd');
                $A.util.removeClass(cmpTarget, 'mpI');
                newPasswordFId.setCustomValidity("Password required.");
                newPasswordFId.reportValidity();
            }
            
            //is Citizen/Tribe Id field is empty?
            if($A.util.isEmpty(newConfirmPassword)) 
            {
                var cmpTarget = component.find('nCPswrd');
                $A.util.removeClass(cmpTarget, 'mpI');
                newConfirmPasswordFId.setCustomValidity("Confirm Password required.");
                newConfirmPasswordFId.reportValidity();
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
        if(newPassword == newConfirmPassword && !$A.util.isEmpty(newPassword)  && !$A.util.isEmpty(newConfirmPassword))
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
                        duration:' 20000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'dismissible'
                    });
                   toastEvent.fire();
        }
        
        
        // else make a server call
        else
        {
           var action = component.get("c.ChangePassword");
            action.setParams({ 
                userid 		: userId, 
                newpassword : newPassword
            });
            
            
        	action.setCallback(this,function(response)
            {
                if(response.getReturnValue() == 'SUCCESS')
                {
                    var toastEvent = $A.get("e.force:showToast");
        				toastEvent.setParams({
                        title : 'Success',
                        message: 'Login Successfull.',
                        duration:' 20000',
                        key: 'info_alt',
                        type: 'success',
                        mode: 'dismissible'
                    });
                   toastEvent.fire();
                }
                
            else
            {
            var toastEvent = $A.get("e.force:showToast");
        	toastEvent.setParams({
                        title : 'Error',
                        message: response.getReturnValue(),
                        duration:' 20000',
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
    
    togglePassword : function(component, event, helper) 
    {
        if(component.get("v.showpassword",true))
        {
            component.set("v.showpassword",false);
        }
        else
        {
            component.set("v.showpassword",true);
        }
    }

})