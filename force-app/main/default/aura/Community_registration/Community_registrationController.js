({
     doInit : function(component, event, helper) 
    {
        var userCheck = $A.get("$SObjectType.CurrentUser.Id");
        if (!$A.util.isUndefined(userCheck) || userCheck != null )
        {
            window.location.replace('/s/');
        }
        else
        {
            component.set("v.visibleRegForm", true);
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
    
     
    validateAndReplace: function (component, event)
    {
        const input = event.getSource();
        const inputValue = input.get('v.value');
        const validValue = inputValue.replace(/^(\d\d)(\d)$/g,'$1/$2')
            .replace(/^(\d\d\/\d\d)(\d+)$/g,'$1/$2')
            .replace(/[^\d\/]/g,'');
        input.set('v.value', validValue);
    },
    
    clearError : function(component, event)  
    {
        var fieldId = event.getSource().getLocalId();
        var fieldInput = component.find(fieldId);
        var fieldValue = fieldInput.get("v.value");
        var newConfirmPassword = component.get('v.userConfirmPassword');
        var newPassword = component.get('v.userPassword');
        
        if(fieldValue != '')
        {
            //  $A.util.removeClass(fieldId, 'slds-has-error');
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
    
    NumberCheck: function(component, event, helper)
    { 
        var charCode = (event.which) ? event.which : event.keyCode;
        if (!(charCode >= 48 && charCode <= 57))
        {
            event.preventDefault();
        }
    },
    
   
	signup : function(component, event, helper) 
    {
        
		var contactFirstName = component.get('v.firstName');
        var contactLastName = component.get('v.lastName');
        var emailFieldValue = component.get('v.email');
        var confirmEmailFieldValue = component.get('v.emailConfirm');
        var contactTribeID = component.get('v.tribeID');
        var contactDob=component.get('v.Dob');
        
        var FirstNameFId = component.find('fName');
        var LastNameFId = component.find('lName');
        var emailFieldValueFId = component.find('emailField');
        var confirmEmailFieldValueFId = component.find('emailFieldConfirm');
        var TribeIDF = component.find('tid');
        var DobFId=component.find('DateOfBirth');
        
        // date formatting
        var formatedDate = contactDob.replace(/(\d\d)\/(\d\d)\/(\d{4})/, "$3-$1-$2");
        var date_regex = /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/ ;
        var checkDateFormate=  date_regex.test(contactDob);
        
        // check citizen id format
        var numbers = /[0-9]/g;
        var containsNumbers = numbers.test(contactTribeID).toString();
        
        var errorMessages = null;
        // Store Regular Expression
       //  var regExpEmailformat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
       //  var regExpEmailformat = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/; 
        var regExpEmailformat = /^[a-zA-Z0-9._-]+@[a-z0-9\-]+\.[a-z]{2,3}/; 
         // custom labels
        var firstNameRequired = $A.get("$Label.c.Community_FirstNameRequiredMessages");
        var lastNameRequired = $A.get("$Label.c.Community_LastNameRequiredMessages");
        var DobRequired = $A.get("$Label.c.Community_DobRequiredMessages");
        var citizenIdRequired = $A.get("$Label.c.Community_CitizenIdRequiredMessages");
        var citizenIdNumericRequired = $A.get("$Label.c.Community_CitizenIMustBeNumericMessages");
        var emailRequired = $A.get("$Label.c.Community_EmailRequiredMessages");
        var validEmailRequired = $A.get("$Label.c.Community_InvalidEmailMessages");
       
        // cleaning tribe/citizen/registration id
        var removedAlphabet = contactTribeID.replace(/[^\d.-]/g, '');
        var removedLeadingZeros =removedAlphabet.replace(/^0+/, '');
        var removeSigns =removedLeadingZeros.replace(/^-+/, '');
        var citizenId =removeSigns.replace(/^0+/, '');
       
        debugger;
        // Check for field level error
        if($A.util.isEmpty(contactFirstName) || $A.util.isEmpty(contactLastName) || $A.util.isEmpty(emailFieldValue)
          || $A.util.isEmpty(confirmEmailFieldValue) || $A.util.isEmpty(contactDob) ||$A.util.isEmpty(contactTribeID)) 
        {
    		errorMessages = 'You must fill in all of the required fields.';
            
            //is First Name field is empty?
            if($A.util.isEmpty(contactFirstName)) 
            {
              //  $A.util.addClass(FirstNameFId, 'slds-has-error');
                FirstNameFId.setCustomValidity("First Name required.");
                FirstNameFId.reportValidity(); 
            }
            
             //is Last Name field is empty?
            if($A.util.isEmpty(contactLastName)) 
            {
              	  LastNameFId.setCustomValidity("Last Name required.");
                  LastNameFId.reportValidity();
            }
            
             //is Email field is empty?
            if($A.util.isEmpty(emailFieldValue)) 
            {
              	  emailFieldValueFId.setCustomValidity("Email required.");
                  emailFieldValueFId.reportValidity();
            }
            
             //is Confirm Email field is empty?
            if($A.util.isEmpty(confirmEmailFieldValue)) 
            {
              	  confirmEmailFieldValueFId.setCustomValidity("Confirm Email required.");
                  confirmEmailFieldValueFId.reportValidity();
            }

             //is Citizen/Tribe Id field is empty?
            if($A.util.isEmpty(contactTribeID)) 
            {
               	  TribeIDF.setCustomValidity("Citizen Id required.");
                  TribeIDF.reportValidity();
            }
            
             //is Date of Birth field is empty?
            if($A.util.isEmpty(contactDob)) 
            {
               	  DobFId.setCustomValidity("Date of Birth required.");
                  DobFId.reportValidity();
            }
            
    	}
        
        // check for email and dob formats
        else
        {
            //is email address is in valid formate?
            if(!$A.util.isEmpty(emailFieldValue))
            {
                if(regExpEmailformat.test(emailFieldValue) == false)
                {
                    if(errorMessages == null)
                    {
                        errorMessages='Please enter a valid email address.';
                    }
                    else
                    {
                        errorMessages +="\n"+'Please enter a valid email address.';
                    }
                    
                }
                
            }
            
            // if confirm email is not empty then
            if(!$A.util.isEmpty(confirmEmailFieldValue) && !$A.util.isEmpty(emailFieldValue) ) 
            {
                if(emailFieldValue != confirmEmailFieldValue) 
                {
                    
                    if(errorMessages == null)
                    {
                        errorMessages='Email and Confirm Email do not match.';
                    }
                    else
                    {
                        errorMessages +="\n"+'Email and Confirm Email do not match.';
                    }
                    
                }
            }
            
            
            //if Dob is not null then check date formate is correct?
            if(!$A.util.isEmpty(contactDob)) 
            {
                if (!checkDateFormate)
                {
                    if(errorMessages == null)
                    {
                        errorMessages='Invalid date format, correct one is MM/DD/YYYY.';
                    }
                    else
                    {
                        errorMessages +="\n"+'Invalid date format, correct one is MM/DD/YYYY.';
                    } 
                }
            }    
            
			// citizen id format check
            if(!$A.util.isEmpty(contactTribeID)) 
            {
                if (containsNumbers == 'false')
                {
                    if(errorMessages == null)
                    {
                        errorMessages='Invalid Citizen ID format. It should contain numbers/digits only.';
                    }
                    else
                    {
                        errorMessages +="\n"+'Invalid Citizen ID format. It should contain numbers/digits only.';
                    } 
                }
            }   
        }
       
       
     // is there any error message?
        if(errorMessages != null)
        {            
            var toastEvent = $A.get("e.force:showToast");
        	toastEvent.setParams({
                        title : 'Warning',
                        message: errorMessages,
                        duration:' 20000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'dismissible'
                    });
                   toastEvent.fire();
        }
        
      // if no error then make server call  
        else
        {
             //disable the button
            component.set("v.isActive", true);
            //show spinner
            helper.showSpinner(component);
            
            var action = component.get("c.userSignUp");
            action.setParams({ 
                
                uFirstName	:	contactFirstName,
                uLastName	:	contactLastName,
                email 		: 	emailFieldValue,
                tribeID 	:	citizenId,
                dob			: 	formatedDate
                
            });
            
            
        	action.setCallback(this,function(response)
            {
                 var state = response.getState();  
                 var result = response.getReturnValue();
                  if(result == "Verified")
                  {
                    //enable the button
                    component.set("v.isActive", false);
                    //hide spinner
                    helper.hideSpinner(component);
                    
                    // show OTP screen and hide registration form
                    component.set("v.visibleRegForm", false);
                    component.set("v.visibleOtpScreen", true);
                  }
                
                 else
                 {
                     let error=response.getReturnValue();
                     if(error.includes("UNABLE_TO_LOCK_ROW") || error.includes("unable to obtain exclusive access to this record"))
                         error="There was an issue processing your request. Please try again in a few minutes.";
                     //enable the button
                     component.set("v.isActive", false);
                     //hide spinner
                     helper.hideSpinner(component);
                     
                     var toastEvent = $A.get("e.force:showToast");
                     toastEvent.setParams({
                         title : 'Error',
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
    
    validateOTP : function(component, event, helper) 
    {
        
        var contactTribeID = component.get('v.tribeID');
        var removedAlphabet = contactTribeID.replace(/[^\d.-]/g, '');
        var removedLeadingZeros =removedAlphabet.replace(/^0+/, '');
        var removeSigns =removedLeadingZeros.replace(/^-+/, '');
        var citizenId =removeSigns.replace(/^0+/, '');
        var contactDob=component.get('v.Dob');
        // date formatting
        var formatedDate = contactDob.replace(/(\d\d)\/(\d\d)\/(\d{4})/, "$3-$1-$2");
        helper.showSpinner(component);
        var inputOtp  = component.find("Input_OTP");
        var userEnteredOTP = component.find("Input_OTP").get("v.value");
        
        //is OTP field is empty?
        if($A.util.isEmpty(userEnteredOTP)) 
        {
            inputOtp.setCustomValidity("Verification Code required.");
            inputOtp.reportValidity();
        }
        
        else
        {
             //disable the button
             component.set("v.isActive", true);
             //show spinner
             var spinner = component.find("OTPSpinner");
       		 $A.util.removeClass(spinner, "slds-hide");
            
            //Call validate function
            var action = component.get("c.validateEnteredPIN");
            action.setParams({ 
                
                tribeID 	:	citizenId,
                dob			: 	formatedDate,
                OTP			:	userEnteredOTP
                
            });
            
            action.setCallback(this,function(response)
                               {
                                   // hide spinner
                                    var spinner = component.find("OTPSpinner");
       								$A.util.addClass(spinner, "slds-hide");
                                   
                                   //get response
                                   var state = response.getState();  
                                   var result = response.getReturnValue();
                                   //if APEX error
                                   if(result == undefined){
                                       var toastEvent = $A.get("e.force:showToast");
                                       toastEvent.setParams({
                                           title : 'Error',
                                           message: 'Unknown Error!',
                                           duration:' 4000',
                                           key: 'info_alt',
                                           type: 'error',
                                           mode: 'dismissible'
                                       });
                                       toastEvent.fire();
                                   }
                                   //if success
                                   else if(result == "Success")
                                   {
                                       component.set("v.visibleOtpScreen", false);
                                       component.set("v.visibleResetPasswordFrom", true);
                                   }
                                   //if failed
                                       else if(result=="Failed")
                                       {
                                           //enable the button
             								component.set("v.isActive", false);
                                           var toastEvent = $A.get("e.force:showToast");
                                           toastEvent.setParams({
                                               title : 'Error',
                                               message: 'Verification Code is incorrect.',
                                               duration:' 4000',
                                               key: 'info_alt',
                                               type: 'error',
                                               mode: 'dismissible'
                                           });
                                           toastEvent.fire();
                                       }
                                   //If Max attempts reached or Expired   
                                      else
                                      {
                                               //enable the button
                                               component.set("v.isActive", false);
                                               component.set("v.showOtpErrorScreen", true);
                                               component.set("v.visibleOtpScreen", false);
                                       }
                                
                               });       
            $A.enqueueAction(action);
        }
       
    },
    
    finish : function(component, event) 
    {
      //  window.location.replace('/s/registration');
      	  component.set("v.visibleOtpScreen", false);
          component.set("v.showOtpErrorScreen", false);
          component.set("v.visibleRegForm", true);
        
    },
    
    
      setPassword : function(component, event) 
    {
        //stores error messages
        var errorMessages = ''; 
       
        var contactFirstName = component.get('v.firstName');
        var contactLastName = component.get('v.lastName');
        var emailFieldValue = component.get('v.email');
        var contactTribeID = component.get('v.tribeID');
        var contactDob=component.get('v.Dob');
        
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
        
         // cleaning tribe/citizen/registration id
        var removedAlphabet = contactTribeID.replace(/[^\d.-]/g, '');
        var removedLeadingZeros =removedAlphabet.replace(/^0+/, '');
        var removeSigns =removedLeadingZeros.replace(/^-+/, '');
        var citizenId =removeSigns.replace(/^0+/, '');
     
        //  formatting date of birth
        var formatedDate = contactDob.replace(/(\d\d)\/(\d\d)\/(\d{4})/, "$3-$1-$2");

        
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
            component.set("v.resetBtnActive", true);
            //show spinner
            var spinner = component.find("mySpinnerResetScr");
            $A.util.removeClass(spinner, "slds-hide");
            
            var action = component.get("c.createUser");
            action.setParams({ 
                    
                firstName	: 	contactFirstName, 
                lastName 	: 	contactLastName,
                email 		: 	emailFieldValue,
                tribeID 	: 	citizenId,
                dob			: 	formatedDate, 
                password	: 	newPassword
            });
            
            
        	action.setCallback(this,function(response)
            {
                if(response.getReturnValue() == 'SUCCESS')
                {
                //enable the button
                component.set("v.resetBtnActive", false);
                //hide spinner
                var spinnerHide = component.find("mySpinnerResetScr");
                $A.util.addClass(spinnerHide, "slds-hide");
                    
                component.set("v.visibleResetPasswordFrom", false);
                component.set("v.visibleMessage", true);
                }
                
            else
            {
                let error=response.getReturnValue();
                if(error.includes("UNABLE_TO_LOCK_ROW") || error.includes("unable to obtain exclusive access to this record"))
                    error="There was an issue processing your request. Please try again in a few minutes.";
                //enable the button
                component.set("v.resetBtnActive", false);
                //hide spinner
                var spinnerHide = component.find("mySpinnerResetScr");
                $A.util.addClass(spinnerHide, "slds-hide");
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title : 'Error',
                    message: error,
                    duration:' 5000',
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
    
    
      login: function (component, event, helpler) 
    {
        //disable the button
        component.set("v.finishBtnActive", true);
        //show spinner
         var spinner = component.find("mySpinnerFinish");
        $A.util.removeClass(spinner, "slds-hide");
        
        var password = component.get('v.userPassword');
        var username = component.get('v.email');
        
        var action = component.get("c.userLogin");
        
            action.setParams({ 
                username : username,
                password : password
            });
            
        	action.setCallback(this,function(response){
            var state = response.getState();   

           if(response.getReturnValue() != 'SUCCESS' && username != '' && password != '')
           {
                 //enable the button
          		component.set("v.finishBtnActive", false);
           		//hide spinner
               	var spinnerHide = component.find("mySpinnerFinish");
       			$A.util.addClass(spinnerHide, "slds-hide");
                }   
           if(state == "ERROR")
           {
                    var errors = response.getError();                       
                    var toastEvent = $A.get("e.force:showToast");
        			toastEvent.setParams({
                        title : 'Error',
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