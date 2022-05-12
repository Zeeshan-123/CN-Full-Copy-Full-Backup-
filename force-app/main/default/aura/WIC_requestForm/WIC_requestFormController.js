({
    doInit: function (component, event, helper) {
        var currentUserAcc = {};
        var action = component.get("c.retrieveDataOnInit");
        action.setParams({
            strObjectName   :   component.get("v.getObjectName"),
            strparentField  :   component.get("v.getParentFieldAPI"),
            strchildField   :   component.get("v.getChildFieldAPI")
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var rst = response.getReturnValue();
                component.set('v.isCNCitizen', (rst.hasOwnProperty('isCNCitizen') ? rst.isCNCitizen : false) );

                // CNHPHOMS-16: Populate the contact details from Current User's contact record for logged in users.
                if(rst.hasOwnProperty('currentUserAcc')) {
                    currentUserAcc = rst.currentUserAcc;
                    // component.set('v.currentUserAcc', currentUserAcc);
                }

                // If Case exists for current then show Success message
                if(rst.hasOwnProperty('existingCase') && rst.existingCase != null && rst.existingCase != undefined) {
                    helper.setExistingCaseAtts(component, event, helper, rst.existingCase);
                }
                // Else set the picklist fields & other data
                else {
                    component.set('v.showEBTForm', true);

                    let resultData = rst.picklistMapping;
                    var genderMap = [];
                    var genderMapData = resultData.gender;
                    for (var key in genderMapData) {
                        genderMap.push({ value: genderMapData[key], key: key });
                    }
                    component.set("v.genderList", genderMap);

                    var ethnicityMap = [];
                    var ethnicityMapData = resultData.ethnicity;
                    for (var key in ethnicityMapData) {
                        ethnicityMap.push({ value: ethnicityMapData[key], key: key });
                    }
                    component.set("v.ethnicityList", ethnicityMap);

                    var tribeMap = [];
                    var tribeMapData = resultData.tribe;
                    for (var key in tribeMapData) {
                        tribeMap.push({ value: tribeMapData[key], key: key });
                    }
                    component.set("v.tribList", tribeMap);

                    // CNHPHOMS-16, CNHPHOMS-37: Vikash: Added Low-Lactose Option Required?
                    var lowLactoseMap = [];
                    var lowLactoseMapData = resultData.lowLactoseOptionRequired;

                    for (var key in lowLactoseMapData) {
                        lowLactoseMap.push({ value: lowLactoseMapData[key], key: key });
                    }
                    component.set("v.lactoseOptionList", lowLactoseMap);

                    var gradeMap = [];
                    var gradeMapData = resultData.grade;
                    for (var key in gradeMapData) {
                        gradeMap.push({ value: gradeMapData[key], key: key });
                    }
                    component.set("v.gradeList", gradeMap);

                    var schoolMap = [];
                    // CNHPHOMS-16, CNHPHOMS-37: Vikash: Added the map to add the value in the last
                    let schoolNotListed = {};
                    let schoolListed = [];
                    var schoolMapData = resultData.school;
                    for (var key in schoolMapData) {
                        if(key == 'School is Not Listed')
                            schoolNotListed = { value: schoolMapData[key], key: key };
                        else {
                            schoolListed.push(schoolMapData[key]);
                            schoolMap.push({ value: schoolMapData[key], key: key });
                        }
                    }
                    
                    schoolListed.sort();
                    const SCHOOL_LISTED_STR = schoolListed.join(', ').replaceAll('*','');
                    schoolMap.push(schoolNotListed);
                    component.set("v.schoolList", schoolMap);
                    component.set("v.schoolListedStr", SCHOOL_LISTED_STR);
                    
                    var fosterChildMap = [];
                    var fosterChildMapData = resultData.fosterChild;
                    for (var key in fosterChildMapData) {
                        fosterChildMap.push({ value: fosterChildMapData[key], key: key });
                    }
                    component.set("v.fosterChildList", fosterChildMap);

                    var migrantMap = [];
                    var migrantMapData = resultData.migrant;
                    for (var key in migrantMapData) {
                        migrantMap.push({ value: migrantMapData[key], key: key });
                    }
                    component.set("v.migrantList", migrantMap);

                    var homeLanguageMap = [];
                    var homeLanguageMapData = resultData.homeLanguage;
                    for (var key in homeLanguageMapData) {
                        homeLanguageMap.push({ value: homeLanguageMapData[key], key: key });
                    }
                    component.set("v.homeLanguageList", homeLanguageMap);
	
                    var incomeFrequencyMap = [];
                    var incomeFrequencyMapData = resultData.incomeFrequency;
                    for (var key in incomeFrequencyMapData) {
                        incomeFrequencyMap.push({ value: incomeFrequencyMapData[key], key: key });
                    }
                    component.set("v.incomeFrequencyList", incomeFrequencyMap);

                    component.set("v.getPickListMap", resultData.pickListMap);

                    var pickListMap = component.get("v.getPickListMap");
                    var parentkeys = [];
                    var parentField = [];

                    for (var pickKey in resultData.pickListMap) {
                        parentkeys.push(pickKey);
                    }

                    if (parentkeys != undefined && parentkeys.length > 0) {
                        parentField.push('--- None ---');
                    }

                    for (var i = 0; i < parentkeys.length; i++) {
                        parentField.push(parentkeys[i]);
                    }

                    component.set("v.getParentList", parentField);
                    component.set("v.getMailingParentList", parentField);

                    window.setTimeout(
                        $A.getCallback(function () {
                            // set default value for physical country picklist
                            component.find("PhysicalCountryInput").set("v.value", 'United States');

                            // set default value for mailing country picklist
                            component.find("MailingCountryInput").set("v.value", 'United States');

                            $A.enqueueAction(component.get('c.ObjFieldByParent'));
                            helper.setDefaultSelelctedObj(component, event, helper, currentUserAcc);
                        }));

                    $A.enqueueAction(component.get('c.addRow'));
                }
            }
            if (state === "ERROR") {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title: 'SUCCESS',
                    message: response.getReturnValue(),
                    duration: ' 10000',
                    key: 'info_alt',
                    type: 'error',
                    mode: 'pester'
                });
                toastEvent.fire();
            }
        });
        $A.enqueueAction(action);
    },

    // using same funtion for both physical and mailing address 
    // because state is default set to US and it's readonly
    ObjFieldByParent: function (component, event, helper) {
        var controllerValue = component.find("PhysicalCountryInput").get("v.value");

        //get country state map
        var pickListMap = component.get("v.getPickListMap");

        // pass country state map key to get values
        var childValues = pickListMap[controllerValue];
        let objSelectedVals = component.get('v.objSelectedVals');
        var childValueListPhysical = [];
        var childValueListMailing = [];
        
        // Iterate on States list & create mapping for Physical & Mailing states
        for (var i = 0; i < childValues.length; i++) {
            childValueListPhysical.push({
                'value' : childValues[i],
                'selected' : (objSelectedVals.selectedPhysicalStateInput 
                              && objSelectedVals.selectedPhysicalStateInput == childValues[i]) ? true : false
            });

            childValueListMailing.push({
                'value' : childValues[i],
                'selected' : (objSelectedVals.selectedMailingStateInput 
                              && objSelectedVals.selectedMailingStateInput == childValues[i]) ? true : false
            });
        }
        // Set the values of Physical & Mailing State list
        component.set("v.getChildList", childValueListPhysical);
        component.set("v.getMailingChildList", childValueListMailing);
        // helper.setDefaultSelelctedObj(component, event, helper, currentUserAcc);
    },

    languageChange: function (component, event) {
        var homeLanguage = component.find("spokenHomeLanguage").get("v.value");
        if (homeLanguage == 'Other') {
            component.find("otherLanguage").set("v.disabled", false);
        }
        else {
            component.find("otherLanguage").set("v.disabled", true);
            component.find("otherLanguage").set("v.value", '');
        }
    },

    // date validator
    validateAndReplace: function (component, event) {
        const input = event.getSource();
        const inputValue = input.get('v.value');
        const validValue = inputValue.replace(/^(\d\d)(\d)$/g, '$1/$2')
            .replace(/^(\d\d\/\d\d)(\d+)$/g, '$1/$2')
            .replace(/[^\d\/]/g, '');
        input.set('v.value', validValue);
    },

    //add row in grid table
    addRow: function (component, event, helper) {
        helper.addAccountRecord(component, event);
    },

    //add row from grid table
    removeRow: function (component, event, helper) {
        //Get the account list
        var accountList = component.get("v.accountList");
        //Get the target object
        var selectedItem = event.currentTarget;
        //Get the selected item index
        var index = selectedItem.dataset.record;
        accountList.splice(index, 1);
        component.set("v.accountList", accountList);
    },

    // save: function (component, event, helper) {
    handleFormReview: function (component, event, helper) {
        //Show spinner
        var spinner = component.find("saveSpinner");
        $A.util.addClass(spinner, "slds-show");

        var errorMessages = null;
        var errorMessagesForChild = null;

        var isCNCitizen = component.get('v.isCNCitizen');
        var accountList = component.get("v.accountList");
        var numberOfChildren = component.find("numberOfChildren").get("v.value");

        var priConFirstName = component.find("priConFirstName").get("v.value");
        var priConLastName = component.find("priConLastName").get("v.value");
        var priConDob = component.find("priConDob").get("v.value");

        var mailingStreet = component.find("MailingStreetInput").get("v.value");
        var mailingCity = component.find("MailingCityInput").get("v.value");
        var mailingState = component.find("MailingStateInput").get("v.value");
        var mailingZip = component.find("MailingzipInput").get("v.value");

        // date formatting
        var formatedDate = priConDob.replace(/(\d\d)\/(\d\d)\/(\d{4})/, "$3-$1-$2");
        var date_regex1 = /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/;
        var checkDateFormate1 = date_regex1.test(priConDob);

        var priConCellPhone = component.find("priConCellPhone").get("v.value");
        let objSelectedVals = component.get('v.objSelectedVals');

        /**
         * CNHPHOMS-16, CNHPHOMS-32: Vikash: Added required check for Primary street/city/state/zipcode
         * Check for first name, last name & date fo birth if then user is not a Cherokee Nation citizen
         */
        if ((!isCNCitizen && (priConFirstName == '' || priConLastName == '' || priConDob == '')) 
            || priConCellPhone == '' || numberOfChildren == '' 
            || mailingStreet == '' || mailingCity == '' || mailingState == '' || mailingZip == '' 
            || !objSelectedVals.selectedPhysicalStreetInput 
            || !objSelectedVals.selectedPhysicalCityInput
            || !objSelectedVals.selectedPhysicalStateInput 
            || !objSelectedVals.selectedPhysicalzipInput) 
        {
            errorMessages = 'You must fill in all of the required fields.';
        }

        if (accountList.length == 0) {
            if (errorMessages == null) errorMessages = 'Must add atleast one child.';
            else errorMessages += " " + 'Must add atleast one child.';
        }

        //if Dob is not null then check date formate is correct?
        if (!$A.util.isEmpty(priConDob)) {
            if (!checkDateFormate1) {
                if (errorMessages == null) errorMessages = 'Invalid date format, correct one is MM/DD/YYYY.';
                else errorMessages += " " + 'Invalid date format, correct one is MM/DD/YYYY.';
            }
        }

        // show primary contact level error if any
        if (errorMessages != null) {
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: 'Warning',
                message: errorMessages,
                duration: ' 10000',
                key: 'info_alt',
                type: 'error',
                mode: 'dismissible'
            });
            toastEvent.fire();
        }
        // check for child grid level error
        else {
            if (accountList.length != numberOfChildren) {
                if (errorMessagesForChild == null) {
                    errorMessagesForChild = 'Please ensure to enter details of only ' + numberOfChildren + ' children or make the correct selection for the number of children to enter.';
                }
                else {
                    errorMessagesForChild += " " + 'Please ensure to enter details of only ' + numberOfChildren + ' children or make the correct selection for the number of children to enter.';
                }
            }
            else {
                // child grid validations
                for (var i = 0; i < accountList.length; i++) {
                    if (accountList[i].FirstName == '' || accountList[i].LastName == '' || accountList[i].HealthCloudGA__Gender__pc == ''
                        || accountList[i].Date_of_Birth__c == '' || accountList[i].Grade__c == '' || accountList[i].School__c == '') 
                    {
                        errorMessagesForChild = 'You must fill in all of the required fields on the child record in row number ' + (i + 1) + '.';
                    }


                    if (!$A.util.isEmpty(accountList[i].Date_of_Birth__c)) {
                        var date_regex = /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/;
                        var checkDateFormate = date_regex.test(accountList[i].Date_of_Birth__c);

                        if (!checkDateFormate) {
                            if (errorMessagesForChild == null) {
                                errorMessagesForChild = 'Invalid date format at row number ' + (i + 1) + ', correct one is MM/DD/YYYY.';
                            }
                            else {
                                errorMessagesForChild += " " + 'Invalid date format at row number ' + (i + 1) + ', correct one is MM/DD/YYYY.';
                            }
                        }
                    }
                }
            }

            //show child grid related errors if any
            if (errorMessagesForChild != null) {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title: 'Warning',
                    message: errorMessagesForChild,
                    duration: ' 10000',
                    key: 'info_alt',
                    type: 'error',
                    mode: 'dismissible'
                });
                toastEvent.fire();
            }
        }

        //server call
        if (errorMessagesForChild == null && errorMessages == null) {
            // Set Selected Object
            helper.updatedSelectedValues(component, event, helper);

            //hide spinner
            var spinner = component.find("saveSpinner");
            $A.util.addClass(spinner, "slds-hide");

            // Hide EBT Form
            component.set('v.showEBTForm', false);

            // Show Review Form
            component.set('v.isShowReviewForm', true);
        }
    },

    // to make physical address same as mailing address
    phySameAsMailing: function (component, event, helper) {
        var sameAsMailing = component.get("v.isSameAsMailing");
        var mailingStreet = component.find("MailingStreetInput").get("v.value");
        var mailingCity = component.find("MailingCityInput").get("v.value");
        var mailingState = component.find("MailingStateInput").get("v.value");
        var mailingZip = component.find("MailingzipInput").get("v.value");

        let objSelectedVals = component.get('v.objSelectedVals');
        if (sameAsMailing == true) {
            component.find("PhysicalStreetInput").set("v.value", mailingStreet);
            component.find("PhysicalCityInput").set("v.value", mailingCity);
            component.find("PhysicalStateInput").set("v.value", mailingState);
            component.find("PhysicalzipInput").set("v.value", mailingZip);

            // Update the Physical Address attributes in Selected Object
            objSelectedVals.sameAsMailing = true;
            objSelectedVals.selectedPhysicalStreetInput = objSelectedVals.selectedMailingStreetInput;
            objSelectedVals.selectedPhysicalCityInput = objSelectedVals.selectedMailingCityInput;
            objSelectedVals.selectedPhysicalStateInput = objSelectedVals.selectedMailingStateInput;
            objSelectedVals.selectedPhysicalCountryInput =objSelectedVals.selectedMailingCountryInput;
            objSelectedVals.selectedPhysicalzipInput = objSelectedVals.selectedMailingzipInput;
            component.set('v.objSelectedVals', objSelectedVals);
        }
        else {
            component.find("PhysicalStreetInput").set("v.value", "");
            component.find("PhysicalCityInput").set("v.value", "");
            component.find("PhysicalStateInput").set("v.value", "");
            component.find("PhysicalzipInput").set("v.value", "");

            // Update the Physical Address attributes in Selected Object
            objSelectedVals.sameAsMailing = false;
            objSelectedVals.selectedPhysicalStreetInput = null;
            objSelectedVals.selectedPhysicalCityInput = null;
            objSelectedVals.selectedPhysicalStateInput = null;
            objSelectedVals.selectedPhysicalzipInput = null;
            component.set('v.objSelectedVals', objSelectedVals);
        }
    },

    /*****************************        Form Review Chnages         ************************************/
    handleProgramChange: function (component, event) {
        let val = JSON.parse(JSON.stringify(event.getParam('value')));
        let temp_objSelectedVals = component.get('v.objSelectedVals');
        temp_objSelectedVals.selectedPrograms = val;

        component.set('v.objSelectedVals', temp_objSelectedVals);

    },

    handleReviewCmpAction: function (component, event, helper) {
        var isFormEditableAgain;
        var isFormSubmitted;
        var objSelectedValFromChild;
        var params = event.getParam('arguments');
        if (params) {
            isFormEditableAgain = params.isFormEditableAgain;
            isFormSubmitted = params.isFormSubmitted;
            objSelectedValFromChild = params.objSelectedValFromChild;
        }

        if(isFormEditableAgain) {
            component.set('v.showEBTForm', true);           // Show EBT Form
            component.set('v.isShowReviewForm', false);     // Hide Review Form

            // Hide Spinner
            var spinner = component.find("saveSpinner");
            $A.util.removeClass(spinner, "slds-show");
            $A.util.addClass(spinner, "slds-hide");
        }

        if(isFormSubmitted) {
            helper.initiateFormSave(component, event, helper);
        }
    },

    viewRequest: function (component, event, helper) {
        var recId = component.get("v.caseId");
        window.location.replace('/s/detail/' + recId);
    },
})