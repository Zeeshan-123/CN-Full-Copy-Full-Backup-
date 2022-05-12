({
    doInit : function(component, event, helper) {
       
        debugger;
        let action = component.get("c.getApplicantInfo");
        action.setCallback(this, function(response){
            var state = response.getState();
             if (state === "SUCCESS")
             {
                 debugger;
                var resultData = response.getReturnValue();
                debugger
                //resultData.caseExists = false;
                //check for case is already exists or not
                if (resultData.caseExists) {
                    component.set("v.caseId",resultData.caseObj.Id);
                    component.set("v.requestNumber", resultData.caseObj.CaseNumber);
                    //  component.set("v.showEditBtn", result.RRRCase.RRR_Request_Edit_Status__c);
                     // show success message
                    // component.set("v.huntAppForm",false);
                    component.set("v.showSuccessMessage", true);
                    return;
                } 
                component.set("v.surveyForm",true);
                
               
                //setting the account obj values to accObj component
                component.set("v.accObj",resultData.acnt);

                //check if user is less than 18
                // debugger
            //     let ageText = resultData.acnt.Age__pc;
            //     let age = ageText.substring(0, 2); 
            //     // var physicalState = resultData.acnt.PersonOtherState;
            // //    age = 17; 
            //     if (age < 18) {
            //         component.set("v.isApplicantUnder18","Yes");
            //     } else if (age > 54){
            //         component.set("v.isApplicantAbove55","Yes");
            //     }
            }
        });
        $A.enqueueAction(action);
    },
   
    handleRangeChange: function (cmp, event) {
        debugger
        
        var val1 = cmp.get("v.value");
        var slider = document.getElementById("slider1");
        var val = cmp.get("v.slider1Val");
        var a = slider.value;
        
        console.log("You selected: "+ val);
    },

    takeMeHome : function(component, event) 
    {
        window.location.replace('/s');
    },

    AlphanumericCheck : function(component, event, helper)
    {
        debugger
        var code = (event.which) ? event.which : event.keyCode;
        if (!(code > 47 && code < 58) && // numeric (0-9)
                !(code > 64 && code < 91) && // upper alpha (A-Z)
                !(code > 96 && code < 123) &&
        		!(code == 32) &&
            	!(code == 39) &&  // apostrophe
            	!(code == 44) && // comma
           		!(code == 46)){  // dot
                    event.preventDefault();
        }
    },

    submitForm : function(component, event, helper){
        debugger
        var errorMessages = null;
        var acc = component.get("v.accObj");
        var group1Input1 = component.find('group1');
        var group1Input2 = component.find('group2');
        var group1Input3 = component.find('group3');
        var group1Input4 = component.find('group4');
        var group1Input5 = component.find('group5');
        var group1Input6 = component.find('group6');
        var group1Input7 = component.find('group7');
        var group1Input8 = component.find('group8');
        var group1Input9 = component.find('group9');
        var group1Input10 = component.find('group10');
        var group1Input11 = component.find('group11');
        var group1Input12 = component.find('group12');
        var group1Input13 = component.find('group13');

        var group1Value1 = component.get("v.value1");
        var group1Value2 = component.get("v.value2");
        var group1Value3 = component.get("v.value3");
        var group1Value4 = component.get("v.value4");
        var group1Value5 = component.get("v.value5");
        var group1Value6 = component.get("v.value6");
        var group1Value7 = component.get("v.value7");
        var group1Value8 = component.get("v.value8");
        var group1Value9 = component.get("v.value9");
        var group1Value10 = component.get("v.value10");
        var group1Value11 = component.get("v.value11");
        var group1Value12 = component.get("v.value12");
        var group1Value13 = component.get("v.value13");

        // var errorMsg = "Please select atleast one value per program";

        debugger
        // var va1 = group1Value1 != 0 ? group1Value1 : 1;
        
        // if (group1Value1 == 0) {
        //     group1Value1 = 1;
        //     // errorMessages = errorMsg;
        //     // $A.util.addClass(group1Input1, 'slds-has-error');
        // }
        // if (group1Value2 == 0) {
        //     group1Value2 = 1;
        //     // errorMessages = errorMsg;
        //     // $A.util.addClass(group1Input2, 'slds-has-error');
        // }
        // if (group1Value3 == 0) {
        //     group1Value2 = 1;
        //     // errorMessages = errorMsg;
        //     // $A.util.addClass(group1Input3, 'slds-has-error');
        // }
        // if (group1Value4 == 0) {
        //     group1Value2 = 1;
        //     // errorMessages = errorMsg;
        //     // $A.util.addClass(group1Input4, 'slds-has-error');
        // }
        // if (group1Value5 == 0) {
        //     group1Value2 = 1;
        //     // errorMessages = errorMsg;
        //     // $A.util.addClass(group1Input5, 'slds-has-error');
        // }
        // if (group1Value6 == 0) {
        //     group1Value2 = 1;
        //     // errorMessages = errorMsg;
        //     // $A.util.addClass(group1Input6, 'slds-has-error');
        // }
        // if (group1Value7 == 0) {
        //     group1Value2 = 1;
        //     // errorMessages = errorMsg;
        //     // $A.util.addClass(group1Input7, 'slds-has-error');
        // }
        // if (group1Value8 == 0) {
        //     group1Value2 = 1;
        //     // errorMessages = errorMsg;
        //     // $A.util.addClass(group1Input8, 'slds-has-error');
        // }
        // if (group1Value9 == 0) {
        //     group1Value2 = 1;
        //     // errorMessages = errorMsg;
        //     // $A.util.addClass(group1Input9, 'slds-has-error');
        // }
        // if (group1Value10 == 0) {
        //     group1Value2 = 1;
        //     // errorMessages = errorMsg;
        //     // $A.util.addClass(group1Input10, 'slds-has-error');
        // }
        // if (group1Value11 == 0) {
        //     group1Value2 = 1;
        //     // errorMessages = errorMsg;
        //     // $A.util.addClass(group1Input11, 'slds-has-error');
        // }
        // if (group1Value12 == 0) {
        //     group1Value2 = 1;
        //     // errorMessages = errorMsg;
        //     // $A.util.addClass(group1Input12, 'slds-has-error');
        // }
        // if (group1Value13 == 0) {
        //     errorMessages = errorMsg;
        //     $A.util.addClass(group1Input13, 'slds-has-error');
        // }

        var commentInput = component.find("commentBox");
        var comment = component.find('commentBox').get("v.value");
        var alphaNumericRegex = /^([a-zA-Z0-9-\.\,\ ]+)$/g;

        debugger
        if (!$A.util.isEmpty(comment)){
            //var addWithoutApostrophe = comment.replace(new RegExp("\\\'","g"), '');
            var addWithoutApostrophe = comment.replaceAll("'", '');
            //var addWithoutApostrophe = comment.split("'").join('');
            //var d = b.join('');
            if(!alphaNumericRegex.test(addWithoutApostrophe)) {
                errorMessages = "Alphanumeric characters with following special characters are allowed i.e. (period, comma, apostrophe and space) in comment box";
            	$A.util.addClass(commentInput, 'slds-has-error');
            }
        } 

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
        } // if no error then make server call 
        else {
            
            debugger;
            helper.showSpinner(component);
            var action = component.get("c.createCase");

           //making request
            var caseObj = {
                SF_Program1__c				:		group1Value1 != 0 ? group1Value1 : 1,
                SF_Program2__c				:		group1Value2 != 0 ? group1Value2 : 1,
                SF_Program3__c				:		group1Value3 != 0 ? group1Value3 : 1,
                SF_Program4__c				:		group1Value4 != 0 ? group1Value4 : 1,
                SF_Program5__c              :       group1Value5 != 0 ? group1Value5 : 1,
                SF_Program6__c				:		group1Value6 != 0 ? group1Value6 : 1,
                SF_Program7__c	    		:		group1Value7 != 0 ? group1Value7 : 1,
                SF_Program8__c		        :		group1Value8 != 0 ? group1Value8 : 1,
                SF_Program9__c				:		group1Value9 != 0 ? group1Value9 : 1,
                SF_Program10__c				:		group1Value10 != 0 ? group1Value10 : 1,
                SF_Program11__c			    :		group1Value11 != 0 ? group1Value11 : 1,
                SF_Program12__c				: 		group1Value12 != 0 ? group1Value12 : 1,
                SF_Program13__c		        : 		group1Value13 != 0 ? group1Value13 : 1,
                SF_Comment__c		        : 		comment,
            };

            //wrapper object
            var wrapperObj = {
                acnt                :   acc,
                caseObj             :   caseObj
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
    }
})