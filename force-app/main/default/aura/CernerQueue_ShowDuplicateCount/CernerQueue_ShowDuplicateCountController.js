({
	doInit : function(component,event,helper)
    {
        var recordid = component.get('v.recordId');
        var action = component.get('c.geDuplicateRecCount');
        
        action.setParams({
          	  CQid : recordid
        }); 
        
        action.setCallback(this, function(response)
         {
            //store state of response
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var result=response.getReturnValue();
                //set response value
                component.set('v.DuplicateCount', result.duplicateCount);
                component.set('v.listViewId', result.listViewId);
            }
        });
        $A.enqueueAction(action); 
    },
    
    //show modal
      ShowModalBox: function(component, event, helper) 
    {      
        component.set("v.ShowModal", false); 
      	component.set("v.ShowModal", true);
  
    },
    
      //hide modal
    HideModalBox: function(component, event, helper)
    {
      component.set("v.ShowModal", false);
   },
    
    // show merge component
    callMergeComponent:function(component,event,helper)
    {
         component.set("v.showMergeComp", false);
         component.set("v.showMergeComp", true);
	},
    
    CreateNewAccount : function(component,event,helper)
    {
        debugger;
       //disable yes button
        component.set("v.isSpinner", true); 
        //show spinner
        helper.showSpinner(component); 

        var listViewId=component.get("v.listViewId");
        var recordid = component.get('v.recordId');
        var action = component.get('c.createAccount');
        
        action.setParams({
            CQid 	: 	recordid
        }); 
        
        action.setCallback(this, function(response)
         {
            //store state of response
            var state = response.getState();
            var result = response.getReturnValue();
            if (state === "SUCCESS") 
            {
                // set account id
				component.set("v.accnt", result);
               
                // hide first scenario features
                component.set("v.ShowFirstScenarioFeatures", false);

                //show second scenario features
                component.set("v.ShowSecondcenarioFeatures", true);
              
                //hide spinner
                helper.hideSpinner(component); 
   				
            }
         
         else if(state === "ERROR")
         {
             //hide spinner
                helper.hideSpinner(component); 
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
                        title : 'Error',
                        message: err,
                        duration:' 2000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'dismissible'
                    });
                   toastEvent.fire();
                }
        });
        $A.enqueueAction(action); 

    },
    
    // navigate user to created account
    NavToCreatedAccnt: function (component, row,action,Name) 
    {
        //get Account id
        var accntId=component.get('v.accnt'); 
        //open new tab with account record
        window.open("/lightning/r/Account/"+accntId.Id+'/view');
    },
    
    //close current cerner record tab and navigate user to cerner 'all' list view
      endProcess: function (component, row,action,Name) 
    {
        var listViewId=component.get("v.listViewId");
       	var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) 
          {
              var focusedTabId = response.tabId;
              workspaceAPI.closeTab({tabId: focusedTabId});
          })
         .catch(function(error) 
           {
                    console.log(error);
           });

        window.open("/lightning/o/Cerner_Queue__c/list?filterName="+listViewId,"_self"); 
        component.set("v.ShowModal", false); 
    }
})