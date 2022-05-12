({
    scriptsLoaded : function(component, event, helper) {
        console.log('Script loaded..'); 
    },
    handleClick : function(component,event,helper) {
        component.set("v.truthy2",false);
        component.set("v.truthy",false);
        var start = component.get("v.StartDate");
        var end = component.get("v.EndDate");
        var action = component.get('c.fetchPLA');
        action.setParams({"startdateNew" : start, "EnddateNew" : end,"ContactOrCase": 'Contact'}); 
        action.setCallback(this, function(response) {
            //store state of response
            var state = response.getState();
            if (state === "SUCCESS") {
                
                window.setTimeout(
                    $A.getCallback(function() {
                        component.set("v.truthy2",true);
                        setTimeout(function(){ 
                            helper.plotgraph(component, response.getReturnValue(),'linechart2');  
                        }, 500);         
                    })
                    ,500);
            }
        });
        $A.enqueueAction(action);
        
        var start = component.get("v.StartDate");
        var end = component.get("v.EndDate");
        action = component.get('c.fetchPLA');
        action.setParams({"startdateNew" : start, "EnddateNew" : end,"ContactOrCase": 'Case'}); 
        action.setCallback(this, function(response) {
            //store state of response
            var state = response.getState();
            if (state === "SUCCESS") {
                
                window.setTimeout(
                    $A.getCallback(function() {
                        component.set("v.truthy",true);
                        setTimeout(function(){ 
                            helper.plotgraph(component, response.getReturnValue(),'linechart');  
                        }, 500);         
                    })
                    ,500);
            }
        });
        $A.enqueueAction(action);
    },
    doInit : function(component,event,helper){
        //call apex class method
        var startdate = component.get('c.startdate');
        startdate.setCallback(this, function(response) {
            //store state of response
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set('v.StartDate', response.getReturnValue());
            }});
        $A.enqueueAction(startdate); 
        //call apex class method
        var enddate = component.get('c.enddate');
        enddate.setCallback(this, function(response) {
            //store state of response
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set('v.EndDate', response.getReturnValue());
            }});
        $A.enqueueAction(enddate); 
        //call apex class method
        var action = component.get('c.fetchPLA');
        action.setParams({"ContactOrCase" : "Case"}); 
        action.setCallback(this, function(response) {
            //store state of response
            var state = response.getState();
            if (state === "SUCCESS") {
                helper.plotgraph(component, response.getReturnValue(),'linechart');
            }
        });
        $A.enqueueAction(action); 
        action = component.get('c.fetchPLA');
        action.setParams({"ContactOrCase" : "Contact"}); 
        action.setCallback(this, function(response) {
            //store state of response
            var state = response.getState();
            if (state === "SUCCESS") {
                helper.plotgraph(component, response.getReturnValue(),'linechart2');
            }
        });
        $A.enqueueAction(action); 
    }
})