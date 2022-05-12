({
	 addAccountRecord: function(component, event) 
    {
        //get the account List from component  
        var accountList = component.get("v.accountList");
        //Add New Account Record
        accountList.push({
            'sobjectType'				: 	'Account',
            'FirstName'					: 	'',
            'Middle_Name__c'			: 	'',
            'LastName'					: 	'',
            'Suffix__c'					: 	'',
            'HealthCloudGA__Gender__pc'	: 	'',
            'Ethnicity__c'				: 	'',
            'Tribe__c'					: 	'',
            'Other_Tribe__c'			:	'',
            'Date_of_Birth__c'			: 	'',
            'Grade__c'					: 	'',
            'School__c'					: 	'',
            'Foster_Child__c'			: 	'',
            'Migrant__c'				: 	''
        });
        component.set("v.accountList", accountList);
    },
    
     validateAccountList: function(component, event)
    {
        var errorMessages = null;
        
        
        //Validate all account records
        var isValid = true;
        var accountList = component.get("v.accountList");
        for (var i = 0; i < accountList.length; i++) 
        {
            if (accountList[i].FirstName == '' || accountList[i].LastName == '' || accountList[i].HealthCloudGA__Gender__pc == ''
              || accountList[i].Date_of_Birth__c == '' || accountList[i].Grade__c == '' || accountList[i].School__c == '') 
            {
                isValid = false;
                errorMessages='You must fill in all of the required fields on the child record in row number ' + (i + 1);
                
            }
            
            
         if(!$A.util.isEmpty(accountList[i].Date_of_Birth__c)) 
         {
                isValid = false;
                var date_regex = /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/ ;
                var checkDateFormate=  date_regex.test(accountList[i].Date_of_Birth__c);  
                
                if (!checkDateFormate)
                {
                    if(errorMessages == null)
                    {
                        errorMessages='Invalid date format at row number ' + (i + 1)+', correct one is MM/DD/YYYY.';
                    }
                    else
                    {
                        errorMessages +=" "+'Invalid date format at row number ' + (i + 1)+', correct one is MM/DD/YYYY.';
                    } 
                }
         } 
        }
        
        
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
        return isValid;
    },
    
   
   
})