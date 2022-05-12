({
    doInit : function(component, event) 
     {
        	var action = component.get("c.getPicklistValuesForLocation");
        	action.setCallback(this,function(response)
            {
            
 			var state = response.getState();
             if (state === "SUCCESS")
             {
               var resultData = response.getReturnValue();

                var langMap = [];
                var LanguageMapData = resultData.LanguageList;
                for(var key in LanguageMapData)
                {
                    langMap.push({value:LanguageMapData[key], key:key});
                }
                component.set("v.languageList", langMap);
                 
                var localeMap = [];
                var LocaleMapData = resultData.LocaleSidKeyList;
                 
                localeMap.push({value:'--None--', key:''}); 
                 
                for(var key in LocaleMapData)
                {
                    localeMap.push({value:LocaleMapData[key], key:key});
                }
                component.set("v.localeList", localeMap);
                 
                var timeZoneMap = [];
                var timeZoneMapData = resultData.TimeZoneSidKeyList;
                 
                timeZoneMap.push({value:'--None--', key:''}); 
                 
                for(var key in timeZoneMapData)
                {
                    timeZoneMap.push({value:timeZoneMapData[key], key:key});
                }
                component.set("v.timeZoneList", timeZoneMap);
                 
                // set default values for picklist
                window.setTimeout(
                $A.getCallback( function() {
                    component.find("LanguageLst").set("v.value", resultData.Language);
                    component.find("LocaleLst").set("v.value", resultData.LocaleSidKey);
                    component.find("timeZoneLst").set("v.value", resultData.TimeZoneSidKey);
                }));
              }
                
              if (state === "ERROR")
             {
                  var toastEvent = $A.get("e.force:showToast");
        			toastEvent.setParams({
                        title : 'SUCCESS',
                        message: response.getReturnValue(),
                        duration:' 5000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'dismissible'
                    });
                   toastEvent.fire();
             }
        });   

        $A.enqueueAction(action);
                   
    },
    
   
	showChangePasswordModal : function(component, event, helper) 
    {

      component.set("v.changePasswordModal", false); 
      component.set("v.changePasswordModal", true);
      
	},
    
    showChangeEmailModal : function(component, event, helper) 
    {

      component.set("v.changeEmailModal", false); 
      component.set("v.changeEmailModal", true);
      
	},
    
    showChangeUsernameModal : function(component, event, helper) 
    {

      component.set("v.changeUsernameModal", false); 
      component.set("v.changeUsernameModal", true);
      
	},
    
      save : function(component, event, helper) 
    { 
        var errorMessages = null;
        var userLocale = component.find("LocaleLst").get("v.value");
        var userTimeZone = component.find("timeZoneLst").get("v.value");
        
        if($A.util.isEmpty(userLocale) || $A.util.isEmpty(userTimeZone))
        {
              errorMessages = 'You must fill in all of the required fields';  
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
        
        else
        {
             component.set("v.isActive", true);
            //show spinner
            var spinner = component.find("mySpinner");
            $A.util.removeClass(spinner, "slds-hide");
        
            var action = component.get("c.saveUpdates");
            action.setParams({ 
                
                userLocale			 : 		userLocale, 
                userTimeZone		 :		userTimeZone
            });
            
            
        	action.setCallback(this,function(response)
            {
                var state = response.getState();  

                if(state === 'SUCCESS')
                {
                   //enable button
                    component.set("v.isActive", false);
                    //hide spinner
                    var spinner = component.find("mySpinner");
                    $A.util.addClass(spinner, "slds-hide");
            		
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'Success',
                        message: 'Updated Successfully.',
                        duration:' 1000',
                        key: 'info_alt',
                        type: 'success',
                        mode: 'dismissible'
                    });
                    toastEvent.fire();

                    $A.get('e.force:refreshView').fire();

            
          
                }
                
          if(state === 'ERROR')
          {
            //enable button
            component.set("v.isActive", false);
            //hide spinner
            var spinner = component.find("mySpinner");
            $A.util.addClass(spinner, "slds-hide"); 
              
            var error=response.getReturnValue();
            var toastEvent = $A.get("e.force:showToast");
        	toastEvent.setParams({
                        title : 'ERROR',
                        message: error,
                        duration:' 3000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'dismissible'
                    });
                   toastEvent.fire();
                }
   
        });       
        $A.enqueueAction(action);    
        }
    }
  
})