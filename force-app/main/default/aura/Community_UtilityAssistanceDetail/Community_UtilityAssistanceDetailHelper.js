({
    addStudentRecord: function(component, event) 
    {
        //get the Student List from component  
        var StudentsList = component.get("v.StudentsList");
        var CVCase =	component.get("v.CVCase");
        console.log(CVCase.Children_attending_K_12_school__c);
        var numRow= CVCase.Children_attending_K_12_school__c;
        if(numRow < 1 || numRow == undefined){
            numRow =10;
        }
        if( StudentsList.length < numRow)
        {
            //Add New Student Record
            StudentsList.push({
                'sobjectType'				: 	'Sub_Applicant__c',
                'Citizen_ID__c'				:   '',
                'Date_of_Birth__c'			: 	''
            });
            component.set("v.StudentsList", StudentsList);
        }
        else
        {
            var msg ='A maximum of '+numRow+' child records can be added.'
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title : 'Warning',
                message: msg,
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