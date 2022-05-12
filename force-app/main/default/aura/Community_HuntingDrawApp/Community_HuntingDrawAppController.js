({
    doInit : function(component, event, helper) {
        debugger;
        var catList = [{label:"Fish and Wildlife Controlled Hunt Youth App", value:"Fish and Wildlife Controlled Hunt Youth App"},
                       {label:"Fish and Wildlife Controlled Hunt Veteran App", value:"Fish and Wildlife Controlled Hunt Veteran App"},
                       {label:"Fish and Wildlife Controlled Hunt At Large App", value:"Fish and Wildlife Controlled Hunt At Large App"},
                       {label:"Fish and Wildlife Controlled Hunt Elder App", value:"Fish and Wildlife Controlled Hunt Elder App"}];
        
        var selectedCategories = [];
        let youthCategory = "Fish and Wildlife Controlled Hunt Youth App";
        let veteranCategory = "Fish and Wildlife Controlled Hunt Veteran App";
        let atLargeCategory = "Fish and Wildlife Controlled Hunt At Large App";
        let elderCategory = "Fish and Wildlife Controlled Hunt Elder App";

        // component.set("v.categoryOptions",catList);

        // let ageText = "16 years";
        // let age = ageText.substring(0, 2); 

        // if (age < 18) {
        //     selectedCategories = catList.filter(function(item) { 
        //         return item.value == "Fish and Wildlife Controlled Hunt Youth App"; 
        //       });
            
        //     component.set("v.categoryOptions",selectedCategories);
        // }
        debugger;
        let action = component.get("c.getApplicantInfo");
        action.setCallback(this, function(response){
            var state = response.getState();
             if (state === "SUCCESS")
             {
                 debugger;
                var resultData = response.getReturnValue();
                debugger
                resultData.caseExists = false;
                //check for case is already exists or not
                if (resultData.caseExists) {
                    component.set("v.caseId",resultData.caseObj.Id);
                    component.set("v.requestNumber", resultData.caseObj.CaseNumber);
                    //  component.set("v.showEditBtn", result.RRRCase.RRR_Request_Edit_Status__c);
                     // show success message
                    // component.set("v.huntAppForm",false);
                    component.set("v.showSuccessMessage", true);
                    debugger
                    console.log(resultData.caseObj.Status);
                     if (resultData.caseObj.Status === "Selected") {
                        //component.set("v.selectedOrNotSelected","Congratulations!");
                        //component.set("v.selectedOrNotSelectedMsg","You’ve been selected to participate in Cherokee Nation’s 2021 Controlled Hunt. Specifically, the " + resultData.caseObj.Selected_Event__c + ".  Cherokee Nation will contact you soon with more details.")
                        //component.set("v.selectedOrNotSelectedDescription","If you have any questions or are no longer interested in participating in this hunt, please contact the Wildlife Conservation department by calling " + 918-453-5000 + ", ext. 5333.")
                        component.set("v.showSelectedMessage",true);
                        component.set("v.showSuccessMessage", false);
                        component.set("winningEvent",resultData.caseObj.Selected_Event__c);
                        
                    } else if (resultData.caseObj.Status === "Not Selected") {
                        component.set("v.showNotSelectedMessage",true);
                        component.set("v.showSuccessMessage", false);

                        //component.set("v.selectedOrNotSelected","Thank You");
                        //component.set("v.selectedOrNotSelectedMsg","Thank you for applying for Cherokee Nation’s inaugural Controlled Hunt program. Unfortunately, you were not selected to participate in a controlled hunt this year.")
                        //component.set("v.selectedOrNotSelectedDescription","As Cherokee citizens, we are blessed with access to thousands of acres, on which to freely hunt, fish and gather. The following is a link to the map of properties, within the Cherokee reservation, open and available for these activities, WALK IN ONLY. (Click Here to view Hunting and Fishing Lands)  Please enjoy these properties while waiting for next year’s Controlled Hunt application.")
                    } else if (resultData.caseObj.Status === "Pending") {
                        
                    }
                    return;
                } else{
					//if have'nt applied for Hunt app, after the Hunt app closed
                }
                component.set("v.huntAppForm",true);
                
                
                debugger
                if (!$A.util.isEmpty(resultData.acnt)) {
                    if (!$A.util.isEmpty(resultData.acnt.Date_of_Birth__c)) {
                        var date = resultData.acnt.Date_of_Birth__c;
                        var datearray = date.split("-");
                        
                        var newdate = datearray[1] + '/' + datearray[2] + '/' + datearray[0];
                        resultData.acnt.Date_of_Birth__c = newdate;
                    }
                    if (!$A.util.isEmpty(resultData.acnt.PersonMobilePhone)) {
                        var phone = resultData.acnt.PersonMobilePhone;
                        var number = phone.replace(/\D/g, '').slice(-10);
                        resultData.acnt.PersonMobilePhone = '('+number.substring(0,3)+')'+number.substring(3,6)+'-'+number.substring(6,10);
                    }
                    
                }
                //setting the account obj values to accObj component
                component.set("v.accObj",resultData.acnt);

                //Set Attributes for Applicant Physical Address
                component.set("v.PhysicalStreetInputOLV",resultData.acnt.PersonOtherStreet);
                component.set("v.PhysicalAddress2InputOLV",'');
                component.set("v.PhysicalSuiteInputOLV",resultData.acnt.Physical_Suite__c);
                component.set("v.PhysicalCityInputOLV",resultData.acnt.PersonOtherCity);
                component.set("v.PhysicalCountryInputOLV",resultData.acnt.PersonOtherCountry);
                component.set("v.PhysicalStateInputOLV",resultData.acnt.PersonOtherState);
                component.set("v.PhysicalOtherStateOLV",'');
                component.set("v.PhysicalzipInputOLV",resultData.acnt.PersonOtherPostalCode);

                console.log(resultData.cs_PickListMap);

                // set phone number
                var phone = '';
                if (!$A.util.isUndefined(resultData.acnt.PersonMobilePhone))
                {       
                    phone = resultData.acnt.PersonMobilePhone;
                    var number = phone.replace(/\D/g, '').slice(-10);                         
                    component.find("aIdPhone").set("v.value", '('+number.substring(0,3)+')'+number.substring(3,6)+'-'+number.substring(6,10));
                    // component.find("aIdPhone").set("v.value", number);
                }
                else
                {
                    component.find("aIdPhone").set("v.value", '');
                }

                 //-----Working---------
                 //-------Set Country and States Dropdown Auto-populated-------
                 component.set("v.getPickListMap",resultData.cs_PickListMap); 
                 var cs_PickListMap = component.get("v.getPickListMap");
                 var parentkeys = [];
                 var parentField = [];                
                 
                 for (var pickKey in resultData.cs_PickListMap)
                 {
                     parentkeys.push(pickKey);
                 }
                 
                 for (var i = 0; i < parentkeys.length; i++) 
                 {
                     parentField.push(parentkeys[i]);
                 }  
                 component.set("v.getPG_PhysicalParentList", parentField);
                 component.set("v.getParentList", parentField);
                //  component.set('v.states',resultData.statesMap);
                //-----Working---------
                 debugger;
               
                 
                 //-------Set Country and States Dropdown Auto-populated-------
                 // set default values for picklists
                 window.setTimeout(
                    $A.getCallback( function() 
                         {
                             debugger
                             //set country(controlling picklist) value 
                             var physicalCountryVal = resultData.acnt.PersonOtherCountry; 
                             if ($A.util.isUndefined(physicalCountryVal))
                             {
                                 component.find("PhysicalCountryInput").set("v.value", 'United States');
                                //  component.set("v.PhysicalCountryInput", 'United States');
                             }
                             else
                             {
                                 component.find("PhysicalCountryInput").set("v.value", resultData.acnt.PersonOtherCountry);
                                //  component.set("v.mailingCountryOLV", resultData.wrp.acnt.PersonOtherCountry);
                             }
                             debugger
                             $A.enqueueAction(component.get('c.handleCountryChange'));
                             
                             // set state(dependent picklist) value once country(controlling picklist) value is set
                             var physicalStateVal = resultData.acnt.PersonOtherState;
                            //  physicalStateVal = '';
                             if ($A.util.isUndefined(physicalStateVal))
                             {
                                 setTimeout(function()
                                            {
                                                // alert("setTimeout");
                                                component.find("PhysicalStateInput").set("v.value", ''); 
                                                // $A.enqueueAction(component.get('c.handlePhysicalStateChange'));
                                                // component.set("v.mailingStateOLV", '');
                                                helper.handleStateChange(component,event);
                                            }, 1000);
                             }
                             else
                             {
                                 setTimeout(function()
                                            {
                                                // alert("setTimeout");
                                                component.find("PhysicalStateInput").set("v.value", physicalStateVal);
                                                helper.handleStateChange(component,event);
                                                //  $A.enqueueAction(component.get('c.handlePhysicalStateChange'));
                                                // component.set("v.mailingStateOLV", physicalStateVal);
                                            }, 1000);   
                             }

                            

                            
                         }));

                         component.set('v.states',resultData.statesMap);

                //------Categories-------
                //check if user is less than 18
                
                let ageText = resultData.acnt.Age__pc;
                let age = ageText.substring(0, 2); 
                // var physicalState = resultData.acnt.PersonOtherState;
               //age = 17; 
                if (age < 18) {
                    component.set("v.isApplicantUnder18","Yes");
                } else if (age > 54){
                    component.set("v.isApplicantAbove55","Yes");
                }
                // setTimeout(function() {
                //     $A.enqueueAction(component.get('c.handlePhysicalStateChange'));
                //     }, 4000); 
                
                //component.set("v.categoryOptions",catList);
              //  users = users.filter(obj => obj.name == filter.name && obj.address == filter.address)
                //  if (age < 18) {
                //      debugger;
                //      component.set("v.isApplicantUnder18","Yes");
                //      catList.forEach(element => {
                //          if (element.value == youthCategory || element.value == atLargeCategory) {
                //                 selectedCategories.push(element);
                //          }
                //      });
                // } else {
                //     debugger;
                //     selectedCategories = catList.filter(item => !(item.value == youthCategory));
                //  }
                //  //Show Categories based on state
                //  debugger;
                //  if (physicalState.localeCompare('Oklahoma') == 0) {
                //      selectedCategories = selectedCategories.filter(item => !(item.value == atLargeCategory));
                //  } 
                //  //Populating Categories
                //  debugger;
                //  if (selectedCategories.length > 0) {
                //     component.set("v.categoryOptions",selectedCategories);
                //  }

                 //Setting the Required attributes
                 component.set("v.physicalAddressRequired", true);
                 component.set("v.physicalStateRequired" , true);
                 component.set("v.physicalOtherStateRequired" , true);

                 //Populating the Hunt Categories
                 //component.set("v.categoryOptions",catList);
            }
        });
        $A.enqueueAction(action);
    },

    handleCategoryChange : function(component, event, helper){
        debugger;
        // if (!event.getSource().get("v.checked")) {
        //     return;
        // }
        let eventDescription = '';
        let eventDescBold = '';
        let eventDescLine = '';
        let selectedCategory = '';
        let youthCategory = "Fish and Wildlife Controlled Hunt Youth App";
        let veteranCategory = "Fish and Wildlife Controlled Hunt Veteran App";
        let atLargeCategory = "Fish and Wildlife Controlled Hunt At Large App";
        let elderCategory = "Fish and Wildlife Controlled Hunt Elder App";
        //getting eventOptions from helper method in List and set it to eventOptions component
        let eventOptions = [];
        debugger;
        let huntCategory = component.find("aIdSelectCategory").get("v.value");
        selectedCategory = huntCategory.toString().split(',');

        // if (component.get("v.singleCatSelected")) {
        //     // alert("You can only select one category");
        //     helper.showToast("You can select either Youth Or At-Large");
        //     component.find("aIdSelectCategory").set("v.value",'');
        //     selectedCategory = "";
        //     //return;
        // }
        // if (component.get("v.comboCatSelected")) {
        //     // alert("You cannot select category");
        //     helper.showToast("You can only select the combo of Veteran and Elder");
        //     component.find("aIdSelectCategory").set("v.value",'');
        //     selectedCategory = "";
        // }

        // if (component.get("v.vetOrElderSelected") && 
        //     (!selectedCategory.includes(elderCategory) || !selectedCategory.includes(veteranCategory))) {
        //         helper.showToast("You can only select the combo of Veteran and Elder");
        //         component.find("aIdSelectCategory").set("v.value",'');
        //         selectedCategory = "";
        // }
            
        component.set("v.comboCatSelected",false);
        component.set("v.singleCatSelected",false);
        component.set("v.vetOrElderSelected",false);

        //showing event section based on category
       // component.set("v.isCategoryOptionSelected",false);
        //set it to false to avoid writing this line multiple times
        component.set("v.isYouthOptionSelected",false);
        //set PG elements to false
        component.set("v.PG_PhysicalAddressRequired", false);
        component.set("v.PG_PhysicalStateRequired" , false);
        component.set("v.PG_PhysicalOtherStateRequired" , false);
        component.set("v.isManual",false);
        //For File Modal
        component.set("v.isVeteranOptionSelected",false);
        // component.set("v.ShowFileModal", false);    

        

        if (!selectedCategory[0] == '') {
            if (selectedCategory.length > 1) {
                if(selectedCategory.includes(veteranCategory) && selectedCategory.includes(elderCategory)){
                   
                    component.set("v.isCategoryOptionSelected",true);
                    component.set("v.comboCatSelected",true);
                    component.set("v.isVeteranOptionSelected",true);
                    if (!component.get("v.ShowFileModal")) {
                        component.set("v.ShowFileModal", true); 
                    }
        
                    let comboEventOptions = [];
                    comboEventOptions = helper.getEventOptions(component,"elder");
                    component.set("v.comboEventOptions",comboEventOptions);
    
                    eventOptions = helper.getEventOptions(component,"veteran");
                    //helper.getEventOptions(component,"elder").filter(item => eventOptions.push(item));
        
                    eventDescription = helper.getEventDescription("veteran");
                    eventDescBold = helper.getEventDescBold('veteran');
                    eventDescLine = helper.getDescLine('veteran');


                    debugger
                    var eventOptions1 = component.find("aIdSelectEvent").get("v.value");
                    component.find("aIdSelectEvent").set("v.value",'');
                    component.find("aIdSelectComboEvent").set("v.value",'');

                }
            } else {
                if (selectedCategory[0].localeCompare(youthCategory) == 0) {
                    component.set("v.singleCatSelected",true);
                    component.set("v.ShowFileModal", false);  
        
                    component.set("v.isYouthOptionSelected",true);
                    eventOptions = helper.getEventOptions(component,"youth");
                    eventDescription = helper.getEventDescription("youth");
                    eventDescBold = helper.getEventDescBold('youth');
                    eventDescLine = helper.getDescLine('youth');
        
                    //Set Parent/Guardian Attributes
                    component.set("v.PG_PhysicalAddressRequired", true);
                    component.set("v.PG_PhysicalStateRequired" , true);
                    component.set("v.PG_PhysicalOtherStateRequired" , true);
                    
        
                    component.find("PG_PhysicalCountryInput").set("v.value", 'United States');
                    $A.enqueueAction(component.get('c.handlePGCountryChange'));
        
                    //set "isManual" to true
                    component.set("v.isManual",false);
                    component.set("v.showManualCB",false);
                    component.set("v.AddressFreeFormInput",'');
                    component.set("v.PG_showLookUp",false);
                    component.set("v.isAddressSame",false);
                    component.set("v.PG_addressUpdate",false);

                    //set AA section to default
                    component.set("v.isAAInfoSameAsParent",false);
                    component.set("v.isAAFieldsDisabled",false);
                    component.set("v.AA_FirstName",'');
                    component.set("v.AA_LastName",'');
                    component.set("v.AA_DriLicNo",'');
                    component.set("v.AA_Mobile",'');

                    component.set("v.isCategoryOptionSelected",true);
                } else if (selectedCategory[0].localeCompare(veteranCategory) == 0) {
                    component.set("v.vetOrElderSelected",true);
                    component.set("v.isVeteranOptionSelected",true);
                    if (!component.get("v.ShowFileModal")) {
                        component.set("v.ShowFileModal", true); 
                    }
        
                    eventOptions = helper.getEventOptions(component,"veteran");
                    eventDescription = helper.getEventDescription("veteran");
                    eventDescBold = helper.getEventDescBold('veteran');
                    eventDescLine = helper.getDescLine('veteran');

                    component.set("v.isCategoryOptionSelected",true);

                    debugger
                    var eventOptions2 = component.find("aIdSelectEvent").get("v.value");

                } else if (selectedCategory[0].localeCompare(atLargeCategory) == 0) {
                    component.set("v.singleCatSelected",true);
                    component.set("v.ShowFileModal", false);  
                    if (component.get("v.isApplicantUnder18").localeCompare('Yes') == 0) {
                        component.set("v.isYouthOptionSelected",true);
                        //Set Parent/Guardian Attributes
                        component.set("v.PG_PhysicalAddressRequired", true);
                        component.set("v.PG_PhysicalStateRequired" , true);
                        component.set("v.PG_PhysicalOtherStateRequired" , true);
                    
                        component.find("PG_PhysicalCountryInput").set("v.value", 'United States');
                        $A.enqueueAction(component.get('c.handlePGCountryChange'));
                        //set "isManual" to true
                        component.set("v.isManual",false);
                        component.set("v.showManualCB",false);
                        component.set("v.AddressFreeFormInput",'');
                        component.set("v.PG_showLookUp",false);
                        component.set("v.isAddressSame",false);
                        component.set("v.PG_addressUpdate",false);

                             //set AA section to default
                        component.set("v.isAAInfoSameAsParent",false);
                        component.set("v.isAAFieldsDisabled",false);
                        component.set("v.AA_FirstName",'');
                        component.set("v.AA_LastName",'');
                        component.set("v.AA_DriLicNo",'');
                        component.set("v.AA_Mobile",'');
                        }
        
                    eventOptions = helper.getEventOptions(component,"atLarge");
                    eventDescription = helper.getEventDescription("atLarge");
                    eventDescBold = helper.getEventDescBold('atLarge');
                    eventDescLine = helper.getDescLine('atLarge');

                    component.set("v.isCategoryOptionSelected",true);
                } else if (selectedCategory[0].localeCompare(elderCategory) == 0) {
                    component.set("v.vetOrElderSelected",true);
                    component.set("v.ShowFileModal", false);  
        
                    eventOptions = helper.getEventOptions(component,"elder");
                    eventDescription = helper.getEventDescription("elder");
                    eventDescBold = helper.getEventDescBold('elder');
                    eventDescLine = helper.getDescLine('elder');

                    component.set("v.isCategoryOptionSelected",true);

                    debugger
                    var eventOptions3 = component.find("aIdSelectEvent").get("v.value");
                }

                
            }
            
           
        } else {
            component.set("v.isCategoryOptionSelected",false);
            component.find("aIdSelectEvent").set("v.value",'');
            if (component.get("v.comboCatSelected")) {
                component.find("aIdSelectEvent").set("v.value",'');
             }
             component.set("v.W9FileName",'');
             if (component.get("v.ShowFileModal")) {
                component.set("v.ShowFileModal", false); 
            }
            //component.set("v.isCategoryOptionSelected",false);
        }
        
        debugger
       // var eventOption = component.find("aIdSelectEvent").get("v.value");
        //After getting the list of eventOptions from Helper method set once here
        component.set("v.eventOptions",eventOptions);
        component.set("v.eventDescription",eventDescription);
        component.set("v.eventDescBold",eventDescBold);
        component.set("v.eventDescLine",eventDescLine);
    },


    //---------Applicant Physical Address Functions----------------
    handlePhysicalAddressChange: function(component, event, helper){
        if(event.getSource().get("v.value").length % 3 == 0){
            debugger;
            var params = {
                input : component.get("v.p_location"),
                country : component.find("PhysicalCountryInput").get("v.value")
            }
            
            
            helper.callServer(component, "c.getMelissaAddresses", function(response){
                debugger;
                var resp = JSON.parse(response);
                console.log(resp);
                component.set("v.p_showManualCB", true);
                if(resp.Results.length > 0){
                    component.set('v.p_predictions',resp.Results);
                    document.getElementById("p_addressResult").style.display = "block";
                } else{
                    component.set('v.p_predictions',[]);
                    document.getElementById("p_addressResult").style.display = "none";
                }
            }, params);
        }
    },

    handlePhysicalAddressClick: function(component, event, helper){
        var details = event.currentTarget;
        var melissaResult = component.get("v.p_predictions");
        var states = component.get("v.states");
        var index = details.dataset.placeid;
        var address = details.dataset.place;
        component.set("v.p_selectedAddressIndex", index);
        component.set("v.p_location", address);
        component.set("v.p_selectedAddress", address);
        debugger;
        for (var i = 0; i < melissaResult.length; i++){
            if(melissaResult[i].Address.SuiteCount > 0){
                for (var j = 0; j < melissaResult[i].Address.SuiteCount; j++){
                    if((melissaResult[i].Address.AddressLine1+' '+melissaResult[i].Address.SuiteList[j]+', '+
                        melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                        component.find("PhysicalStreetInput").set("v.value", melissaResult[i].Address.AddressLine1);
                        component.find("PhysicalCityInput").set("v.value", melissaResult[i].Address.City);
                        debugger;
                        if(component.get("v.p_isManual") && component.find("PhysicalCountryInput").get("v.value") != "United States"){
                            component.find("PhysicalCountryInput").set("v.value", "United States");
                            //get PG_Physical country value
                            var controllerValue = component.find("PhysicalCountryInput").get("v.value");
                            // get country state map
                            var pickListMap = component.get("v.getPickListMap");
                            
                            // pass country state map key(country value) to get state values
                            var childValues = pickListMap[controllerValue];            
                            var childValueList = [];
                            
                            for (var k = 0; k < childValues.length; k++)
                            {
                                childValueList.push(childValues[k]);
                            }
                            
                            component.set("v.getChildList", childValueList);
                            
                            //get state values against country
                            if(childValues.length > 0)
                            {
                                component.set("v.showPhysicalOtherState", false);
                                component.set("v.showPhysicalState", true);
                                //component.set("v.getPhysicalDisabledChildField" , false); 
                                
                               // component.set("v.physicalOtherStateDisabled" , true);
                                if(component.find("PhysicalOtherState") != null){
                                    component.find("PhysicalOtherState").set("v.value",'');
                                }
                            }
                        }
                        component.find("PhysicalStateInput").set("v.value", states[0][melissaResult[i].Address.State]);
                        component.find("PhysicalzipInput").set("v.value", melissaResult[i].Address.PostalCode);
                        component.find("PhysicalSuiteInput").set("v.value", melissaResult[i].Address.SuiteList[j]);
                    }
                }
            } 
            if(melissaResult[i].Address.SuiteCount < 1){
                if((melissaResult[i].Address.AddressLine1+(melissaResult[i].Address.SuiteName != ''?' '+melissaResult[i].Address.SuiteName:'')+', '+
                    melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                    component.find("PhysicalStreetInput").set("v.value", melissaResult[i].Address.AddressLine1);
                    component.find("PhysicalCityInput").set("v.value", melissaResult[i].Address.City);
                    if(component.find("PhysicalCountryInput").get("v.value") != "United States"){
                        component.find("PhysicalCountryInput").set("v.value", "United States");
                        //get PG_Physical country value
                        var controllerValue = component.find("PhysicalCountryInput").get("v.value");
                        // get country state map
                        var pickListMap = component.get("v.getPickListMap");
                        
                        // pass country state map key(country value) to get state values
                        var childValues = pickListMap[controllerValue];            
                        var childValueList = [];
                        
                        for (var k = 0; k < childValues.length; k++)
                        {
                            childValueList.push(childValues[k]);
                        }
                        
                        component.set("v.getChildList", childValueList);
                        
                        //get state values against country
                        if(childValues.length > 0)
                        {
                            component.set("v.showPhysicalOtherState", false);
                            component.set("v.showPhysicalState", true);
                            //component.set("v.getPhysicalDisabledChildField" , false); 
                            
                            //component.set("v.physicalOtherStateDisabled" , true);
                            if(component.find("PhysicalOtherState") != null){
                                component.find("PhysicalOtherState").set("v.value",'');
                                }
                        }
                    }
                    component.find("PhysicalStateInput").set("v.value", states[0][melissaResult[i].Address.State]);
                    component.find("PhysicalzipInput").set("v.value", melissaResult[i].Address.PostalCode);
                    component.find("PhysicalSuiteInput").set("v.value", melissaResult[i].Address.SuiteName);
                }
            }
        }
        document.getElementById("p_addressResult").style.display = "none";
        helper.handleStateChange(component,event);
        //component.set("v.predictions", []);
    },

    handlePhysicalToggleChange: function(component, event, helper){
        var melissaResult = component.get("v.p_predictions");
        var states = component.get("v.states");
        var index = component.get("v.p_selectedAddressIndex");
        var address = component.get("v.p_selectedAddress");
        
        var physicalStreetInput = component.find("PhysicalStreetInput");
        var physicalStreet = physicalStreetInput.get("v.value");
        var physicalCityInput = component.find("PhysicalCityInput");
        var physicalCity = physicalCityInput.get("v.value");
        var physicalCountryInput = component.find("PhysicalCountryInput");
        var physicalCountry = physicalCountryInput.get("v.value");
        var physicalZipInput = component.find("PhysicalzipInput");
        var physicalZip = physicalZipInput.get("v.value");
        
        debugger
        if(!component.get("v.p_isManual")){
             //component.set("v.physicalAddressRequired", false);
            if (physicalStreet == '' ||  physicalCity == ''  || physicalCountry == '' || physicalZip == '')
            {
                //mark free form address field required
                component.set("v.p_FFAddressRequired", true); 
            }
            
            if(component.get("v.p_location") != ""){
            component.find("PhysicalCountryInput").set("v.value", 'United States');
            
            // get country state map
                            var pickListMap = component.get("v.getPickListMap");//get physical country value
                        	var controllerValue = component.find("PhysicalCountryInput").get("v.value");
                            
                            // pass country state map key(country value) to get state values
                            var childValues = pickListMap[controllerValue];            
                            var childValueList = [];
                            
                            for (var k = 0; k < childValues.length; k++)
                            {
                                childValueList.push(childValues[k]);
                            }
                            
                            component.set("v.getChildList", childValueList);
                            
                            //get state values against country
                            if(childValues.length > 0)
                            {
                                component.set("v.showPhysicalOtherState", false);
                                component.set("v.showPhysicalState", true);
                                //component.set("v.getPhysicalDisabledChildField" , false); 
                                
                                //component.set("v.physicalOtherStateDisabled" , true);
								if(component.find("PhysicalOtherState") != null){
                                component.find("PhysicalOtherState").set("v.value",'');
                                }                            
                            }
            }
            // remove has errors
            var street = component.find('PhysicalStreetInput');
            $A.util.removeClass(street, 'slds-has-error');
     
            var city = component.find('PhysicalCityInput');
            $A.util.removeClass(city, 'slds-has-error');
            
            var state = component.find('PhysicalStateInput');
            $A.util.removeClass(state, 'slds-has-error');
     
            var country = component.find('PhysicalCountryInput');
            $A.util.removeClass(country, 'slds-has-error');
            
            var zip = component.find('PhysicalzipInput');
            $A.util.removeClass(zip, 'slds-has-error');
                     
            var otherState = component.find('PhysicalOtherState');
            $A.util.removeClass(otherState, 'slds-has-error');
            
            if(melissaResult.length > 0 )
            {
               for (var i = 0; i < melissaResult.length; i++){
                if(melissaResult[i].Address.SuiteCount > 0){
                    for (var j = 0; j < melissaResult[i].Address.SuiteCount; j++){
                        if((melissaResult[i].Address.AddressLine1+' '+melissaResult[i].Address.SuiteList[j]+', '+
                        melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                            component.find("PhysicalStreetInput").set("v.value", melissaResult[i].Address.AddressLine1);
                            component.find("PhysicalCityInput").set("v.value", melissaResult[i].Address.City);
                            if(component.find("PhysicalCountryInput").get("v.value") != "United States"){
                                component.find("PhysicalCountryInput").set("v.value", "United States");
                                //get physical country value
                                var controllerValue = component.find("PhysicalCountryInput").get("v.value");
                                // get country state map
                                var pickListMap = component.get("v.getPickListMap");
                                
                                // pass country state map key(country value) to get state values
                                var childValues = pickListMap[controllerValue];            
                                var childValueList = [];
                                
                                for (var k = 0; k < childValues.length; k++)
                                {
                                    childValueList.push(childValues[k]);
                                }
                                
                                //component.set("v.getPhysicalChildList", childValueList);
                                
                                //get state values against country
                                if(childValues.length > 0)
                                {
                                    component.set("v.showPhysicalOtherState", false);
                                    component.set("v.showPhysicalState", true);
                                    //component.set("v.getPhysicalDisabledChildField" , false); 
                                    
                                    //component.set("v.physicalOtherStateDisabled" , true);
                                    if(component.find("PhysicalOtherState") != null){
                                	component.find("PhysicalOtherState").set("v.value",'');
                                }
                                }
                            }
                            debugger;
                            component.find("PhysicalStateInput").set("v.value", states[0][melissaResult[i].Address.State]);
                            component.find("PhysicalzipInput").set("v.value", melissaResult[i].Address.PostalCode);
                            component.find("PhysicalSuiteInput").set("v.value", melissaResult[i].Address.SuiteList[j]);
                            component.find("PhysicalAddress2Input").set("v.value", '');
                        }
                    }
                } 
                if(melissaResult[i].Address.SuiteCount < 1){
                    if((melissaResult[i].Address.AddressLine1+(melissaResult[i].Address.SuiteName != ''?' '+melissaResult[i].Address.SuiteName:'')+', '+
                    melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                        component.find("PhysicalStreetInput").set("v.value", melissaResult[i].Address.AddressLine1);
                        component.find("PhysicalCityInput").set("v.value", melissaResult[i].Address.City);
                        //component.find("physicalCountryInput").set("v.value", "United States");
                        if(component.find("PhysicalCountryInput").get("v.value") != "United States"){
                            component.find("PhysicalCountryInput").set("v.value", "United States");
                            //get PG_Physical country value
                            var controllerValue = component.find("PhysicalCountryInput").get("v.value");
                            // get country state map
                            var pickListMap = component.get("v.getPickListMap");
                            
                            // pass country state map key(country value) to get state values
                            var childValues = pickListMap[controllerValue];            
                            var childValueList = [];
                            
                            for (var k = 0; k < childValues.length; k++)
                            {
                                childValueList.push(childValues[k]);
                            }
                            
                            component.set("v.getChildList", childValueList);
                            
                            //get state values against country
                            if(childValues.length > 0)
                            {
                                component.set("v.showPhysicalOtherState", false);
                                component.set("v.showPhysicalState", true);
                                //component.set("v.getPhysicalDisabledChildField" , false); 
                                
                                //component.set("v.physicalOtherStateDisabled" , true);
                                if(component.find("PhysicalOtherState") != null){
                                	component.find("PhysicalOtherState").set("v.value",'');
                                }
                            }
                        }
                        component.find("PhysicalStateInput").set("v.value", states[0][melissaResult[i].Address.State]);
                        component.find("PhysicalzipInput").set("v.value", melissaResult[i].Address.PostalCode);
                        component.find("PhysicalSuiteInput").set("v.value", melissaResult[i].Address.SuiteName);
                        component.find("PhysicalAddress2Input").set("v.value", '');
                    }
                }
            }  
            }
           
        }
        else
        {
            component.set("v.physicalAddressRequired", true);
            component.set("v.p_FFAddressRequired", false);
            
            var ffAddress = component.find('p_AddressFreeFormInput');
            $A.util.removeClass(ffAddress, 'slds-has-error');
        }

        helper.handleStateChange(component,event);
    },

    handleCountryChange : function(component, event, helper)
    { 
        debugger;
        //get physical country value
        var controllerValue = component.find("PhysicalCountryInput").get("v.value");
        //get country state map
        var pickListMap = component.get("v.getPickListMap");
        
        if (controllerValue != '') 
        {            
            // pass country state map key to get values
            var childValues = pickListMap[controllerValue];            
            var childValueList = [];
            
            for (var i = 0; i < childValues.length; i++)
            {
                childValueList.push(childValues[i]);
            }
            
            component.set("v.getChildList", childValueList);
            
            // if selected country has state values
            if(childValues.length > 0)
            {
                // hide other state/Territory field
                component.set("v.showPhysicalOtherState", false);
                // show state picklist
                component.set("v.showPhysicalState", true);
                // set state picklist value to empty
                component.find("PhysicalStateInput").set("v.value",'');
                // set other state/Territory field value to empty
                 if(component.find("PhysicalOtherState") != null)
                 {
                     component.find("PhysicalOtherState").set("v.value",'');
                 }
                
            }
            
            // if selected country has not state values
            else
            {
                // show state/territory field
                component.set("v.showPhysicalOtherState", true); 
                // hide state picklist
                component.set("v.showPhysicalState", false); 
                // set other state/Territory field value to empty
                component.find("PhysicalOtherState").set("v.value",'');
                
            }
            
        } 
        else 
        {
            // set state picklist value to empty
            component.set("v.getChildList", '');

            // set other state field value to empty
            if(component.find("PhysicalOtherState") != null)
            {
                component.find("PhysicalOtherState").set("v.value",'');
            }
        }
        setTimeout(item => helper.handleStateChange(component,event),1000);
        
    },

    handlePhysicalStateChange : function(component, event, helper)
    {
        debugger;
        helper.handleStateChange(component,event);
    },

    //----------Parent/Guardian Physical Address Functions------------

    handlePGAddressChange: function(component, event, helper){
        if(event.getSource().get("v.value").length % 3 == 0){
            var params = {
                input : component.get("v.location"),
                country : component.find("PG_PhysicalCountryInput").get("v.value")
            }
            
            debugger;
            helper.callServer(component, "c.getMelissaAddresses", function(response){
                debugger;
                var resp = JSON.parse(response);
                console.log(resp);
                component.set("v.showManualCB", true);
                if(resp.Results.length > 0){
                    component.set('v.predictions',resp.Results);
                    document.getElementById("addressResult").style.display = "block";
                } else{
                    component.set('v.predictions',[]);
                    document.getElementById("addressResult").style.display = "none";
                }
            }, params);
        }
    },

    handlePGAddressClick: function(component, event, helper){
        var details = event.currentTarget;
        var melissaResult = component.get("v.predictions");
        var states = component.get("v.states");
        var index = details.dataset.placeid;
        var address = details.dataset.place;
        component.set("v.selectedAddressIndex", index);
        component.set("v.location", address);
        component.set("v.selectedAddress", address);
    debugger;
        for (var i = 0; i < melissaResult.length; i++){
            if(melissaResult[i].Address.SuiteCount > 0){
                for (var j = 0; j < melissaResult[i].Address.SuiteCount; j++){
                    if((melissaResult[i].Address.AddressLine1+' '+melissaResult[i].Address.SuiteList[j]+', '+
                        melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                        component.find("PG_PhysicalStreetInput").set("v.value", melissaResult[i].Address.AddressLine1);
                        component.find("PG_PhysicalCityInput").set("v.value", melissaResult[i].Address.City);
                        if(component.get("v.isManual") && component.find("PG_PhysicalCountryInput").get("v.value") != "United States"){
                            component.find("PG_PhysicalCountryInput").set("v.value", "United States");
                            //get PG_Physical country value
                            var controllerValue = component.find("PG_PhysicalCountryInput").get("v.value");
                            // get country state map
                            var pickListMap = component.get("v.getPickListMap");
                            
                            // pass country state map key(country value) to get state values
                            var childValues = pickListMap[controllerValue];            
                            var childValueList = [];
                            
                            for (var k = 0; k < childValues.length; k++)
                            {
                                childValueList.push(childValues[k]);
                            }
                            
                            component.set("v.getPG_PhysicalChildList", childValueList);
                            
                            //get state values against country
                            if(childValues.length > 0)
                            {
                                component.set("v.showPG_PhysicalOtherState", false);
                                component.set("v.showPG_PhysicalState", true);
                                //component.set("v.getPG_PhysicalDisabledChildField" , false); 
                                
                                //component.set("v.PG_PhysicalOtherStateDisabled" , true);
                                if(component.find("PG_PhysicalOtherState") != null){
                                component.find("PG_PhysicalOtherState").set("v.value",'');
                                }
                            }
                        }
                        component.find("PG_PhysicalStateInput").set("v.value", states[0][melissaResult[i].Address.State]);
                        component.find("PG_PhysicalzipInput").set("v.value", melissaResult[i].Address.PostalCode);
                        component.find("PG_PhysicalSuiteInput").set("v.value", melissaResult[i].Address.SuiteList[j]);
                    }
                }
            } 
            if(melissaResult[i].Address.SuiteCount < 1){
                if((melissaResult[i].Address.AddressLine1+(melissaResult[i].Address.SuiteName != ''?' '+melissaResult[i].Address.SuiteName:'')+', '+
                    melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                    component.find("PG_PhysicalStreetInput").set("v.value", melissaResult[i].Address.AddressLine1);
                    component.find("PG_PhysicalCityInput").set("v.value", melissaResult[i].Address.City);
                    if(component.find("PG_PhysicalCountryInput").get("v.value") != "United States"){
                        component.find("PG_PhysicalCountryInput").set("v.value", "United States");
                        //get PG_Physical country value
                        var controllerValue = component.find("PG_PhysicalCountryInput").get("v.value");
                        // get country state map
                        var pickListMap = component.get("v.getPickListMap");
                        
                        // pass country state map key(country value) to get state values
                        var childValues = pickListMap[controllerValue];            
                        var childValueList = [];
                        
                        for (var k = 0; k < childValues.length; k++)
                        {
                            childValueList.push(childValues[k]);
                        }
                        
                        component.set("v.getPG_PhysicalChildList", childValueList);
                        
                        //get state values against country
                        if(childValues.length > 0)
                        {
                            component.set("v.showPG_PhysicalOtherState", false);
                            component.set("v.showPG_PhysicalState", true);
                            //component.set("v.getPG_PhysicalDisabledChildField" , false); 
                            
                            //component.set("v.PG_PhysicalOtherStateDisabled" , true);
                            if(component.find("PG_PhysicalOtherState") != null){
                                component.find("PG_PhysicalOtherState").set("v.value",'');
                                }
                        }
                    }
                    component.find("PG_PhysicalStateInput").set("v.value", states[0][melissaResult[i].Address.State]);
                    component.find("PG_PhysicalzipInput").set("v.value", melissaResult[i].Address.PostalCode);
                    component.find("PG_PhysicalSuiteInput").set("v.value", melissaResult[i].Address.SuiteName);
                }
            }
        }
        document.getElementById("addressResult").style.display = "none";
        //component.set("v.predictions", []);
    },

    handlePGToggleChange: function(component, event, helper){
        var melissaResult = component.get("v.predictions");
        var states = component.get("v.states");
        var index = component.get("v.selectedAddressIndex");
        var address = component.get("v.selectedAddress");
        
        var PG_PhysicalStreetInput = component.find("PG_PhysicalStreetInput");
        var PG_PhysicalStreet = PG_PhysicalStreetInput.get("v.value");
        var PG_PhysicalCityInput = component.find("PG_PhysicalCityInput");
        var PG_PhysicalCity = PG_PhysicalCityInput.get("v.value");
        var PG_PhysicalCountryInput = component.find("PG_PhysicalCountryInput");
        var PG_PhysicalCountry = PG_PhysicalCountryInput.get("v.value");
        var PG_PhysicalZipInput = component.find("PG_PhysicalzipInput");
        var PG_PhysicalZip = PG_PhysicalZipInput.get("v.value");
        
        if(!component.get("v.isManual")){
             //component.set("v.PG_PhysicalAddressRequired", false);
            if (PG_PhysicalStreet == '' ||  PG_PhysicalCity == ''  || PG_PhysicalCountry == '' || PG_PhysicalZip == '')
            {
                //mark free form address field required
                component.set("v.FFAddressRequired", true); 
            }
            
            if(component.get("v.location") != ""){
            component.find("PG_PhysicalCountryInput").set("v.value", 'United States');
            
            // get country state map
                            var pickListMap = component.get("v.getPickListMap");//get PG_Physical country value
                        	var controllerValue = component.find("PG_PhysicalCountryInput").get("v.value");
                            
                            // pass country state map key(country value) to get state values
                            var childValues = pickListMap[controllerValue];            
                            var childValueList = [];
                            
                            for (var k = 0; k < childValues.length; k++)
                            {
                                childValueList.push(childValues[k]);
                            }
                            
                            component.set("v.getPG_PhysicalChildList", childValueList);
                            
                            //get state values against country
                            if(childValues.length > 0)
                            {
                                component.set("v.showPG_PhysicalOtherState", false);
                                component.set("v.showPG_PhysicalState", true);
                                //component.set("v.getPG_PhysicalDisabledChildField" , false); 
                                
                                //component.set("v.PG_PhysicalOtherStateDisabled" , true);
								if(component.find("PG_PhysicalOtherState") != null){
                                component.find("PG_PhysicalOtherState").set("v.value",'');
                                }                            
                            }
            }
            // remove has errors
            var street = component.find('PG_PhysicalStreetInput');
            $A.util.removeClass(street, 'slds-has-error');
     
            var city = component.find('PG_PhysicalCityInput');
            $A.util.removeClass(city, 'slds-has-error');
            
            var state = component.find('PG_PhysicalStateInput');
            $A.util.removeClass(state, 'slds-has-error');
     
            var country = component.find('PG_PhysicalCountryInput');
            $A.util.removeClass(country, 'slds-has-error');
            
            var zip = component.find('PG_PhysicalzipInput');
            $A.util.removeClass(zip, 'slds-has-error');
                     
            var otherState = component.find('PG_PhysicalOtherState');
            $A.util.removeClass(otherState, 'slds-has-error');
            
            if(melissaResult.length > 0 )
            {
               for (var i = 0; i < melissaResult.length; i++){
                if(melissaResult[i].Address.SuiteCount > 0){
                    for (var j = 0; j < melissaResult[i].Address.SuiteCount; j++){
                        if((melissaResult[i].Address.AddressLine1+' '+melissaResult[i].Address.SuiteList[j]+', '+
                        melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                            component.find("PG_PhysicalStreetInput").set("v.value", melissaResult[i].Address.AddressLine1);
                            component.find("PG_PhysicalCityInput").set("v.value", melissaResult[i].Address.City);
                            if(component.find("PG_PhysicalCountryInput").get("v.value") != "United States"){
                                component.find("PG_PhysicalCountryInput").set("v.value", "United States");
                                //get PG_Physical country value
                                var controllerValue = component.find("PG_PhysicalCountryInput").get("v.value");
                                // get country state map
                                var pickListMap = component.get("v.getPickListMap");
                                
                                // pass country state map key(country value) to get state values
                                var childValues = pickListMap[controllerValue];            
                                var childValueList = [];
                                
                                for (var k = 0; k < childValues.length; k++)
                                {
                                    childValueList.push(childValues[k]);
                                }
                                
                                component.set("v.getPG_PhysicalChildList", childValueList);
                                
                                //get state values against country
                                if(childValues.length > 0)
                                {
                                    component.set("v.showPG_PhysicalOtherState", false);
                                    component.set("v.showPG_PhysicalState", true);
                                   // component.set("v.getPG_PhysicalDisabledChildField" , false); 
                                    
                                   // component.set("v.PG_PhysicalOtherStateDisabled" , true);
                                    if(component.find("PG_PhysicalOtherState") != null){
                                	component.find("PG_PhysicalOtherState").set("v.value",'');
                                }
                                }
                            }
                            debugger;
                            component.find("PG_PhysicalStateInput").set("v.value", states[0][melissaResult[i].Address.State]);
                            component.find("PG_PhysicalzipInput").set("v.value", melissaResult[i].Address.PostalCode);
                            component.find("PG_PhysicalSuiteInput").set("v.value", melissaResult[i].Address.SuiteList[j]);
                            component.find("PG_PhysicalAddress2Input").set("v.value", '');
                        }
                    }
                } 
                if(melissaResult[i].Address.SuiteCount < 1){
                    if((melissaResult[i].Address.AddressLine1+(melissaResult[i].Address.SuiteName != ''?' '+melissaResult[i].Address.SuiteName:'')+', '+
                    melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                        component.find("PG_PhysicalStreetInput").set("v.value", melissaResult[i].Address.AddressLine1);
                        component.find("PG_PhysicalCityInput").set("v.value", melissaResult[i].Address.City);
                        //component.find("PG_PhysicalCountryInput").set("v.value", "United States");
                        if(component.find("PG_PhysicalCountryInput").get("v.value") != "United States"){
                            component.find("PG_PhysicalCountryInput").set("v.value", "United States");
                            //get PG_Physical country value
                            var controllerValue = component.find("PG_PhysicalCountryInput").get("v.value");
                            // get country state map
                            var pickListMap = component.get("v.getPickListMap");
                            
                            // pass country state map key(country value) to get state values
                            var childValues = pickListMap[controllerValue];            
                            var childValueList = [];
                            
                            for (var k = 0; k < childValues.length; k++)
                            {
                                childValueList.push(childValues[k]);
                            }
                            
                            component.set("v.getPG_PhysicalChildList", childValueList);
                            
                            //get state values against country
                            if(childValues.length > 0)
                            {
                                component.set("v.showPG_PhysicalOtherState", false);
                                component.set("v.showPG_PhysicalState", true);
                                //component.set("v.getPG_PhysicalDisabledChildField" , false); 
                                
                               // component.set("v.PG_PhysicalOtherStateDisabled" , true);
                                if(component.find("PG_PhysicalOtherState") != null){
                                	component.find("PG_PhysicalOtherState").set("v.value",'');
                                }
                            }
                        }
                        component.find("PG_PhysicalStateInput").set("v.value", states[0][melissaResult[i].Address.State]);
                        component.find("PG_PhysicalzipInput").set("v.value", melissaResult[i].Address.PostalCode);
                        component.find("PG_PhysicalSuiteInput").set("v.value", melissaResult[i].Address.SuiteName);
                        component.find("PG_PhysicalAddress2Input").set("v.value", '');
                    }
                }
            }  
            }
           
        }
        else
        {
            component.set("v.PG_PhysicalAddressRequired", true);
            component.set("v.FFAddressRequired", false);
            
            var ffAddress = component.find('AddressFreeFormInput');
            $A.util.removeClass(ffAddress, 'slds-has-error');
        }
    },

    handlePGCountryChange : function(component, event, helper)
    {
        var PG_PhysicalAddressRequiredField = component.get("v.PG_PhysicalAddressRequired");
        //get physical country value
        var controllerValue = component.find("PG_PhysicalCountryInput").get("v.value");
        // get country state map
        var pickListMap = component.get("v.getPickListMap");
        
        if (controllerValue != '') 
        {     
            // pass country state map key to get values
            var childValues = pickListMap[controllerValue];            
            var childValueList = [];

            for (var i = 0; i < childValues.length; i++)
            {
                childValueList.push(childValues[i]);
            }
            
            component.set("v.getPG_PhysicalChildList", childValueList);
            
            if(childValues.length > 0)
            {
                // hide other state/Territory field
                component.set("v.showPG_PhysicalOtherState", false); 
                // show  state picklist
                component.set("v.showPG_PhysicalState", true);
                // enable state picklist
                component.set("v.getPG_PhysicalDisabledChildField" , false); 
                // set state field value to empty
                component.find("PG_PhysicalStateInput").set("v.value",'');
                if(PG_PhysicalAddressRequiredField == true)
                {
                    // set state picklist value to required
                    component.set("v.PG_PhysicalStateRequired" , true); 
                }
                // disable other state/Territory field
                component.set("v.PG_PhysicalOtherStateDisabled" , true);
                // set other state/Territory field value to empty
                if(component.find("PG_PhysicalOtherState") != null)
                {
                    component.find("PG_PhysicalOtherState").set("v.value",'');
                }
                // set other state/Territory field value to not required
                component.set("v.PG_PhysicalOtherStateRequired" , false);
            }
            else
            {
                // show other state/Territory field
                component.set("v.showPG_PhysicalOtherState", true); 
                // hide  state picklist
                component.set("v.showPG_PhysicalState", false); 
                // disable state picklist
                component.set("v.getPG_PhysicalDisabledChildField" , true); 
                // set state picklist value to not required
                component.set("v.PG_PhysicalStateRequired" , false);
                // enable other state/Territory field
                component.set("v.PG_PhysicalOtherStateDisabled" , false);
                // set other state/Territory field value to empty
                component.find("PG_PhysicalOtherState").set("v.value",'');
                if(PG_PhysicalAddressRequiredField == true)
                {
                    // set other state/Territory field value to required
                    component.set("v.PG_PhysicalOtherStateRequired" , true);
                }
                
            }
            
        } 
        else 
        {
            // set state picklist value to empty
            component.set("v.getPG_PhysicalChildList", '');
            // disable state  picklist
            component.set("v.getPG_PhysicalDisabledChildField" , true);
            // disable state/Territory field
            component.set("v.PG_PhysicalOtherStateDisabled" , true);
            // set other state field value to empty
            if(component.find("PG_PhysicalOtherState") != null)
            {
                component.find("PG_PhysicalOtherState").set("v.value",'');
            }
            
        }
    },

    handleIsSameAddressCheckBox : function(component, event, helper){
        debugger;
        let isChecked = component.get("v.isAddressSame");
        //let isChecked = component.get("v.isManual");
        if (isChecked) {
            //disable fields
            component.set("v.PG_addressUpdate",false);
            component.find("PG_addressUpdateCheckBox").set("v.disabled",true);
            component.set("v.PG_showLookUp", false);
            // $A.enqueueAction(component.get("c.PG_handleAddreesUpdate"));
            
            component.set("v.isManual",false);

            // $A.enqueueAction(component.get("c.handlePGCountryChange"));

            // if (component.get("v.PG_showLookUp")) {
            //     //disable address lookup field
            //     component.find("AddressFreeFormInput").set("v.disabled", true);
            //     //disable "pg_checkManual" 
            //     component.find("pg_checkManual").set("v.disabled",true);
            // }
            

            //getting applicant physical address values
            let street = component.find("PhysicalStreetInput").get("v.value");
            let addLine2 = component.find("PhysicalAddress2Input").get("v.value");
            let suit = component.find("PhysicalSuiteInput").get("v.value");
            let city = component.find("PhysicalCityInput").get("v.value");
            let country = component.find("PhysicalCountryInput").get("v.value");
            let state = "";
            let otherState = "";
            // let county = component.find("physicalCounty").get("v.value");
            let zip = component.find("PhysicalzipInput").get("v.value");

            if (component.get("v.showPhysicalOtherState")) {
                //showing PG_PhysicalOtherState and hiding PG_PhysicalState
                component.set("v.showPG_PhysicalOtherState",true);
                component.set("v.showPG_PhysicalState",false);

                otherState = component.find("PhysicalOtherState").get("v.value");
            } else {
                component.set("v.showPG_PhysicalOtherState",false);
                component.set("v.showPG_PhysicalState",true);

                $A.enqueueAction(component.get('c.handlePGCountryChange'));

                state = component.find("PhysicalStateInput").get("v.value");
                
            }
            

            //setting address values to PG Address section
            component.find("PG_PhysicalStreetInput").set("v.value",street);
            component.find("PG_PhysicalAddress2Input").set("v.value",addLine2);
            component.find("PG_PhysicalSuiteInput").set("v.value",suit);
            component.find("PG_PhysicalCityInput").set("v.value",city);
            component.find("PG_PhysicalCountryInput").set("v.value",country);
            // component.find("PG_PhysicalCounty").set("v.value",county);
            component.find("PG_PhysicalzipInput").set("v.value",zip);

            setTimeout(function(){
                if (component.get("v.showPG_PhysicalOtherState")) {
                    component.find("PG_PhysicalOtherState").set("v.value",otherState);
                } else {
                    component.find("PG_PhysicalStateInput").set("v.value",state);
                }
            },1000);
            

            // remove has errors
            $A.util.removeClass(component.find('PG_PhysicalStreetInput'), 'slds-has-error');
            $A.util.removeClass(component.find('PG_PhysicalCityInput'), 'slds-has-error');
            $A.util.removeClass(component.find('PG_PhysicalStateInput'), 'slds-has-error');
            $A.util.removeClass(component.find('PG_PhysicalCountryInput'), 'slds-has-error');
            $A.util.removeClass(component.find('PG_PhysicalzipInput'), 'slds-has-error');
            $A.util.removeClass(component.find('PG_PhysicalOtherState'), 'slds-has-error');
        }
        else{
            //enabling fields
            component.find("PG_addressUpdateCheckBox").set("v.disabled",false);

            component.set("v.isManual",false);
            if (component.get("v.PG_showLookUp")) {
                //enabling address lookup field
                component.find("AddressFreeFormInput").set("v.disabled", false);
                //enabling "pg_checkManual" 
                component.find("pg_checkManual").set("v.disabled",false);
            }

            //setting address values to PG Address section
            component.find("PG_PhysicalStreetInput").set("v.value",'');
            component.find("PG_PhysicalAddress2Input").set("v.value",'');
            component.find("PG_PhysicalSuiteInput").set("v.value",'');
            component.find("PG_PhysicalCityInput").set("v.value",'');
            component.find("PG_PhysicalCountryInput").set("v.value",'United States');
            // component.find("PG_PhysicalCounty").set("v.value",county);
            component.find("PG_PhysicalzipInput").set("v.value",'');

           
            if (component.get("v.showPG_PhysicalOtherState")) {
                component.find("PG_PhysicalOtherState").set("v.value",'');
            } else {
                component.find("PG_PhysicalStateInput").set("v.value",'None');
            }
           
            

            // remove has errors
            $A.util.removeClass(component.find('PG_PhysicalStreetInput'), 'slds-has-error');
            $A.util.removeClass(component.find('PG_PhysicalCityInput'), 'slds-has-error');
            $A.util.removeClass(component.find('PG_PhysicalStateInput'), 'slds-has-error');
            $A.util.removeClass(component.find('PG_PhysicalCountryInput'), 'slds-has-error');
            $A.util.removeClass(component.find('PG_PhysicalzipInput'), 'slds-has-error');
            $A.util.removeClass(component.find('PG_PhysicalOtherState'), 'slds-has-error');
        }
    },

    handleIsAAInfoSameAsParent : function(component, event, helper){
        debugger;
        let isChecked = component.get("v.isAAInfoSameAsParent");
        //let isChecked = component.get("v.isManual");
        if (isChecked) {
            var PG_FirstName = component.find("aIdGuardFirstName").get("v.value");
            var PG_LastName = component.find("aIdGuardLastName").get("v.value");
            var PG_Mobile = component.find("PG_aIdPhone").get("v.value");
            var PG_DrLicNo = component.find("aIdGuardDrivLicNo").get("v.value");

            if (!$A.util.isEmpty(PG_FirstName) && !$A.util.isEmpty(PG_LastName) && !$A.util.isEmpty(PG_Mobile) && !$A.util.isEmpty(PG_DrLicNo)) {
                component.set("v.AA_FirstName",PG_FirstName);
                component.set("v.AA_LastName",PG_LastName);
                component.set("v.AA_Mobile",PG_Mobile);
                component.set("v.AA_DriLicNo",PG_DrLicNo);

                //disable all AA fields
                component.set("v.isAAFieldsDisabled",true);

                $A.util.removeClass(component.find("AA_aIdFirstName"), 'slds-has-error');
                $A.util.removeClass(component.find("AA_aIdLastName"), 'slds-has-error');
                $A.util.removeClass(component.find("AA_aIdDrivLicNo"), 'slds-has-error');
                $A.util.removeClass(component.find("AA_aIdPhone"), 'slds-has-error');
            } else {
                //uncheck the same info checkbox
                component.set("v.isAAInfoSameAsParent",false);
                //enable all AA fields
                component.set("v.isAAFieldsDisabled",false);
                helper.showToast('Kindly fill all the Parent/Guardian required fields first.');
            }
        }
        else{
           //enable all AA fields
           component.set("v.isAAFieldsDisabled",false);

           component.set("v.AA_FirstName",'');
           component.set("v.AA_LastName",'');
           component.set("v.AA_Mobile",'');
           component.set("v.AA_DriLicNo",'');
        }
    },

    handlePGFirstName : function(component, event, helper){
        debugger
        let isChecked = component.get("v.isAAInfoSameAsParent");
        if (isChecked) {
            component.set("v.AA_FirstName",component.find("aIdGuardFirstName").get("v.value"));
        }
    },

    handlePGLastName : function(component, event, helper){
        debugger
        let isChecked = component.get("v.isAAInfoSameAsParent");
        if (isChecked) {
            component.set("v.AA_LastName",component.find("aIdGuardLastName").get("v.value"));
        }
    },

    handlePGMobile : function(component, event, helper){
        debugger
        let isChecked = component.get("v.isAAInfoSameAsParent");
        if (isChecked) {
            component.set("v.AA_Mobile",component.find("PG_aIdPhone").get("v.value"));
        }
    },

    handlePGDriLicNo : function(component, event, helper){
        debugger
        var lic = component.find("aIdGuardDrivLicNo").get("v.value");
        let isChecked = component.get("v.isAAInfoSameAsParent");
        if (isChecked) {
            component.set("v.AA_DriLicNo",lic);
        }
    },

    handlePhysicalStreet : function(component, event, helper){
        debugger
        if (component.get("v.isYouthOptionSelected")) {
            let isChecked = component.get("v.isAddressSame");
            if (isChecked) {
                component.find("PG_PhysicalStreetInput").set("v.value",component.find("PhysicalStreetInput").get("v.value"));
            }
        }
       
    },

    handlePhysicalAddress2 : function(component, event, helper){
        debugger
        if (component.get("v.isYouthOptionSelected")) {
            let isChecked = component.get("v.isAddressSame");
            if (isChecked) {
                component.find("PG_PhysicalAddress2Input").set("v.value",component.find("PhysicalAddress2Input").get("v.value"));
            }
        }
       
    },

    handlePhysicalSuite : function(component, event, helper){
        debugger
        if (component.get("v.isYouthOptionSelected")) {
            let isChecked = component.get("v.isAddressSame");
            if (isChecked) {
                component.find("PG_PhysicalSuiteInput").set("v.value",component.find("PhysicalSuiteInput").get("v.value"));
            }
        }
       
    },

    handlePhysicalCity : function(component, event, helper){
        debugger
        if (component.get("v.isYouthOptionSelected")) {
            let isChecked = component.get("v.isAddressSame");
            if (isChecked) {
                component.find("PG_PhysicalCityInput").set("v.value",component.find("PhysicalCityInput").get("v.value"));
            }
        }
       
    },

    handlePhysicalZip : function(component, event, helper){
        debugger
        if (component.get("v.isYouthOptionSelected")) {
            let isChecked = component.get("v.isAddressSame");
            if (isChecked) {
                component.find("PG_PhysicalzipInput").set("v.value",component.find("PhysicalzipInput").get("v.value"));
            }
        }
       
    },

    handlePhysicalOtherState : function(component, event, helper){
        debugger
        if (component.get("v.isYouthOptionSelected")) {
            let isChecked = component.get("v.isAddressSame");
            if (isChecked) {
                if (component.get("v.showPG_PhysicalOtherState")) {
                    component.find("PG_PhysicalOtherState").set("v.value",component.find("PhysicalOtherState").get("v.value"));
                }
                
            }
        }
       
    },

    onFilesChange: function(component, event, helper) {
        var fileName = '';
        var listFiles = event.getSource().get("v.files");
        if (listFiles.length > 0) {
            for(let i=0; i < listFiles.length; i++){
                var fName = listFiles[i]['name'];
                var fType = listFiles[i]['type'];
                var fSize = listFiles[i]['size'];
                
                //First, Check file Type
                if(fType != 'application/pdf' && fType != 'image/png' && fType != 'image/jpeg' && fType != 'image/jpg'){
                    fileName = '';
                    helper.showToast('Uploaded invalid file type. PDF/Images are only valid file types');
                    break;
                }
                //Second, Check File size
                else if(fSize > 0){
                    var Isvalid = helper.CheckFileSize(component,event,helper,fSize);
                    if(!Isvalid){
                        fileName = '';
                        helper.showToast('Uploaded file size is too large. Maximum supported file size is 25MB');
                    	break;
                    }
                } 
                if(fileName == '')
                	fileName = fName;
                else
                    fileName += '\n  '+fName;
            } 
        }
        component.set("v.W9FileName", fileName);
        component.set("v.fSize", fSize);
        component.set("v.fType", fType);
    },

    hideModal: function(component, event, helper) 
    {
        component.set("v.showReviewScreen", false); 
    },

    ShowInfoToReview: function(component, event, helper){
        debugger
        // if(component.find("W9FileId")){
        //     if(component.find("W9FileId").get("v.files") != null){
        //         var W9Files = component.find("W9FileId").get("v.files");
        //         var W9FilesCount = W9Files.length;
        //         if (W9FilesCount > 0) {
        //             for (var i = 0; i < W9FilesCount; i++) 
        //             {
        //                 // helper.uploadHelper(component, event, helper, W9Files[i]);
        //             }
                    
        //         }
        //     } else {
        //         helper.showToast('Please Upload File');
        //     }
        // }

        var errorMessages = helper.checkValidation(component,event);
        debugger
        // is there any error message?
        if(errorMessages != null) {
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
        } else {
            component.set("v.showReviewScreen", true);

            //setting review fields values
            //Applicant Address Fields
            component.find("Rev_PhysicalStreetInput").set("v.value", component.find("PhysicalStreetInput").get("v.value"));
            component.find("Rev_PhysicalAddress2Input").set("v.value", component.find("PhysicalAddress2Input").get("v.value"));
            component.find("Rev_PhysicalSuiteInput").set("v.value", component.find("PhysicalSuiteInput").get("v.value"));
            component.find("Rev_PhysicalCityInput").set("v.value", component.find("PhysicalCityInput").get("v.value"));
            component.find("Rev_PhysicalCountryInput").set("v.value", component.find("PhysicalCountryInput").get("v.value"));
            if (component.get("v.showPhysicalState")) {
                component.find("Rev_PhysicalStateInput").set("v.value", component.find("PhysicalStateInput").get("v.value"));
            } 
            if (component.get("v.showPhysicalOtherState")) {
                component.find("Rev_PhysicalOtherState").set("v.value", component.find("PhysicalOtherState").get("v.value"));
            }
            // component.find("Rev_physicalCounty").set("v.value", component.find("physicalCounty").get("v.value"));
            component.find("Rev_PhysicalzipInput").set("v.value", component.find("PhysicalzipInput").get("v.value"));
            //Parent/ Guradian Fields
            if (component.get("v.isYouthOptionSelected")) {
                component.find("Rev_aIdGuardFirstName").set("v.value", component.find("aIdGuardFirstName").get("v.value"));
                // component.find("Rev_aIdGuardMiddleName").set("v.value", component.find("aIdGuardMiddleName").get("v.value"));
                component.find("Rev_aIdGuardLastName").set("v.value", component.find("aIdGuardLastName").get("v.value"));
                component.find("Rev_aIdGuardDrivLicNo").set("v.value", component.find("aIdGuardDrivLicNo").get("v.value"));
                component.find("Rev_PG_aIdPhone").set("v.value", component.find("PG_aIdPhone").get("v.value"));
                //Parent/ Guradian Address Fields
                component.find("Rev_PG_PhysicalStreetInput").set("v.value", component.find("PG_PhysicalStreetInput").get("v.value"));
                component.find("Rev_PG_PhysicalAddress2Input").set("v.value", component.find("PG_PhysicalAddress2Input").get("v.value"));
                component.find("Rev_PG_PhysicalSuiteInput").set("v.value", component.find("PG_PhysicalSuiteInput").get("v.value"));
                component.find("Rev_PG_PhysicalCityInput").set("v.value", component.find("PG_PhysicalCityInput").get("v.value"));
                component.find("Rev_PG_PhysicalCountryInput").set("v.value", component.find("PG_PhysicalCountryInput").get("v.value"));
                if (component.get("v.showPG_PhysicalState")) {
                    component.find("Rev_PG_PhysicalStateInput").set("v.value", component.find("PG_PhysicalStateInput").get("v.value"));
                } 
                if (component.get("v.showPG_PhysicalOtherState")) {
                    component.find("Rev_PG_PhysicalOtherState").set("v.value", component.find("PG_PhysicalOtherState").get("v.value"));
                }
                // component.find("Rev_PG_PhysicalCounty").set("v.value", component.find("PG_PhysicalCounty").get("v.value"));
                component.find("Rev_PG_PhysicalzipInput").set("v.value", component.find("PG_PhysicalzipInput").get("v.value"));
                //Accompanying Adult Fields
                component.find("Rev_AA_aIdFirstName").set("v.value", component.find("AA_aIdFirstName").get("v.value"));
                // component.find("Rev_AA_aIdMiddleName").set("v.value", component.find("AA_aIdMiddleName").get("v.value"));
                component.find("Rev_AA_aIdLastName").set("v.value", component.find("AA_aIdLastName").get("v.value"));
                component.find("Rev_AA_aIdDrivLicNo").set("v.value", component.find("AA_aIdDrivLicNo").get("v.value"));
                component.find("Rev_AA_aIdPhone").set("v.value", component.find("AA_aIdPhone").get("v.value"));
            }

           
        }
       
        
    },
    
    submitForm : function(component, event, helper){
        debugger
        // if(component.find("W9FileId")){
        //     if(component.find("W9FileId").get("v.files") != null){
        //         var W9Files = component.find("W9FileId").get("v.files");
        //         var W9FilesCount = W9Files.length;
        //         if (W9FilesCount > 0) {
        //             for (var i = 0; i < W9FilesCount; i++) 
        //             {
        //                 // helper.uploadHelper(component, event, helper, W9Files[i]);
        //             }
                    
        //         }
        //     } else {
        //         helper.showToast('Please Upload File');
        //     }
        // }
        var filename=component.get("v.W9FileName");
        var fileid=component.get("v.DocID");
        var errorMessages = null;
        var acc = component.get("v.accObj");
        var mobileNo = component.find("aIdPhone").get("v.value").replace(/\D/g, '');
        acc.PersonMobilePhone = mobileNo;
        var huntCat = component.find("aIdSelectCategory").get("v.value");
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
        
        var isHuntingLicenseHolder = component.find("aIdSelectOption").get("v.value");
        // var isHuntingLicenseHolder = false;
        // if (component.find("aIdSelectOption").get("v.value").localeCompare("Yes") == 0) {
        //     isHuntingLicenseHolder = true;
        // }

        var eventOptions = null;
        var selectedEvent = null;
        var comboEventOptions = null;
        var comboSelectedEvent = null;
        if(! $A.util.isEmpty(selectedCategory) ) {
            debugger;
            eventOptions = component.find("aIdSelectEvent").get("v.value");
            selectedEvent = eventOptions.toString().split(',');

            var comboSelected = component.get("v.comboCatSelected");
            if (comboSelected) {
                comboEventOptions = component.find("aIdSelectComboEvent").get("v.value");
                comboSelectedEvent = comboEventOptions.toString().split(',');
            }
        }
       

        //Applicant Physical Address
        var physicalAddress = component.find("PhysicalStreetInput").get("v.value");
        var physicalCity = component.find("PhysicalCityInput").get("v.value");
        var physicalState = '';
        var physicalOtherState = '';
        // var physicalCounty = component.find("physicalCounty").get("v.value");
        var physicalZip = component.find("PhysicalzipInput").get("v.value");
        var physicalCountry = component.find("PhysicalCountryInput").get("v.value"); 
        var physicalSuite = component.find("PhysicalSuiteInput").get("v.value");
        var physicalAddress2 = component.find("PhysicalAddress2Input").get("v.value");
        var physicalMelissaAddress = component.get("v.p_selectedAddress");
        var IsLookUpVisible = component.get("v.showLookUp");
        if(IsLookUpVisible == true)
        {
            var physicalffAddressValue = component.find("p_AddressFreeFormInput").get("v.value");
        }
        var isAddressCorrectInput = "";
        var isAddressCorrect = "";
        debugger;
        isAddressCorrect = component.find("acceptCheckBox").get("v.checked");
        // if (component.get("v.p_isManual")) {
        //     isAddressCorrect = component.find("acceptCheckBox").get("v.checked");
        // }
        if(showPhysicalState){
            debugger;
            physicalState = component.find("PhysicalStateInput").get("v.value");
        } else {
            physicalOtherState = component.find("PhysicalOtherState").get("v.value");
        }

        //Parent/Guardian Info
        if (selectedCategory.includes(youthCategory) || component.get("v.isYouthOptionSelected")) {
            var PG_FirstName = component.find("aIdGuardFirstName").get("v.value");
            var PG_MiddleName = '';
            // var PG_MiddleName = component.find("aIdGuardMiddleName").get("v.value");
            var PG_LastName = component.find("aIdGuardLastName").get("v.value");
            var PG_DriverLicenseNo = component.find("aIdGuardDrivLicNo").get("v.value");
            var PG_Mobile = component.find("PG_aIdPhone").get("v.value").replace(/\D/g, '');

            var PG_PhysicalAddress = component.find("PG_PhysicalStreetInput").get("v.value");
            var PG_PhysicalCity = component.find("PG_PhysicalCityInput").get("v.value");
            var PG_PhysicalState = '';
            var PG_PhysicalOtherState = '';
            // var PG_PhysicalCounty = component.find("PG_PhysicalCounty").get("v.value");
            var PG_PhysicalZip = component.find("PG_PhysicalzipInput").get("v.value");
            var PG_PhysicalCountry = component.find("PG_PhysicalCountryInput").get("v.value"); 
            var PG_PhysicalSuite = component.find("PG_PhysicalSuiteInput").get("v.value");
            var PG_PhysicalAddress2 = component.find("PG_PhysicalAddress2Input").get("v.value");

            var PG_PhysicalMelissaAddress = component.get("v.selectedAddress");
            var IsLookUpVisible = component.get("v.PG_showLookUp");
            if(IsLookUpVisible == true){
                var PG_PhysicalffAddressValue = component.find("AddressFreeFormInput").get("v.value");
            }
            if(showPhysicalState){
                PG_PhysicalState = component.find("PG_PhysicalStateInput").get("v.value");
            } else {
                PG_PhysicalOtherState = component.find("PG_PhysicalOtherState").get("v.value");
            }

            debugger;
            var PG_isAddressCorrectInput = "";
            var PG_isAddressCorrect = "";
            // if (component.get("v.isManual")) {
            //     PG_isAddressCorrect = component.find("PG_AcceptCheckBox").get("v.checked");
            // }

            //Accompanying Adult Fields
            var AA_FirstName = component.find("AA_aIdFirstName").get("v.value");
            var AA_MiddleName = '';
            // var AA_MiddleName = component.find("AA_aIdMiddleName").get("v.value");
            var AA_LastName = component.find("AA_aIdLastName").get("v.value");
            var AA_DriverLicenseNo = component.find("AA_aIdDrivLicNo").get("v.value");
            var AA_Mobile = component.find("AA_aIdPhone").get("v.value").replace(/\D/g, '');
            
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
        
        debugger
        // is there any error message?
        if(errorMessages != null) {
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
        else {
            
            debugger;
            //combining values of single and combo event if combo is selected
            if (!$A.util.isEmpty(comboEventOptions)) {
                comboEventOptions.filter(item => eventOptions.push(item));
            }
            //show spinner
            helper.showSpinner(component);
            var isApplicantUnder18 = component.get("v.isApplicantUnder18");
            if (!component.get("v.isYouthOptionSelected")) {
                PG_FirstName                = '';
                // PG_MiddleName               = '';
                PG_LastName                 = '';
                PG_DriverLicenseNo          = '';
                PG_Mobile                   = '';
                
                PG_PhysicalAddress          = '';
                PG_PhysicalAddress2         = '';
                PG_PhysicalCity             = '';
                PG_PhysicalCountry          = '';
                // PG_PhysicalCounty           = '';
                PG_PhysicalOtherState       = '';
                PG_PhysicalState            = '';
                PG_PhysicalSuite            = '';
                PG_PhysicalZip              = '';
                PG_PhysicalMelissaAddress   = '';

                AA_FirstName                = '';
                // AA_MiddleName               = '';
                AA_LastName                 = '';
                AA_DriverLicenseNo          = '';
                AA_Mobile                   = '';
            }

            var action = component.get("c.createCase");

            debugger;
            
           //making request
            var caseObj = {
                PG_First_Name__c					:		PG_FirstName,
                PG_Middle_Name__c					:		PG_MiddleName,
                PG_Last_Name__c						:		PG_LastName,
                PG_Driver_License__c				:		PG_DriverLicenseNo,
                PG_Mobile_Phone__c                  :       PG_Mobile,
                PG_Physical_Street__c				:		PG_PhysicalAddress,
                PG_Physical_City__c					:		PG_PhysicalCity,
                PG_Physical_ZipPostal_Code__c		:		PG_PhysicalZip,
                PG_Physical_Country__c				:		PG_PhysicalCountry,
                PG_Physical_State__c				:		PG_PhysicalState,
                PG_Other_Physical_State__c			:		PG_PhysicalOtherState,
                PG_Physical_Suite__c				: 		PG_PhysicalSuite,
                PG_Physical_Address_Line2__c		: 		PG_PhysicalAddress2,
                PG_Physical_Melissa_Address__c		: 		PG_PhysicalMelissaAddress,
                PG_Physical_IsManual__c				: 		PG_PhysicalIsManual,
                Physical_Street__c					:		physicalAddress,
                Physical_City__c					:		physicalCity,
                Physical_ZipPostal_Code__c 			:		physicalZip,
                Physical_Countries__c				:		physicalCountry,
                Physical_States__c					:		physicalState,
                Other_Physical_State__c				: 		physicalOtherState,
                Physical_Suite__c					:		physicalSuite,
                Physical_Address2__c				:		physicalAddress2,
                Physical_IsManual__c				:		physicalIsManual,
                Physical_Melissa_Address__c			:		physicalMelissaAddress,
                Is_Applicant_Under_18__c			:		isApplicantUnder18,
                Hunting_License_Holder__c			:		isHuntingLicenseHolder,
                AA_First_Name__c                    :       AA_FirstName,
                AA_Middle_Name__c                   :       AA_MiddleName,
                AA_Last_Name__c                     :       AA_LastName,
                AA_Driver_License__c                :       AA_DriverLicenseNo,
                AA_Mobile_Phone__c                  :       AA_Mobile
            };

            //wrapper object
            var wrapperObj = {
                acnt                :   acc,
                caseObj             :   caseObj,
                huntCategories      :   huntCat,
                huntEvents          :   eventOptions,
                fileid				:	fileid,
                filename			:	filename
            };

            debugger;
            action.setParams({
                wrapperObj  :   wrapperObj
            });
            

            debugger;
            action.setCallback(this, function(response){
                var state = response.getState();
                if (state === 'SUCCESS') {
                    debugger;
                    //set apex return record id to parentId attribute
                    var wrapperObjRes = response.getReturnValue();
                    if ($A.util.isEmpty(wrapperObjRes.exceptionMsg)) {
                        component.set('v.caseId',wrapperObjRes.caseObj.Id);
                        component.set("v.requestNumber", wrapperObjRes.caseObj.CaseNumber);
                        // call helper method to end request
                        helper.endRequest(component, event, helper);
                        // check if veteran category is selected 
                        
                    } else {
                        debugger;
                        component.set("v.exceptionMsg",wrapperObjRes.exceptionMsg)
                        helper.endRequestWithException(component,event,helper);
                    }
                    
                } else if (state === 'ERROR') {
                    debugger;
                    var wrapperObjRes = response.getReturnValue();
                    component.set("v.exceptionMsg",wrapperObjRes.exceptionMsg)
                    helper.endRequestWithException(component,event,helper);
                }
            });

            $A.enqueueAction(action);

        }

        
    },

    AlphanumericCheck : function(component, event, helper)
    {
        debugger
        var code = (event.which) ? event.which : event.keyCode;
        if (!(code > 47 && code < 58) && // numeric (0-9)
                !(code > 64 && code < 91) && // upper alpha (A-Z)
                !(code > 96 && code < 123) && // lower alpha (a-z)
                !(code == 45)) { // dash and underscore
                    event.preventDefault();
        }
    },

    NumberCheck: function(component, event, helper)
    { 
        debugger;
        var charCode = (event.which) ? event.which : event.keyCode;
        if (!(charCode >= 48 && charCode <= 57))
        {
            event.preventDefault();
        }
       
        var fieldId = event.currentTarget.id;
        var fieldInput = component.find(fieldId);
        
        var phoneNumber = fieldInput.get("v.value");
         var cleaned = ('' + phoneNumber) + ''.replace(/\D/g, '');
        if(cleaned.length == 10){
          var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        //   var match = cleaned.match(/^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/);
          if (match) {
            var finalOne ='(' + match[1] + ')' + match[2] + '-' + match[3];
              debugger;
             component.find(fieldId).set("v.value", finalOne);
          }
          return null;
        }
    },

    characterCheck: function(component, event, helper)
    {
         var inputValue = event.which;
        if(!(inputValue >= 65 && inputValue <= 90 || inputValue == 45 || (inputValue >= 97 && inputValue <= 122)) && (inputValue != 32 && inputValue != 0))
        {
            event.preventDefault(); 
        }
    },

    
    clearErrors : function(component, event) 
    {
        var fieldId = event.getSource().getLocalId();
        $A.util.removeClass(fieldId, 'slds-has-error');
    },

    handleContext: function(component, event, helper)
    {
   		 event.preventDefault(); 
	},

    handlePaste: function(component, event, helper) 
    {
    	event.preventDefault(); 
	}, 

    // called by onuploadfinished attribute of lightning file upload
    addFiles: function(component, event, helper)
    {
        helper.endRequest(component, event, helper);
    },
    // called by finish button on files modal
    endRequestWithOutFiles: function(component, event, helper)
    {
        helper.endRequest(component, event, helper);
    },

     //show hunt request created by user(navigate to case detail page)
     viewRequest: function(component, event, helper)
     {
         var recId = component.get("v.caseId");
         window.location.replace('/s/detail/'+recId);
     },  

     handleAddreesUpdate : function(component, event, helper) 
     {
         debugger
         if(component.get("v.addressUpdate"))
         {
             component.set("v.showLookUp", true);
         }
         else
         {
             component.set("v.showLookUp", false);
             component.set("v.p_isManual", false);
             component.set("v.physicalAddressRequired", false);

             component.find("PhysicalStreetInput").set("v.value", component.get("v.PhysicalStreetInputOLV"));
             component.find("PhysicalAddress2Input").set("v.value", component.get("v.PhysicalAddress2InputOLV"));
             component.find("PhysicalSuiteInput").set("v.value", component.get("v.PhysicalSuiteInputOLV"));
             component.find("PhysicalCityInput").set("v.value", component.get("v.PhysicalCityInputOLV")); 
             component.find("PhysicalCountryInput").set("v.value", component.get("v.PhysicalCountryInputOLV")); 
             if (component.get("v.PhysicalStateInputOLV") != '') {
                 component.set("v.showPhysicalState",true);
                 component.set("v.showPhysicalOtherState",false);
                 $A.enqueueAction(component.get('c.handleCountryChange'));

             }
             setTimeout(function(){
                if (component.get("v.showPhysicalState")) {
                    component.find("PhysicalStateInput").set("v.value", component.get("v.PhysicalStateInputOLV")); 
                 } else {
                    component.find("PhysicalOtherState").set("v.value", component.get("v.PhysicalOtherStateOLV")); 
                 }
             },1000);
            
             component.find("PhysicalzipInput").set("v.value", component.get("v.PhysicalzipInputOLV")); 
             
            //  $A.enqueueAction(component.get("c.handleCountryCHange"));
             //calling state change function
             helper.handleStateChange(component,event);
             
              // remove has errors
             var street = component.find('PhysicalStreetInput');
             $A.util.removeClass(street, 'slds-has-error');
      
             var city = component.find('PhysicalCityInput');
             $A.util.removeClass(city, 'slds-has-error');
             
             var state = component.find('PhysicalStateInput');
             $A.util.removeClass(state, 'slds-has-error');
      
             var country = component.find('PhysicalCountryInput');
             $A.util.removeClass(country, 'slds-has-error');
             
             var zip = component.find('PhysicalzipInput');
             $A.util.removeClass(zip, 'slds-has-error');
                      
             var otherState = component.find('PhysicalOtherState');
             $A.util.removeClass(otherState, 'slds-has-error');
         }
        
     },

     PG_handleAddreesUpdate : function(component, event, helper) 
     {
         debugger
         if(component.get("v.PG_addressUpdate"))
         {
             component.set("v.PG_showLookUp", true);
         }
         else
         {
             component.set("v.PG_showLookUp", false);
             component.set("v.isManual", false);
             component.set("v.PG_PhysicalAddressRequired", false);
            //  component.find("MailingStreetInput").set("v.value", component.get("v.mailingStreetOLV"));
            //  component.find("MailingCityInput").set("v.value", component.get("v.mailingCityOLV"));
            //  component.find("MailingzipInput").set("v.value", component.get("v.mailingZipOLV")); 
            //  component.find("MailingSuiteInput").set("v.value", component.get("v.mailingSuitOLV")); 
            //  component.find("MailingStateInput").set("v.value", component.get("v.mailingStateOLV")); 
            //  component.find("MailingCountryInput").set("v.value", component.get("v.mailingCountryOLV")); 
             
            //setting address values to PG Address section
            component.find("PG_PhysicalStreetInput").set("v.value",'');
            component.find("PG_PhysicalAddress2Input").set("v.value",'');
            component.find("PG_PhysicalSuiteInput").set("v.value",'');
            component.find("PG_PhysicalCityInput").set("v.value",'');
            component.find("PG_PhysicalCountryInput").set("v.value",'United States');
            // component.find("PG_PhysicalCounty").set("v.value",county);
            component.find("PG_PhysicalzipInput").set("v.value",'');

           
            if (component.get("v.showPG_PhysicalOtherState")) {
                component.find("PG_PhysicalOtherState").set("v.value",'');
            } else {
                component.find("PG_PhysicalStateInput").set("v.value",'None');
            }
           
              // remove has errors
             var street = component.find('PG_PhysicalStreetInput');
             $A.util.removeClass(street, 'slds-has-error');
      
             var city = component.find('PG_PhysicalCityInput');
             $A.util.removeClass(city, 'slds-has-error');
             
             var state = component.find('PG_PhysicalStateInput');
             $A.util.removeClass(state, 'slds-has-error');
      
             var country = component.find('PG_PhysicalCountryInput');
             $A.util.removeClass(country, 'slds-has-error');
             
             var zip = component.find('PG_PhysicalzipInput');
             $A.util.removeClass(zip, 'slds-has-error');
                      
             var otherState = component.find('PG_PhysicalOtherState');
             $A.util.removeClass(otherState, 'slds-has-error');
         }
        
     },

     handleUploadFinished: function (component, event) {
        debugger
        // Get the list of uploaded files
        var uploadedFiles = event.getParam("files");
        //alert("Files uploaded : " + uploadedFiles.length);
        
        // Get the file name
        uploadedFiles.forEach(file => 
                              {
                                  console.log(file.name+' '+file.documentId);
                                  component.set("v.W9FileName",file.name);
                                  component.set("v.DocID",file.documentId);
                                  
                              }
                                  );
    }
    
})