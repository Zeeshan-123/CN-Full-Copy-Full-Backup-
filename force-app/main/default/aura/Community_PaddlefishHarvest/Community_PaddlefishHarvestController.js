({
    doInit : function(component, event, helper){
        var action = component.get("c.getPaddleFishInfo"); 
        action.setCallback(this,function(response){
            var state = response.getState();
            debugger;
            if(state === "SUCCESS"){
                var resultData = response.getReturnValue(); 
                var riverSystemMap = []; 
                var riverSystemMapData = resultData.riverSystemMap; 
                for(var key in riverSystemMapData){
                    riverSystemMap.push({value:riverSystemMapData[key], key:key}); 
                    component.set("v.riverSystemList", riverSystemMap);
                }
               
            }

        });
        $A.enqueueAction(action);
    },
    
    formatNum : function(component, event){
        var fieldId = event.getSource().getLocalId();
        var fieldInput = component.find(fieldId);
        var val = fieldInput.get('v.value');        
        
        var inputValue = val.replace(/\D/g,'');
        console.log(inputValue);
        fieldInput.set('v.value', inputValue); 
    }, 
    
    clearError : function(component, event){
        var fieldId = event.getSource().getLocalId(); 
        var fieldInput = component.find(fieldId); 
        var val = fieldInput.get('v.value'); 
        console.log("Changed value is: " + val);
        if(val != undefined || val != ''){
            $A.util.removeClass(component.find(fieldId), 'slds-has-error');
        }
    },
    
    save: function(component, event, helper){
        console.log("running");
        debugger; 
        var usResident = component.get("v.usResidentValue");
        var checkBand = component.get("v.checkBandValue"); 
        var metalBand = component.get("v.metalBandValue");
        var CVCase = component.get("v.CVCase");
        var action = component.get("c.createPaddlefishCase");
        var harvestDateValue = component.get("v.harvestDateValue"); 
        component.set("v.CVCase.Is_Resident_of_US__c", usResident);
        component.set("v.CVCase.Was_Paddlefish_Checked__c", checkBand);
        component.set("v.CVCase.Did_Paddlefish_Have_Metal_Band__c", metalBand);
        component.set("v.CVCase.Date_Time_Of_Harvest__c", harvestDateValue);
        var errorExist = false; 
        debugger; 
        console.log('Date time of Harvest: ' + CVCase.Date_Time_Of_Harvest__c);
        
        var controlselectAuraIds1 = ["harvestDate", "usResident", "riverSystem", "checkPaddlefish", "metalBand"];
        debugger; 
        
        if(metalBand === 'true'){
            controlselectAuraIds1.push("metalBandNum");
            console.log('Add points');
            
        }
        debugger; 
        for(var i = 0; i < controlselectAuraIds1.length; i++) {
                        var fieldId1 = controlselectAuraIds1[i];
                        var cmpFindFieldId1 = component.find(fieldId1);
                        var fieldValue1 = cmpFindFieldId1.get("v.value");
                        if(fieldValue1 === undefined || fieldValue1 === '') {
                            $A.util.addClass(component.find(fieldId1), 'slds-has-error');
                            errorExist = true; 
                        }
            		
                    } 
        debugger; 
        
        console.log('Error? ' + errorExist);
		var d = new Date();
        //2021-12-30T03:21:00.000Z
        var today = $A.localizationService.formatDateTime(new Date());
        console.log(today);
        var d2 = new Date(harvestDateValue);
        	console.log(d2);   
        
       	
        
        debugger; 
        
        console.log(typeof harvestDateValue);
        console.log(typeof d);

        if(errorExist){
           helper.showErrorMessage(component, event, helper, 'Please complete all required fields');

        }
        
        else if(harvestDateValue === null || harvestDateValue === ''){
            helper.showErrorMessage(component, event, helper, 'You must enter a valid date.');
            errorExist = true; 
   
        }
        else if(d2 > d){
            helper.showErrorMessage(component, event, helper, 'Date/Time of Harvest cannot be in the future.');
            errorExist = true; 
        }
        
        
       console.log('Error Exists?' + errorExist);
        if(errorExist === false){
            console.log(harvestDateValue);
           component.set("v.CVCase.Date_Time_Of_Harvest__c", harvestDateValue);

            debugger; 
            action.setParams({
                CVCase : CVCase, 
                dateTimeValue : harvestDateValue
            });
            action.setCallback(this, function(response){
                var state = response.getState();
                debugger; 
                if(state === 'SUCCESS'){
                    var result = response.getReturnValue(); 
                    component.set("v.requestCreated", true);
                    component.set("v.createRequest", false);
                    component.set("v.requestNumber", result.Animal_Harvest_Request__c);
                }
                if(state === 'ERROR'){
                    var err = ''; 
                    var errors = response.getError(); 
                    errors.forEach(function (error){
                        if(error.message){
                            err = err + ' ' + error.message; 
                        } 
                        if(error.pageErrors){
                            error.pageErrors.forEach(function (pageError){
                                err = err + ' ' + pageError.message; 
                            });
                        }
                        if(error.fieldErrors){
                            for(var fieldName in error.fieldErrors){
                                error.fieldErrors[fieldNmae].forEach(function (errorList){
                                    err = err + ' ' + errorList.message, "Field error on " + fieldName + " : "; 
                                }); 
                            };
                        }
                    });
                    helper.showErrorMessage(component, event, helper, err);
                }
                
                
            });
        }
        
        $A.enqueueAction(action);
    }
})