({
    MAX_FILE_SIZE: 25000000, //Max file size 25 MB 
    // CHUNK_SIZE: 5000000,      //Chunk Max size 5 MB
    CHUNK_SIZE: 2500000,      //Chunk Max size 2.5 MB

    getEventOptions : function(component,eventCategory) {
        let options = [];
        if (eventCategory.localeCompare("youth") == 0) {
            options = [{label:"Cherokee Youth, 17 and Under (Gun) October 16-17 (5 Either Sex)", value:"Cherokee Youth, 17 and Under (Gun) October 16-17 (5 Either Sex)"},
                       {label:"Cherokee Youth, 17 and Under (Gun) October 16-17 (5 Antlerless)", value:"Cherokee Youth, 17 and Under (Gun) October 16-17 (5 Antlerless)"},
                       {label:"Cherokee Youth, 17 and Under (Gun) December 4-5 (5 Either Sex)", value:"Cherokee Youth, 17 and Under (Gun) December 4-5 (5 Either Sex)"},
                       {label:"Cherokee Youth, 17 and Under (Gun) December 4-5 (5 Antlerless)", value:"Cherokee Youth, 17 and Under (Gun) December 4-5 (5 Antlerless)"}];
        }
        else if (eventCategory.localeCompare("veteran") == 0) {
            options = [{label:"Cherokee Veteran, (Muzzleloader) October 23-24 (5 Either Sex)", value:"Cherokee Veteran, (Muzzleloader) October 23-24 (5 Either Sex)"},
                       {label:"Cherokee Veteran, (Muzzleloader) October 23-24 (5 Antlerless)", value:"Cherokee Veteran, (Muzzleloader) October 23-24 (5 Antlerless)"},
                       {label:"Cherokee Veteran, (Gun) November 27-28 (5 Either Sex)", value:"Cherokee Veteran, (Gun) November 27-28 (5 Either Sex)"},
                       {label:"Cherokee Veteran, (Gun) November 27-28 (5 Antlerless)", value:"Cherokee Veteran, (Gun) November 27-28 (5 Antlerless)"}];
        }
        else if (eventCategory.localeCompare("atLarge") == 0) {
            options = [{label:"Cherokee At-Large, (Gun) November 20-21 (5 Either Sex)", value:"Cherokee At-Large, (Gun) November 20-21 (5 Either Sex)"},
                       {label:"Cherokee At-Large, (Gun) November 20-21 (5 Antlerless)", value:"Cherokee At-Large, (Gun) November 20-21 (5 Antlerless)"}];
        }
        else if (eventCategory.localeCompare("elder") == 0) {
            options = [{label:"Cherokee Elder, (Muzzleloader) October 30-31 (5 Either Sex)", value:"Cherokee Elder, (Muzzleloader) October 30-31 (5 Either Sex)"},
                       {label:"Cherokee Elder, (Muzzleloader) October 30-31 (5 Antlerless)", value:"Cherokee Elder, (Muzzleloader) October 30-31 (5 Antlerless)"},
                       {label:"Cherokee Elder, (Gun) December 2-3 (5 Either Sex)", value:"Cherokee Elder, (Gun) December 2-3 (5 Either Sex)"},
                       {label:"Cherokee Elder, (Gun) December 2-3 (5 Antlerless)", value:"Cherokee Elder, (Gun) December 2-3 (5 Antlerless)"}];
        }
        return options;
    },

    getEventDescription : function(eventCategory){
        let eventDesc = '';
        if (eventCategory.localeCompare("youth") == 0) {
            eventDesc = 'All youth hunters must be accompanied by a licensed adult throughout the hunt, ' +
            'youth must also possess a license when required and appropriate tag(s) for the hunt drawn. ' +
            'If your tag provided by Cherokee Nation is filled before the hunt you must purchase an additional tag before participating. ' +
            'This is not a bonus hunt. State game laws and bag limits apply. ';
        } else if (eventCategory.localeCompare("veteran") == 0 || eventCategory.localeCompare("elder") == 0) {
            eventDesc = 'Participants must possess hunting license and appropriate tag(s) for the hunt drawn. If your tag provided by Cherokee Nation is filled before the hunt you must purchase an additional tag before participating. This is not a bonus hunt. State game laws and bag limits apply. ';
        } else {
            eventDesc = '';
        }
        return eventDesc;
    },

    getEventDescBold : function(eventCategory){
        let eventDescBold = '';
        if (eventCategory.localeCompare("youth") == 0) {
            eventDescBold = 'If drawn, parent or guardian will be required to sign liability release before youth can participate.  ';
        } else if (eventCategory.localeCompare("veteran") == 0 || eventCategory.localeCompare("elder") == 0) {
            eventDescBold = 'If drawn, participant will be required to sign liability release before participation.';
        } else if (eventCategory.localeCompare("atLarge") == 0) {
            eventDescBold = 'Cherokee Nation will provide appropriate licenses for successful applicants. This is not a bonus hunt. State game laws and bag limits apply.';
        }
        return eventDescBold;
    },

    getDescLine : function(eventCategory){
        return 'Please choose any or all of the following hunts to apply for (applicant can only draw one of 4 options per hunt category)';
    //     let eventDescLine = '';
    //    if (eventCategory.localeCompare("atLarge") == 0) {
    //         eventDescLine = 'Please choose any or all of the following hunts to apply for:';
    //     } else {
    //         eventDescLine = 'Please choose any or all of the following hunts to apply for (applicant can only draw one of 4 options):';
    //     }
    //     return eventDescLine;
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

     // this method shows spinner
     showSpinner: function (component, event, helper)
     {
         var spinner = component.find("Spinner2");
         $A.util.removeClass(spinner, "slds-hide");
     },
      // this method hides spinner
    hideSpinner: function (component, event, helper) 
    {
        var spinner = component.find("mySpinner");
        $A.util.addClass(spinner, "slds-hide");
    },
     // show toast of success and navigate to newly created case record            
	endRequest: function(component, event, helper)
    {
        debugger;
        component.set("v.showReviewScreen", false); 
        component.set("v.huntAppForm",false);
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
        component.set("v.huntAppForm",true);
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

   handleStateChange : function(component, event){
    //    alert("helper");
        var catList = [{label:"Fish and Wildlife Controlled Hunt Youth App", value:"Fish and Wildlife Controlled Hunt Youth App"},
                       {label:"Fish and Wildlife Controlled Hunt Veteran App", value:"Fish and Wildlife Controlled Hunt Veteran App"},
                       {label:"Fish and Wildlife Controlled Hunt At Large App", value:"Fish and Wildlife Controlled Hunt At Large App"},
                       {label:"Fish and Wildlife Controlled Hunt Elder App", value:"Fish and Wildlife Controlled Hunt Elder App"}];
        
        debugger;
        var selectedCategories = [];
        let selectedCategory = '';
        let youthCategory = "Fish and Wildlife Controlled Hunt Youth App";
        let veteranCategory = "Fish and Wildlife Controlled Hunt Veteran App";
        let atLargeCategory = "Fish and Wildlife Controlled Hunt At Large App";
        let elderCategory = "Fish and Wildlife Controlled Hunt Elder App";
        let physicalStateInput = component.find("PhysicalStateInput");
        let selectedVal = "";
        if (!$A.util.isEmpty(physicalStateInput)) {
            selectedVal = physicalStateInput.get("v.value");
        } 
        // let selectedVal = event.getSource().get("v.value");
        let isUnder18 = component.get("v.isApplicantUnder18");
        let isAbove55 = component.get("v.isApplicantAbove55");

        

        if (selectedVal.localeCompare("Oklahoma") == 0 && isUnder18 == "Yes") {
            selectedCategories = catList.filter(item => item.value == youthCategory);
        } else if (selectedVal.localeCompare("Oklahoma") == 0 && isUnder18 == "No" && isAbove55 == "No"){
            selectedCategories = catList.filter(item => item.value == veteranCategory);
        } else if (selectedVal.localeCompare("Oklahoma") == 0 && isUnder18 == "No" && isAbove55 == "Yes"){
            catList.filter(item => {
                if (item.value == veteranCategory || item.value == elderCategory) {
                    selectedCategories.push(item);
                }
            });
        } else {
            selectedCategories = catList.filter(item => item.value == atLargeCategory);
        }

        // if (isUnder18 == "Yes"){
        //     selectedCategories = catList.filter(item => item.value == youthCategory);
        // }

        if (selectedCategories.length > 0) {
            component.set("v.categoryOptions",selectedCategories);
         }

         if (component.get("v.ShowFileModal")) {
             component.set("v.ShowFileModal",false);
         }
         component.set("v.isCategoryOptionSelected",false);
         component.set("v.isYouthOptionSelected",false);
         component.find("aIdSelectCategory").set("v.value",'');

         component.find("aIdSelectEvent").set("v.value",'');
        //action component.set("v.comboCatSelected",false);
         if (component.get("v.comboCatSelected")) {
            component.find("aIdSelectEvent").set("v.value",'');
         }

         component.set("v.W9FileName",'');


        // if (component.get("v.isCategoryOptionSelected")) {
        //     debugger
        //     let huntCategory = component.find("aIdSelectCategory").get("v.value");
        //     selectedCategory = huntCategory.toString().split(',');
        //     if (selectedCategory.includes(atLargeCategory) && selectedVal.localeCompare("Oklahoma") == 0) {
        //         this.showToast("Only out of the state member can apply for At-Large category");
        //     }
        //     if ((selectedCategory.includes(youthCategory) || selectedCategory.includes(elderCategory) ||
        //           selectedCategory.includes(veteranCategory)) && !selectedVal.localeCompare("Oklahoma") == 0) {
        //         this.showToast("State must be Oklahoma");
        //     }

        // }
   },

   CheckFileSize : function(component,event,helper,fSize){
    var ValidSize = true;
    if (fSize > this.MAX_FILE_SIZE) {
        ValidSize = false;
    }
    return ValidSize;
    },

    uploadHelper: function(component, event, helper, f) {
        debugger
        var file = f;
        var self = this;
        // check the selected file size, if select file size greter then MAX_FILE_SIZE,
        // then show a alert msg to user,hide the loading spinner and return from function  
        if (file.size < self.MAX_FILE_SIZE) {
            
            // Convert file content in Base64
            var objFileReader = new FileReader();
            objFileReader.onload = $A.getCallback(function() {
                var fileContents = objFileReader.result;
                var base64 = 'base64,';
                var dataStart = fileContents.indexOf(base64) + base64.length;
                fileContents = fileContents.substring(dataStart);
                self.uploadProcess(component, file, fileContents);
            });
            
            objFileReader.readAsDataURL(file);
        }
    },
    
    uploadProcess: function(component, file, fileContents) {
        debugger
        // set a default size or startpostiton as 0 
        var startPosition = 0;
        // calculate the end size or endPostion using Math.min() function which is return the min. value   
        var endPosition = Math.min(fileContents.length, startPosition + this.CHUNK_SIZE);
        
        // start with the initial chunk, and set the attachId(last parameter)is null in begin
        this.uploadInChunk(component, file, fileContents, startPosition, endPosition, '');
    },
    
    
    uploadInChunk: function(component, file, fileContents, startPosition, endPosition, attachId) {
        debugger
        // call the apex method 'saveFile'
        var getchunk = fileContents.substring(startPosition, endPosition);
        var action = component.get("c.saveFile");
        
        action.setParams({
            // Take current object's opened record. You can set dynamic values here as well
            
            parentId: component.get("v.caseId"), 
            fileName: file.name,
            base64Data: encodeURIComponent(getchunk),
            contentType: file.type,
            fileId: attachId
        });
        debugger
        // set call back 
        action.setCallback(this, function(response) {
            debugger
            attachId = response.getReturnValue();
            var state = response.getState();
            if (state === "SUCCESS") {
                debugger
                // update the start position with end postion
                startPosition = endPosition;
                endPosition = Math.min(fileContents.length, startPosition + this.CHUNK_SIZE);
                if (startPosition < endPosition) {
                    this.uploadInChunk(component, file, fileContents, startPosition, endPosition, attachId);
                }     
                else {
                    debugger
                    this.createContentVersion(component,attachId);
                }
            }
            else if (state === 'ERROR') {
                debugger;
                var msg = response.getReturnValue();
                this.endRequestWithException(component,event,helper);
            }
        });
        $A.enqueueAction(action);
    },

    createContentVersion : function(component, attachId) {
        debugger
        var action = component.get("c.createContentVersion");

        action.setParams({
            attachmentId: attachId
        });

          // set call back 
        action.setCallback(this, function(response) {
            debugger
            var conVersId = response.getReturnValue();
            var state = response.getState();
            if (state === "SUCCESS") {
                debugger
                this.endRequest(component, '', '');
            }
            else if (state === 'ERROR') {
                debugger;
                var msg = response.getReturnValue();
                if ($A.util.isEmpty(msg)) {
                    msg = 'There is some error in uploading file!.'
                }
                component.set("v.exceptionMsg",msg);
                this.endRequestWithException(component,event,helper);
            }
        });
        $A.enqueueAction(action);
    },

    AlphanumericCheck : function(str)
    {
        var code, i, len;

        for (i = 0, len = str.length; i < len; i++) {
          code = str.charCodeAt(i);
          if (!(code > 47 && code < 58) && // numeric (0-9)
              !(code > 64 && code < 91) && // upper alpha (A-Z)
              !(code > 96 && code < 123) && // lower alpha (a-z)
              !(code == 45)) { // dash and underscore
            return false;
          }
        }
        return true;
        // debugger
        // var charCode = (event.which) ? event.which : event.keyCode;
        // if (!(code > 47 && code < 58) && // numeric (0-9)
        //         !(code > 64 && code < 91) && // upper alpha (A-Z)
        //         !(code > 96 && code < 123)) { // lower alpha (a-z)
        //             event.preventDefault();
        // }
    },

    checkValidation : function(component,event){
        var errorMessages = null;
        var acc = component.get("v.accObj");
        var mobileNoInput = component.find("aIdPhone");
        // var mobileNo = mobileNoInput.get("v.value").replace(/\D/g, '');
        var mobileNo = mobileNoInput.get("v.value");
        var huntCatInput = component.find("aIdSelectCategory");
        var huntCat = huntCatInput.get("v.value");
        let selectedCategory = "";
        if(!huntCat[0] == ""){
            selectedCategory = huntCat.toString().split(',');
        } 
        let youthCategory = "Fish and Wildlife Controlled Hunt Youth App";
        let veteranCategory = "Fish and Wildlife Controlled Hunt Veteran App";
        let atLargeCategory = "Fish and Wildlife Controlled Hunt At Large App";
        let elderCategory = "Fish and Wildlife Controlled Hunt Elder App";

        var requiredFields = $A.get("$Label.c.CommunityFillRequiredFields");
        var showPhysicalState = component.get("v.showPhysicalState");
        var showPhysicalOtherState = component.get("v.showPhysicalOtherState");
        var showPG_PhysicalState = component.get("v.showPG_PhysicalState");
        var showPG_PhysicalOtherState = component.get("v.showPG_PhysicalOtherState");
        

        var isHuntingLicenseHolderInput = component.find("aIdSelectOption");
        var isHuntingLicenseHolder = isHuntingLicenseHolderInput.get("v.value");

        var eventOptions = null;
        var selectedEvent = null;
        var comboEventOptions = null;
        var comboSelectedEvent = null;
        if(! $A.util.isEmpty(selectedCategory) ) {
            debugger;
            var eventOptionInput = component.find("aIdSelectEvent");
            eventOptions = component.find("aIdSelectEvent").get("v.value");
            if(!eventOptions[0] == ""){
                selectedEvent = eventOptions.toString().split(',');
            } 
            var comboSelected = component.get("v.comboCatSelected");
            if (comboSelected) {
                var comboEventOptionInput = component.find("aIdSelectComboEvent");
                comboEventOptions = component.find("aIdSelectComboEvent").get("v.value");
                if(!comboEventOptions[0] == ""){
                    comboSelectedEvent = comboEventOptions.toString().split(',');
                } 
                
            }
        }
       

        //Applicant Physical Address
        var physicalStreetInput = component.find("PhysicalStreetInput");
        var physicalAddress = physicalStreetInput.get("v.value");
        var physicalCityInput = component.find("PhysicalCityInput");
        var physicalCity = physicalCityInput.get("v.value");
        var physicalState = '';
        var physicalOtherState = '';
        // var physicalCounty = component.find("physicalCounty").get("v.value");
        var physicalZipInput = component.find("PhysicalzipInput");
        var physicalZip = physicalZipInput.get("v.value");
        var physicalCountryInput = component.find("PhysicalCountryInput"); 
        var physicalCountry = physicalCountryInput.get("v.value"); 
        var physicalSuite = component.find("PhysicalSuiteInput").get("v.value");
        var physicalAddress2 = component.find("PhysicalAddress2Input").get("v.value");
        var physicalMelissaAddress = component.get("v.p_selectedAddress");
        var IsLookUpVisible = component.get("v.showLookUp");
        if(IsLookUpVisible == true)
        {
            var physicalffAddress = component.find("p_AddressFreeFormInput");
            var physicalffAddressValue = physicalffAddress.get("v.value");
        }
        
        var isAddressCorrectInput = "";
        var isAddressCorrect = "";
        debugger;
        isAddressCorrectInput = component.find("acceptCheckBox");
        isAddressCorrect = isAddressCorrectInput.get("v.checked");
        // if (component.get("v.p_isManual")) {
        //     isAddressCorrectInput = component.find("acceptCheckBox");
        //     isAddressCorrect = isAddressCorrectInput.get("v.checked");
        // }
        if(showPhysicalState){
            debugger;
            var physicalStateInput = component.find("PhysicalStateInput");
            physicalState = physicalStateInput.get("v.value");
        } else {
            var physicalOtherStateInput = component.find("PhysicalOtherState");
            physicalOtherState = physicalOtherStateInput.get("v.value");
        }

        //Parent/Guardian Info
        if (selectedCategory.includes(youthCategory) || component.get("v.isYouthOptionSelected")) {
            var PG_FirstNameInput = component.find("aIdGuardFirstName");
            var PG_FirstName = component.find("aIdGuardFirstName").get("v.value");
            // var PG_MiddleNameInput = component.find("aIdGuardMiddleName");
            // var PG_MiddleName = component.find("aIdGuardMiddleName").get("v.value");
            var PG_LastNameInput = component.find("aIdGuardLastName");
            var PG_LastName = component.find("aIdGuardLastName").get("v.value");
            var PG_DriverLicenseNoInput = component.find("aIdGuardDrivLicNo");
            var PG_DriverLicenseNo = component.find("aIdGuardDrivLicNo").get("v.value");
            var PG_MobileInput = component.find("PG_aIdPhone");
            var PG_Mobile = PG_MobileInput.get("v.value");

            var PG_PhysicalStreetInput = component.find("PG_PhysicalStreetInput");
            var PG_PhysicalAddress = component.find("PG_PhysicalStreetInput").get("v.value");
            var PG_PhysicalCityInput = component.find("PG_PhysicalCityInput");
            var PG_PhysicalCity = component.find("PG_PhysicalCityInput").get("v.value");
            var PG_PhysicalState = '';
            var PG_PhysicalOtherState = '';
            // var PG_PhysicalCountyInput = component.find("PG_PhysicalCounty");
            // var PG_PhysicalCounty = component.find("PG_PhysicalCounty").get("v.value");
            var PG_PhysicalZipInput = component.find("PG_PhysicalzipInput");
            var PG_PhysicalZip = component.find("PG_PhysicalzipInput").get("v.value");
            var PG_PhysicalCountryInput = component.find("PG_PhysicalCountryInput");
            var PG_PhysicalCountry = component.find("PG_PhysicalCountryInput").get("v.value"); 
            var PG_PhysicalSuiteInput = component.find("PG_PhysicalSuiteInput");
            var PG_PhysicalSuite = component.find("PG_PhysicalSuiteInput").get("v.value");
            var PG_PhysicalAddress2Input = component.find("PG_PhysicalAddress2Input");
            var PG_PhysicalAddress2 = component.find("PG_PhysicalAddress2Input").get("v.value");
            var PG_PhysicalMelissaAddress = component.get("v.selectedAddress");
            var IsLookUpVisible = component.get("v.PG_showLookUp");
            if(IsLookUpVisible == true){
                var PG_PhysicalffAddressValue = component.find("AddressFreeFormInput").get("v.value");
            }
            if(showPhysicalState){
                var PG_PhysicalStateInput = component.find("PG_PhysicalStateInput");
                PG_PhysicalState = component.find("PG_PhysicalStateInput").get("v.value");
            } else {
                var PG_PhysicalOtherStateInput = component.find("PG_PhysicalOtherState");
                PG_PhysicalOtherState = component.find("PG_PhysicalOtherState").get("v.value");
            }

            debugger;
            var PG_isAddressCorrectInput = "";
            var PG_isAddressCorrect = "";
            // if (component.get("v.isManual")) {
            //     PG_isAddressCorrectInput = component.find("PG_AcceptCheckBox");
            //     PG_isAddressCorrect = PG_isAddressCorrectInput.get("v.checked");
            // }

            //Accompanying Adult Fields
            var AA_FirstNameInput = component.find("AA_aIdFirstName");
            var AA_FirstName = component.find("AA_aIdFirstName").get("v.value");
            // var AA_MiddleNameInput = component.find("AA_aIdMiddleName");
            // var AA_MiddleName = component.find("AA_aIdMiddleName").get("v.value");
            var AA_LastNameInput = component.find("AA_aIdLastName");
            var AA_LastName = component.find("AA_aIdLastName").get("v.value");
            var AA_DriverLicenseNoInput = component.find("AA_aIdDrivLicNo");
            var AA_DriverLicenseNo = component.find("AA_aIdDrivLicNo").get("v.value");
            var AA_MobileInput = component.find("AA_aIdPhone");
            var AA_Mobile = AA_MobileInput.get("v.value");
            
        }

        var isVeteranSelected = component.get("v.isVeteranOptionSelected");

        //------------Validation Handling-------------------

        var physicalAddressRequiredField = component.get("v.physicalAddressRequired");
        var physicalOtherStateRequired = component.get("v.physicalOtherStateRequired");
        var physicalStateRequired = component.get("v.physicalStateRequired");
        var PG_PhysicalAddressRequired = component.get("v.PG_PhysicalAddressRequired");
        var PG_PhysicalOtherStateRequired = component.get("v.PG_PhysicalOtherStateRequired");
        var PG_PhysicalStateRequired = component.get("v.PG_PhysicalStateRequired");

        var physicalIsManual = component.get("v.p_isManual");
        var PG_PhysicalIsManual = component.get("v.isManual");
        
        //Category and Physical State validation
        if (!$A.util.isEmpty(physicalState) && !$A.util.isEmpty(selectedCategory)) {
            if (selectedCategory.includes(atLargeCategory) && physicalState.localeCompare("Oklahoma") == 0) {
                this.showToast("Only out of the state member can apply for At-Large category");
                return;
            }
            if ((selectedCategory.includes(youthCategory) || selectedCategory.includes(elderCategory) ||
                  selectedCategory.includes(veteranCategory)) && !physicalState.localeCompare("Oklahoma") == 0) {
                this.showToast("State must be Oklahoma");
                return;
            }
        }

         // Category type required field validation
         if($A.util.isEmpty(selectedCategory) ) {
             errorMessages = requiredFields;  
             $A.util.addClass(huntCatInput, 'slds-has-error');
         }
         debugger
         //Applicant Mobile Number Field Validation
         if($A.util.isEmpty(mobileNo)) {
            errorMessages = requiredFields;  
            $A.util.addClass(mobileNoInput, 'slds-has-error');
        }

        //----Mobile No Regex----
        //  var mobRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        // if($A.util.isEmpty(mobileNo)) {
        //     errorMessages = requiredFields;  
        //     $A.util.addClass(mobileNoInput, 'slds-has-error');
        // } else if (!mobRegex.test(mobileNo)) {
        //     helper.showToast("Please provide a valid mobile number");
        //     errorMessages = requiredFields;
        // }

         //Email Validation
        // var emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        // var emailInput = component.find("aIdEmail");
        // var email = emailInput.get("v.value");
        // if ($A.util.isEmpty(email)) {
        //     errorMessages = requiredFields;
        //     $A.util.addClass(emailInput, 'slds-has-error');
        // }  else if (!emailRegex.test(email)) {
        //     this.showToast("Please provide a valid email address");
        //     errorMessages = requiredFields;
        // }

        //Applicant Physical Address Required Fields Validation
        if (physicalAddressRequiredField) {
            if (physicalIsManual) {
                if($A.util.isEmpty(physicalAddress) || $A.util.isEmpty(physicalCity) || 
                       $A.util.isEmpty(physicalZip) || $A.util.isEmpty(physicalCountry)) {
                        errorMessages = requiredFields;  
                    }
                //Physical State/Other State Validation
                debugger;
                if (physicalStateRequired) {
                    if ($A.util.isEmpty(physicalState)) {
                        errorMessages = requiredFields;  
                        $A.util.addClass(physicalStateInput, 'slds-has-error');
                    }
                } else {
                    if ($A.util.isEmpty(physicalOtherState)) {
                        errorMessages = requiredFields;  
                        $A.util.addClass(physicalOtherStateInput, 'slds-has-error');
                    }
                }

                //is Physical Street field is empty?
                if($A.util.isEmpty(physicalAddress)) {
                    $A.util.addClass(physicalStreetInput, 'slds-has-error');
                }
                
                //is Physical City field is empty?
                if($A.util.isEmpty(physicalCity))  {
                    $A.util.addClass(physicalCityInput, 'slds-has-error');
                }
                
                //is Physical Country field is empty?
                if($A.util.isEmpty(physicalCountry)) {
                    $A.util.addClass(physicalCountryInput, 'slds-has-error');
                }
                
                //is Physical Zip field is empty?
                if($A.util.isEmpty(physicalZip)) {
                    $A.util.addClass(physicalZipInput, 'slds-has-error');
                }

                if (!isAddressCorrect) {
                    $A.util.addClass(isAddressCorrectInput, 'slds-has-error');
                    errorMessages = requiredFields; 
                }

            } else {
                if (!isAddressCorrect) {
                    $A.util.addClass(isAddressCorrectInput, 'slds-has-error');
                    errorMessages = requiredFields;  
                }
                //is Physical Free Form Address field is empty?
                // if($A.util.isEmpty(physicalffAddressValue)) 
                // {
                //     component.set("v.p_FFAddressRequired", true);
                //     $A.util.addClass(physicalffAddress, 'slds-has-error');
                // } 
            }
        }

        if (!isAddressCorrect) {
            $A.util.addClass(isAddressCorrectInput, 'slds-has-error');
            errorMessages = requiredFields; 
        }
        

        //Parent/Guardian Fields Validaton
        if (component.get("v.isYouthOptionSelected")) {
            var licenseRegex = /^([a-zA-Z0-9-]+)$/;

            if ($A.util.isEmpty(PG_FirstName) || $A.util.isEmpty(PG_LastName) || 
                    $A.util.isEmpty(PG_DriverLicenseNo) || $A.util.isEmpty(PG_Mobile)) {
                    errorMessages = requiredFields;  
            }
            if ($A.util.isEmpty(PG_FirstName)) {
                $A.util.addClass(PG_FirstNameInput, 'slds-has-error');
            }
            // if ($A.util.isEmpty(PG_MiddleName)) {
            //     $A.util.addClass(PG_MiddleNameInput, 'slds-has-error');
            // }
            if ($A.util.isEmpty(PG_LastName)) {
                $A.util.addClass(PG_LastNameInput, 'slds-has-error');
            }
            if ($A.util.isEmpty(PG_DriverLicenseNo)) {
                $A.util.addClass(PG_DriverLicenseNoInput, 'slds-has-error');
            } else if (!licenseRegex.test(PG_DriverLicenseNo)) {
                this.showToast("Please provide a valid Driver License No");
                errorMessages = requiredFields;
                $A.util.addClass(PG_DriverLicenseNoInput, 'slds-has-error');
            }
            if ($A.util.isEmpty(PG_Mobile)) {
                $A.util.addClass(PG_MobileInput, 'slds-has-error');
            }
        }

        //Parent/Guardian Physical Address Validaton
        if (PG_PhysicalAddressRequired) {
            if (PG_PhysicalIsManual) {
                if($A.util.isEmpty(PG_PhysicalAddress) || $A.util.isEmpty(PG_PhysicalCity) || 
                       $A.util.isEmpty(PG_PhysicalZip) || $A.util.isEmpty(PG_PhysicalCountry)) {
                        errorMessages = requiredFields;  
                    }
                //Physical State/Other State Validation
                if (PG_PhysicalStateRequired) {
                    if ($A.util.isEmpty(PG_PhysicalState)) {
                        errorMessages = requiredFields;  
                        $A.util.addClass(PG_PhysicalStateInput, 'slds-has-error');
                    }
                } else {
                    if ($A.util.isEmpty(PG_PhysicalOtherState)) {
                        errorMessages = requiredFields;  
                        $A.util.addClass(PG_PhysicalOtherStateInput, 'slds-has-error');
                    }
                }

                //is Physical Street field is empty?
                if($A.util.isEmpty(PG_PhysicalAddress)) {
                    $A.util.addClass(PG_PhysicalStreetInput, 'slds-has-error');
                }
                
                //is Physical City field is empty?
                if($A.util.isEmpty(PG_PhysicalCity))  {
                    $A.util.addClass(PG_PhysicalCityInput, 'slds-has-error');
                }
                
                //is Physical Country field is empty?
                if($A.util.isEmpty(PG_PhysicalCountry)) {
                    $A.util.addClass(PG_PhysicalCountryInput, 'slds-has-error');
                }
                
                //is Physical Zip field is empty?
                if($A.util.isEmpty(PG_PhysicalZip)) {
                    $A.util.addClass(PG_PhysicalZipInput, 'slds-has-error');
                }

            } else {
                //is Physical Free Form Address field is empty?
                // if($A.util.isEmpty(physicalffAddressValue)) 
                // {
                //     component.set("v.p_FFAddressRequired", true);
                //     $A.util.addClass(physicalffAddress, 'slds-has-error');
                // } 
            }
        }

        // if (PG_PhysicalIsManual && !PG_isAddressCorrect) {
        //     $A.util.addClass(PG_isAddressCorrectInput, 'slds-has-error');
        //     errorMessages = requiredFields;  
        // }

        //License Holder Field Validation
        debugger;
        if ($A.util.isEmpty(isHuntingLicenseHolder)) {
            errorMessages = requiredFields;  
            $A.util.addClass(isHuntingLicenseHolderInput, 'slds-has-error');
        }

        //Accompanying Adult Fields Validations
         if (component.get("v.isYouthOptionSelected")) {
            var licenseRegex = /^([a-zA-Z0-9_-]+)$/;

            if ($A.util.isEmpty(AA_FirstName) || $A.util.isEmpty(AA_LastName) || 
                    $A.util.isEmpty(AA_DriverLicenseNo) || $A.util.isEmpty(AA_Mobile)) {
                    errorMessages = requiredFields;  
            }
            if ($A.util.isEmpty(AA_FirstName)) {
                $A.util.addClass(AA_FirstNameInput, 'slds-has-error');
            }
            // if ($A.util.isEmpty(PG_MiddleName)) {
            //     $A.util.addClass(PG_MiddleNameInput, 'slds-has-error');
            // }
            if ($A.util.isEmpty(AA_LastName)) {
                $A.util.addClass(AA_LastNameInput, 'slds-has-error');
            }
            if ($A.util.isEmpty(AA_DriverLicenseNo)) {
                $A.util.addClass(AA_DriverLicenseNoInput, 'slds-has-error');
            } else if (!licenseRegex.test(AA_DriverLicenseNo)) {
                this.showToast("Please provide a valid Driver License No");
                errorMessages = requiredFields;
                $A.util.addClass(AA_DriverLicenseNoInput, 'slds-has-error');
            }
            if ($A.util.isEmpty(AA_Mobile)) {
                $A.util.addClass(AA_MobileInput, 'slds-has-error');
            }
        }

        //Event Section Fields Validation
        if (component.get("v.isCategoryOptionSelected")) {
            if($A.util.isEmpty(selectedEvent) ) {
                errorMessages = requiredFields;  
                $A.util.addClass(eventOptionInput, 'slds-has-error');
            }
            if(comboSelected && $A.util.isEmpty(comboSelectedEvent) ) {
                errorMessages = requiredFields;  
                $A.util.addClass(comboEventOptionInput, 'slds-has-error');
            }
        }

        //File Validation
        debugger
        if (isVeteranSelected && $A.util.isEmpty(component.get("v.W9FileName"))) {
            $A.util.addClass(component.find("W9FileId"), 'slds-has-error');
            errorMessages = requiredFields ;
            this.showToast('Please Upload File');
        }

        // Parent/ Guardian and Acompanying Adult name fields validations
       if (errorMessages == null)
       {
           if (component.get("v.isYouthOptionSelected")) {
               if (!$A.util.isEmpty(PG_FirstName) && !$A.util.isEmpty(PG_LastName) && !$A.util.isEmpty(AA_FirstName) && !$A.util.isEmpty(AA_LastName)) {
                    var alphaChar = /^[a-zA-Z -]*$/;
                    var PG_FirstNameCheck = alphaChar.test(PG_FirstName).toString();
                    var PG_LastNameCheck = alphaChar.test(PG_LastName).toString();
                    var AA_FirstNameCheck = alphaChar.test(AA_FirstName).toString();
                    var AA_LastNameCheck = alphaChar.test(AA_LastName).toString();
                
                    if(PG_FirstNameCheck == 'false' || PG_LastNameCheck == 'false' || AA_FirstNameCheck == 'false' || AA_LastNameCheck == 'false')
                    {
                        errorMessages='Parent Guardian and Accompanying Adult name fields cannot contain special characters or numbers.';
                    }
                }
           }
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

            if (errorMessages == null) {
                if (!$A.util.isEmpty(PG_Mobile)) {
                    var numTestForPG = numRegex.test(PG_Mobile).toString();
                    if (numTestForPG == 'false') {
                        errorMessages='Parent/Guardian Mobile number should not contain alphabets or special characters.';
                    }
                }
            }
           
            if (errorMessages == null) {
                if (!$A.util.isEmpty(AA_Mobile)) {
                    var numTestForAA = numRegex.test(AA_Mobile).toString();
                    if (numTestForAA == 'false') {
                        errorMessages='Accompanying Adult Mobile number should not contain alphabets or special characters.';
                    }
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

             if (errorMessages == null) {
                if(!$A.util.isEmpty(PG_Mobile))  {
                    PG_Mobile = PG_Mobile.replace(/\D/g, '');
                    var PG_fChar = PG_Mobile.charAt(0);
                     
                     if(PG_Mobile.length != 10) {
                        errorMessages='Parent/Guardian Mobile number must contain 10 digits.';
                     }
                     if(PG_fChar == '1'  || PG_fChar == '0'){
                        errorMessages='Parent/Guardian Mobile number should not begin with 1 or 0.';
                     }
                    
                 }
             }
             
             if (errorMessages == null) {
                if(!$A.util.isEmpty(AA_Mobile))  {
                    AA_Mobile = AA_Mobile.replace(/\D/g, '');
                    var AA_fChar = AA_Mobile.charAt(0);
                    
                    if(AA_Mobile.length != 10) {
                       errorMessages='Accompanying Adult Mobile number must contain 10 digits.';
                    }
                    if(AA_fChar == '1'  || AA_fChar == '0'){
                       errorMessages='Accompanying Adult Mobile number should not begin with 1 or 0.';
                    }
                   
                }
            }
             
        }

        //PG Address validation
        if (errorMessages == null) {
            if (component.get("v.isYouthOptionSelected")) {
                var isAddSame = component.find("aIdAddSame").get("v.checked");
                if (!isAddSame) {
                    if ($A.util.isEmpty(PG_PhysicalAddress) || $A.util.isEmpty(PG_PhysicalCity) || $A.util.isEmpty(PG_PhysicalCountry) || $A.util.isEmpty(PG_PhysicalState) || $A.util.isEmpty(PG_PhysicalZip)) {
                        errorMessages = 'Kindly fill all the PG address required fields or check the address same as above.';
                    }
                }
            }
            
        }

        //Applicant address required fields validtions
        if (errorMessages == null) {
            if($A.util.isEmpty(physicalAddress) || $A.util.isEmpty(physicalCity) || 
                  $A.util.isEmpty(physicalZip) || $A.util.isEmpty(physicalCountry)) {
                  errorMessages = 'Please make sure all address fields are complete.';  
            }
            //Physical State/Other State Validation
             debugger;
            if (physicalStateRequired) {
                if ($A.util.isEmpty(physicalState)) {
                    errorMessages = 'Please make sure all required address fields are complete.';
                 }
            } else {
                if ($A.util.isEmpty(physicalOtherState)) {
                    errorMessages = 'Please make sure all required address fields are complete.';
                }
            }
        }
        return errorMessages;
        
            
        
    }

//     SubmitERAP.setCallback(this, function(response) {
//         debugger;
//         var state = response.getState();
        
//         if (state == 'SUCCESS') {
//             var Caseresult = response.getReturnValue();
//             if(Caseresult){
//                 component.set("v.CaseId",Caseresult.CaseId); 
//             }
            
//             // After Save, File uploading work will be done.
            
//             // First, Tax files will be uploaded
//             if(component.get("v.TaxfileName") != ''){
//                 if(component.find("TaxfileId")){
//                     if(component.find("TaxfileId").get("v.files") != null){
//                         var Taxfiles = component.find("TaxfileId").get("v.files");
//                         var TaxFilesCount = Taxfiles.length;
//                         if (TaxFilesCount > 0) {
//                             for (var i = 0; i < TaxFilesCount; i++) 
//                             {
//                                 helper.uploadHelper(component, event, helper, Taxfiles[i]);
//                             }
//                         }
//                     }
//                 }
//             }
//              // Then, Lease files will be uploaded
//             if(CaseObj.Current_Lease_Agreement__c == 'Yes' && component.get("v.LeasefileName") != ''){
//                 if(component.find("LeasefileId")){
//                     if(component.find("LeasefileId").get("v.files") != null){
//                         var Leasefiles = component.find("LeasefileId").get("v.files");
//                         var LeaseFilesCount = Leasefiles.length;
//                         if (LeaseFilesCount > 0) {
//                             for (var i = 0; i < LeaseFilesCount; i++) 
//                             {
//                                 helper.uploadHelper(component, event, helper, Leasefiles[i]);
//                             }
//                         }
//                     }
//                 }
//             }
//             // Then, Unemployment benefit proof files will be uploaded
//             if(CaseObj.Unemployment_Benefits__c == 'Yes' && component.get("v.UnEmpBenfileName") != ''){
//                 if(component.find("UnEmpBenfileId")){
//                     if(component.find("UnEmpBenfileId").get("v.files") != null){
//                         var UnEmpBenfiles = component.find("UnEmpBenfileId").get("v.files");
//                         var UnEmpBenfilesCount = UnEmpBenfiles.length;
//                         if (UnEmpBenfilesCount > 0) {
//                             for (var i = 0; i < UnEmpBenfilesCount; i++) 
//                             {
//                                 helper.uploadHelper(component, event, helper, UnEmpBenfiles[i]);
//                             }
//                         }
//                     }
//                 }
//             }
//             setTimeout(function(){
//                 if(Caseresult){   
//                     component.set("v.isLoading", false);
//                     if(Caseresult.CaseRejected)
//                         helper.showErrorMessage(component,event,helper,'You do not qualify due to Maximum Gross Income criteria');
//                     else
//                         helper.showSuccessMessage(component,event,helper,'Your application is submitted for review');
//                     setTimeout(function(){
//                         window.location.assign("/s/my-cases","_blank");
//                     }, 3000);
//                 }
//             }, 1000);
        
//         }
//         else if (state == 'ERROR'){
//             component.set("v.isLoading", false);
//             let errors = response.getError();
//             helper.showErrorMessage(component,event,helper,errors[0].message.split("message")[1]);
//         }
//     })
//     $A.enqueueAction(SubmitERAP);
// },
})