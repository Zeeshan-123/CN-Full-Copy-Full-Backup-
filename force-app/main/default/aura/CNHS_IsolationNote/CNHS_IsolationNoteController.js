({
    doInit : function(component, event) {
        // get id from url
        var queryString = 	window.location.search;
        var rid			= 	location.search.split('Id=')[1];
        var action = component.get("c.getAccountData");
        action.setParams({ 
            accId 		: rid
        });
        
        action.setCallback(this,function(response){
            var state = response.getState();
            if (state === "SUCCESS"){
                debugger;
                var resultData = response.getReturnValue();
                component.set("v.acnt", resultData);
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
    performPrint: function(component, event, helper){
       setTimeout(function(){
            //document.execCommand('print');
            window.print();
        }, 300);
    },
})