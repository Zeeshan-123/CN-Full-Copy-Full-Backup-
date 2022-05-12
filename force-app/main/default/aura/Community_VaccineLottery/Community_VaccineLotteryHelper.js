({
    helperMethod : function() {

    },

    callServer : function(component,method,callback,params) {
        debugger;
        var action = component.get(method);
        if (params) {        
            action.setParams(params);
        }
        
        action.setCallback(this,function(response) {    
            debugger;        
            var state = response.getState();
            if (state === "SUCCESS") { 
                // pass returned value to callback function
                callback.call(this,response.getReturnValue());   
            } else if (state === "ERROR") {
                // generic error handler
                var errors = response.getError();
                if (errors) {
                    console.log("Errors", errors);
                    if (errors[0] && errors[0].message) {
                        throw new Error("Error" + errors[0].message);
                    }
                } else {
                    throw new Error("Unknown Error");
                }
            }
        });
        
        $A.enqueueAction(action);
    },

    showToast : function(message){
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title : 'Warning',
            message: message,
            duration:' 3000',
            key: 'info_alt',
            type: 'error',
            mode: 'dismissible'
        });
        toastEvent.fire();
       },
    
       showSpinner: function (component, event, helper)
       {
           var spinner = component.find("Spinner2");
           $A.util.removeClass(spinner, "slds-hide");
       },
        // this method hides spinner
      hideSpinner: function (component, event, helper) 
      {
          var spinner = component.find("Spinner2");
          $A.util.addClass(spinner, "slds-hide");
      },
       // show toast of success and navigate to newly created case record            
      endRequest: function(component, event, helper)
      {
          debugger;
          component.set("v.showReviewScreen", false); 
          component.set("v.vaccineLotteryForm",false);
          component.set("v.showSuccessMessage", true);
          this.hideSpinner(component,event,helper);
          
         
          // var recId=component.get('v.caseId');
          var toastEvent = $A.get("e.force:showToast");
                  toastEvent.setParams({
                          title : 'SUCCESS',
                          message: $A.get("$Label.c.Community_RequestCreatedMessage"),
                          duration:' 2000',
                          key: 'info_alt',
                          type: 'success',
                          mode: 'dismissible'
                      });
                     toastEvent.fire();
                      
          // var urlEvent = $A.get("e.force:navigateToURL");
          //         urlEvent.setParams({
          //         "url": '/s/detail/'+recId
          //        });
            // 	urlEvent.fire();
     },
     endRequestWithException: function(component, event, helper)
      {
          debugger;
          component.set("v.showReviewScreen", false); 
          component.set("v.vaccineLotteryForm",true);
          this.hideSpinner(component,event,helper);
  
          var exceptionMsg = component.get("v.exceptionMsg");
          // var recId=component.get('v.caseId');
          var toastEvent = $A.get("e.force:showToast");
          toastEvent.setParams({
              title : 'ERROR',
              message: exceptionMsg,
              duration:' 3000',
              key: 'info_alt',
              type: 'error',
              mode: 'dismissible'
          });
          toastEvent.fire();
                      
          // var urlEvent = $A.get("e.force:navigateToURL");
          //         urlEvent.setParams({
          //         "url": '/s/detail/'+recId
          //        });
            // 	urlEvent.fire();
     },
    checkValidation : function(component,event){
        debugger

        var errorMessages = null;
        var acc = component.get("v.accObj");
        var mobileNoInput = component.find("aIdPhone");
        // var mobileNo = mobileNoInput.get("v.value").replace(/\D/g, '');
        var mobileNo = mobileNoInput.get("v.value");
        
        var requiredFields = $A.get("$Label.c.CommunityFillRequiredFields");

        //Mailing Address
        debugger
        var ffAddressValue = '';
        var IsLookUpVisible = component.get("v.showLookUp");
        if(IsLookUpVisible == true)
        {
            var ffAddress = component.find("AddressFreeFormInput");
            ffAddressValue = ffAddress.get("v.value");
        }
                    
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
        var isManual = component.get("v.isManual");
  
        var showMailingState = component.get("v.showMailingState");
        var showMailingOtherState = component.get("v.showMailingOtherState");
        
        var iAccept = component.get("v.iAccept");
        var mAddressCheckbox = component.get("v.malingAddressCorrect");
        var UpdateAddressRequired = component.get("v.UpdateAddressRequired");
        var addressUpdate = component.get("v.addressUpdate");
        
        if(showMailingState == true)
        {
            mailingState = component.find("MailingStateInput").get("v.value");
        }
        
        if(showMailingOtherState == true)
        {
            mailingOtherState = component.find("MailingOtherState").get("v.value");
        }
   
        if(IsLookUpVisible == true)
        {
            // if address is entered manually then check for required mailing address fields
           if (isManual == true)
            {
                // if Mailing Other State/Territory is used
                if( showMailingOtherState == true)
                {
                    if(mailingStreet == '' ||  mailingCity == '' || mailingOtherState == '' || mailingCountry == '' || mailingZip == '' ||
                       mailingStreet.trim() == "" ||  mailingCity.trim() == "" || mailingOtherState.trim() == "" || mailingCountry.trim() == "" || mailingZip.trim() == "")
                    {
                        errorMessages  = 'You must fill in all of the required fields.'; 
                    }
                    
                    var mailingOtherStateInput = component.find("MailingOtherState");
                    
                    //is Mailing Other State field is empty?
                    if($A.util.isEmpty(mailingOtherState) || mailingOtherState.trim() == "") 
                    {
                        $A.util.addClass(mailingOtherStateInput, 'slds-has-error');
                    }
                }
                
                // if Mailing State is used
                if( showMailingState == true)
                {
                    if(mailingStreet == '' ||  mailingCity == '' || mailingState == '' || mailingCountry == '' || mailingZip == '' ||
                        mailingStreet.trim() == "" ||  mailingCity.trim() == "" || mailingState.trim() == "" || mailingCountry.trim() == "" || mailingZip.trim() == "")
                    {
                        errorMessages  = 'You must fill in all of the required fields.'; 
                    }
                    
                    var mailingStateInput = component.find("MailingStateInput");
                    
                    //is Mailing State field is empty?
                    if($A.util.isEmpty(mailingState) || mailingState.trim() == "") 
                    {
                        $A.util.addClass(mailingStateInput, 'slds-has-error');
                    }
                }
                
                //is Mailing Street field is empty?
                if($A.util.isEmpty(mailingStreet) || mailingStreet.trim() == "") 
                {
                    $A.util.addClass(mailingStreetInput, 'slds-has-error');
                }
                
                //is Mailing City field is empty?
                if($A.util.isEmpty(mailingCity) || mailingCity.trim() == "") 
                {
                    $A.util.addClass(mailingCityInput, 'slds-has-error');
                }
                
                //is Mailing Country field is empty?
                if($A.util.isEmpty(mailingCountry) || mailingCountry.trim() == "")
                {
                    $A.util.addClass(mailingCountryInput, 'slds-has-error');
                }
                
                //is Mailing Zip field is empty?
                if($A.util.isEmpty(mailingZip) || mailingZip.trim() == "")
                {
                    $A.util.addClass(mailingZipInput, 'slds-has-error');
                }
                
            }
            //if address is not manual
            else
            {
                if((mailingStreet == '' ||  mailingCity == ''  || mailingCountry == '' || mailingState == '' || mailingZip == '') && ffAddressValue == '') 
                {
                    errorMessages  = 'You must fill in all of the required fields.'; 
                    
                    //is Free Form Address field is empty?
                    if($A.util.isEmpty(ffAddressValue)) 
                    {
                        component.set("v.FFAddressRequired", true);
                        $A.util.addClass(ffAddress, 'slds-has-error');
                    }
                }

                 if(ffAddressValue != '' && (mailingStreet == '' ||  mailingCity == ''  || mailingCountry == '' || mailingState == '' || mailingZip == '') ) 
                 {    
                     if(errorMessages == null)
                     {
                         errorMessages='Please make sure the address provided is complete via the address lookup box.';
                     }
                }
                
            }
            
        }
        
        debugger
        // check if user check Update Address, if required
        if( addressUpdate == false && UpdateAddressRequired == true)
        {
            errorMessages='The mailing address provided is invalid. Please click the Update Address toggle to edit and provide a new mailing address.';
            
            var cb = component.find("addressUpdateCheckBox");
            $A.util.addClass(cb, 'slds-has-error');
            
        }

         // check boxes validations
         if (errorMessages == null)
        {
            // check if user check I have verified that my address is correct
            if( mAddressCheckbox == false)
            {
                errorMessages='Must check the I have verified that my address is correct checkbox.';
                
                var cb = component.find("mAddressCheckBox");
                $A.util.addClass(cb, 'slds-has-error');
            }
            
        }

        //Mailing Address

       
         debugger
         //Applicant Mobile Number Field Validation
         if($A.util.isEmpty(mobileNo)) {
            errorMessages = requiredFields;  
            $A.util.addClass(mobileNoInput, 'slds-has-error');
        }

        //Is Applicant is Female
        debugger
        if (component.get("v.isFemale")) {
            var alphaChar = /^([A-Za-z\-]+)$/g
            var lastNameInput = component.find('aIdLastName');
            var lastName = lastNameInput.get("v.value");
            if ($A.util.isEmpty(lastName)) {
                errorMessages = requiredFields;
                $A.util.addClass(lastNameInput, 'slds-has-error');
            } 
            else {
                 if (!alphaChar.test(lastName) || lastName.trim() == "") {
                    errorMessages = "Please provide a valid lastname";
                    $A.util.addClass(lastNameInput, 'slds-has-error');
                } 
            }
            
        }
     

        //Vaccine Validation
        var vacTypeInput = component.find('VaccineTypeInput');
        var vacType = component.get("v.vacType");
        $A.util.removeClass(vacTypeInput, 'slds-has-error');
        if ($A.util.isEmpty(vacType)) {
            errorMessages = requiredFields;  
            $A.util.addClass(vacTypeInput, 'slds-has-error');
        }

        //Vaccine Date Validation
        var fVaxDateInput = component.find('aIdFinalVaccinationDate');
        var dateRegex = /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/ ;
        //var dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
        var fVaxDate = component.get("v.finalVaxDate");
        if (!dateRegex.test(fVaxDate)){
            errorMessages = 'Please provide a valid format for date i.e. MM/DD/YYYY';
            $A.util.addClass(fVaxDateInput, 'slds-has-error');
         } else {
            var prevDate = new Date("03/01/2020"); //MM/DD/YYYY
            var finalVaxDate = new Date(fVaxDate);
            var currentDate = new Date();
            if (finalVaxDate > currentDate) {
                errorMessages = 'Date of Final Vaccination cannot be greater than today';
                $A.util.addClass(fVaxDateInput, 'slds-has-error');
            } else if (finalVaxDate < prevDate){
                errorMessages = 'Date of Final Vaccination cannot be before March 2020';
                $A.util.addClass(fVaxDateInput, 'slds-has-error');
            }
        }
         if ($A.util.isEmpty(fVaxDate)) {
            errorMessages = requiredFields;  
            $A.util.addClass(fVaxDateInput, 'slds-has-error');
        }

        //File Validation
        debugger
        var fileInput1 = component.find('firstVacDoseFileId');
        var docId1 = component.get("v.docId1");
        var docId2 = component.get("v.docId2");
        if ($A.util.isEmpty(docId1) && $A.util.isEmpty(docId2)) {
            // $A.util.addClass(fileInput1, 'slds-has-error');
            errorMessages = requiredFields ;
            this.showToast('Please Upload atleast one document');
        }
       debugger
       // Phone field validations For special characters
       if (errorMessages == null) {
            var numRegex = /^[0-9-)(]*$/;
            if(!$A.util.isEmpty(mobileNo))  {
                var numTestForApp = numRegex.test(mobileNo).toString();
                if(numTestForApp == 'false'){
                    errorMessages='Mobile number should not contain alphabets or special characters.';
                } 
            }
            
       }

        // Phone field validations
        if (errorMessages == null) {
            debugger
             //if Mobile field is not empty for applicant
             if(!$A.util.isEmpty(mobileNo))  {
                 mobileNo = mobileNo.replace(/\D/g, '');
                 var firstCharValforPriCon = mobileNo.charAt(0);
                 
                 if(mobileNo.length != 10) {
                    errorMessages='Applicant Mobile number must contain 10 digits.';
                 }
                 if(firstCharValforPriCon == '1'  || firstCharValforPriCon == '0'){
                    errorMessages='Applicant Mobile number should not begin with 1 or 0.';
                 }
                
             }
             
        }

         //Address Fields special characters validations
         if (errorMessages == null) {
            var addressLine2Input = component.find('MailingAddress2Input');
            var addressLine2 = addressLine2Input.get("v.value");

             $A.util.removeClass(mailingStreetInput, 'slds-has-error');
             $A.util.removeClass(mailingCityInput, 'slds-has-error');
             $A.util.removeClass(addressLine2Input, 'slds-has-error');
             debugger
             if (isManual == true){
                //  var forMobAddRegex = /^[a-zA-Z0-9\. \,\:\/\$\#\-]/;
                 var forMobAddRegex = /^([a-zA-Z0-9\. \,\:\/\$\#\-]+)$/g;
                 
                //  let addRegex = new RegExp("([a-zA-Z0-9\\.\\, \\'\\-\\:\\/\\$\\#]+)");
                // let addRegex = new RegExp("\\\'*","g");
                debugger
                var addWithoutApostrophe = mailingStreet.replace(new RegExp("\\\'","g"), '');
                // addWithoutApostrophe = addWithoutApostrophe.remove(new RegExp("\\\'","g"));
              
                
                if (!forMobAddRegex.test(addWithoutApostrophe)){
                    errorMessages = 'Please provide a valid address';
                    $A.util.addClass(mailingStreetInput, 'slds-has-error');
                 }
    
                 if (!$A.util.isEmpty(addressLine2)) {
                    var forAdd2Regex = /^([a-zA-Z0-9\. \,\:\/\$\#\-]+)$/g;
                    addWithoutApostrophe = addressLine2.replace(new RegExp("\\\'","g"), '');
                     if (!forAdd2Regex.test(addWithoutApostrophe)){
                        errorMessages = 'Please provide a valid address';
                        $A.util.addClass(addressLine2Input, 'slds-has-error');
                     }
                 }
                 
                //  let cityRegex = new RegExp('\'');
                //  var forMobCityRegex = /^([a-zA-Z0-9. -]+)$/;
                //  var forMobCityRegex = /^([a-zA-Z0-9\.\ \-]+)$/;
                 var forMobCityRegex = /^([a-zA-Z0-9\.\ \-]+)$/g;
                 addWithoutApostrophe = mailingCity.replace(new RegExp("\\\'","g"), '');
                  if (!forMobCityRegex.test(addWithoutApostrophe)){
                     errorMessages = 'Please provide a valid address';
                     $A.util.addClass(mailingCityInput, 'slds-has-error');
                 }
             }
    
         }

        

        
        return errorMessages;
        
            
        
    }
})