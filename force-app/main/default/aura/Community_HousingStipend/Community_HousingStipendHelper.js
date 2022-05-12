({
    addStudentRecord: function(component, event, helper){
        //get the Student List from component  
        var StudentsList = component.get("v.StudentsList");
        
        if( StudentsList.length < 10){
            //Add New Student Record
            StudentsList.push({
                'sobjectType'				: 	'CA_Student2__c',
                'Citizen_ID__c'				:   '',
                'Date_of_Birth__c'			: 	'',
                'Grade__c'					: 	'',
                'Category__c'				: 	'',
                'School_District__c'		:	''
            });
            component.set("v.StudentsList", StudentsList);
        }
        else{
            helper.showErrorMessage(component,event,helper,'A maximum of 10 student records can be added.');
        }
    },
    
    addHHMemberRecord: function(component, event, helper){
        component.set("v.HHMembersRequired", true);
        //get the HHMembersList List from component  
        var HHMembersList = component.get("v.HHMembersList");
        
        if( HHMembersList.length < 15){
            //Add New HH Member Record
            HHMembersList.push({
                'sobjectType'		: 	'HH_Member__c',
                'First_Name__c'		:   '',
                'Last_Name__c'		: 	'',
                'Date_of_Birth__c'	: 	'',
                'Relation__c'		: 	''
            });
            component.set("v.HHMembersList", HHMembersList);  
        }
        else{
            helper.showErrorMessage(component,event,helper,'A maximum of 15 Household Member records can be added.');
        }
    },
    

    callServer : function(component,method,callback,params) {
        var action = component.get(method);
        if (params) {        
            action.setParams(params);
        }
        
        action.setCallback(this,function(response) {            
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
    
    secConValidations: function(component, CVCase){
        var  SecConInfoRequired = false;
        console.log(SecConInfoRequired);
        if(
            (CVCase.Sec_First_Name__c  != '' 
             ||  CVCase.Sec_Last_Name__c  != ''  
             || CVCase.Sec_Phone__c  != '' 
             || CVCase.Relation__c != '')
           && 
           (CVCase.Sec_First_Name__c  == '' 
            ||  CVCase.Sec_Last_Name__c  == ''  
            || CVCase.Sec_Phone__c  == '' 
            || CVCase.Relation__c == '')){
            SecConInfoRequired = true;
        }
           
           console.log(SecConInfoRequired);
        return SecConInfoRequired;
    },
    
    ObjFieldByMailingParent : function(component, event, mailingCountry) {
        var countryValue = mailingCountry;
        var pickListMap = component.get("v.getPickListMap");
        console.log('Helper running');
        debugger; 
        
        if (countryValue != '') {     
            console.log(countryValue);
            //get state values against country
            var stateValues = pickListMap[countryValue];            
            var stateValueList = [];
            
            for (var i = 0; i < stateValues.length; i++) {
                stateValueList.push(stateValues[i]);
            }
            //set mailing state picklist
            component.set("v.getMailingChildList", stateValueList);
            
            if(stateValues.length > 0) {
                console.log(stateValues.length);
                // hide other state/Territory field
                component.set("v.showMailingOtherState", false); 
                // show  state picklist
                component.set("v.showMailingState", true);
                // set state field value to empty
                component.set("v.CVCase.Other_Mailing_State__c", '');
                //console.log(stateValueList);
                
            }
            else {
                // show other state/Territory field
                component.set("v.showMailingOtherState", true); 
                // hide  state picklist
                component.set("v.showMailingState", false); 
                // set other state/Territory field value to empty
                component.set("v.CVCase.Mailing_States__c", '');
                
            }
            
        } 
        else  {
            component.set("v.CVCase.Mailing_States__c", '');
            component.set("v.CVCase.Other_Mailing_State__c", '');
        }
    }, 
    
     ObjFieldByPhysicalParent : function(component, event, physicalCountry) {
        var countryValue = physicalCountry;
        var pickListMap = component.get("v.getPickListMap");
        
        if (countryValue != '') {     
            //get state values against country
            var stateValues = pickListMap[countryValue];            
            var stateValueList = [];
            
            for (var i = 0; i < stateValues.length; i++) {
                stateValueList.push(stateValues[i]);
            }
            //set physical state picklist
           component.set("v.getPhysicalChildList", stateValueList);
            
            if(stateValues.length > 0) {
                // hide other state/Territory field
                component.set("v.showPhysicalOtherState", false); 
                // show  state picklist
                component.set("v.showPhysicalState", true);
                // set state field value to empty
                component.set("v.CVCase.Other_Physical_State__c", '');
            }
            else {
                // show other state/Territory field
                component.set("v.showPhysicalOtherState", true); 
                // hide  state picklist
                component.set("v.showPhysicalState", false); 
                // set other state/Territory field value to empty
                component.set("v.CVCase.Physical_States__c", '');
            }
            
        } 
        else  {
            component.set("v.CVCase.Physical_States__c", '');
            component.set("v.CVCase.Other_Physical_State__c", '');
        }
    }, 
    
    // validate Mailing Address Completeness
    checkMailingAddFieldsCompleteness : function(component, event)  {
        var isMailingAddressValid = true;
        var CVCase = component.get('v.CVCase');
        if(component.get("v.CVCase.Mailing_Countries__c") == "United States"){
            if($A.util.isUndefinedOrNull(CVCase.Mailing_Street__c)   		 ||   CVCase.Mailing_Street__c.trim() == ''   || 
               $A.util.isUndefinedOrNull(CVCase.Mailing_City__c)      		 ||   CVCase.Mailing_City__c.trim() == ''     || 
               $A.util.isUndefinedOrNull(CVCase.Mailing_States__c)     		 ||   CVCase.Mailing_States__c == ''    ||
               $A.util.isUndefinedOrNull(CVCase.Mailing_Countries__c)   	 ||   CVCase.Mailing_Countries__c.trim() == ''  || 
               $A.util.isUndefinedOrNull(CVCase.Mailing_ZipPostal_Code__c) 	 ||   CVCase.Mailing_ZipPostal_Code__c.trim() == '' ){
                isMailingAddressValid = false;
            }
        }
        return isMailingAddressValid;
    },
    
     // validate Physical Address Completeness
    checkPhysicalAddFieldsCompleteness : function(component, event)  {
        var isPhysicalAddressValid = true;
        var CVCase = component.get('v.CVCase');
        if(component.get("v.CVCase.Physical_Countries__c") == "United States"){
            if($A.util.isUndefinedOrNull(CVCase.Physical_Street__c)   		 ||   CVCase.Physical_Street__c.trim() == ''   || 
               $A.util.isUndefinedOrNull(CVCase.Physical_City__c)      		 ||   CVCase.Physical_City__c.trim() == ''     || 
               $A.util.isUndefinedOrNull(CVCase.Physical_States__c)     	 ||   CVCase.Physical_States__c == ''    ||
               $A.util.isUndefinedOrNull(CVCase.Physical_Countries__c)   	 ||   CVCase.Physical_Countries__c.trim() == ''  || 
               $A.util.isUndefinedOrNull(CVCase.Physical_ZipPostal_Code__c ) ||   CVCase.Physical_ZipPostal_Code__c .trim() == '' ){
                isPhysicalAddressValid = false;
            }
        }
        return isPhysicalAddressValid;
    },
    
    getAge : function(component, event, dob)  {
        var dob = new Date(dob);
        var month_diff = Date.now() - dob.getTime();
        var age_dt = new Date(month_diff); 
        var year = age_dt.getUTCFullYear();
        var age = Math.abs(year - 1970);
        return age;
    },
    
    getCleanedCitizenId : function(component, event, cId){
        // cleaning citizen id
        var removedAlphabet 			= 	cId.replace(/[^\d.-]/g, '');
        var removedLeadingZeros 		=	removedAlphabet.replace(/^0+/, '');
        var removeSpecialChars			=	removedLeadingZeros.replace(/^-+/, '');
        var citizenId 					=	removeSpecialChars.replace(/^0+/, '');
        return  citizenId;
    },
    
     deletefile : function(component,event,helper,fileIds){
        debugger;
        var deletefile = component.get("c.RemoveFile");
        deletefile.setParams({
            fileIds : fileIds
        });
        deletefile.setCallback(this, function(response) {
            debugger;
            var state = response.getState();
            if (state == 'ERROR'){
                let errors = response.getError();
                helper.showErrorMessage(component,event,helper,errors[0].message);
            }
            component.set("v.isLoading", false);
        })
        $A.enqueueAction(deletefile);
    },
    
        //handle error messages
    showErrorMessage : function(component, event, helper, message){
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title : 'Warning',
            message: message,
            duration:' 7000',
            key: 'info_alt',
            type: 'error',
            mode: 'dismissible'
        });
        toastEvent.fire();
    },
    
    //handle success/informative messages
    showSuccessMessage : function(component, event, helper, message){
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title : 'Success',
            message: message,
            duration:' 3000',
            key: 'info_alt',
            type: 'success',
            mode: 'dismissible'
        });
        toastEvent.fire();
    }

})