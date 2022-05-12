({
    doInit : function(component, event) {
        debugger;
        // get id from url
        var queryString = 	window.location.search;
        var rid			= 	location.search.split('Id=')[1];
        component.set("v.rId", rid);
        var action = component.get("c.updateAttemptCount");

        action.setParams({ 
            userId 		: rid
        });
        
        action.setCallback(this,function(response){
            var state = response.getState();
            if (state === "SUCCESS"){
                debugger;
                var resultData = response.getReturnValue();
                if(resultData.RecordType.DeveloperName == 'ERM_Patient'){
                    component.set("v.isERMPatientAccount", true);     
                    if(resultData.CA_Creatd_4_Cmnty_User__c)
                        component.set("v.IsolationEndDate", resultData.Isolatied_End_Date__pc);
                    else
                        component.set("v.responseNotSubmitted", true); 
                }
            }
            if (state === "ERROR"){
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title : 'ERROR',
                    message: response.getReturnValue(),
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'error',
                    mode: 'pester'
                });
                toastEvent.fire();
            }
        });   
        
        $A.enqueueAction(action);
        
    },
    
    validateUser : function(component, event, helper) {
        var DobFId		=	component.find('DateOfBirth');
        var Dob	=	component.get('v.Dob');
        var errorMessages = null;
        var formatedDate = Dob.replace(/(\d\d)\/(\d\d)\/(\d{4})/, "$3-$1-$2");
        var date_regex = /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/ ;
        var checkDateFormate=  date_regex.test(Dob);
        
        //is Date of Birth field is empty?
        if($A.util.isEmpty(Dob)) {
            DobFId.setCustomValidity("Date of Birth required.");
            DobFId.reportValidity();
        }
        else{
            if (!checkDateFormate){
                errorMessages='Invalid date format, correct one is MM/DD/YYYY.';
                helper.showErrorMessage(component, event, errorMessages);
            }
                   // if no error then make server call  
            else{
                //disable Next button
                component.set("v.isActive", true);
                //show spinner
                var spinner = component.find("bSpinner");
                $A.util.removeClass(spinner, "slds-hide");
                
                // get id from url
                var queryString = 	window.location.search;
                var rid			= 	location.search.split('Id=')[1];
                
                var action = component.get("c.getUserInfo");
                action.setParams({ 
                    userId 		: rid,
                    Dob 		: formatedDate
                });
                
                action.setCallback(this,function(response){
                    var state = response.getState();
                    if (state === "SUCCESS"){
                        var resultData = response.getReturnValue();
                        //disable Next button
                        component.set("v.isActive", false);
                        
                        //hide spinner
                        var spinner = component.find("bSpinner");
                        $A.util.addClass(spinner, "slds-hide");
                        
                        if (resultData == null){
                            var err = 'Invalid URL or Date of Birth.';
                            helper.showErrorMessage(component, event, err);
                        }
                        else{
                            //if APEX error
                            if(resultData == undefined){
                                helper.showErrorMessage(component, event, 'Unknown Error!');
                            }
                            //if failed
                            else if(resultData == "Failed"){
                                helper.showErrorMessage(component, event, 'We could not verify the Date of Birth entered. Please try again.');
                            }
                            //if Max attempts reached  
                            else if(resultData == "MaxAttemptsReached"){
                                component.set("v.showDob", false);
                            }
                            //Succeed  
                            else{
                                component.set("v.acnt", resultData);
                                console.log(component.get("v.acnt"));
                                component.set("v.showInputS", false);
                                component.set("v.showTestResult", true);
                             }
                        }
                    }
                    if(state === 'ERROR'){
                        //hide spinner
                        var spinner = component.find("Spinner2");
                        $A.util.addClass(spinner, "slds-hide");
                        var err='';
                        var errors = response.getError();
                        errors.forEach( function (error){
                               //top-level error.  there can be only one
                               if (error.message){
                                   err=err+' '+error.message;					
                               }
                                           
                               //page-level errors (validation rules, etc)
                               if (error.pageErrors){
                                   error.pageErrors.forEach( function(pageError) {
                                            err=err+' '+pageError.message;					
                                        });					
                               }
                                           
                               if (error.fieldErrors){
                                   //field specific errors--we'll say what the field is					
                                   for (var fieldName in error.fieldErrors){
                                       //each field could have multiple errors
                                       error.fieldErrors[fieldName].forEach( function (errorList){	
                                              err=err+' '+errorList.message, "Field Error on " + fieldName + " : ";						
                                          });                                
                                   };  //end of field errors forLoop					
                               } //end of fieldErrors if
                           }); //end Errors forEach
                        
                        helper.showErrorMessage(component, event, err);
                    }
                });       
                $A.enqueueAction(action);
            }
        }    
            
    },

    validateAndReplace: function (component, event){
        const input = event.getSource();
        const inputValue = input.get('v.value');
        const validValue = inputValue.replace(/^(\d\d)(\d)$/g,'$1/$2')
        .replace(/^(\d\d\/\d\d)(\d+)$/g,'$1/$2')
        .replace(/[^\d\/]/g,'');
        input.set('v.value', validValue);
    },
    
    fillQuestionnaire: function(component, event, helper) {
        component.set("v.showTestResult", false);
        component.set("v.showQuestionnaire", true);
    },  
 })