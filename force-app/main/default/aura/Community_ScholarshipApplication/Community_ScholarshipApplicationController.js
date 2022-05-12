({
    doInit : function(component, event, helper){ 
        var  CVCase = component.get("v.CVCase");
        var action = component.get("c.getInfo");
        var searchTerm = component.get( "v.searchTerm" );
        var caseNum = '';
        var confMess = '';
        //helper.handleSearch( component, searchTerm );
        component.set("v.isLoading", true);
        component.set("v.showSuccessMessage", false);

        action.setCallback(this,function(response){
            var state = response.getState();
            debugger;
            if (state === "SUCCESS") {
                var resultData = response.getReturnValue(); 
                // request exist 
                if (resultData.ScholarshipApp != undefined) {
                    var result = response.getReturnValue();
                    var caseList = resultData.ScholarshipApp;
                    if(caseList.length === 1){
                        debugger;
                    
                    component.set("v.caseId", caseList[0].Id);
                        debugger; 
                       caseNum ='<strong> Confirmation Number: ' + caseList[0].CaseNumber + '</strong>'; 
                        debugger; 
                        //component.set("v.requestNumber", caseNum);
                        var applicConcat = '';
                        debugger; 
               		if(caseList[0].Scholarship_Application__c	== 'Valedictorian and Salutatorian'){
                   			applicConcat = caseList[0].Scholarship_Application__c; 
              	 }
               else if(caseList[0].Scholarship_Application__c	== 'Concurrent Enrollment Scholarship'){
                   applicConcat = caseList[0].Student_Type__c + ' ' + caseList[0].Scholarship_Application__c; 
               }
                   else{
                       applicConcat = caseList[0].Student_Type__c + ' ' + caseList[0].Degree__c + ' ' + caseList[0].Scholarship_Application__c; 

                   }
                        confMess+='You have successfully submitted your 2022-23 CN ' + applicConcat +  ' Scholarship application. <br> ' + caseNum; 
               component.set("v.applicationResult", confMess);
                    // show success message
                    component.set("v.showWarningMessage", true);
                        
                    }
                    if(caseList.length > 1){
                        debugger;
                    component.set("v.caseId", caseList[0].Id);

					for (var c in caseList){
                       caseNum ='<strong> <a href="/s/detail/' + caseList[c].Id + '" > Confirmation Number: ' + caseList[c].CaseNumber + '</a></strong><br><br>'; 
                        //component.set("v.requestNumber", caseNum);
                        var applicConcat = '';
               		if(caseList[c].Scholarship_Application__c	== 'Valedictorian and Salutatorian'){
                   			applicConcat = caseList[c].Scholarship_Application__c; 
              	 }
               else if(caseList[c].Scholarship_Application__c	== 'Concurrent Enrollment Scholarship'){
                   applicConcat = caseList[c].Student_Type__c + ' ' + caseList[c].Scholarship_Application__c; 
               }
                   else{
                       applicConcat = caseList[c].Student_Type__c + ' ' + caseList[c].Degree__c + ' ' + caseList[c].Scholarship_Application__c; 

                   }
                        confMess+='You have successfully submitted your 2022-23 CN ' + applicConcat +  ' Scholarship application.<br><br> ' + caseNum; 
                    }                        
                        
               component.set("v.applicationResult", confMess);
                    // show success message
                    component.set("v.showSuccessMessage", true);
                    component.set("v.isLoading",false);
                    }
                    
                    //component.set("v.requestNumber", result.ScholarshipApp.CaseNumber);
                    /*var applicConcat = '';
               		if(result.ScholarshipApp.Scholarship_Application__c	== 'Valedictorian and Salutatorian'){
                   			applicConcat = result.ScholarshipApp.Scholarship_Application__c; 
              	 }
               else if(result.ScholarshipApp.Scholarship_Application__c	== 'Concurrent Enrollment Scholarship'){
                   applicConcat = result.ScholarshipApp.Student_Type__c + ' ' + result.ScholarshipApp.Scholarship_Application__c; 
               }
                   else{
                       applicConcat = result.ScholarshipApp.Student_Type__c + ' ' + result.ScholarshipApp.Degree__c + ' ' + result.ScholarshipApp.Scholarship_Application__c; 

                   }
               component.set("v.applicationResult", applicConcat);
                    // show success message
                    component.set("v.showSuccessMessage", true);
                    debugger; */
                }//end
                if(resultData.ScholarshipApp == undefined || resultData.ScholarshipApp.length === 1){
                    // set up dependent picklist
                    console.log(resultData.mapOfDependentPL);
                    console.log(resultData);
                    
                    debugger; 
                    component.set("v.getPickListMap",resultData.mapOfDependentPL);
                    var pickListMap = component.get("v.getPickListMap");
                    var parentkeys = [];
                    var parentField = [];                
                    for (var pickKey in pickListMap){
                        parentkeys.push(pickKey);
                    }
                    for (var i = 0; i < parentkeys.length; i++) {
                        parentField.push(parentkeys[i]);
                    }  
                    component.set("v.getMailingParentList", parentField);
                    console.log(resultData.acnt.Date_of_Birth__c);
                    debugger; 
                     var phone = '';
                     component.set("v.Acnt", resultData.acnt);
                     var Accnt=component.get("v.Acnt");
                     //format Date of birth
                     if(!$A.util.isUndefinedOrNull(resultData.acnt.Date_of_Birth__c)){
                         var splitDate = resultData.acnt.Date_of_Birth__c.split('-');
                         var year = splitDate[0];
                         var month = splitDate[1];
                         var day = splitDate[2];
                         var uDob = splitDate[1]+'/'+splitDate[2]+'/'+splitDate[0];
                         Accnt.Date_of_Birth__c = uDob;
                     }
                     component.set("v.Acnt",Accnt); 
                    if(resultData.acnt.Eligible_For_Housing_Stipend__c){
                         component.set("v.showHousingStipend", true);
                    }
                    
                                  
                    // set phone number
                     if (!$A.util.isUndefined(resultData.acnt.PersonMobilePhone)) {       
                         phone = resultData.acnt.PersonMobilePhone;
                         var number = phone.replace(/\D/g, '').slice(-10);                         
                     	 CVCase.Ebt_Mobile_Phone__c = '('+number.substring(0,3)+') '+number.substring(3,6)+'-'+number.substring(6,10);;
                     }
                     else {
                         CVCase.Ebt_Mobile_Phone__c = '';
                     }
                     
                     CVCase.Primary_Contact_First_Name__c = resultData.acnt.FirstName;
                     CVCase.Primary_Contact_Last_Name__c  = resultData.acnt.LastName;
                    console.log(resultData.acnt.HealthCloudGA__Gender__pc);
                    console.log(resultData.acnt.Marital_Status__c);
                    CVCase.Gender__c = resultData.acnt.HealthCloudGA__Gender__pc; 
                    CVCase.Marital_Status__c = 'Single';
                    CVCase.Tribe__c = resultData.acnt.Tribe__c; 
                    console.log('Case Marital Status' + CVCase.Marital_Status__c );
                    var genderId = component.find("gender");

                    //component.set(genderId, resultData.acnt.HealthCloudGA__Gender__pc);
                    //component.set("maritalStatus", resultData.acnt.Marital_Status__c);
                    //component.set("tribe", resultData.acnt.Tribe__c);
                    
                    // set relation picklist value for Student Table
                     var relationMap = [];
                     var relationMapData = resultData.relationMap;
                     for(var key in relationMapData){
                         relationMap.push({value:relationMapData[key], key:key});
                     }
                     component.set("v.relationList", relationMap);
                    
                    // set Gender picklist value
                     var genderMap = [];
                     var genderMapData = resultData.genderMap;
                     for(var key in genderMapData){
                         genderMap.push({value:genderMapData[key], key:key});
                     }
                    debugger;
                     console.log(genderMap);
                     component.set("v.genderList", genderMap);
                    
                    // set Marital Status picklist value
                     var maritalMap = [];
                     var maritalMapData = resultData.maritalMap;
                     for(var key in maritalMapData){
                         console.log('Marital Key' + key);
                         console.log('Marital Value ' + maritalMapData[key]);
                         maritalMap.push({value:maritalMapData[key], key:key});
                     }
                    debugger;
                     component.set("v.maritalList", maritalMap);
                    
                    // set Tribe picklist value
                     var tribeMap = [];
                     var tribeMapData = resultData.tribeMap;
                     for(var key in tribeMapData){
                         tribeMap.push({value:tribeMapData[key], key:key});
                     }
                    debugger;
                     component.set("v.tribeList", tribeMap);
                    
                    // set District picklist value
                     var districtMap = [];
                     var districtMapData = resultData.districtMap;
                     for(var key in districtMapData){
                         districtMap.push({value:districtMapData[key], key:key});
                     }
                    debugger;
                     component.set("v.districtList", districtMap);
                    
                    // set Semester picklist value
                     var semesterMap = [];
                     var semesterMapData = resultData.semesterMap;
                     for(var key in semesterMapData){
                         semesterMap.push({value:semesterMapData[key], key:key});
                     }
                    debugger;
                     component.set("v.semesterList", semesterMap);
                    
                    // set Student Classification picklist value
                     var classificationMap = [];
                     var classificationMapData = resultData.classificationMap;
                     for(var key in classificationMapData){
                         classificationMap.push({value:classificationMapData[key], key:key});
                     }
                    debugger;
                     component.set("v.classificationList", classificationMap);
                    
                    // set Expected Graduation Month picklist value
                     var monthMap = [];
                     var monthMapData = resultData.monthMap;
                     for(var key in monthMapData){
                         monthMap.push({value:monthMapData[key], key:key});
                     }
                    debugger;
                     component.set("v.monthList", monthMap);
                    
                     // set Field of Study picklist value
                     var fieldofStudyMap = [];
                     var fieldofStudyMapData = resultData.fieldofStudyMap;
                     for(var key in fieldofStudyMapData){
                         fieldofStudyMap.push({value:fieldofStudyMapData[key], key:key});
                     }
                    debugger;
                     component.set("v.fieldOfStudyList", fieldofStudyMap);
                    
                    // set Degree picklist value
                     var degreeMap = [];
                     var degreeMapData = resultData.degreeMap;
                     for(var key in degreeMapData){
                         degreeMap.push({label:degreeMapData[key], value:key});
                     }
                    debugger;
                     component.set("v.degreeList", degreeMap); 
                    // set Student Type picklist value
                     var studentTypeMap = [];
                     var studentTypeMapData = resultData.studentTypeMap;
                     for(var key in studentTypeMapData){
                         studentTypeMap.push({label:studentTypeMapData[key], value:key});
                     }
                    debugger;
                     component.set("v.studentTypeList", studentTypeMap); 
                    
                    // set Application Type picklist value
                     var applicationTypeMap = [];
                     var applicationTypeMapData = resultData.applicationTypeMap;
                     for(var key in applicationTypeMapData){
                         applicationTypeMap.push({label:applicationTypeMapData[key], value:key});
                     }
                    debugger;
                     component.set("v.applicationTypeList", applicationTypeMap); 
                    
                     // set County  picklist value
                     var countyMap = [];
                     var countyMapData = resultData.countyMap;
                     for(var key in countyMapData){
                         countyMap.push({label:countyMapData[key], value:key});
                     }
                    debugger;
                     component.set("v.countyList", countyMap); 

                    //applicationTypes
                    //
                    component.set("v.CVCase.Scholarship_Application__c", "Concurrent Enrollment Scholarship");
                    
                     //replace potential undefined values with empty string
                     var replaceBadValues = {
                         PersonMailingStreet : resultData.acnt.PersonMailingStreet,
                         PersonMailingCity : resultData.acnt.PersonMailingCity,
                         PersonMailingPostalCode : resultData.acnt.PersonMailingPostalCode,
                         PersonOtherStreet : resultData.acnt.PersonOtherStreet,
                         PersonOtherCity : resultData.acnt.PersonOtherCity,
                         PersonOtherPostalCode : resultData.acnt.PersonOtherPostalCode
                     }
                     var replacedValues = JSON.parse(JSON.stringify(replaceBadValues, function (key, value) {return (value === undefined) ? "" : value}));
                     
                     							/*=============SET MAILING ADDRESS===========*/ 
                    //if Mailing address is a bad address then make it null and set US as default country
                    if(replacedValues.PersonMailingStreet.toUpperCase().includes("BAD ADDRESS")  || replacedValues.PersonMailingCity.includes("99") || replacedValues.PersonMailingPostalCode.includes("00000") || $A.util.isUndefined(resultData.acnt.PersonMailingCountry) ){
                        CVCase.Mailing_Street__c = '';
                        CVCase.Mailing_City__c = '';
                        CVCase.Mailing_ZipPostal_Code__c = '';
                        CVCase.mailing_suite__c = '';
                        CVCase.Mailing_Countries__c = 'United States';
                        
                        helper.ObjFieldByMailingParent(component, event, CVCase.Mailing_Countries__c);
                        debugger; 
                        CVCase.Mailing_States__c = '';
                        debugger; 
                        component.set("v.UpdateAddressRequired", true);
                    }// Not a Bad Address but partially filled then populate the fields and mark update address required for Mailing
                    else if((!replacedValues.PersonMailingStreet.toUpperCase().includes("BAD ADDRESS") && !replacedValues.PersonMailingCity.includes("99") &&
                            !replacedValues.PersonMailingPostalCode.includes("00000")) && ($A.util.isUndefined(resultData.acnt.PersonMailingStreet) 
                            || $A.util.isUndefined(resultData.acnt.PersonMailingCity) || $A.util.isUndefined(resultData.acnt.PersonMailingState) 
                            || $A.util.isUndefined(resultData.acnt.PersonMailingCountry) ||   $A.util.isUndefined(resultData.acnt.PersonMailingPostalCode))){
                        component.set("v.UpdateAddressRequired", true);
                        CVCase.Mailing_Street__c = resultData.acnt.PersonMailingStreet;
                        CVCase.Mailing_City__c = resultData.acnt.PersonMailingCity;
                        CVCase.Mailing_ZipPostal_Code__c = resultData.acnt.PersonMailingPostalCode;
                        CVCase.mailing_suite__c = resultData.acnt.Mailing_Suite__c;
                        CVCase.Mailing_Countries__c = resultData.acnt.PersonMailingCountry;
                        helper.ObjFieldByMailingParent(component, event, CVCase.Mailing_Countries__c);
                        debugger; 
                        CVCase.Mailing_States__c = resultData.acnt.PersonMailingState; 
                        debugger; 
                     }
                    else{// Not a Badd Address and completely filled
						if(!$A.util.isUndefined(resultData.acnt.PersonMailingStreet)  || !$A.util.isUndefined(resultData.acnt.PersonMailingCity) 
                           || !$A.util.isUndefined(resultData.acnt.PersonMailingState)   || !$A.util.isUndefined(resultData.acnt.PersonMailingCountry) 
                           || !$A.util.isUndefined(resultData.acnt.PersonMailingPostalCode)){
                        CVCase.Mailing_Street__c = resultData.acnt.PersonMailingStreet;
                        CVCase.Mailing_City__c = resultData.acnt.PersonMailingCity;
                        CVCase.Mailing_ZipPostal_Code__c = resultData.acnt.PersonMailingPostalCode;
                        CVCase.mailing_suite__c = resultData.acnt.Mailing_Suite__c;
                        CVCase.Mailing_Countries__c = resultData.acnt.PersonMailingCountry;
                        helper.ObjFieldByMailingParent(component, event, CVCase.Mailing_Countries__c);
                            debugger; 
                        CVCase.Mailing_States__c = resultData.acnt.PersonMailingState; 
                            debugger; 
                     }						                        
                    }

                   							 /*=============SET PHYSICAL ADDRESS===========*/ 
                    //if Physical address is a bad address then make it null and set US as default country
                  /*  if(replacedValues.PersonOtherStreet.toUpperCase().includes("BAD ADDRESS")  || replacedValues.PersonOtherStreet.includes("99") || replacedValues.PersonOtherPostalCode.includes("00000") || $A.util.isUndefined(resultData.acnt.PersonOtherCountry)){
                        component.set("v.UpdatePhysicalAddressRequired", true);
                        CVCase.Physical_Street__c = '';
                        CVCase.Physical_City__c = '';
                        //CVCase.Physical_ZipPostal_Code__c = '';
                        CVCase.Physical_Suite__c = '';
                        CVCase.Physical_Countries__c = 'United States';
                        helper.ObjFieldByPhysicalParent(component, event, CVCase.Physical_Countries__c);
                        CVCase.Physical_States__c = '';
                    }// Not a Bad Address but partially filled then populate the fields and mark update address required for Physical
                    else if( (!replacedValues.PersonOtherStreet.toUpperCase().includes("BAD ADDRESS")  && !replacedValues.PersonOtherCity.includes("99") &&
                            !replacedValues.PersonOtherPostalCode.includes("00000")) && ($A.util.isUndefined(resultData.acnt.PersonOtherStreet) 
                            ||  $A.util.isUndefined(resultData.acnt.PersonOtherCity) || $A.util.isUndefined(resultData.acnt.PersonOtherState)   
                            ||  $A.util.isUndefined(resultData.acnt.PersonOtherCountry) ||  $A.util.isUndefined(resultData.acnt.PersonOtherPostalCode))){ 
                        component.set("v.UpdatePhysicalAddressRequired", true);
                        CVCase.Physical_Street__c = resultData.acnt.PersonOtherStreet;
                        CVCase.Physical_City__c = resultData.acnt.PersonOtherCity;
                        CVCase.Physical_ZipPostal_Code__c = resultData.acnt.PersonOtherPostalCode;
                        CVCase.Physical_Suite__c = resultData.acnt.Physical_Suite__c;
                        CVCase.Physical_Countries__c = resultData.acnt.PersonOtherCountry;
                        helper.ObjFieldByPhysicalParent(component, event, CVCase.Physical_Countries__c);
                        CVCase.Physical_States__c = resultData.acnt.PersonOtherState;
                    }                                                                                                                                                                                                   //if mailing address is empty, set physical address
                    else{
                         if(!$A.util.isUndefined(resultData.acnt.PersonOtherStreet)   ||  !$A.util.isUndefined(resultData.acnt.PersonOtherCity)
                            || !$A.util.isUndefined(resultData.acnt.PersonOtherState) ||  !$A.util.isUndefined(resultData.acnt.PersonOtherCountry)
                            ||  !$A.util.isUndefined(resultData.acnt.PersonOtherPostalCode)){
                             CVCase.Physical_Street__c = resultData.acnt.PersonOtherStreet;
                             CVCase.Physical_City__c = resultData.acnt.PersonOtherCity;
                             CVCase.Physical_ZipPostal_Code__c = resultData.acnt.PersonOtherPostalCode;
                             CVCase.Physical_Suite__c = resultData.acnt.Physical_Suite__c;
                             CVCase.Physical_Countries__c = resultData.acnt.PersonOtherCountry;
                             helper.ObjFieldByPhysicalParent(component, event, CVCase.Physical_Countries__c);
                             CVCase.Physical_States__c = resultData.acnt.PersonOtherState;
                         }
                      }*/
                    
                    var controlselectAuraIds1 = [ "MailingStreetInput", "MailingCityInput", "MailingzipInput", "MailingStateInput", "MailingSuiteInput", "MailingAddress2Input", "ssn",
                                                
                                                 "priConCellPhone"];
                    debugger; 
                    var age = helper.getAge(component, event, resultData.acnt.Date_of_Birth__c);
                   /* if(age < 18  ){
                        //if applicant is under 18, show primary guardian section
                        component.set("v.showPrimaryGuardianSection", true);
                        controlselectAuraIds1.push("PriGuardianFirstName", "PriGuardianLastName", "PriGuardianPhone");
                    }*/
                    component.set("v.isLoading",false);
                    debugger; 
                    for(var i = 0; i < controlselectAuraIds1.length; i++) {
                        var fieldId1 = controlselectAuraIds1[i];
                        var cmpFindFieldId1 = component.find(fieldId1);
                        var fieldValue1 = cmpFindFieldId1.get("v.value");
                        if($A.util.isUndefinedOrNull(fieldValue1)) {
                            component.find(fieldId1).set("v.value", '');
                        }
                    } 
                     
                    debugger; 
                    

                    component.set('v.CVCase',CVCase);
                    component.set("v.CVCaseClone",JSON.parse(JSON.stringify(CVCase)));    
                    component.set('v.states',resultData.mapOfStates);
                    
                 }  
               
                
            }
            if (state === "ERROR"){
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title : 'SUCCESS',
                    message: response.getReturnValue(),
                    duration:' 60000',
                    key: 'info_alt',
                    type: 'error',
                    mode: 'pester'
                });
                toastEvent.fire();
            }
        });   
        
        $A.enqueueAction(action);
      	
    },
    
    //handle update address toggle for Mailing
    handleAddreesUpdate : function(component, event, helper){
        var  CVCaseClone = component.get("v.CVCaseClone");
        if(component.get("v.addressUpdate")) {
            component.set("v.showLookUp", true);
        }
        else  {
            component.set("v.showLookUp", false);
            component.set("v.isManual", false);
            component.set("v.mailingAddressRequired", false);
            component.set("v.CVCase.Mailing_Street__c", CVCaseClone.Mailing_Street__c);
            component.set("v.CVCase.mailing_address2__c", '');
            component.set("v.CVCase.Mailing_City__c", CVCaseClone.Mailing_City__c);
            component.set("v.CVCase.Mailing_ZipPostal_Code__c", CVCaseClone.Mailing_ZipPostal_Code__c); 
            component.set("v.CVCase.mailing_suite__c", CVCaseClone.mailing_suite__c); 
            component.set("v.CVCase.Mailing_Countries__c", CVCaseClone.Mailing_Countries__c); 
            helper.ObjFieldByMailingParent(component, event, CVCaseClone.Physical_Countries__c);
            component.set("v.CVCase.Mailing_States__c", CVCaseClone.Mailing_States__c); 
            
             // remove has errors
            $A.util.removeClass(component.find('MailingStreetInput'), 'slds-has-error');
            $A.util.removeClass(component.find('MailingCityInput'), 'slds-has-error');
            $A.util.removeClass(component.find('MailingStateInput'), 'slds-has-error');
            $A.util.removeClass(component.find('MailingCountryInput'), 'slds-has-error');
            $A.util.removeClass(component.find('MailingzipInput'), 'slds-has-error');
            $A.util.removeClass(component.find('MailingOtherState'), 'slds-has-error');
        }
       
    },
    
    
    
    onMailingCountryChange : function(component, event, helper){
        var CVCase = component.get('v.CVCase');
        helper.ObjFieldByMailingParent(component, event, CVCase.Mailing_Countries__c);
    },     
    
    // date validator
    validateAndReplace: function (component, event) {
        const input = event.getSource();
        const inputValue = input.get('v.value');
        const validValue = inputValue.replace(/^(\d\d)(\d)$/g,'$1/$2')
        .replace(/^(\d\d\/\d\d)(\d+)$/g,'$1/$2')
        .replace(/[^\d\/]/g,'');
        input.set('v.value', validValue);
    },
    
    //Name fields validator
    validateLName:  function(component, event)   { 
        var regex = new RegExp("[^a-zA-Z-]","g");
        var fieldId = event.getSource().getLocalId();
        var fieldInput = component.find(fieldId);
        var inputValue = fieldInput.get('v.value');
        var validValue = inputValue.replace(regex, "");
        fieldInput.set('v.value', validValue);
    },
    
     //Income field validator
    validateIncome:  function(component, event)   { 
        var regex = new RegExp("[^0-9]","g");
        var fieldId = event.getSource().getLocalId();
        var fieldInput = component.find(fieldId);
        var inputValue = fieldInput.get('v.value');
        var validValue = inputValue.replace(regex, "");
        fieldInput.set('v.value', validValue);
    },
    
     formatNumber:  function(component, event)   { 
        var fieldId = event.getSource().getLocalId();
        var fieldInput = component.find(fieldId);
        var val = fieldInput.get('v.value');
         console.log(fieldInput);
        debugger; 
        // Strip all characters from the input except digits
        var inputValue = val.replace(/\D/g,'');
         
         if(fieldId == 'satScore' || fieldId == 'expectedGradYear'){
            inputValue = inputValue.substring(0,4);
            
 
         }
         else if(fieldId == 'actScore' ){
             inputValue = inputValue.substring(0,2);
         }
             else if(fieldId == 'noHours'){
                 inputValue = inputValue.substring(0,3);

                     }
        
        fieldInput.set('v.value', inputValue);
         debugger; 
    },
    
    validateEmail:  function(component, event)   { 
        var regex = new RegExp("/^[a-zA-Z0-9._-]+@[a-z0-9\-]+\.[a-z]{2,3}/","g");
        debugger;
        var fieldId = event.getSource().getLocalId();
        debugger;
        var fieldInput = component.find(fieldId);
        debugger;
        var inputValue = fieldInput.get('v.value');
        debugger;
    	var validity = component.find(fieldId).get("v.validity");
        console.log(validity.valid);
        debugger; 
        if(validity.valid == false){
            $A.util.addClass(component.find(fieldId), 'slds-has-error');
        }
        debugger; 
        
    },
       
    //format phone fields
    formatPhone:  function(component, event)   { 
        var fieldId = event.getSource().getLocalId();
        var fieldInput = component.find(fieldId);
        var val = fieldInput.get('v.value');
        debugger; 
        // Strip all characters from the input except digits
        var inputValue = val.replace(/\D/g,'');
        
        // Trim the remaining input to ten characters, to preserve phone number format
        inputValue = inputValue.substring(0,10);

        // Based upon the length of the string, adding necessary formatting 
        var size = inputValue.length;
        if(size == 0)
                inputValue = inputValue;
        else if(size < 4)
            inputValue = '('+inputValue;
        else if(size < 7)
       		  inputValue = '('+inputValue.substring(0,3)+') '+inputValue.substring(3,6);
        else
            inputValue = '('+inputValue.substring(0,3)+') '+inputValue.substring(3,6)+'-'+inputValue.substring(6,10);
     
        fieldInput.set('v.value', inputValue);
    },
      //format phone fields
    formatSSN:  function(component, event)   { 
        var fieldId = event.getSource().getLocalId();
        var fieldInput = component.find(fieldId);
        var val = fieldInput.get('v.value');
        
        // Strip all characters from the input except digits
        var inputValue = val.replace(/\D/g,'');
        
        // Trim the remaining input to ten characters, to preserve SSN format
        inputValue = inputValue.substring(0,9);

        // Based upon the length of the string, adding necessary formatting 
        var size = inputValue.length;
        if(size == 0)
                inputValue = inputValue;
        else if(size < 4)
            inputValue = inputValue + '-';
        else if(size < 6)
       		  inputValue = inputValue.substring(0,3)+'-'+inputValue.substring(3,5) + '-';
        else
            inputValue = inputValue.substring(0,3)+'-'+inputValue.substring(3,5)+'-'+inputValue.substring(5,9);
     
        fieldInput.set('v.value', inputValue);
    },
     formatDate:  function(component, event)   { 
        var fieldId = event.getSource().getLocalId();
        var fieldInput = component.find(fieldId);
        var val = fieldInput.get('v.value');
        
        // Strip all characters from the input except digits
        var inputValue = val.replace(/\D/g,'');
        
        // Trim the remaining input to ten characters, to preserve SSN format
        inputValue = inputValue.substring(0,8);

        // Based upon the length of the string, adding necessary formatting 
        var size = inputValue.length;
        if(size == 0)
                inputValue = inputValue;
        else if(size < 2)
            inputValue = inputValue+'/';
        else if(size < 4)
       		  inputValue = '/'+inputValue.substring(0,2)+'/'+inputValue.substring(2,4);
        else
            inputValue = inputValue.substring(0,2)+'/'+inputValue.substring(2,4)+'/'+inputValue.substring(4,8);
     
        fieldInput.set('v.value', inputValue);
    },
   
    picklistChange : function(component, event){
        debugger; 
        console.log('function runs');
    },
    clearErrors : function(component, event)    {
        debugger;
        var fieldId = event.getSource().getLocalId();
        debugger;
        var fieldInput = component.find(fieldId);
        debugger;
        var fieldValue = fieldInput.get("v.value");
        console.log('fieldId' + fieldValue);
        debugger; 
        if(fieldValue != '' || fieldValue != NULL)
            $A.util.removeClass(fieldInput, 'slds-has-error');
    },
        
    handleAddressChange: function(component, event, helper) {
        if(event.getSource().get("v.value").length % 3 == 0){
            component.set('v.addressClicked',false);
            var params = {
                input : component.get("v.location"),
                country : "United States"
            }
            helper.callServer(component, "c.getMelissaAddresses", function(response){
                var resp = JSON.parse(response);
                console.log(resp);
                component.set("v.showManualCB", true);
                if(resp.Results.length > 0){
                    component.set('v.predictions',resp.Results);
                    console.log(resp.Results); 
                    debugger;
                    document.getElementById("addressResult").style.display = "block";
                } else{
                    component.set('v.predictions',[]);
                    document.getElementById("addressResult").style.display = "none";
                }
            }, params);
        }
    },
    searchSchools: function(component, event, helper) {
        if(event.getSource().get("v.value").length % 3 == 0){
            var params = {
                input : component.get("v.univ"),
                country : "United States"
            }
            helper.callServer(component, "c.getMelissaAddresses", function(response){
                var resp = JSON.parse(response);
                console.log(resp);
                component.set("v.showManualCB", true);
                if(resp.Results.length > 0){
                    component.set('v.predictions',resp.Results);
                    console.log(resp.Results); 
                    debugger;
                    document.getElementById("addressResult").style.display = "block";
                } else{
                    component.set('v.predictions',[]);
                    document.getElementById("addressResult").style.display = "none";
                }
            }, params);
        }
    },
    
         handleAddressClick: function(component, event, helper)  {
        debugger;
        component.set('v.addressClicked',false);
        var details = event.currentTarget;
        var melissaResult = component.get("v.predictions");
        var states = component.get("v.states");
        var index = details.dataset.placeid;
        var address = details.dataset.place;
        component.set("v.selectedAddressIndex", index);
        component.set("v.location", address);
        component.set("v.selectedAddress", address);
       	console.log(address); 
        console.log(address.PostalCode);
        console.log(states);
        debugger; 

        for (var i = 0; i < melissaResult.length; i++){
            if(melissaResult[i].Address.SuiteCount > 0){
                for (var j = 0; j < melissaResult[i].Address.SuiteCount; j++){
                    if((melissaResult[i].Address.AddressLine1+' '+melissaResult[i].Address.SuiteList[j]+', '+
                        melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                        component.set("v.CVCase.Mailing_Street__c", melissaResult[i].Address.AddressLine1);
                        component.set("v.CVCase.Mailing_City__c", melissaResult[i].Address.City);
                        component.set("v.CVCase.Mailing_Countries__c", "United States");
                        helper.ObjFieldByMailingParent(component, event, "United States");
                        component.set("v.CVCase.Mailing_States__c", states[0][melissaResult[i].Address.State]);
                        console.log(melissaResult[i].Address.PostalCode);
                        debugger; 
                        component.set("v.CVCase.Mailing_ZipPostal_Code__c", melissaResult[i].Address.PostalCode);
                        component.set("v.CVCase.mailing_suite__c", melissaResult[i].Address.SuiteList[j]);
                        component.set("v.CVCase.mailing_address2__c", '');
                    }
                }
            } 
            if(melissaResult[i].Address.SuiteCount < 1){
                if((melissaResult[i].Address.AddressLine1+(melissaResult[i].Address.SuiteName != ''?' '+melissaResult[i].Address.SuiteName:'')+', '+
                    melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                    component.set("v.CVCase.Mailing_Street__c", melissaResult[i].Address.AddressLine1);
                    component.set("v.CVCase.Mailing_City__c", melissaResult[i].Address.City);
                    component.set("v.CVCase.Mailing_Countries__c", "United States");
                    helper.ObjFieldByMailingParent(component, event, "United States");
                    console.log(melissaResult[i].Address.PostalCode);
                    debugger; 
                    component.set("v.CVCase.Mailing_States__c", states[0][melissaResult[i].Address.State]);
                    component.set("v.CVCase.Mailing_ZipPostal_Code__c", melissaResult[i].Address.PostalCode);
                    component.set("v.CVCase.mailing_suite__c", melissaResult[i].Address.SuiteName);
                    component.set("v.CVCase.mailing_address2__c", '');
                }
            }
        }
        document.getElementById("addressResult").style.display = "none";
        //component.set("v.predictions", []);
    },
    
    
    handleToggleChange: function(component, event, helper){
        debugger;
        component.set('v.addressClicked',false);
        var  CVCaseClone = component.get("v.CVCaseClone");
        var melissaResult = component.get("v.predictions");
        var states = component.get("v.states");
        var index = component.get("v.selectedAddressIndex");
        var address = component.get("v.selectedAddress");
                
        if(!component.get("v.isManual")){
            component.set("v.mailingAddressRequired", false);
            
        if(!helper.checkMailingAddFieldsCompleteness(component, event))
           component.set("v.FFAddressRequired", true); 
            
            // remove has errors
            $A.util.removeClass(component.find('MailingStreetInput'), 'slds-has-error');
            $A.util.removeClass(component.find('MailingCityInput'), 'slds-has-error');
            $A.util.removeClass(component.find('MailingStateInput'), 'slds-has-error');
            $A.util.removeClass(component.find('MailingCountryInput'), 'slds-has-error');
            $A.util.removeClass(component.find('MailingzipInput'), 'slds-has-error');
            
            if(melissaResult.length > 0 && addressClicked ) {
                for (var i = 0; i < melissaResult.length; i++){
                    if(melissaResult[i].Address.SuiteCount > 0){
                        for (var j = 0; j < melissaResult[i].Address.SuiteCount; j++){
                            if((melissaResult[i].Address.AddressLine1+' '+melissaResult[i].Address.SuiteList[j]+', '+
                                melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                                component.set("v.CVCase.Mailing_Street__c", melissaResult[i].Address.AddressLine1);
                                component.set("v.CVCase.Mailing_City__c", melissaResult[i].Address.City);
                                component.set("v.CVCase.Mailing_Countries__c", "United States");
                                helper.ObjFieldByMailingParent(component, event, "United States");
                                component.set("v.CVCase.Mailing_States__c", states[0][melissaResult[i].Address.State]);
                                component.set("v.CVCase.Mailing_ZipPostal_Code__c", melissaResult[i].Address.PostalCode);
                                component.set("v.CVCase.mailing_suite__c", melissaResult[i].Address.SuiteList[j]);
                                component.set("v.CVCase.mailing_address2__c", '');
                            }
                        }
                    } 
                if(melissaResult[i].Address.SuiteCount < 1){
                    if((melissaResult[i].Address.AddressLine1+(melissaResult[i].Address.SuiteName != ''?' '+melissaResult[i].Address.SuiteName:'')+', '+
                        melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                        
                        component.set("v.CVCase.Mailing_Street__c", melissaResult[i].Address.AddressLine1);
                        component.set("v.CVCase.Mailing_City__c", melissaResult[i].Address.City);
                        component.set("v.CVCase.Mailing_Countries__c", "United States");
                        helper.ObjFieldByMailingParent(component, event, "United States");
                        component.set("v.CVCase.Mailing_States__c", states[0][melissaResult[i].Address.State]);
                        component.set("v.CVCase.Mailing_ZipPostal_Code__c", melissaResult[i].Address.PostalCode);
                        component.set("v.CVCase.mailing_suite__c", melissaResult[i].Address.SuiteName);
                        component.set("v.CVCase.mailing_address2__c", '');
                    }
                }
            }  
            }
            else{
                helper.ObjFieldByMailingParent(component, event, CVCaseClone.Mailing_Countries__c);
                component.set("v.CVCase.Mailing_Street__c", CVCaseClone.Mailing_Street__c);
                component.set("v.mailing_address2__c", '');
                component.set("v.CVCase.Mailing_City__c", CVCaseClone.Mailing_City__c);
                component.set("v.CVCase.Mailing_ZipPostal_Code__c", CVCaseClone.Mailing_ZipPostal_Code__c); 
                component.set("v.CVCase.mailing_suite__c", CVCaseClone.mailing_suite__c); 
                component.set("v.CVCase.Mailing_States__c", CVCaseClone.Mailing_States__c); 
                component.set("v.CVCase.Mailing_Countries__c", CVCaseClone.Mailing_Countries__c); 
            }
        }
        else  {
            component.set("v.mailingAddressRequired", true);
            component.set("v.FFAddressRequired", false);
            var ffAddress = component.find('AddressFreeFormInput');
            console.log(ffAddress);
            $A.util.removeClass(ffAddress, 'slds-has-error');
        }
    },
    
  
    

    
    reviewInformation: function(component, event, helper){
        debugger;
        var CVCase = component.get("v.CVCase");
        var isLookupValSelected = true;
        var isAllValid = true;
        var isValidAddress = true;
        var isValidPhyAddress = true;
        var isAddressDataValid = true;
        var phoneFieldError = '';
        var isMobileFieldsDataValid = true;
        var verifiedAddress = true;
        var SecConInfoRequired = false;
        var incomeUploadedFilesList = component.get("v.incomeUploadedFilesList");
		var uploadedTranscriptList  = component.get("v.uploadedTranscriptList"); 
        var uploadedLetterList = component.get("v.uploadedLetterList");
        var uploadedw9List = component.get("v.uploadedw9List");
        var uploadedOtherList = component.get("v.uploadedOtherList");
        var StudentsList = component.get("v.StudentsList");
        var AccountList = '';
        var ProcessedStudentsList = '';
        
        var StudntTblErrors = '';
        var errorExist = false; 
        var HHMTblErrors = '';
        var NonVerifiedStudntErrors = '';
        var showPrimaryGuardianSection = component.get("v.showPrimaryGuardianSection");
         
        var isManual = component.get("v.isManual");
        var fileError = false; 
        var fileErrorMsg = '';
        
        console.log('Vendor Selection: ' + CVCase.Vendor__c);
        
        debugger; 
         
        
        // check if user ticks the Update Address if required for Mailing Address
        if(!component.get("v.addressUpdate")  && component.get("v.UpdateAddressRequired")){
            isValidAddress= false;
            $A.util.addClass(component.find("addressUpdateCheckBox"), 'slds-has-error');
        }
         // check if user ticks the Update Address if required for Physical Address
       
        if(isValidAddress){
            debugger; 
            var controlselectAuraIds = ["priConCellPhone", "actScore", "ssn", "studentId", "countyID", "districtID", "applicationType", "collegeChoice", "noHours", "studentClassification", "expectedMonth", "expectedGradYear", "background"];
            //ConInfoRequired = helper.secConValidations(component, CVCase);
            /*if(showPrimaryGuardianSection)
                controlselectAuraIds.push("PriGuardianFirstName", "PriGuardianLastName", "PriGuardianPhone");
            if(SecConInfoRequired)
                controlselectAuraIds.push("SecConFirstName", "SecConLastName", "SecConPhone", "SecConRelation");
            */
            if(CVCase.Scholarship_Application__c != 'Valedictorian and Salutatorian'){
                controlselectAuraIds.push("studentStatus");
                if(CVCase.Scholarship_Application__c == 'Cherokee Nation Scholarship'){
                    controlselectAuraIds.push("degreeSeek");
                }
            }
            //for Mailing Address
            if(component.get("v.showLookUp") && isManual){
                console.log('Lookup Address');
                if(component.get("v.CVCase.Mailing_Countries__c ") == "United States" || component.get("v.CVCase.Mailing_Countries__c ") == "Canada")
                    controlselectAuraIds.push("MailingStreetInput","MailingCityInput","MailingCountryInput","MailingStateInput" ,"MailingzipInput");
                else
                    controlselectAuraIds.push("MailingStreetInput","MailingCityInput","MailingCountryInput","MailingOtherState","MailingzipInput");
            }
            if(component.get("v.showLookUp") && !isManual)
                controlselectAuraIds.push("AddressFreeFormInput");
            
            
            for(var i = 0; i < controlselectAuraIds.length; i++) {
                console.log(i);
                debugger; 
                var fieldId = controlselectAuraIds[i];
                var cmpFindFieldId = component.find(fieldId);
                var fieldValue = cmpFindFieldId.get("v.value");
                console.log(cmpFindFieldId + ' ' + fieldValue);
                debugger; 
                if(fieldId == "AddressFreeFormInput" && !helper.checkMailingAddFieldsCompleteness(component, event)){
                    if($A.util.isUndefinedOrNull(fieldValue) || fielhandleAddressChangedValue.trim() == "") { 
                        component.set("v.FFAddressRequired", true); 
                        $A.util.addClass(cmpFindFieldId, 'slds-has-error');
                        isAllValid = false;
                        debugger; 
                    }
                    //if mailing address is not selected via lookup field
                    else{
                        isLookupValSelected = false;
                    }
                }

                else {
                    console.log(cmpFindFieldId + ' ' + fieldValue);
                    debugger; 
                    if(fieldValue === undefined || fieldValue === ''){
                        
                        $A.util.addClass(cmpFindFieldId, 'slds-has-error');
                        isAllValid = false;
                    
                    }                      
                }
            }
        }

        //validate mailing address integrity 
        if(isAllValid && isLookupValSelected && isValidAddress) {            
            //for mailing street
            var forMobAddRegex = /^([a-zA-Z0-9\. \,\:\/\$\#\-]+)$/g;
            var addWithoutApostrophe = CVCase.Mailing_Street__c.replace(new RegExp("\\\'","g"), '');
            if (!forMobAddRegex.test(addWithoutApostrophe)){
                $A.util.addClass(component.find('MailingStreetInput'), 'slds-has-error');
                isAddressDataValid = false;
            }            
            
            //validate mailing city value
            var forMobCityRegex = /^([a-zA-Z0-9\.\ \-]+)$/g;
            addWithoutApostrophe = CVCase.Mailing_City__c.replace(new RegExp("\\\'","g"), '');
            if (!forMobCityRegex.test(addWithoutApostrophe)){
                $A.util.addClass(component.find('MailingCityInput'), 'slds-has-error');
                isAddressDataValid = false;
            }

            //validate mailing postal code value for  US address
            if(component.get("v.CVCase.Mailing_Countries__c") == "United States"){
                var forZipRegex = /^[0-9-]*$/; 
                var count = (CVCase.Mailing_ZipPostal_Code__c.match(/-/g) || []).length;
                if (!forZipRegex.test(CVCase.Mailing_ZipPostal_Code__c) || count > 1  
                    || CVCase.Mailing_ZipPostal_Code__c.substr(-1) == '-' || CVCase.Mailing_ZipPostal_Code__c.charAt(0) == '-'){
                    $A.util.addClass(component.find('MailingzipInput'), 'slds-has-error');
                    isAddressDataValid = false;
                }
            }  
            
            //validate mailing postal code value for  NON-US address
            if(component.get("v.CVCase.Mailing_Countries__c") != "United States"){
                var forZipRegex = /^[a-zA-Z0-9 -]*$/;                 
                if (!forZipRegex.test(CVCase.Mailing_ZipPostal_Code__c)  || CVCase.Mailing_ZipPostal_Code__c.substr(-1) == '-' ||CVCase.Mailing_ZipPostal_Code__c.charAt(0) == '-'){
                    $A.util.addClass(component.find('MailingzipInput'), 'slds-has-error');
                    isAddressDataValid = false;
                }
            }  
            
            if (!$A.util.isEmpty(CVCase.mailing_address2__c)) {
                //validate mailing address Line 2 value
                var forAdd2Regex = /^([a-zA-Z0-9\. \,\:\/\$\#\-]+)$/g;
                addWithoutApostrophe = CVCase.mailing_address2__c.replace(new RegExp("\\\'","g"), '');
                if (!forAdd2Regex.test(addWithoutApostrophe)){
                    $A.util.addClass(component.find('MailingAddress2Input'), 'slds-has-error');
                    isAddressDataValid = false;
                }
            }
           
        }        
        // validate phone fields
        if (isAllValid && isLookupValSelected && isValidAddress && isAddressDataValid){
            debugger; 
            // for Primary Contact
            var priConPhone  = CVCase.Ebt_Mobile_Phone__c.replace(/\D/g, '');
            var firstCharValforPriCon = priConPhone.charAt(0);
            if(priConPhone.length != 10) {
                isMobileFieldsDataValid = false;
                phoneFieldError+='Mobile number must contain 10 digits only for Primary Contact.\n';
            }
            if(firstCharValforPriCon == '1'  || firstCharValforPriCon == '0') {
                isMobileFieldsDataValid = false;
                phoneFieldError +='Mobile number should not begin with 1 or 0 for Primary Contact.\n';
            }
            debugger;
            //For ROI Mobile
            console.log(CVCase.ROI_Mobile__c);
            debugger;
            if( CVCase.ROI_Mobile__c != undefined){ 
                if(CVCase.ROI_Mobile__c != ''){
                    
               
              var roiMobile  = CVCase.ROI_Mobile__c.replace(/\D/g, '');
            var firstCharValforROIMobile = roiMobile.charAt(0);
            if(roiMobile.length != 10) {
                isMobileFieldsDataValid = false;
                phoneFieldError+='Mobile number must contain 10 digits only for Release of Information Contact.\n';
            }
            if(firstCharValforROIMobile == '1'  || firstCharValforROIMobile == '0') {
                isMobileFieldsDataValid = false;
                phoneFieldError +='Mobile number should not begin with 1 or 0 for Release of Information Contact.\n';
            }
             }
            }
            
            if( CVCase.ROI_Work_Phone__c != undefined){ 
                if(CVCase.ROI_Work_Phone__c != ''){
                    
               
            var roiWork  = CVCase.ROI_Work_Phone__c.replace(/\D/g, '');
            var firstCharValforROIWork = roiWork.charAt(0);
            if(roiWork.length != 10) {
                isMobileFieldsDataValid = false;
                phoneFieldError+='Work number must contain 10 digits only for Release of Information Contact.\n';
            }
            if(firstCharValforROIWork == '1'  || firstCharValforROIWork == '0') {
                isMobileFieldsDataValid = false;
                phoneFieldError +='Work number should not begin with 1 or 0 for Release of Information Contact.\n';
            }
             }
            }
            
            if( CVCase.ROI_Home_Phone__c != undefined){ 
                if(CVCase.ROI_Home_Phone__c != ''){
                    
               
            var roiHome  = CVCase.ROI_Home_Phone__c.replace(/\D/g, '');
            var firstCharValforROIHome = roiHome.charAt(0);
            if(roiHome.length != 10) {
                isMobileFieldsDataValid = false;
                phoneFieldError+='Home number must contain 10 digits only for Release of Information Contact.\n';
            }
            if(firstCharValforROIHome == '1'  || firstCharValforROIHome == '0') {
                isMobileFieldsDataValid = false;
                phoneFieldError +='Home number should not begin with 1 or 0 for Release of Information Contact.\n';
            }
             }
            }
            debugger;  
            /*
            if( CVCase.ROI_Work_Phone__c != ''){
             //For ROI Work
            var roiWork  = CVCase.ROI_Work_Phone__c.replace(/\D/g, '');
            var firstCharValforROIWork = roiWork.charAt(0);
            if(roiWork.length != 10) {
                isMobileFieldsDataValid = false;
                phoneFieldError+='Work number must contain 10 digits only for Release of Information Contact.\n';
            }
            if(firstCharValforROIWork == '1'  || firstCharValforROIWork == '0') {
                isMobileFieldsDataValid = false;
                phoneFieldError +='Work number should not begin with 1 or 0 for Release of Information Contact.\n';
            }
            debugger;   
            }
            
            if(CVCase.ROI_Home_Phone__c != NULL || CVCase.ROI_Home_Phone__c != ''){
               //For ROI Home
            var roiHome  = CVCase.ROI_Home_Phone__c.replace(/\D/g, '');
            var firstCharValforROIHome = roiHome.charAt(0);
            if(roiHome.length != 10) {
                isMobileFieldsDataValid = false;
                phoneFieldError+='Home number must contain 10 digits only for Release of Information Contact.\n';
            }
            if(firstCharValforROIHome == '1'  || firstCharValforROIHome == '0') {
                isMobileFieldsDataValid = false;
                phoneFieldError +='Home number should not begin with 1 or 0 for Release of Information Contact.\n';
            }
            debugger; 
            }
            */
            
            
            //For Counselor Phone
            if(CVCase.Scholarship_Application__c != 'Cherokee Nation Scholarship'){
                if(CVCase.HS_Counselor_Phone__c != undefined){
                    if(CVCase.HS_Counselor_Phone__c != ''){
                        
                    
                    var counselorPhone  = CVCase.HS_Counselor_Phone__c.replace(/\D/g, '');
            var firstCharValforCounselorPhone = counselorPhone.charAt(0);
            if(counselorPhone.length != 10) {
                isMobileFieldsDataValid = false;
                phoneFieldError+='Phone number must contain 10 digits only for High School Counselor Phone.\n';
            }
            if(firstCharValforCounselorPhone == '1'  || firstCharValforCounselorPhone == '0') {
                isMobileFieldsDataValid = false;
                phoneFieldError +='Phone number should not begin with 1 or 0 for High School Counselor Phone.\n';
            } 
                        }
                }
               
            }
            
            // for Primary Guardian Contact
            /*if(showPrimaryGuardianSection){
                var pgPhone  = CVCase.PG_Mobile_Phone__c.replace(/\D/g, '');
                var firstCharValforPriGuardian = pgPhone.charAt(0);
                if(pgPhone.length != 10) {
                    isMobileFieldsDataValid = false;
                    phoneFieldError +='Mobile number must contain 10 digits only for Primary Guardian Contact.\n';
                }
                if(firstCharValforPriGuardian == '1'  || firstCharValforPriGuardian == '0') {
                    isMobileFieldsDataValid = false;
                    phoneFieldError +='Mobile number should not begin with 1 or 0 for Primary Guardian Contact.\n';
                }
            }*/
            // for Alternate Contact
            /*if(CVCase.Sec_First_Name__c  != '' &&  CVCase.Sec_Last_Name__c  != ''  && CVCase.Sec_Phone__c  != '' && CVCase.Relation__c != ''){
                var secConPhone  = CVCase.Sec_Phone__c.replace(/\D/g, '');
                var firstCharValforSecCon = secConPhone.charAt(0);
                if(secConPhone.length != 10) {
                    isMobileFieldsDataValid = false;
                    phoneFieldError +='Mobile number must contain 10 digits only for Alternate Contact.\n';
                }
                if(firstCharValforSecCon == '1'  || firstCharValforSecCon == '0') {
                    isMobileFieldsDataValid = false;
                    phoneFieldError +='Mobile number should not begin with 1 or 0 for Alternate Contact.\n';
                }
            }
         */
        
            if(!component.get("v.malingAddressCorrect")  &&  phoneFieldError == ''){
                verifiedAddress = false;
                $A.util.addClass(component.find("mAddressCheckBox"), 'slds-has-error');
            }
        }
        
      /*  if(!SecConInfoRequired){
            $A.util.removeClass(component.find('SecConFirstName'), 'slds-has-error');
            $A.util.removeClass(component.find('SecConLastName'), 'slds-has-error');
            $A.util.removeClass(component.find('SecConPhone'), 'slds-has-error');
            $A.util.removeClass(component.find('SecConRelation'), 'slds-has-error');
        }*/
        
        //validate emails 
        var emailsValidate = ["secondaryEmail", "releaseEmail"];
        if(CVCase.Scholarship_Application__c != 'Cherokee Nation Scholarship'){
            emailsValidate.push("counselorEmail");
        }
        
        debugger; 
        
        for(var i = 0; i < emailsValidate.length; i++) {
                        var fieldId1 = emailsValidate[i];
                        var cmpFindFieldId1 = component.find(fieldId1);
                        var fieldValue1 = cmpFindFieldId1.get("v.value");
            	var validity = component.find(fieldId1).get("v.validity");
            debugger; 
        			console.log(validity.valid);
            if(validity.valid == false){
                $A.util.addClass(component.find(fieldId1), 'slds-has-error');
                            errorExist = true; 
            }
                            
                        }
            debugger; 
        
        //Validate File Upload 
        if(CVCase.Scholarship_Application__c == 'Valedictorian and Salutatorian'){
            if(uploadedTranscriptList.length == 0 ||  uploadedTranscriptList == ''){
               
                fileError = true;
                fileErrorMsg+='Please ensure your Most Recent HS Transcript is uploaded.\n';

            }
            if(uploadedLetterList.length == 0 ||  uploadedLetterList == ''){
                fileError = true;
                fileErrorMsg+='Please ensure your Counselor Approval Letter is uploaded.\n';


            }
           if(uploadedw9List.length == 0 ||  uploadedw9List == ''){
                fileError = true;
                fileErrorMsg+='Please ensure your W-9 Form is uploaded.\n';


            }
            //uploadedTranscriptList
            //uploadedLetterList
            //uploadedw9List
        }
       else if(CVCase.Scholarship_Application__c == 'Concurrent Enrollment Scholarship' && CVCase.Student_Type__c == 'New'){
           debugger;  
           if(uploadedTranscriptList.length == 0 || uploadedTranscriptList == ''){
                fileError = true;
                fileErrorMsg+='Please ensure your Most Recent HS Transcript is uploaded.\n';


            }
            if(uploadedLetterList.length == 0 || uploadedLetterList == ''){
                fileError = true;
               fileErrorMsg+='Please ensure your Parent Approval Letter is uploaded.\n';


            }
            if(uploadedw9List.length == 0 || uploadedw9List == ''){
                fileError = true;
               fileErrorMsg+='Please ensure your Counselor Approval Letter is uploaded.\n';


            }
            if(incomeUploadedFilesList.length == 0 || incomeUploadedFilesList == '' ){
                fileError = true;
               fileErrorMsg+='Please ensure your Fall 2022 College Class Schedule is uploaded.\n';


            }
            //uploadedTranscriptList
            //uploadedLetterList
            //uploadedw9List
            //incomeUploadedFilesList
        }
       else if(CVCase.Scholarship_Application__c == 'Concurrent Enrollment Scholarship' && CVCase.Student_Type__c == 'Continuing'){
           if(uploadedTranscriptList.length == 0 ||  uploadedTranscriptList == ''){
                fileError = true;
               fileErrorMsg+='Please ensure your Most Recent College Transcript is uploaded.\n';


            } 
           if(uploadedw9List.length == 0 ||  uploadedw9List == ''){
                fileError = true;
              fileErrorMsg+='Please ensure your Spring 2022 Self Help Service Form is uploaded.\n';


            } 
           if(uploadedOtherList.length == 0 ||  uploadedOtherList == ''){
                fileError = true;
               fileErrorMsg+='Please ensure your Parent Approval Letter is uploaded.\n';


            } 
           if(uploadedLetterList.length == 0 ||  uploadedLetterList == ''){
                fileError = true;
                fileErrorMsg+='Please ensure your Counselor Approval Letter is uploaded.\n';


            } 
           if(incomeUploadedFilesList.length == 0 ||  incomeUploadedFilesList == ''){
                fileError = true;
                fileErrorMsg+='Please ensure your Fall 2022 College Class Schedule is uploaded.\n';


            } 
           //uploadedTranscriptList
            //uploadedw9List
            //uploadedOtherList
            //uploadedLetterList
            //incomeUploadedFilesList
        }
      else if(CVCase.Degree__c  == 'Graduate' && CVCase.Student_Type__c == 'Continuing'){
          if(uploadedTranscriptList.length == 0 ||  uploadedTranscriptList == ''){
               helper.showErrorMessage(component, event, helper, 'Please ensure your Most Recent College Transcript is uploaded.');
                fileError = true;

            } 
          if(incomeUploadedFilesList.length == 0 ||  incomeUploadedFilesList == ''){
               helper.showErrorMessage(component, event, helper, 'Please ensure your Spring 2022 Self Help Service Form is uploaded.');
                fileError = true;

            } 
          //uploadedTranscriptList
            //incomeUploadedFilesList
            
        }
       else if(CVCase.Degree__c  == 'Graduate' && CVCase.Student_Type__c == 'New'){
           if(uploadedTranscriptList.length == 0 ||  uploadedTranscriptList == ''){
                fileError = true;
                 fileErrorMsg+='Please ensure your Most Recent College Transcript is uploaded.\n';


            } 
          if(incomeUploadedFilesList.length == 0 ||  incomeUploadedFilesList == ''){
                fileError = true;
                fileErrorMsg+='Please ensure your Graduate Program Acceptance Letter is uploaded.\n';


            } 
            //uploadedTranscriptList
            //incomeUploadedFilesList
        }
 else if(CVCase.Degree__c  == 'Undergraduate' && CVCase.Student_Type__c == 'New'){
     if(uploadedTranscriptList.length == 0 ||  uploadedTranscriptList == ''){
                fileError = true;
                fileErrorMsg+='Please ensure your Most Recent HS Transcript/GED or College Transcript is uploaded.\n';


            } 
          if(incomeUploadedFilesList.length == 0 ||  incomeUploadedFilesList == ''){
                fileError = true;
                fileErrorMsg+='Please ensure your 2022-2023 Student Aid Report is uploaded.\n';


            }        
     //incomeUploadedFilesList
            //uploadedTranscriptList
        }          
else if(CVCase.Degree__c  == 'Undergraduate' && CVCase.Student_Type__c == 'Continuing'){
    
          if(incomeUploadedFilesList.length == 0 ||  incomeUploadedFilesList == ''){
                fileError = true;
               fileErrorMsg+='Please ensure your 2022-2023 Student Aid Report is uploaded.\n';


            }  
    if(uploadedTranscriptList.length == 0 ||  uploadedTranscriptList == ''){
                fileError = true;
                fileErrorMsg+='Please ensure your Most Recent College Transcript is uploaded.\n';


            } 
    if(uploadedLetterList.length == 0 ||  uploadedLetterList == ''){
                fileError = true;
               fileErrorMsg+='Please ensure your Spring 2022 Self Help Service Form is uploaded.\n';


            } 
    //incomeUploadedFilesList
            //uploadedTranscriptList
            //uploadedLetterList
            //
        }
        debugger;
      //validate SSN 
      var SSN  = component.get("v.Acnt.Social_Security__c");
      var SSNComp = component.find('ssn');
        debugger; 
            var firstCharValforSSN = SSN.charAt(0);
            if(SSN.length != 11) {
                errorExist = true; 
                $A.util.addClass(SSNComp, 'slds-has-error');
                //SSNComp.setCustomValidity("Social Security # must be 9 digits with 2 hyphens");
  //SSNComp.reportValidity(); 
                //phoneFieldError+='Mobile number must contain 10 digits only for Primary Contact.\n';
            }
           /* if(firstCharValforPriCon == '1'  || firstCharValforPriCon == '0') {
                isMobileFieldsDataValid = false;
                phoneFieldError +='Mobile number should not begin with 1 or 0 for Primary Contact.\n';
            }*/
            debugger;   
         
        
         
        
         
        debugger; 
        if(CVCase.ACT_Score__c < 1 || CVCase.ACT_Score__c > 36){
                $A.util.addClass(component.find('actScore'), 'slds-has-error');
            errorExist = true; 

        }
        debugger; 
        console.log('SAT Score' + CVCase.SAT_Score__c);
          if(CVCase.SAT_Score__c != '' && (CVCase.SAT_Score__c < 400 || CVCase.SAT_Score__c > 1600)){
                $A.util.addClass(component.find('satScore'), 'slds-has-error');
            errorExist = true; 

        }    
        debugger; 
        if(CVCase.Expected_College_Graduation_Year__c < 2022 || CVCase.Expected_College_Graduation_Year__c > 2050){
                $A.util.addClass(component.find('expectedGradYear'), 'slds-has-error');
            errorExist = true; 

        }    
        var sfIDRegex = /[a-zA-Z0-9]{18}/; 
        if(!sfIDRegex.test(CVCase.Vendor__c)){
           
            $A.util.addClass(component.find('collegeChoice'), 'slds-has-error');
            errorExist = true; 

        }   
        
        
		if(errorExist){
                helper.showErrorMessage(component, event, helper, 'Please review invalid fields.');
            debugger; 
            }
         
        else if (!isAllValid) 
            helper.showErrorMessage(component, event, helper, 'You must fill in all of the required fields.');
        
        else if (!isLookupValSelected) 
            helper.showErrorMessage(component, event, helper, 'Please make sure the Mailing Address provided is complete via the address lookup box.');
        
        else if (!isValidAddress) 
            helper.showErrorMessage(component, event, helper,'The Mailing Address provided is invalid. Please click the Update Mailing Address toggle to edit and provide a new mailing address.');
         
        else if(fileError)
             helper.showErrorMessage(component, event, helper,fileErrorMsg);

        //else if(incomeUploadedFilesList.length == 0 || incomeUploadedFilesList == '' )
            // helper.showErrorMessage(component, event, helper, 'At least one file must be uploaded to support income mentioned.');
       
           else if (!isMobileFieldsDataValid) 
             helper.showErrorMessage(component, event, helper, phoneFieldError);

        else if(!isAddressDataValid)
             helper.showErrorMessage(component, event, helper, 'There are invalid characters in the Mailing Address fields. Please provide a valid Mailing Address.');
        
        
        else if(!verifiedAddress)
             helper.showErrorMessage(component, event, helper, 'Must check the I have verified that my mailing address is correct checkbox.');
        
		
     else{
            debugger;

           if (!component.get("v.iAccept")){
                helper.showErrorMessage(component, event, helper, 'Must check the I Accept checkbox.');
                $A.util.addClass(component.find("termsAndCons"), 'slds-has-error');
            }
           if (component.get("v.iAccept")){
                //disable save button
                debugger; 
                component.set("v.isActive", true);
                //show spinner
                var spinner = component.find("saveSpinner");
                $A.util.removeClass(spinner, "slds-hide");
                
                var emptyOut = [];
               debugger;
                component.set("v.ProcessedStudentsList", emptyOut);
               debugger;
                ProcessedStudentsList = component.get("v.ProcessedStudentsList");
                debugger; 
                for (var i = 0; i < StudentsList.length; i++){
                    if(!$A.util.isEmpty(StudentsList[i].Citizen_ID__c)){
                        var citizenId = helper.getCleanedCitizenId(component, event, StudentsList[i].Citizen_ID__c);
                        ProcessedStudentsList.push({
                            'sobjectType'				: 	'CA_Student2__c',
                            'First_Name__c'				: 	StudentsList[i].First_Name__c,
                            'Last_Name__c'				: 	StudentsList[i].Last_Name__c,
                            'Citizen_ID__c'				:   citizenId,
                            'Date_of_Birth__c'			: 	StudentsList[i].Date_of_Birth__c
                        });
                    }
                }

           var action = component.get("c.validateStudentsList");
            action.setParams({ 
                StudentsList	:	ProcessedStudentsList
            });
            
               action.setCallback(this,function(response){
                   var state = response.getState(); 
                   if(state === 'SUCCESS'){
                       //hide spinner
                       var spinner = component.find("saveSpinner");
                       $A.util.addClass(spinner, "slds-hide");
                       //enable button
                       component.set("v.isActive", false);
                       debugger;
                       var result = response.getReturnValue();
                       debugger;
                       var NonVerifiedStudentIds	= result.NonVerifiedStudentIds;
                       AccountList			= result.legitStudentsAccounts;
                       
                       //for invalide citizen ids
                       if(result.NonVerifiedStudentIds.length > 0) {
                           for (var i = 0; i < NonVerifiedStudentIds.length; i++){
                               for (var j = 0; j < StudentsList.length; j++){
                                   var cId  = StudentsList[j].Citizen_ID__c.includes(NonVerifiedStudentIds[i]);
                                   if( cId == true)  
                                       NonVerifiedStudntErrors+='The record for Student with Citizen ID: ' + StudentsList[j].Citizen_ID__c + ' cannot be verified.  For additional assistance, please contact support by phone at 918-453-5058 or by email at support-gadugiportal@cherokee.org.\n';
                               }
                           }
                           //show errors if any
                           if(NonVerifiedStudntErrors != '')
                               helper.showErrorMessage(component, event, helper, NonVerifiedStudntErrors);
                       }   
                      
                       else {
                           debugger; 
                           var emptyOut = [];
                           component.set("v.ProcessedStudentsList", emptyOut);
                           var ProcessedStudentsList = component.get("v.ProcessedStudentsList");
                           
                          /* for (var i = 0; i < AccountList.length; i++){
                               var splitDate 	= 	 AccountList[i].Date_of_Birth__c.split('-');
                               ProcessedStudentsList.push({
                                   'sobjectType'				: 	'CA_Student2__c',
                                   'First_Name__c'				: 	AccountList[i].FirstName,
                                   'Last_Name__c'				: 	AccountList[i].LastName,
                                   'Citizen_ID__c'				:   AccountList[i].Tribe_Id__c,
                                   'Date_of_Birth__c'			: 	splitDate[1]+'/'+splitDate[2]+'/'+splitDate[0]
                               });
                           }*/
                           
                           /*for (var i = 0; i < StudentsList.length; i++){
                               var citizenId = helper.getCleanedCitizenId(component, event, StudentsList[i].Citizen_ID__c);
                               for (var j = 0; j < ProcessedStudentsList.length; j++) {
                                   if(ProcessedStudentsList[j].Citizen_ID__c == citizenId) {
                                       ProcessedStudentsList[j].Grade__c 	   		 =	StudentsList[i].Grade__c;
                                       ProcessedStudentsList[j].Category__c	  		 =	StudentsList[i].Category__c;
                                       ProcessedStudentsList[j].School_District__c	 =	StudentsList[i].School_District__c;
                                   }
                               }
                           }      */    
                           debugger; 
                           component.set("v.showReviewScreen", true);
                       }
                       
                   }
                   else if (state == 'ERROR'){
                       //hide spinner
                       var spinner = component.find("saveSpinner");
                       $A.util.addClass(spinner, "slds-hide");
                       //enable button
                       component.set("v.isActive", false);
                       let errors = response.getError();
                       helper.showErrorMessage(component, event, helper, errors[0].message);
                   }
               });       
            	$A.enqueueAction(action);      
           }
        }
    },
  
    save: function(component, event, helper) {
        debugger;
        var confMess = '';
        var caseNum = '';
        var ProcessedStudentsList 	= 	component.get("v.ProcessedStudentsList");
        var CVCase 					= 	component.get("v.CVCase");
        var Accnt = component.get("v.Acnt");
        var priConMobile  			=	CVCase.Ebt_Mobile_Phone__c.replace(/\D/g, '');
        var incomeUploadedFilesList = component.get("v.incomeUploadedFilesList");
        var uploadedTranscriptList = component.get("v.uploadedTranscriptList");
        var uploadedLetterList = component.get("v.uploadedLetterList");
        var uploadedw9List = component.get("v.uploadedw9List");
        var uploadedOtherList = component.get("v.uploadedOtherList");
        console.log(CVCase.Vendor__c);
        debugger; 
        CVCase.Ebt_Mobile_Phone__c  = 	priConMobile;
        debugger; 
        /*if(CVCase.Sec_Phone__c != ''){
            var secConMobile  			=	CVCase.Sec_Phone__c.replace(/\D/g, '');
            CVCase.Sec_Phone__c  		= 	secConMobile;
        }
        if(component.get("v.showPrimaryGuardianSection")){
            debugger; 
            var pgConMobile  			=	CVCase.PG_Mobile_Phone__c.replace(/\D/g, '');
            CVCase.PG_Mobile_Phone__c  		= 	pgConMobile;
        }*/
        debugger; 
        var addressFreeForm 		= 	component.get("v.location");
        var isManual 				= 	component.get("v.isManual");
        var isAddressChanged 		= 	false;
        var melissaResult 			=	component.get("v.predictions");
        var states 					= 	component.get("v.states");
        var index					= 	component.get("v.selectedAddressIndex");
        var address 				= 	component.get("v.selectedAddress");
        var stateVal = ''; 
        if(!component.get("v.showMailingState")){
            stateVal = component.find("MailingOtherState").get("v.value"); 
        }
        else if(component.get("v.showMailingState")){
            stateVal = component.find("MailingStateInput").get("v.value");
        }
        console.log(melissaResult);
        debugger; 
             if(component.get("v.isManual")){
            for (var i = 0; i < melissaResult.length; i++){
                if(melissaResult[i].Address.SuiteCount > 0){
                     console.log(melissaResult[i].Address.State);
                    
                    
                    

                    debugger; 
                    for (var j = 0; j < melissaResult[i].Address.SuiteCount; j++){
                        if((melissaResult[i].Address.AddressLine1+' '+melissaResult[i].Address.SuiteList[j]+', '+
                            melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                            if(melissaResult[i].Address.AddressLine1 != component.find("MailingStreetInput").get("v.value") || 
                               melissaResult[i].Address.City != component.find("MailingCityInput").get("v.value") || 
                               states[0][melissaResult[i].Address.State] != stateVal || 
                               melissaResult[i].Address.PostalCode != component.find("MailingzipInput").get("v.value") || 
                               melissaResult[i].Address.SuiteList[j] != component.find("MailingSuiteInput").get("v.value") || 
                               component.find("MailingCountryInput").get("v.value") != "United States" || 
                               component.find("MailingAddress2Input").get("v.value") != ""){
                                component.set("v.isAddressChanged", true);
                                isAddressChanged = true;
                            }
                        }
                    }
                } 
                if(melissaResult[i].Address.SuiteCount < 1){
            
					
                    debugger; 
                    if((melissaResult[i].Address.AddressLine1+(melissaResult[i].Address.SuiteName != ''?' '+melissaResult[i].Address.SuiteName:'')+', '+
                        melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                        if(melissaResult[i].Address.AddressLine1 != component.find("MailingStreetInput").get("v.value") || 
                           melissaResult[i].Address.City != component.find("MailingCityInput").get("v.value") || 
                           states[0][melissaResult[i].Address.State] != stateVal ||
                           melissaResult[i].Address.PostalCode != component.find("MailingzipInput").get("v.value") || 
                           melissaResult[i].Address.SuiteName != component.find("MailingSuiteInput").get("v.value") || 
                           component.find("MailingCountryInput").get("v.value") != "United States" || 
                           component.find("MailingAddress2Input").get("v.value") != ""){
                            debugger; 
                            component.set("v.isAddressChanged", true);
                            isAddressChanged = true;
                        }
                    }
                }
            }
        }
        
          
        //disable save button
        component.set("v.isActive2", true);
        debugger; 
        //show spinner
        var spinner = component.find("Spinner2");
        $A.util.removeClass(spinner, "slds-hide");
        debugger; 
        var applicationType = component.get("v.applicationValue");
        //console.log(applicationType);
        //component.set("CVCase.Scholarship_Application__c", applicationType);
        
        
        var action = component.get("c.saveCARequest");
        debugger; 
        action.setParams({ 
            CVRequest			:  CVCase,
            accnt : Accnt,
            addressFreeForm 	:	address,
            isManual		 	:	isManual,
            isAddressChanged 	:	isAddressChanged,
            incomeUploadedFiles : incomeUploadedFilesList,
            uploadedTranscriptList : uploadedTranscriptList, 
            uploadedLetterList : uploadedLetterList,
            uploadedw9List : uploadedw9List,
            uploadedOtherList : uploadedOtherList, 
            
            
        });
        
        action.setCallback(this,function(response) {
           var state = response.getState(); 
           if(state === 'SUCCESS') {
               debugger;
               var result = response.getReturnValue();
               component.set("v.showReviewScreen", false); 
               
              
               
               
               component.set("v.caseId", result.Id);
                       caseNum='<strong><a href="/s/detail/' + result.Id + '" > Confirmation Number: ' + result.CaseNumber + '</a></strong><br><br>'; 
                       // component.set("v.requestNumber", caseNum);
                        var applicConcat = '';
               		if(result.Scholarship_Application__c	== 'Valedictorian and Salutatorian'){
                   			applicConcat = result.Scholarship_Application__c; 
              	 }
               else if(result.Scholarship_Application__c	== 'Concurrent Enrollment Scholarship'){
                   applicConcat = result.Student_Type__c + ' ' + result.Scholarship_Application__c; 
               }
                   else{
                       applicConcat = result.Student_Type__c + ' ' + result.Degree__c + ' ' + result.Scholarship_Application__c; 

                   }
                        confMess+='You have successfully submitted your 2022-23 CN ' + applicConcat +  ' Scholarship application.<br>' + caseNum; 
               component.set("v.applicationResult", confMess);
                    // show success message
               component.set("v.showHousingStipend", false);
               component.set("v.showSuccessMessage", true);
           }
           if(state === 'ERROR')  {
               component.set("v.showReviewScreen", false);
               component.set("v.isActive", false);
               //enable button
               component.set("v.isActive2", false);
               //hide spinner
               var spinner = component.find("Spinner2");
               $A.util.addClass(spinner, "slds-hide");
               var err='';
               var errors = response.getError();
               errors.forEach( function (error)  {
                    //top-level error.  there can be only one
                    if (error.message)
                        err=err+' '+error.message;					
                    
                    //page-level errors (validation rules, etc)
                    if (error.pageErrors)  {
                        error.pageErrors.forEach( function(pageError)  {
                                err=err+' '+pageError.message;					
                           });					
                    }
                    
                    if (error.fieldErrors){
                        //field specific errors--we'll say what the field is					
                        for (var fieldName in error.fieldErrors) {
                            //each field could have multiple errors
                            error.fieldErrors[fieldName].forEach( function (errorList) {	
                                          err=err+' '+errorList.message, "Field Error on " + fieldName + " : ";						
                                    });                                
                        };  //end of field errors forLoop					
                    } //end of fieldErrors if
                }); //end Errors forEach
               helper.showErrorMessage(component, event, helper, err);
           }
       });       
        
        $A.enqueueAction(action);

    },
    
    viewRequest: function(component, event, helper){
        var recId = component.get("v.caseId");
        window.location.replace('/s/detail/'+recId);
    }, 
    
    handlePaste: function(component, event, helper){
        event.preventDefault(); 
    }, 
    
    handleContext: function(component, event, helper){
        event.preventDefault(); 
    },
    
    hideModal: function(component, event, helper) {
        component.set("v.showReviewScreen", false); 
    },
    onSearchTermChange: function( component, event, helper ) {
        // search anytime the term changes
        document.getElementById("schoolResult").style.display = "block";
        var searchTerm = component.get( "v.searchTerm" );
        debugger;
        component.set("v.CVCase.Vendor__c", '');
        debugger; 
        // to improve performance, particularly for fast typers,
        // we wait a small delay to check when user is done typing
        var delayMillis = 500;
        // get timeout id of pending search action
        var timeoutId = component.get( "v.searchTimeoutId" );
        // cancel pending search action and reset timer
        clearTimeout( timeoutId );
        // delay doing search until user stops typing
        // this improves client-side and server-side performance
        timeoutId = setTimeout( $A.getCallback( function() {
            helper.handleSearch( component, searchTerm );
        }), delayMillis );
        component.set( "v.searchTimeoutId", timeoutId );
    },
    
	  handleIncomeFilesUpload: function (component, event) {
        debugger;
        var incomeUploadedFilesList = component.get("v.incomeUploadedFilesList");
        // Get the list of uploaded files
        var uploadedFiles = event.getParam("files");
        console.log(event.getSource());
        debugger; 
   //      [].forEach.call(uploadedFiles, function(file) {
       uploadedFiles.forEach(file =>  {
       debugger;
             var filename=file.name; 
            var filetype=filename.split('.')[1];
                                  incomeUploadedFilesList.push({'Id' : file.documentId,
                                  'Title': file.name,
                                  'FileExtension':filetype,
                              });
        
    }
    );
        
        component.set("v.incomeUploadedFilesList", incomeUploadedFilesList);
	},
 	handleTranscriptUpload: function (component, event) {
        debugger;
        var uploadedTranscriptList = component.get("v.uploadedTranscriptList");
        // Get the list of uploaded files
        var uploadedFiles = event.getParam("files");
        console.log(event.getSource());
        debugger; 
   //      [].forEach.call(uploadedFiles, function(file) {
       uploadedFiles.forEach(file =>  {
       debugger;
             var filename=file.name; 
            var filetype=filename.split('.')[1];
                                  uploadedTranscriptList.push({'Id' : file.documentId,
                                  'Title': file.name,
                                  'FileExtension':filetype,
                              });
        
    }
    );
        
        component.set("v.uploadedTranscriptList", uploadedTranscriptList);
	},
    handleLetterUpload: function (component, event) {
        debugger;
        var uploadedLetterList = component.get("v.uploadedLetterList");
        // Get the list of uploaded files
        var uploadedFiles = event.getParam("files");
        console.log(event.getSource());
        debugger; 
   //      [].forEach.call(uploadedFiles, function(file) {
       uploadedFiles.forEach(file =>  {
       debugger;
             var filename=file.name; 
            var filetype=filename.split('.')[1];
                                  uploadedLetterList.push({'Id' : file.documentId,
                                  'Title': file.name,
                                  'FileExtension':filetype,
                              });
        
    }
    );
        
        component.set("v.uploadedLetterList", uploadedLetterList);
	},
   	handlew9Upload: function (component, event) {
        debugger;
        var uploadedw9List = component.get("v.uploadedw9List");
        // Get the list of uploaded files
        var uploadedFiles = event.getParam("files");
        console.log(event.getSource());
        debugger; 
   //      [].forEach.call(uploadedFiles, function(file) {
       uploadedFiles.forEach(file =>  {
       debugger;
             var filename=file.name; 
            var filetype=filename.split('.')[1];
                                  uploadedw9List.push({'Id' : file.documentId,
                                  'Title': file.name,
                                  'FileExtension':filetype,
                              });
        
    }
    );
        
        component.set("v.uploadedw9List", uploadedw9List);
	},
    handleOtherUpload: function (component, event) {
        debugger;
        var uploadedOtherList = component.get("v.uploadedOtherList");
        // Get the list of uploaded files
        var uploadedFiles = event.getParam("files");
        console.log(event.getSource());
        debugger; 
   //      [].forEach.call(uploadedFiles, function(file) {
       uploadedFiles.forEach(file =>  {
       debugger;
             var filename=file.name; 
            var filetype=filename.split('.')[1];
                                  uploadedOtherList.push({'Id' : file.documentId,
                                  'Title': file.name,
                                  'FileExtension':filetype,
                              });
        
    }
    );
        
        component.set("v.uploadedOtherList", uploadedOtherList);
	},
        handleSchoolChoice: function(component, event, helper)  {
        debugger;
        var details = event.currentTarget;
            console.log('Event details' + details);
        var orderId = event.currentTarget.id;
        var melissaResult = component.get("v.rows");
        //var states = component.get("v.states");
		var index = details.dataset.placeid;
         var address = details.dataset.place;
        /*component.set("v.selectedAddressIndex", index);
        component.set("v.location", address);
        component.set("v.selectedAddress", address);
       	console.log(address); 
        console.log(address.PostalCode);
        console.log(states);
        debugger; */
            
            console.log(melissaResult[index].Name);
            component.set("v.CVCase.Vendor__c", melissaResult[index].Id);
            component.set("v.searchTerm", melissaResult[index].Name);
            component.set("v.univName", melissaResult[index].Name);

        /*for (var i = 0; i < melissaResult.length; i++){
            console.log(index);
            console.log('Place in list' + i);
            console.log('Index equal place? ' + index==i);
            if(index === melissaResult[i]){
                console.log(melissaResult[i].Id);
            component.set("v.CVCase.Vendor__c", melissaResult[i].Id);
            component.set("v.searchTerm", melissaResult[i].Name);
            }*/
            
           /* if(melissaResult[i].Address.SuiteCount > 0){
                for (var j = 0; j < melissaResult[i].Address.SuiteCount; j++){
                    if((melissaResult[i].Address.AddressLine1+' '+melissaResult[i].Address.SuiteList[j]+', '+
                        melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                        component.set("v.CVCase.Mailing_Street__c", melissaResult[i].Address.AddressLine1);
                        component.set("v.CVCase.Mailing_City__c", melissaResult[i].Address.City);
                        component.set("v.CVCase.Mailing_Countries__c", "United States");
                        helper.ObjFieldByMailingParent(component, event, "United States");
                        component.set("v.CVCase.Mailing_States__c", states[0][melissaResult[i].Address.State]);
                        console.log(melissaResult[i].Address.PostalCode);
                        debugger; 
                        component.set("v.CVCase.Mailing_ZipPostal_Code__c", melissaResult[i].Address.PostalCode);
                        component.set("v.CVCase.mailing_suite__c", melissaResult[i].Address.SuiteList[j]);
                        component.set("v.CVCase.mailing_address2__c", '');
                    }
                }
            } */
           /* if(melissaResult[i].Address.SuiteCount < 1){
                if((melissaResult[i].Address.AddressLine1+(melissaResult[i].Address.SuiteName != ''?' '+melissaResult[i].Address.SuiteName:'')+', '+
                    melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                    component.set("v.CVCase.Mailing_Street__c", melissaResult[i].Address.AddressLine1);
                    component.set("v.CVCase.Mailing_City__c", melissaResult[i].Address.City);
                    component.set("v.CVCase.Mailing_Countries__c", "United States");
                    helper.ObjFieldByMailingParent(component, event, "United States");
                    console.log(melissaResult[i].Address.PostalCode);
                    debugger; 
                    component.set("v.CVCase.Mailing_States__c", states[0][melissaResult[i].Address.State]);
                    component.set("v.CVCase.Mailing_ZipPostal_Code__c", melissaResult[i].Address.PostalCode);
                    component.set("v.CVCase.mailing_suite__c", melissaResult[i].Address.SuiteName);
                    component.set("v.CVCase.mailing_address2__c", '');
                }
            }*/
        document.getElementById("schoolResult").style.display = "none";

        //component.set("v.predictions", []);
    },
        
onIncomeFileRemove: function(component, event, helper) {
        debugger;
        component.set("v.isLoading", true);  
        var FilesArray = component.get("v.incomeUploadedFilesList");
        var FileId = event.getSource().get('v.name');
        var FileIds = [];
        
        for (var i = 0; i < FilesArray.length; i++) {
            if (FileId === FilesArray[i].Id) {
                const element = FilesArray[i].Id;
                FileIds.push(element);
                FilesArray.splice(i, 1);
                break;
            }
        }
        component.set('v.incomeUploadedFilesList', FilesArray);
        helper.deletefile(component,event,helper,FileIds);
    },
                   
onTranscriptFileRemove: function(component, event, helper) {
        debugger;
        component.set("v.isLoading", true);  
        var FilesArray = component.get("v.uploadedTranscriptList");
        var FileId = event.getSource().get('v.name');
        var FileIds = [];
        
        for (var i = 0; i < FilesArray.length; i++) {
            if (FileId === FilesArray[i].Id) {
                const element = FilesArray[i].Id;
                FileIds.push(element);
                FilesArray.splice(i, 1);
                break;
            }
        }
        component.set('v.uploadedTranscriptList', FilesArray);
        helper.deletefile(component,event,helper,FileIds);
    },
 onw9FileRemove: function(component, event, helper) {
        debugger;
        component.set("v.isLoading", true);  
        var FilesArray = component.get("v.uploadedw9List");
        var FileId = event.getSource().get('v.name');
        var FileIds = [];
        
        for (var i = 0; i < FilesArray.length; i++) {
            if (FileId === FilesArray[i].Id) {
                const element = FilesArray[i].Id;
                FileIds.push(element);
                FilesArray.splice(i, 1);
                break;
            }
        }
        component.set('v.uploadedw9List', FilesArray);
        helper.deletefile(component,event,helper,FileIds);
    },
 onLetterFileRemove: function(component, event, helper) {
        debugger;
        component.set("v.isLoading", true);  
        var FilesArray = component.get("v.uploadedLetterList");
        var FileId = event.getSource().get('v.name');
        var FileIds = [];
        
        for (var i = 0; i < FilesArray.length; i++) {
            if (FileId === FilesArray[i].Id) {
                const element = FilesArray[i].Id;
                FileIds.push(element);
                FilesArray.splice(i, 1);
                break;
            }
        }
        component.set('v.uploadedLetterList', FilesArray);
        helper.deletefile(component,event,helper,FileIds);
    },
        onOtherFileRemove: function(component, event, helper) {
        debugger;
        component.set("v.isLoading", true);  
        var FilesArray = component.get("v.uploadedOtherList");
        var FileId = event.getSource().get('v.name');
        var FileIds = [];
        
        for (var i = 0; i < FilesArray.length; i++) {
            if (FileId === FilesArray[i].Id) {
                const element = FilesArray[i].Id;
                FileIds.push(element);
                FilesArray.splice(i, 1);
                break;
            }
        }
        component.set('v.uploadedOtherList', FilesArray);
        helper.deletefile(component,event,helper,FileIds);
    },
        
        previewFile : function(component, event, helper) {
        var fileId = event.getSource().get("v.name");
        var openPreview = $A.get('e.lightning:openFiles');
        openPreview.fire({
            recordIds: [fileId]
        });
    },
    radioChange: function(component, event, helper) {
        debugger; 
        var fieldId = event.getSource().getLocalId();
        var fieldInput = component.find(fieldId);
        var val = fieldInput.get('v.value');
        
         console.log(component.get("v.CVCase.Student_Type__c") );
        debugger;
        var applicationType = component.get("v.CVCase.Scholarship_Application__c"); 
        console.log(applicationType);
        debugger; 
        if(applicationType == 'Valedictorian and Salutatorian'){
            debugger; 
            component.set("v.CVCase.Student_Type__c", ''); 
            debugger; 
            component.set("v.CVCase.Degree__c", '');
            debugger; 
        }
        else if(applicationType == 'Concurrent Enrollment Scholarship'){
            debugger; 
            console.log(component.get("v.CVCase.Degree__c"));
            debugger; 
            component.set("v.CVCase.Degree__c", '');
            console.log(component.get("v.CVCase.Degree__c"));
            debugger; 
        }
        debugger; 
        var incomeUploadedFilesList = component.get("v.incomeUploadedFilesLst");
        debugger; 
        var uploadedTranscriptList = component.get("v.uploadedTranscriptList");
        debugger;
        var uploadedLetterList = component.get("v.uploadedLetterList");
        debugger; 
        var uploadedw9List = component.get("v.uploadedw9List");
        debugger;
        var uploadedOtherList = component.get("v.uploadedOtherList");
		debugger;
        var FilesArray = [];
        debugger; 
        var FileId = event.getSource().get('v.name');
        debugger; 
        var FileIds = [];
        debugger; 
        
        
             FilesArray.concat(incomeUploadedFilesList);
        
        debugger; 
      
		FilesArray.concat(uploadedTranscriptList);            
              
       
        debugger; 
        
            FilesArray.concat(uploadedLetterList);
        debugger;
       
             FilesArray.concat(uploadedw9List);
     debugger; 
        
            FilesArray.concat(uploadedOtherList);
        debugger; 
       
        
        console.log(FilesArray);
        debugger; 
        
        for (var i = 0; i < FilesArray.length; i++) {
           debugger; 
                const element = FilesArray[i].Id;
            console.log(element);
            debugger;
                FileIds.push(element);
            debugger; 
                FilesArray.splice(i, 1);
            debugger; 
               
            
        }
        component.set('v.uploadedOtherList', FilesArray);
        component.set('v.incomeUploadedFilesList', FilesArray); 
        component.set('v.uploadedTranscriptList', FilesArray); 
        component.set('v.uploadedLetterList', FilesArray); 
        component.set('v.uploadedw9List', FilesArray); 
        helper.deletefile(component,event,helper,FileIds);
        debugger; 
    },

})