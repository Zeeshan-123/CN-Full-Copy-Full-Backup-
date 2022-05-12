({
    doInit : function(component, event) 
     {
   			//check does ebt request exist for this user
        	var actionCheck = component.get("c.ebtRequestCheck");
        	actionCheck.setCallback(this,function(response)
            {
            // request exist
             if (response.getReturnValue() != null)
             {
               var result = response.getReturnValue();
               component.set("v.caseId", result.Id);
               component.set("v.confirmationNumber", result.EBT_Confirmation_Number__c);
               // show success message
               component.set("v.showSuccessMessage", true);
              }//end
     	 else
         {
               //show EBT form
                component.set("v.showEBTForm", true);
                 
                var action = component.get("c.getPicklistValues");
           		action.setParams({
                
                    strObjectName 	: component.get("v.getObjectName"),
                    strparentField 	: component.get("v.getParentFieldAPI"),
                    strchildField 	: component.get("v.getChildFieldAPI")
                
       		 });
        	action.setCallback(this,function(response)
            {
            
 			var state = response.getState();
             if (state === "SUCCESS")
             {
              	var resultData = response.getReturnValue();
                 
                var genderMap = [];
                var genderMapData = resultData.gender;
                for(var key in genderMapData)
                {
                    genderMap.push({value:genderMapData[key], key:key});
                }
                component.set("v.genderList", genderMap);
                 
                var ethnicityMap = [];
                var ethnicityMapData = resultData.ethnicity;
                for(var key in ethnicityMapData)
                {
                    ethnicityMap.push({value:ethnicityMapData[key], key:key});
                }
                component.set("v.ethnicityList", ethnicityMap);
                 
               	var tribeMap = [];
                var tribeMapData = resultData.tribe;
                for(var key in tribeMapData)
                {
                    tribeMap.push({value:tribeMapData[key], key:key});
                }
                component.set("v.tribList", tribeMap);
                 
                var gradeMap = [];
                var gradeMapData = resultData.grade;
                for(var key in gradeMapData)
                {
                    gradeMap.push({value:gradeMapData[key], key:key});
                }
                component.set("v.gradeList", gradeMap);
                 
                var schoolMap = [];
                var schoolMapData = resultData.school;
                for(var key in schoolMapData)
                {
                    schoolMap.push({value:schoolMapData[key], key:key});
                }
                component.set("v.schoolList", schoolMap);
                 
                var fosterChildMap = [];
                var fosterChildMapData = resultData.fosterChild;
                for(var key in fosterChildMapData)
                {
                    fosterChildMap.push({value:fosterChildMapData[key], key:key});
                }
                component.set("v.fosterChildList", fosterChildMap);
                 
                var migrantMap = [];
                var migrantMapData = resultData.migrant;
                for(var key in migrantMapData)
                {
                    migrantMap.push({value:migrantMapData[key], key:key});
                }
                component.set("v.migrantList", migrantMap);
                 
                var homeLanguageMap = [];
                var homeLanguageMapData = resultData.homeLanguage;
                for(var key in homeLanguageMapData)
                {
                    homeLanguageMap.push({value:homeLanguageMapData[key], key:key});
                }
                component.set("v.homeLanguageList", homeLanguageMap);
                 
                var incomeFrequencyMap = [];
                var incomeFrequencyMapData = resultData.incomeFrequency;
                for(var key in incomeFrequencyMapData)
                {
                    incomeFrequencyMap.push({value:incomeFrequencyMapData[key], key:key});
                }
                component.set("v.incomeFrequencyList", incomeFrequencyMap);
                                 
                component.set("v.getPickListMap",resultData.pickListMap);
                
                var pickListMap = component.get("v.getPickListMap");
                var parentkeys = [];
                var parentField = [];                
                
                for (var pickKey in resultData.pickListMap)
                {
                    parentkeys.push(pickKey);
                }
               
                if (parentkeys != undefined && parentkeys.length > 0) 
                {
                    parentField.push('-- None --');
                }
                
                for (var i = 0; i < parentkeys.length; i++) 
                {
                    parentField.push(parentkeys[i]);
                }  
               
                component.set("v.getParentList", parentField);
                component.set("v.getMailingParentList", parentField);
                
                window.setTimeout(
                $A.getCallback( function() {
                    component.find("priConHomePhone").set("v.value", resultData.acnt.Phone);
                    component.find("priConWorkPhone").set("v.value", resultData.acnt.PersonOtherPhone);
                    component.find("priConCellPhone").set("v.value", resultData.acnt.PersonMobilePhone);
                    component.find("priConFirstName").set("v.value", resultData.acnt.FirstName);
                    component.find("priConMiddleName").set("v.value", resultData.acnt.Middle_Name__c);
                    component.find("priConLastName").set("v.value", resultData.acnt.LastName);
                    component.find("priConSuffix").set("v.value", resultData.acnt.Suffix__c);
                    component.find("priConEmail").set("v.value", resultData.userEmail);
                    component.find("priConDob").set("v.value", resultData.acnt.Date_of_Birth__c);
                    
                    component.find("PhysicalStreetInput").set("v.value", resultData.acnt.PersonOtherStreet);
                    component.find("PhysicalCityInput").set("v.value", resultData.acnt.PersonOtherCity);
                    component.find("PhysicalCountryInput").set("v.value", 'United States');
                    component.set("v.physicalStateVal", resultData.acnt.PersonOtherState);
                    component.find("PhysicalzipInput").set("v.value", resultData.acnt.PersonOtherPostalCode);
                    
                    component.find("MailingStreetInput").set("v.value", resultData.acnt.PersonMailingStreet);
                    component.find("MailingCityInput").set("v.value", resultData.acnt.PersonMailingCity);
                    component.find("MailingCountryInput").set("v.value", 'United States');
                    component.set("v.mailingStateVal", resultData.acnt.PersonMailingState);
                    component.find("MailingzipInput").set("v.value", resultData.acnt.PersonMailingPostalCode);
                    $A.enqueueAction(component.get('c.ObjFieldByParent'));
                    
                     var physicalVal = component.get("v.physicalStateVal");
                    var mailingVal = component.get("v.mailingStateVal");
                              
                                
                    if ($A.util.isUndefined(mailingVal))
                    {
                        setTimeout(function(){
                        	component.find("MailingStateInput").set("v.value", '-- None --');  
                        }, 1000);
                    }
                    else
                    {
                         
                        setTimeout(function(){
                            component.find("MailingStateInput").set("v.value", mailingVal);
                        }, 1000);            
                    }
                    
                    
                    if ($A.util.isUndefined(physicalVal))
                    {
                        setTimeout(function(){
                        	component.find("PhysicalStateInput").set("v.value", '-- None --');
                        }, 1000);    
                    }
                    else
                    {
                        setTimeout(function(){
                            component.find("PhysicalStateInput").set("v.value", physicalVal);
                        }, 1000);
                    }   
                    
                    
                }));
                 
                 $A.enqueueAction(component.get('c.addRow')); 
              }
                
              if (state === "ERROR")
             {
                  var toastEvent = $A.get("e.force:showToast");
        			toastEvent.setParams({
                        title : 'SUCCESS',
                        message: response.getReturnValue(),
                        duration:' 10000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'pester'
                    });
                   toastEvent.fire();
             }
        });   

        $A.enqueueAction(action);
           }

        });   

        $A.enqueueAction(actionCheck);	
       
    },
        
    // using same funtion for both physical and mailing address 
    // because state is default set to US and it's readonly
     ObjFieldByParent : function(component, event, helper)
    { 
            var controllerValue = component.find("PhysicalCountryInput").get("v.value");
            //get country state map
            var pickListMap = component.get("v.getPickListMap");
          
            // pass country state map key to get values
            var childValues = pickListMap[controllerValue];            
            var childValueList = [];
            childValueList.push('-- None --');
            
            for (var i = 0; i < childValues.length; i++)
            {
                childValueList.push(childValues[i]);
            }
            
            component.set("v.getChildList", childValueList);
            component.set("v.getMailingChildList", childValueList);
   	},  

		languageChange: function (component, event)
    {
        var homeLanguage = component.find("spokenHomeLanguage").get("v.value");
        if (homeLanguage == 'Other')
        {
            component.find("otherLanguage").set("v.disabled", false);
        }
        else
        {
            component.find("otherLanguage").set("v.disabled", true);
            component.find("otherLanguage").set("v.value", '');
        }
    },
    
     tribeChange: function (component, event)
    {
        var tribe = component.find("tribe").get("v.value");
        if (tribe == 'Other')
        {
            component.find("otherTribe").set("v.disabled", false);
        }
        else
        {
            component.find("otherTribe").set("v.disabled", true);
            component.find("otherTribe").set("v.value", '');
        }
    },
    
    // date validator
       validateAndReplace: function (component, event)
    {
        const input = event.getSource();
        const inputValue = input.get('v.value');
        const validValue = inputValue.replace(/^(\d\d)(\d)$/g,'$1/$2')
            .replace(/^(\d\d\/\d\d)(\d+)$/g,'$1/$2')
            .replace(/[^\d\/]/g,'');
        input.set('v.value', validValue);
    },
    
    //add row in grid table
	addRow: function(component, event, helper) 
    {
        helper.addAccountRecord(component, event);
    },
    
    //add row from grid table
    removeRow: function(component, event, helper) 
    {
        //Get the account list
        var accountList = component.get("v.accountList");
        //Get the target object
        var selectedItem = event.currentTarget;
        //Get the selected item index
        var index = selectedItem.dataset.record;
        accountList.splice(index, 1);
        component.set("v.accountList", accountList);
    },
    

    
    save: function(component, event, helper)
    {
      debugger;
      	var accountList = component.get("v.accountList");
        var numberOfChildren = component.find("numberOfChildren").get("v.value");
        var errorMessages = null;
        var errorMessagesForChild = null;
        
        var spokenLanguage = component.find("spokenHomeLanguage").get("v.value");
        var otherLanguage = component.find("otherLanguage").get("v.value");
        var programParticipated = component.find("program").get("v.value");
        
        var householdIncome = component.find("householdIncome").get("v.value");
        var incomeFrequency = component.find("incomeFrequency").get("v.value");
        var householdSize = component.find("householdSize").get("v.value");
        
        var priConFirstName = component.find("priConFirstName").get("v.value");
        var priConMiddleName = component.find("priConMiddleName").get("v.value");
        var priConLastName = component.find("priConLastName").get("v.value");
        var priConSuffix = component.find("priConSuffix").get("v.value");
        
        var physicalStreet = component.find("PhysicalStreetInput").get("v.value");
        var physicalCity = component.find("PhysicalCityInput").get("v.value");
        var physicalCountry = component.find("PhysicalCountryInput").get("v.value");
        var physicalState = component.find("PhysicalStateInput").get("v.value");
        var physicalZip = component.find("PhysicalzipInput").get("v.value");
        
        var mailingStreet = component.find("MailingStreetInput").get("v.value");
        var mailingCity = component.find("MailingCityInput").get("v.value");
        var mailingCountry = component.find("MailingCountryInput").get("v.value");
        var mailingState = component.find("MailingStateInput").get("v.value");
        var mailingZip = component.find("MailingzipInput").get("v.value");
        
        var priConEmail = component.find("priConEmail").get("v.value");
        var priConDob = component.find("priConDob").get("v.value");
        
        var priConHomePhone = component.find("priConHomePhone").get("v.value");
        var priConWorkPhone = component.find("priConWorkPhone").get("v.value");
        var priConCellPhone = component.find("priConCellPhone").get("v.value");
        
        var secConFirstName = component.find("secConFirstName").get("v.value");
        var secConLastName = component.find("secConLastName").get("v.value");
        var secConPhone = component.find("secConPhone").get("v.value");
        var secConEmail = component.find("secConEmail").get("v.value");
        
        var iAccept = component.get("v.iAccept");
        
           // check for parent fields level error 
        if( mailingStreet == '' ||  mailingCity == '' || mailingState == '-- None --' || mailingZip == '' 
           || priConCellPhone == '' || numberOfChildren == '')
        {
           errorMessages = 'You must fill in all of the required fields.'; 
        }
       
        if( accountList.length == 0)
        {
          if(errorMessages == null)
            {
                errorMessages='Must add atleast one child.';
            }
            else
            {
            	errorMessages +=" "+'Must add atleast one child.';
            } 
        }
        
      
        
          if( iAccept == false)
          {
               if(errorMessages == null)
            {
                errorMessages='Must check the I Accept checkbox.';
            }
            else
            {
            	errorMessages +=" "+'Must check the I Accept checkbox.';
            }
          }
        
         // show primary contact level error if any
          if(errorMessages != null)
        {
            var toastEvent = $A.get("e.force:showToast");
        	toastEvent.setParams({
                        title : 'Warning',
                        message: errorMessages,
                        duration:' 10000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'dismissible'
                    });
                   toastEvent.fire();
        }
        
             // check for child grid level error
         else
        {
              if( accountList.length < numberOfChildren)
          {
               if(errorMessagesForChild == null)
            {
               errorMessagesForChild= 'Please ensure to enter details of at least '+ numberOfChildren+' children or make the correct selection for the number of children to enter.';
            }
            else
            {
            	errorMessagesForChild +=" "+'Please ensure to enter details of at least '+ numberOfChildren+' children or make the correct selection for the number of children to enter.';
            }
          }       
           else
           {
                        // child grid validations
        for (var i = 0; i < accountList.length; i++) 
        {
            if (accountList[i].FirstName == '' || accountList[i].LastName == '' || accountList[i].HealthCloudGA__Gender__pc == ''
              || accountList[i].Date_of_Birth__c == '' || accountList[i].Grade__c == '' || accountList[i].School__c == '') 
            {
                errorMessagesForChild='You must fill in all of the required fields on the child record in row number ' + (i + 1) +'.';
                
            }
            
            
         if(!$A.util.isEmpty(accountList[i].Date_of_Birth__c)) 
         {
                var date_regex = /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/ ;
                var checkDateFormate=  date_regex.test(accountList[i].Date_of_Birth__c);  
                
                if (!checkDateFormate)
                {
                    if(errorMessagesForChild == null)
                    {
                        errorMessagesForChild='Invalid date format at row number ' + (i + 1)+', correct one is MM/DD/YYYY.';
                    }
                    else
                    {
                        errorMessagesForChild +=" "+'Invalid date format at row number ' + (i + 1)+', correct one is MM/DD/YYYY.';
                    } 
                }
         } 
        }
            }    
         
        //show child grid related errors if any
        if(errorMessagesForChild != null)
        {
            var toastEvent = $A.get("e.force:showToast");
        	toastEvent.setParams({
                        title : 'Warning',
                        message: errorMessagesForChild,
                        duration:' 10000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'dismissible'
                    });
                   toastEvent.fire();
        }
        }  
      
        //server call
        if (errorMessagesForChild == null && errorMessages == null)
        {
            if (physicalState == '-- None --')
            {
                physicalStreet	= 	'';
                physicalCity	= 	'';
                physicalState	= 	'';
                physicalCountry	=	'';
                physicalZip		= 	'';
            }
            
            //disable save button
            component.set("v.isActive", true);
            //show spinner
            var spinner = component.find("saveSpinner");
            $A.util.removeClass(spinner, "slds-hide");
            
            var action = component.get("c.saveAccounts");
            action.setParams({ 
                childsAccountList			:		accountList,
                spokenHomeLanguage			: 		spokenLanguage, 
                otherLanguage			 	:		otherLanguage,
                programParticipated 		: 		programParticipated,
                householdIncome		 		: 		householdIncome,
                incomeFrequency		 		: 		incomeFrequency,
                householdSize		 	 	: 		householdSize,
                priConFirstName 		 	: 		priConFirstName,
                priConMiddleName		 	: 		priConMiddleName,
                priConLastName 		 		: 		priConLastName,
                priConSuffix	 			:		priConSuffix,
                dob							:		priConDob,
                physicalStreet				:		physicalStreet,
                physicalCity				:		physicalCity,
                physicalCountry				:		physicalCountry,
                physicalState				:		physicalState,
                physicalZip					:		physicalZip,
                mailingStreet				:		mailingStreet,
                mailingCity					:		mailingCity,
                mailingCountry				:		mailingCountry,
                mailingState				:		mailingState,
                mailingZip					:		mailingZip,
                priConEmail					:		priConEmail,
                priHomePhone				:		priConHomePhone,
                priMobilePhone				:		priConCellPhone,
                priWorkPhone				:		priConWorkPhone,
                secConFirstName				:		secConFirstName,
                secConLastName				:		secConLastName,
                secConPhone					:		secConPhone,
                secConEmail					:		secConEmail
            });
            
            
        	action.setCallback(this,function(response)
            {
                var state = response.getState(); 
               if(state === 'SUCCESS')
                {
                    var result = response.getReturnValue();
                    component.set("v.caseId", result.Id);
                    component.set("v.confirmationNumber", result.EBT_Confirmation_Number__c);
                    
                    //hide spinner
                    var spinner = component.find("saveSpinner");
                    $A.util.addClass(spinner, "slds-hide");
                    
                    //hide EBT form and show success message
                    component.set("v.showEBTForm", false);
                	component.set("v.showSuccessMessage", true);
                }
               if(state === 'ERROR')
          		{
                    //enable button
                    component.set("v.isActive", false);
                    //hide spinner
                    var spinner = component.find("saveSpinner");
                    $A.util.addClass(spinner, "slds-hide");
                    
                    alert('Unknown Error');
                    
                    var error=response.getReturnValue();
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                                title : 'ERROR',
                                message: error,
                                duration:' 10000',
                                key: 'info_alt',
                                type: 'error',
                                mode: 'dismissible'
                    });
                   toastEvent.fire();
                }
                 });       
        $A.enqueueAction(action);
            } // end else
        	
    },
    
    // to make physical address same as mailing address
   phySameAsMailing: function(component, event, helper)
    {
        var sameAsMailing = component.get("v.isSameAsMailing");
        var mailingStreet = component.find("MailingStreetInput").get("v.value");
        var mailingCity = component.find("MailingCityInput").get("v.value");
        var mailingState = component.find("MailingStateInput").get("v.value");
        var mailingZip = component.find("MailingzipInput").get("v.value");
        
        if (sameAsMailing ==  true)
        {
            component.find("PhysicalStreetInput").set("v.value", mailingStreet);
            component.find("PhysicalCityInput").set("v.value", mailingCity);
            component.find("PhysicalStateInput").set("v.value", mailingState);
            component.find("PhysicalzipInput").set("v.value", mailingZip);
        }
        else
        {
            component.find("PhysicalStreetInput").set("v.value","");
            component.find("PhysicalCityInput").set("v.value", "");
            component.find("PhysicalStateInput").set("v.value", "");
            component.find("PhysicalzipInput").set("v.value","");
        }
        
    },
    
    //show ebt request created by user(navigate to case detail page)
   viewRequest: function(component, event, helper)
    {
        var recId = component.get("v.caseId");
        window.location.replace('/s/detail/'+recId);
      },  
})