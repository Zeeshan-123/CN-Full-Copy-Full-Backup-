({
     
  doInit : function(component, event, helper) 
    {
        
		// get  Branch Service picklist values     
        var action = component.get("c.getBranchServicePl");
        	action.setCallback(this,function(response)
            {
               
                var state = response.getState();   
                if (state === "SUCCESS")
                {
                var result = response.getReturnValue();
                component.set("v.branchServiceList", result.BranchServicePlValues);
                component.set("v.EnlistmentYearPicklist", result.EnlistmentYear);
                component.set("v.EnlistmentMonthPicklist", result.EnlistmentMonth);
                component.set("v.NumOfServiceYearsPicklist", result.NumOfServiceYears);
                component.set("v.NumOfServiceMonthsPicklist", result.NumOfServiceMonths);
            }
    
        });       
        
        $A.enqueueAction(action);
    },
    
	HideMe: function(component, event, helper)
    {
      component.set("v.ShowModule", false);
   },

    
   ShowModuleBox: function(component, event, helper) 
    {
      component.set("v.ShowModule", true);
   },
    
      
    createVetRecord: function(component, event, helper)
    {
        //disable submitt button
        component.set("v.isSpinner", true); 
        //show spinner
        helper.showSpinner(component); 
        
        var errorMessages = null;
        var space=" ";
        var serviceDuration = "";
        //get fields
        var serviceBranch = component.find("serviceBranch").get("v.value");
        var serviceStartyear = component.find("yearPl").get("v.value"); 
        var serviceStartmonth = component.find("monthPl").get("v.value"); 
        var Durationyear = component.find("yearDuration").get("v.value");
        var DurationMonths = component.find("monthDuration").get("v.value"); 
		var combatVeteran = component.get("v.isCombatVet");
       
        var serviceStartyearCheck=parseInt(serviceStartyear);
        var dte = new Date();
 		var currentYear = dte.getFullYear();
        
         //is Service Branch value is empty?
        if($A.util.isEmpty(serviceBranch)) 
        {
    		errorMessages = 'Select a value for service branch.';
    	}
       
      
        //is year for start of enlistment is empty?
        if($A.util.isEmpty(serviceStartyear)) 
        {
            if(errorMessages == null)
            {
                errorMessages='Must select a year for start to enlistment.';
            }
            else
            {
            	errorMessages +=" "+'Must select a year for start to enlistment.';
            }
        }
        
        
        //is year for start of enlistment year is greater than current year?
        if(serviceStartyearCheck > currentYear)
        {
            if(errorMessages == null)
            {
                errorMessages='Enlistment year can not be a future value.';
            }
            else
            {
            	errorMessages +=" "+'Enlistment year can not be a future value.';
            }
        }
        
        
         //is month for start of enlistment is empty?
        if($A.util.isEmpty(serviceStartmonth)) 
        {
            if(errorMessages == null)
            {
                errorMessages='Must select a month for start to enlistment.';
            }
            else
            {
            	errorMessages +=" "+'Must select a month for start to enlistment.';
            }
        }
        
		  //is years for service period is empty?
        if($A.util.isEmpty(Durationyear)) 
        {
            if(errorMessages == null)
            {
                errorMessages='Years for service period is a required field.';
            }
            else
            {
            	errorMessages +=" "+'Years for service period is a required field.';
            }
        }
      
        
         // is there any error message?
        if(errorMessages != null)
        {
            //enable submitt button
        	component.set("v.isSpinner", false); 
            helper.hideSpinner(component); 
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
        
        //make server call
       else
       {
        var action = component.get("c.createVeterantRecord");
            //Set method parameters
            action.setParams({
                serviceBranch 			: serviceBranch,
                startToEnlistmentYear	: serviceStartyear,
                startToEnlistmentMonth	: serviceStartmonth,
                serviceDurationYear		: Durationyear,
                serviceDurationMonth	: DurationMonths,
                combatVet		 	 	: combatVeteran
        });
        
                    
            action.setCallback(this,function(response)
           {
                var state = response.getState();
                if (state === "SUCCESS") 
                {
                     //hide spinner
                      helper.hideSpinner(component); 
   					  //showing toast event on success
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'Success',
                        message: $A.get("$Label.c.Community_RecordCreatedSuccessMessage"),
                        duration:' 1000',
                        key: 'info_alt',
                        type: 'success',
                        mode: 'pester'
                    });
                    toastEvent.fire();
                  component.set("v.ShowModule", false); 
                  $A.get('e.force:refreshView').fire();
                    
                }
               
                else if (state === "ERROR")
                {
                var errors = response.getError();
                alert('error is '+errors[0].message);
                  //hide spinner
                      helper.hideSpinner(component); 
           		 }
               
            });
            $A.enqueueAction(action); 
       }
   },


})