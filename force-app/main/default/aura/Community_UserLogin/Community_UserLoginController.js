({
    doInit : function(component, event, helper) 
    {
        var userCheck = $A.get("$SObjectType.CurrentUser.Id");
        if (!$A.util.isUndefined(userCheck) || userCheck != null )
        {
            window.location.replace('/s/');
        }
        else
        {
            component.set("v.showLoginWindow", true);
        }
    },
    
    turnOffAutocomplete : function(component, event, helper) 
    {
        // debugger;
        
        var ue = document.getElementsByName("usrEmail");
        for (var j = 0; j < ue.length; j++)
        {
            var uef = ue[j];
            uef.setAttribute("autocomplete", "off");
        }
        
    },
    
    // login function  
    signin : function(component, event, helper)
    {
        var username = component.get('v.userName');
        var password = component.get('v.password');
        var errorMessage = '';
        var passwordError = '';
        // custom labels
        var userNameRequired = $A.get("$Label.c.Community_UsernameRequiredMessages");
        var passwordRequired = $A.get("$Label.c.Community_PasswordRequiredMessages");
        
        if($A.util.isEmpty(username)) 
        {
            errorMessage = userNameRequired + " ";
        }
        
        if($A.util.isEmpty(password)) 
        {
            if($A.util.isEmpty(errorMessage))
            {
                errorMessage = passwordRequired;
            }
            else{
                passwordError = passwordRequired;
            }
        }
        
        // display error
        if(!$A.util.isEmpty(errorMessage))
        {
            component.set("v.visible", true);
            component.set("v.error1", errorMessage);
            component.set("v.error2", passwordError);
        }
        
        // else make server call
        else{
            // CNHPHOMS-42/16/37: Added by Vikash - START
            let objPageHref = decodeURIComponent(window.location.href);
            var formType = objPageHref.includes('formType=') ? objPageHref.split('formType=')[1] : '';
            // CNHPHOMS-42/16/37: Added by Vikash - END
                        
            component.set("v.isActive", true);
            
            var action = component.get("c.login");
            action.setParams({ 
                username 	: username,
                password 	: password,
                formTypeVal : formType
            });
            action.setCallback(this,function(response){
                var state = response.getState();   
                
                if(response.getReturnValue() != 'SUCCESS' && username != '' && password != '') {
                    component.set("v.visible", true);
                    component.set("v.isActive", false);
                    component.set("v.error1", response.getReturnValue());
                    component.set("v.error2", '');
                }   
                if(state == "ERROR") {
                    var errors = response.getError();                       
                    alert(errors[0].message) ;    
                }
            });       
            $A.enqueueAction(action);
        }
    },
    
    // navigate to registeration page
    register: function (component, event, helper)
    {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": '/s/registration'
        });
        urlEvent.fire();
    },
    
    // close error alert box
    closeAlert: function (component, event, helper)
    {
        component.set("v.visible", false);
    },
    
    togglePassword : function(component, event, helper) 
    {
        if(component.get("v.showpassword",true))
        {
            component.set("v.showpassword",false);
        }
        else
        {
            component.set("v.showpassword",true);
        }
    }
})