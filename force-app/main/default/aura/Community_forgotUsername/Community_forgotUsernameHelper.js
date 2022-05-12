({
    handleSearch: function (component, event, helpler) 
    {
        const CitID = component.find("CitID").get("v.value");
        // cleaning tribe/citizen/registration id
        const removedAlphabet = CitID.replace(/[^\d.-]/g, '');
        const removedLeadingZeros =removedAlphabet.replace(/^0+/, '');
        const removeSigns =removedLeadingZeros.replace(/^-+/, '');
        const citizenId =removeSigns.replace(/^0+/, '');
        
        const DOB = component.find("DOB").get("v.value");
        const CitIDcmp = component.find('CitID');
        const DOBcmp=component.find('DOB');
        
        let errorMessages = null;
        let formatedDate = DOB.replace(/(\d\d)\/(\d\d)\/(\d{4})/, "$3-$1-$2");
        let date_regex = /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/ ;
        const checkDateFormate=  date_regex.test(DOB);
        
        // custom label
        const fillinReqfields = $A.get("$Label.c.Community_FillinRequiredFields");
        const inactiveUser = $A.get("$Label.c.Community_UserDeactivated");
        const notfound = $A.get("$Label.c.Community_UserNotfound");
        
        //is username field is empty?
        if($A.util.isEmpty(CitID) || $A.util.isEmpty(DOB)) 
        {
            errorMessages=fillinReqfields;
            if($A.util.isEmpty(CitID)) 
            {
               	  CitIDcmp.setCustomValidity("Citizen Id required.");
                  CitIDcmp.reportValidity();
            }
            
             //is Date of Birth field is empty?
            if($A.util.isEmpty(DOB)) 
            {
               	  DOBcmp.setCustomValidity("Date of Birth required.");
                  DOBcmp.reportValidity();
            }
        }
        else
        {
            //Check date formate is correct?
            if (!checkDateFormate)
            {
                errorMessages='Invalid date format, correct one is MM/DD/YYYY.';
            }   
        }
        
        //show error
        if(errorMessages != null)
        {
            let toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title : 'Error',
                message: errorMessages,
                duration:' 5000',
                key: 'info_alt',
                type: 'error',
                mode: 'pester'
            });
            toastEvent.fire();
        }
        //make server call
        else
        {
            component.set("v.isActive", true);
            //show spinner
            this.showSpinner(component); 
            let action = component.get("c.forgotUsername");
            action.setParams({
                CitizenID	:	citizenId,
                DOB			:	formatedDate	
            });
            
            action.setCallback(this, function(response) 
            {
                debugger;
                const rtnValue = response.getReturnValue();
                if (rtnValue != inactiveUser && rtnValue !=notfound ) 
                {
                    //hide spinner
                    this.hideSpinner(component); 
                    component.set("v.visible", false);
                    component.set("v.visibleMessage", true);
                    component.set("v.Username",rtnValue);
                }
                
                
                else
                {
                    component.set("v.Username",'');
                    //hide spinner
                    this.hideSpinner(component);  
                    component.set("v.isActive", false);
                    let toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'Error',
                        message: rtnValue,
                        duration:' 8000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'dismissible'
                    });
                    toastEvent.fire();
                    //   $A.get('e.force:refreshView').fire();
                }
            });
            $A.enqueueAction(action);
        }        
        
    },
    // this method shows spinner
    showSpinner: function (component, event, helper)
    {
        let spinner = component.find("Spinner");
        $A.util.removeClass(spinner, "slds-hide");
    },
    
    // this method hides spinner
    hideSpinner: function (component, event, helper) 
    {
        let spinner = component.find("Spinner");
        $A.util.addClass(spinner, "slds-hide");
    },
    
    
})