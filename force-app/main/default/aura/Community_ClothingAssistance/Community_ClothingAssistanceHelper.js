({
    addStudentRecord: function(component, event) 
    {
        //get the Student List from component  
        var StudentsList = component.get("v.StudentsList");
        
        if( StudentsList.length < 10)
        {
            //Add New Student Record
            StudentsList.push({
                'sobjectType'				: 	'CA_Household_Member__c',
                'Citizen_ID__c'				:   '',
                'Date_of_Birth__c'			: 	'',
                'Grade__c'					: 	'',
                'Sector__c'					: 	''
            });
            component.set("v.StudentsList", StudentsList);
        }
        else
        {
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title : 'Warning',
                message: 'A maximum of 10 student records can be added.',
                duration:' 60000',
                key: 'info_alt',
                type: 'error',
                mode: 'dismissible'
            });
            toastEvent.fire();
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
    
    secConValidations: function(component, SecConFirstName, SecConLastName, SecConPhone, SecConRelation) 
    {

        var  SecConInfoRequired = false;
        if( SecConFirstName  != '' ||  SecConLastName  != ''  || SecConPhone  != '' || SecConRelation != '')
        {
            if(SecConFirstName  == '' ||  SecConLastName  == ''  || SecConPhone  == '' || SecConRelation == '')
            {
                SecConInfoRequired = true;
            }
            else
            {
                SecConInfoRequired = false;
            }
        }
        return SecConInfoRequired;
    }

})