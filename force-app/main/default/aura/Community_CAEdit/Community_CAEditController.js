({
    doInit: function(component, event, helper)
    {
        debugger;
        var action = component.get("c.getStudents");
           		
            action.setCallback(this,function(response)
            {
 			 var state = response.getState();
                
                if (state === "SUCCESS")
                {
                    helper.getUploadedFiles(component, event); 
                    var resultData = response.getReturnValue();
                    component.set("v.parentId", resultData.Id);
                    var studentRecords = [];
                    
                    //set students list
                    if(!$A.util.isUndefined(resultData.CA_Household_Members__r))
                    {
                        studentRecords = resultData.CA_Household_Members__r;
                    }
                    
                    if(studentRecords.length > 0)
                    {
                        var StudentsList = component.get("v.StudentsList");
                        for (var i = 0; i < studentRecords.length; i++) 
                        {
                            //show only non withdrawn students
                            if(studentRecords[i].Withdraw__c == false  && studentRecords[i].Duplicate__c == true)
                            {
                                var HmDob = studentRecords[i].Date_of_Birth__c;	
                                var splitDate = HmDob.split('-');
                                var year = splitDate[0];
                                var month = splitDate[1];
                                var day = splitDate[2];
                                
                                studentRecords[i].Date_of_Birth__c = month+'/'+day+'/'+year;
                                
                                StudentsList.push({
                                    'sobjectType'			: 	'CA_Household_Member__c',
                                    'Id'					: 	studentRecords[i].Id,
                                    'First_Name__c'			: 	studentRecords[i].First_Name__c,
                                    'Last_Name__c'			: 	studentRecords[i].Last_Name__c,
                                    'Citizen_ID__c'			:   studentRecords[i].Citizen_ID__c,
                                    'Date_of_Birth__c'		: 	studentRecords[i].Date_of_Birth__c,
                                    'Grade__c'				:	studentRecords[i].Grade__c,
                                    'Sector__c'				:	studentRecords[i].Sector__c,
                                    'Withdraw__c'			:	studentRecords[i].Withdraw__c,
                                    'Duplicate__c'			:	studentRecords[i].Duplicate__c
                                    
                                });
                            }
                            
                        }
                        component.set("v.StudentsList", StudentsList); 
                    } 
                    component.set("v.dataLoaded", true);
                }
                if (state === "ERROR")
                {
                    var err='';
                       var errors = response.getError();
                       errors.forEach( function (error)
                        {
                            //top-level error.  there can be only one
                            if (error.message)
                            {
                                err=err+' '+error.message;					
                            }
                            
                            //page-level errors (validation rules, etc)
                            if (error.pageErrors)
                            {
                                error.pageErrors.forEach( function(pageError) 
                                   {
                                        err=err+' '+pageError.message;					
                                   });					
                            }
                            
                            if (error.fieldErrors)
                            {
                                //field specific errors--we'll say what the field is					
                                for (var fieldName in error.fieldErrors)
                                {
                                    //each field could have multiple errors
                                    error.fieldErrors[fieldName].forEach( function (errorList)
                                           {	
                                                  err=err+' '+errorList.message, "Field Error on " + fieldName + " : ";						
                                            });                                
                                };  //end of field errors forLoop					
                            } //end of fieldErrors if
                        }); //end Errors forEach
                    
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'SUCCESS',
                        message: err,
                        duration:' 200000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'pester'
                    });
                    toastEvent.fire();
                }
        });   
        
        $A.enqueueAction(action);
    },
	    	// upload files    
    addFiles: function(component, event, helper)
    {
        debugger;
    	var files=component.get("v.uploadedfiles");
    	var uploadedFiles = event.getParam("files");
        
        /*if(files==undefined)
        {
            files='Successfully Uploaded: '+uploadedFiles[0].name;
            component.set("v.DocID",uploadedFiles[0].documentId);
        }
        else
        {
            files=files+', '+uploadedFiles[0].name;
            component.set("v.DocID",uploadedFiles[0].documentId);
        }*/
        if(files==undefined){
            files = '';
        } else{
            files += ', ';
        }
        
        var fileArray = component.get("v.DocID");
        for (let i = 0; i < uploadedFiles.length; i++) 
        {
        	files+=uploadedFiles[i].name+', ';
            fileArray.push(uploadedFiles[i].documentId);
        }
        files = files.slice(0, files.length - 2);
        component.set("v.W9FileName", files);
        component.set("v.DocID", fileArray);
        
        helper.getUploadedFiles(component, event); 
    	component.set("v.uploadedfiles",files);
	},
    
    previewFile : function(component, event, helper)
    {  
        $A.get('e.lightning:openFiles').fire({ 
            
            recordIds: [event.currentTarget.id]
            
        });  
    },  
    
    // delete files 
    deleteSelectedFile : function(component, event, helper)
    {
        if( confirm("Confirm deleting this file?"))
        {
            component.set("v.showSpinner", true); 
            helper.deleteUploadedFile(component, event);                
        }
    },
    
      // delete files 
    handleConfirm : function(component, event, helper)
    {
        var HMlist = component.get("v.StudentsList");
        var DocIDs = component.get("v.DocID");
        var caseID = component.get("v.parentId");
        
        component.set("v.showSpinner", true);
        for (var i=0; i<HMlist.length; i++) {
            HMlist[i].Withdraw__c = document.getElementById(HMlist[i].Id).checked;
        }
        
        var action = component.get("c.saveCA");
           		
        action.setParams({
            "HMlist": HMlist,
            "DocIDs": DocIDs,
            "CaseID": caseID
        });  
            action.setCallback(this,function(response)
            {
 			 	var state = response.getState();
                
                if (state === "SUCCESS")
                {
                    var resultData = response.getReturnValue();
                    if ($A.util.isEmpty(resultData)){
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            title : 'Success',
                            message: 'Updated Successfully.',
                            duration:' 5000',
                            key: 'info_alt',
                            type: 'success',
                            mode: 'dismissible'
                        });
                        toastEvent.fire();
                        
                        var url = component.get("v.redirectURL");
                        window.open(url,'_top');
                    } else{
                		component.set("v.showSpinner", false); 
                        component.set("v.exceptionMsg",resultData)
                        helper.endRequestWithException(component,event,helper);
                    }
                		component.set("v.showSpinner", false); 
                }
                if (state === "ERROR")
                {
                	component.set("v.showSpinner", false);
                    
                    var err='';
                       var errors = response.getError();
                       errors.forEach( function (error)
                        {
                            //top-level error.  there can be only one
                            if (error.message)
                            {
                                err=err+' '+error.message;					
                            }
                            
                            //page-level errors (validation rules, etc)
                            if (error.pageErrors)
                            {
                                error.pageErrors.forEach( function(pageError) 
                                   {
                                        err=err+' '+pageError.message;					
                                   });					
                            }
                            
                            if (error.fieldErrors)
                            {
                                //field specific errors--we'll say what the field is					
                                for (var fieldName in error.fieldErrors)
                                {
                                    //each field could have multiple errors
                                    error.fieldErrors[fieldName].forEach( function (errorList)
                                           {	
                                                  err=err+' '+errorList.message, "Field Error on " + fieldName + " : ";						
                                            });                                
                                };  //end of field errors forLoop					
                            } //end of fieldErrors if
                        }); //end Errors forEach
                    
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'ERROR',
                        message: err,
                        duration:'200000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'dismissible'
                    });
                    toastEvent.fire();
                }
        });   
        
        $A.enqueueAction(action);
        
    },
    showConfirmation : function(cmp) {
        debugger;
        
        var HMlist = cmp.get("v.StudentsList");
        var DocIDs = cmp.get("v.DocID");
        var caseID = cmp.get("v.parentId");
        var withdrawnCitizen = '';
        var stdIds = '';
        
        cmp.set("v.showSpinner", true); 
        var isWithdraw = 0;
        for (var i=0; i<HMlist.length; i++) {
            HMlist[i].Withdraw__c = document.getElementById(HMlist[i].Id).checked;
            if(HMlist[i].Withdraw__c){
            	withdrawnCitizen += HMlist[i].Citizen_ID__c+',';
                stdIds += HMlist[i].Id+',';
            }
            if(document.getElementById(HMlist[i].Id).checked){
                isWithdraw = 1;
            }
        }
        
        if(isWithdraw == 0 && DocIDs.length == 0){
                cmp.set("v.showSpinner", false); 
            var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'ERROR',
                        message: 'Please upload a file or select a student to withdraw.',
                        duration:' 200000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'dismissible'
                    });
                    toastEvent.fire();
        } else{
            debugger;
            
        var action = cmp.get("c.checkDuplicates");
        action.setParams({
            "HMlist": HMlist,
            "withdrawnCitizens": withdrawnCitizen
        });  
            action.setCallback(this,function(response)
            {
                debugger;
 			 var state = response.getState();
                
                if (state === "SUCCESS")
                {
                    var resultData = response.getReturnValue();
                    cmp.set("v.showSpinner", false); 
                    if(resultData.length > 0){
                        alert('Changes have occurred since the last time the page was loaded.  Please refresh the page and try again.');
                    } else{
                        $A.createComponent(
                            "c:modal_confirmation",
                            {
                                "title": "Confirm Submission",
                                "tagline": "",
                                "message": "Once submitted, your application will be locked for review. You will not be able to make modifications. Please select EDIT to make any additional changes; otherwise, select SUBMIT to submit your application.",
                                "confirm": cmp.getReference("c.handleConfirm"),
                                "param": ""
                            },
                            function(modalWindow, status, errorMessage){
                                //Add the new button to the body array
                                if (status === "SUCCESS") {
                                    var body = cmp.get("v.body");
                                    body.push(modalWindow);
                                    cmp.set("v.body", body);
                                }
                                else if (status === "INCOMPLETE") {
                                    console.log("No response from server or client is offline.")
                                    // Show offline error
                                }
                                else if (status === "ERROR") {
                                    console.log("Error: " + errorMessage);
                                    // Show error message
                                }
                            }
                        );
                    }
                }
                if (state === "ERROR")
                {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'SUCCESS',
                        message: response.getReturnValue(),
                        duration:' 200000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'pester'
                    });
                    toastEvent.fire();
                }
        });   
        
        $A.enqueueAction(action);
                
        }
    },
})