({
      validateAndReplace: function (component, event) {
        const input = event.getSource();
        const inputValue = input.get('v.value');
        const validValue = inputValue.replace(/^(\d\d)(\d)$/g,'$1/$2')
            .replace(/^(\d\d\/\d\d)(\d+)$/g,'$1/$2')
            .replace(/[^\d\/]/g,'');
        input.set('v.value', validValue);
    },
 
	signup : function(component, event, helper) 
    {
		var contactFirstName = component.get('v.firstName');
        var contactLastName = component.get('v.lastName');
        var emailFieldValue = component.get('v.email');
        var contactTribeID = component.get('v.tribeID');
        var contactDob=component.get('v.Dob');
        
        var formatedDate = contactDob.replace(/(\d\d)\/(\d\d)\/(\d{4})/, "$3-$1-$2");
        var date_regex = /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/ ;
        var checkDateFormate=  date_regex.test(contactDob);
        
        var errorMessages = null;
        // Store Regular Expression
        var regExpEmailformat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
        
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
        
        //is first name field is empty?
        if($A.util.isEmpty(contactFirstName)) 
        {
    		errorMessages = firstNameRequired;
    	}
       
        //is last name field is empty?
        if($A.util.isEmpty(contactLastName)) 
        {
            if(errorMessages == null)
            {
                errorMessages=lastNameRequired;
            }
            else
            {
            	errorMessages +=" "+lastNameRequired;
            }
        }
       
        //is email address field is empty?
        if($A.util.isEmpty(emailFieldValue)) 
        {
            if(errorMessages == null)
            {
                errorMessages=emailRequired;
            }
            else
            {
                errorMessages +=" "+emailRequired;
            }
        }
        
        //is email address is in valid formate?
        if(!$A.util.isEmpty(emailFieldValue))
        {
           if(!emailFieldValue.match(regExpEmailformat))
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
        
        //is dob field is empty?
         if($A.util.isEmpty(contactDob)) 
        {
            if(errorMessages == null)
            {
                errorMessages=DobRequired;
            }
            else
            {
            	errorMessages +=" "+DobRequired;
            }
        }
        
       if (!checkDateFormate)
       {
        if(errorMessages == null)
            {
                errorMessages='Invalid date format, correct one is MM/DD/YYYY.';
            }
            else
            {
            	errorMessages +=" "+'Invalid date format, correct one is MM/DD/YYYY.';
            } 
       }
      
         //is tribe id field is empty?
        if($A.util.isEmpty(citizenId)) 
            {
                if(errorMessages == null)
                {
                    errorMessages=citizenIdRequired;
                }
                else
                {
                    errorMessages +=" "+citizenIdRequired;
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
           var action = component.get("c.userSignUp");
            action.setParams({ 
                
                firstName	: contactFirstName, 
                lastName 	: contactLastName,
                email 		: emailFieldValue,
                tribeID 	: citizenId,
                dob			: formatedDate
                
            });
            
            
        	action.setCallback(this,function(response)
            {
                if(response.getReturnValue() == 'SUCCESS')
                {
				component.set("v.visibleRegForm", false);
                component.set("v.visibleMessage", true);           
                }
                
            else
            {
            var toastEvent = $A.get("e.force:showToast");
        	toastEvent.setParams({
                        title : 'Error',
                        message: response.getReturnValue(),
                        duration:' 3000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'dismissible'
                    });
                   toastEvent.fire();
                  $A.get('e.force:refreshView').fire();
                
        }
            
        });       
        $A.enqueueAction(action);
        }
	}
})