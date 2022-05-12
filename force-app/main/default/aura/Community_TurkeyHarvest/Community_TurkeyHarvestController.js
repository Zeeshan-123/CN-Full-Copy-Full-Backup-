({
    doInit : function(component, event, helper){
        var action = component.get("c.getTurkeyHarvestInfo"); 
        action.setCallback(this,function(response){
            var state = response.getState();
            debugger; 
            if(state === "SUCCESS"){
                var resultData = response.getReturnValue(); 
                var landTypeMap = []; 
                var landTypeMapData = resultData.landTypeMap; 
                for(var key in landTypeMapData){
                    landTypeMap.push({value:landTypeMapData[key], key:key}); 
                    component.set("v.landTypeList", landTypeMap);
                }
                
                var methodMap = []; 
                var methodMapData = resultData.methodMap; 
                console.log(methodMapData);
                for(var key in methodMapData){
                    methodMap.push({value:methodMapData[key], key:key}); 
                    component.set("v.methodList", methodMap);
                }
                
                var ageGroupMap = []; 
                var ageGroupMapData = resultData.ageGroupMap; 
                for(var key in ageGroupMapData){
                    ageGroupMap.push({value:ageGroupMapData[key], key:key}); 
                    component.set("v.ageGroupList", ageGroupMap);
                }
                
                var countyMap = []; 
                var countyMapData = resultData.countyMap; 
                for(var key in countyMapData){
                    countyMap.push({value:countyMapData[key], key:key}); 
                    component.set("v.countyList", countyMap);
                }
                
                var beardlengthMap = []; 
                var beardlengthData = resultData.beardlength; 
                for(var key in beardlengthData){
                    beardlengthMap.push({value:beardlengthData[key], key:key}); 
                    component.set("v.beardlengthList", beardlengthMap);
                }
                
                var spurlengthMap = []; 
                var spurlengthData = resultData.spurlength; 
                for(var key in spurlengthData){
                    spurlengthMap.push({value:spurlengthData[key], key:key}); 
                    component.set("v.spurlengthList", spurlengthMap);
                }
                
                var turkeygenderMap = []; 
                var turkeygenderData = resultData.turkeygender; 
                for(var key in turkeygenderData){
                    turkeygenderMap.push({value:turkeygenderData[key], key:key}); 
                    component.set("v.turkeygenderList", turkeygenderMap);
                }
                console.log(turkeygenderData);
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
        var antlerStatus = component.get("v.radioValue");
        var CVCase = component.get("v.CVCase");
        var action = component.get("c.createTurkeyHarvestCase");
        var harvestDateValue = component.get("v.harvestDateValue"); 
        component.set("v.CVCase.Is_the_Deer_Antlered__c", antlerStatus);
        component.set("v.CVCase.Date_Time_Of_Harvest__c", harvestDateValue);
        var errorExist = false; 
        debugger; 
        console.log('Date time of Harvest: ' + CVCase.Date_Time_Of_Harvest__c);
        console.log('Antler Status: ' + antlerStatus);
        console.log('Land Type' + CVCase.Land_Type__c);
        
        var controlselectAuraIds1 = ["harvestDate", "landType", "methodOfHarvest", "beardlength", "spurlength", "countyHarvest", "turkeygender"];
        debugger; 
        if(component.find("LandTypeOther")){
            controlselectAuraIds1.push("LandTypeOther");
        }
        
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
    },
    onChangeLandtype: function (component, event, helper) {
        debugger;
        
        var fieldId = event.getSource().getLocalId(); 
        var fieldInput = component.find(fieldId); 
        var val = fieldInput.get('v.value'); 
        if(val=='Other'){
            component.set("v.ShowOtherLandtypefiled", true);    
        }else{
            component.set("v.ShowOtherLandtypefiled", false);    
        }
        console.log("Changed value is: " + val);
        if(val != undefined || val != ''){
            $A.util.removeClass(component.find(fieldId), 'slds-has-error');
        }
        
    }
})