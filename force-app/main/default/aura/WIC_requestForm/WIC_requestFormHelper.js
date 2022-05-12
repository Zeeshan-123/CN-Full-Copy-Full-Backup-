({
    setExistingCaseAtts : function name(cmp, event, helper, existingCase) {
        cmp.set("v.caseId", existingCase.Id);
        cmp.set("v.confirmationNumber", existingCase.CaseNumber);

        // Show success message for existing case record
        cmp.set("v.showSuccessMessage", true);
    },

    addAccountRecord: function (component, event) {
        //get the account List from component  
        var accountList = component.get("v.accountList");

        //Add New Account Record
        accountList.push({
            'sobjectType': 'Account',
            'FirstName': '',
            'Middle_Name__c': '',
            'LastName': '',
            'Suffix__c': '',
            'HealthCloudGA__Gender__pc': '',
            'Ethnicity__c': '',
            'Tribe__c': '',
            'Other_Tribe__c': '',
            'Date_of_Birth__c': '',
            'Grade__c': '',
            'School__c': '',
            'Foster_Child__c': '',
            'Migrant__c': ''
        });
        component.set("v.accountList", accountList);
    },

    validateAccountList: function (component, event) {
        var errorMessages = null;

        //Validate all account records
        var isValid = true;
        var accountList = component.get("v.accountList");
        for (var i = 0; i < accountList.length; i++) {
            if (accountList[i].FirstName == '' || accountList[i].LastName == '' || accountList[i].HealthCloudGA__Gender__pc == ''
                || accountList[i].Date_of_Birth__c == '' || accountList[i].Grade__c == '' || accountList[i].School__c == '') {
                isValid = false;
                errorMessages = 'You must fill in all of the required fields on the child record in row number ' + (i + 1);
            }

            if (!$A.util.isEmpty(accountList[i].Date_of_Birth__c)) {
                isValid = false;
                var date_regex = /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/;
                var checkDateFormate = date_regex.test(accountList[i].Date_of_Birth__c);

                if (!checkDateFormate) {
                    if (errorMessages == null) {
                        errorMessages = 'Invalid date format at row number ' + (i + 1) + ', correct one is MM/DD/YYYY.';
                    }
                    else {
                        errorMessages += " " + 'Invalid date format at row number ' + (i + 1) + ', correct one is MM/DD/YYYY.';
                    }
                }
            }
        }

        if (errorMessages != null) {
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: 'Warning',
                message: errorMessages,
                duration: ' 3000',
                key: 'info_alt',
                type: 'error',
                mode: 'dismissible'
            });
            toastEvent.fire();
        }
        return isValid;
    },

    // CNHPHOMS-16: Moved data save logic from Controller JS to helper JS
    initiateFormSave: function(component, event, helper) {
        // Disable NEXT button
        component.set("v.isActive", true);
        
        let objSelectedVals = component.get('v.objSelectedVals');

        // date formatting
        var priConDob               =    objSelectedVals.selectedpriConDob;
        var formatedDate = priConDob.replace(/(\d\d)\/(\d\d)\/(\d{4})/, "$3-$1-$2");
        // var accountList = component.get("v.accountList");

        var action = component.get("c.saveAccounts");
        action.setParams({
            childsAccountList      :    component.get("v.accountList"), //accountList,
            spokenHomeLanguage     :    objSelectedVals.selectedSpokenHomeLanguage, //spokenLanguage,
            otherLanguage          :    objSelectedVals.selectedOtherLanguage, //otherLanguage,
            programParticipated    :    objSelectedVals.selectedPrograms, //programParticipated,
            householdIncome        :    objSelectedVals.selectedHouseholdIncome, //householdIncome,
            incomeFrequency        :    objSelectedVals.selectedIncomeFrequency, //incomeFrequency,
            householdSize          :    objSelectedVals.selectedHouseholdSize, //householdSize,
            priConFirstName        :    objSelectedVals.selectedpriConFirstName, //priConFirstName,
            priConMiddleName       :    objSelectedVals.selectedpriConMiddleName, //priConMiddleName,
            priConLastName         :    objSelectedVals.selectedpriConLastName, //priConLastName,
            priConSuffix           :    objSelectedVals.selectedpriConSuffix, //priConSuffix,
            dob                    :    formatedDate,
            priConCitizenNumber    :    objSelectedVals.selectedpriConCitizenshipNumber, //priConCitizenNumber,
            physicalStreet         :    objSelectedVals.selectedPhysicalStreetInput, //physicalStreet,
            physicalCity           :    objSelectedVals.selectedPhysicalCityInput, //physicalCity,
            physicalCountry        :    objSelectedVals.selectedPhysicalCountryInput, //physicalCountry,
            physicalState          :    objSelectedVals.selectedPhysicalStateInput, //physicalState,
            physicalZip            :    objSelectedVals.selectedPhysicalzipInput, //physicalZip,
            mailingStreet          :    objSelectedVals.selectedMailingStreetInput, //mailingStreet,
            mailingCity            :    objSelectedVals.selectedMailingCityInput, //mailingCity,
            mailingCountry         :    objSelectedVals.selectedMailingCountryInput, //mailingCountry,
            mailingState           :    objSelectedVals.selectedMailingStateInput, //mailingState,
            mailingZip             :    objSelectedVals.selectedMailingzipInput, //mailingZip,
            priConEmail            :    objSelectedVals.selectedpriConEmail, //priConEmail,
            priHomePhone           :    objSelectedVals.selectedpriConHomePhone, //priConHomePhone,
            priMobilePhone         :    objSelectedVals.selectedpriConCellPhone, //priConCellPhone,
            priWorkPhone           :    objSelectedVals.selectedpriConWorkPhone, //priConWorkPhone,
            secConFirstName        :    objSelectedVals.selectedsecConFirstName, //secConFirstName,
            secConLastName         :    objSelectedVals.selectedsecConLastName, //secConLastName,
            secConPhone            :    objSelectedVals.selectedsecConPhone, //secConPhone,
            secConEmail            :    objSelectedVals.selectedsecConEmail, //secConEmail
            mapWicsFormData        :    {
                'isCNCitizen'           :   component.get('v.isCNCitizen'),
                'deviceType'            :   $A.get("$Browser.formFactor"),
                'abtAssociateConsent'   :   objSelectedVals.abtAssociateConsent
            }
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            var result = response.getReturnValue();
            
            if (state === 'SUCCESS') {
                if(result.isSuccess && result.hasOwnProperty('userCase') && result.userCase.hasOwnProperty('Id')) {
                    // Set Case Id & number attributes
                    component.set("v.caseId", result.userCase.Id);
                    component.set("v.confirmationNumber", result.userCase.CaseNumber);

                    component.set("v.showEBTForm", false);          // Hide EBT form
                    component.set('v.isShowReviewForm', false);     // Hide Review Form
                    component.set("v.showSuccessMessage", true);    // Show success message

                    // Hide Spinner
                    var spinner = component.find("saveSpinner");
                    $A.util.removeClass(spinner, "slds-show");
                    $A.util.addClass(spinner, "slds-hide");
                } else {
                    component.set("v.isActive", false);             // Enable Next button
                    component.set("v.showEBTForm", true);           // Show EBT form
                    component.set('v.isShowReviewForm', false);     // Hide Review Form

                    // Show Error toast message
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title: 'ERROR',
                        message: result.strErrorMesage,
                        duration: ' 10000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'dismissible'
                    });
                    toastEvent.fire();
                }
            }
            else if (state === 'ERROR') {
                if(!result.isSuccess) {
                    component.set("v.isActive", false);                 // Enable Next button
                    component.set("v.showEBTForm", true);               // Show EBT form
                    component.set('v.isShowReviewForm', false);         // Hide Review Form
                    
                    // Hide Spinner
                    var spinner = component.find("saveSpinner");
                    $A.util.removeClass(spinner, "slds-show");
                    $A.util.addClass(spinner, "slds-hide");

                    // Show Error toast message
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title: 'ERROR',
                        message: result.strErrorMesage,
                        duration: ' 10000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'dismissible'
                    });
                    toastEvent.fire();
                }
            }
            else {
                // Hide Spinner
                var spinner = component.find("saveSpinner");
                $A.util.removeClass(spinner, "slds-show");
                $A.util.addClass(spinner, "slds-hide");
            }
        });
        $A.enqueueAction(action);
    },

    // CNHPHOMS-16 & CNHPHOMS-37: Set default value to the selected object
    setDefaultSelelctedObj: function(component, event, helper, currentUserAcc) {
        let conDOB;
        let sfFormatDOB = currentUserAcc.hasOwnProperty('Date_of_Birth__c') ? currentUserAcc.Date_of_Birth__c : '';
        if(sfFormatDOB != null && sfFormatDOB != '' && sfFormatDOB != undefined && sfFormatDOB) {
            // Change coming date format as per page format i.e., from YYYY-MM-DD to MM/DD/YYYY
            let lstDOBsplits = sfFormatDOB.split('-');
            conDOB = lstDOBsplits[1] + '/' + lstDOBsplits[2] + '/' + lstDOBsplits[0];
        }

        let isCNCitizen = component.get('v.isCNCitizen');
        let objSelectedVals = {
            'selectedChildCount'                     :  '',
            'accountList'                            :  [],
            'selectedSpokenHomeLanguage'             :  '',
            'diableOtherLanguage'                    :  true,
            'selectedOtherLanguage'                  :  '',
            'selectedPrograms'                       :  '',
            'selectedIncomeFrequency'                :  '',
            'selectedHouseholdIncome'                :  '',
            'selectedHouseholdSize'                  :  '',
            'selectedpriConFirstName'                :  currentUserAcc.hasOwnProperty('FirstName') ? currentUserAcc.FirstName : '',
            'selectedpriConMiddleName'               :  currentUserAcc.hasOwnProperty('Middle_Name__c') ? currentUserAcc.Middle_Name__c : '',
            'selectedpriConLastName'                 :  currentUserAcc.hasOwnProperty('LastName') ? currentUserAcc.LastName : '',
            'selectedpriConSuffix'                   :  currentUserAcc.hasOwnProperty('Suffix__c') ? currentUserAcc.Suffix__c : '',
            'selectedpriConEmail'                    :  currentUserAcc.hasOwnProperty('PersonEmail') ? currentUserAcc.PersonEmail : '',
            'selectedpriConDob'                      :  (conDOB != null && conDOB != '' & conDOB != undefined && conDOB) ? conDOB : '',
            'selectedpriConCitizenshipNumber'        :  '',
            'selectedMailingStreetInput'             :  currentUserAcc.hasOwnProperty('PersonMailingStreet') ? currentUserAcc.PersonMailingStreet : '',
            'selectedMailingCityInput'               :  currentUserAcc.hasOwnProperty('PersonMailingCity') ? currentUserAcc.PersonMailingCity : '',
            'selectedMailingStateInput'              :  currentUserAcc.hasOwnProperty('PersonMailingState') ? currentUserAcc.PersonMailingState : '',
            'selectedMailingzipInput'                :  currentUserAcc.hasOwnProperty('PersonMailingPostalCode') ? currentUserAcc.PersonMailingPostalCode : '',
            'selectedMailingCountryInput'            :  ((isCNCitizen && currentUserAcc.hasOwnProperty('PersonMailingCountry')) 
                                                         ? currentUserAcc.PersonMailingCountry : 'United States'),
            'sameAsMailing'                          :  '',
            'selectedPhysicalStreetInput'            :  currentUserAcc.hasOwnProperty('PersonOtherStreet') ? currentUserAcc.PersonOtherStreet : '',
            'selectedPhysicalCityInput'              :  currentUserAcc.hasOwnProperty('PersonOtherCity') ? currentUserAcc.PersonOtherCity : '',
            'selectedPhysicalStateInput'             :  currentUserAcc.hasOwnProperty('PersonOtherState') ? currentUserAcc.PersonOtherState : '',
            'selectedPhysicalzipInput'               :  currentUserAcc.hasOwnProperty('PersonOtherPostalCode') ? currentUserAcc.PersonOtherPostalCode : '',
            'selectedPhysicalCountryInput'           :  ((isCNCitizen && currentUserAcc.hasOwnProperty('PersonOtherCountry')) 
                                                         ? currentUserAcc.PersonOtherCountry : 'United States'),
            'selectedpriConCellPhone'                :  currentUserAcc.hasOwnProperty('PersonMobilePhone') ? currentUserAcc.PersonMobilePhone : '',
            'selectedpriConHomePhone'                :  currentUserAcc.hasOwnProperty('Phone') ? currentUserAcc.Phone : '',
            'selectedpriConWorkPhone'                :  currentUserAcc.hasOwnProperty('PersonOtherPhone') ? currentUserAcc.PersonOtherPhone : '',
            'selectedsecConFirstName'                :  '',
            'selectedsecConLastName'                 :  '',
            'selectedsecConPhone'                    :  '',
            'selectedsecConEmail'                    :  '',
            'iAccept'                                :  false,
            'abtAssociateConsent'                    :  true
        };
        component.set('v.objSelectedVals', objSelectedVals);
    },

    // CNHPHOMS-16 & CNHPHOMS-37: Update selected object from values entered by user
    updatedSelectedValues: function(component, event, helper) {
        let temp_ObjSelectedVals = {
            selectedChildCount              :   component.find('numberOfChildren').get('v.value'),
            selectedSpokenHomeLanguage      :   component.find('spokenHomeLanguage').get('v.value'),
            selectedOtherLanguage           :   component.find("otherLanguage").get("v.value"),
            selectedPrograms                :   component.find("program").get("v.value"),
            selectedHouseholdIncome         :   component.find("householdIncome").get("v.value"),
            selectedIncomeFrequency         :   component.find("incomeFrequency").get("v.value"),
            selectedHouseholdSize           :   component.find("householdSize").get("v.value"),
            selectedpriConFirstName         :   component.find("priConFirstName").get("v.value"),
            selectedpriConMiddleName        :   component.find("priConMiddleName").get("v.value"),
            selectedpriConLastName          :   component.find("priConLastName").get("v.value"),
            selectedpriConSuffix            :   component.find("priConSuffix").get("v.value"),
            selectedpriConEmail             :   component.find("priConEmail").get("v.value"),
            selectedpriConDob               :   component.find("priConDob").get("v.value"),
            selectedMailingStreetInput      :   component.find("MailingStreetInput").get("v.value"),
            selectedMailingCityInput        :   component.find("MailingCityInput").get("v.value"),
            selectedMailingCountryInput     :   component.find("MailingCountryInput").get("v.value"),
            selectedMailingStateInput       :   component.find("MailingStateInput").get("v.value"),
            selectedMailingzipInput         :   component.find("MailingzipInput").get("v.value"),
            selectedPhysicalStreetInput     :   component.find("PhysicalStreetInput").get("v.value"),
            selectedPhysicalCityInput       :   component.find("PhysicalCityInput").get("v.value"),
            selectedPhysicalCountryInput    :   component.find("PhysicalCountryInput").get("v.value"),
            selectedPhysicalStateInput      :   component.find("PhysicalStateInput").get("v.value"),
            selectedPhysicalzipInput        :   component.find("PhysicalzipInput").get("v.value"),
            selectedpriConCellPhone         :   component.find("priConCellPhone").get("v.value"),
            selectedpriConHomePhone         :   component.find("priConHomePhone").get("v.value"),
            selectedpriConWorkPhone         :   component.find("priConWorkPhone").get("v.value"),
            selectedsecConFirstName         :   component.find("secConFirstName").get("v.value"),
            selectedsecConLastName          :   component.find("secConLastName").get("v.value"),
            selectedsecConPhone             :   component.find("secConPhone").get("v.value"),
            selectedsecConEmail             :   component.find("secConEmail").get("v.value"),
            selectedIAccept                 :   component.get("v.iAccept"),
            accountList                     :   component.get("v.accountList"),
            diableOtherLanguage             :   '',
            accountList                     :   component.get('v.accountList'),
            abtAssociateConsent             :   component.find("abtAssociateConsentCheckBox").get("v.value")
        };
        temp_ObjSelectedVals.diableOtherLanguage = (temp_ObjSelectedVals.selectedSpokenHomeLanguage == 'Other') ? false : true;

        let isCNCitizen = component.get('v.isCNCitizen');
        if(!isCNCitizen) temp_ObjSelectedVals.selectedpriConCitizenshipNumber = component.find("priConCitizenshipNumber").get("v.value");
        
        component.set('v.objSelectedVals', temp_ObjSelectedVals);
    }
})