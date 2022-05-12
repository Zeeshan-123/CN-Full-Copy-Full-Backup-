({
    //Check Mark for delete on previously selected row
	MarkforDeletePS: function (component, row) {
    	var AccountsC1 = component.get('v.AccountsC1');
        var AccountsC2 = component.get('v.AccountsC2');
        var AccountsC3 = component.get('v.AccountsC3');
        for(var i = 0; i < AccountsC1.length; i++){
            if(AccountsC1[i].Id == row )
                AccountsC1[i].Marked_for_Delete__c='Yes';
        }
        for(var i = 0; i < AccountsC2.length; i++){
            if(AccountsC2[i].Id == row )
                AccountsC2[i].Marked_for_Delete__c='Yes';
        }
        for(var i = 0; i < AccountsC3.length; i++){
            if(AccountsC3[i].Id == row )
                AccountsC3[i].Marked_for_Delete__c='Yes';
        }
        component.set("v.AccountsC1", AccountsC1);
        component.set("v.AccountsC2", AccountsC2);
        component.set("v.AccountsC3", AccountsC3);
    },
    //Row Marked for delete status update
	editRowStatus: function (component, row,action,Name) {
        var Aid=row.Id;
        var Marked_for_Delete;
        if(Name=='C1')
        	var Accounts = component.get('v.AccountsC1');
        if(Name=='C2')
            var Accounts = component.get('v.AccountsC2');
        if(Name=='C3')
            var Accounts = component.get('v.AccountsC3');
        for(var i = 0; i < Accounts.length; i++){
            if(Accounts[i].Id == row.Id ){ 
                if(Accounts[i].Marked_for_Delete__c=='Yes')
                    Accounts[i].Marked_for_Delete__c='No';
                else
                    Accounts[i].Marked_for_Delete__c='Yes';
                Marked_for_Delete=Accounts[i].Marked_for_Delete__c;
            }
        }
        if(Name=='C1')
        	component.set("v.AccountsC1", Accounts);
        if(Name=='C2')
        	component.set("v.AccountsC2", Accounts);
        if(Name=='C3')
        	component.set("v.AccountsC3", Accounts);
        //console.log(Aid+' '+Marked_for_Delete);
        /*var action = component.get('c.UpdateMFD');
        action.setParams({"Accountid" : Aid, "status" : Marked_for_Delete}); 
        action.setCallback(this, function(response) {
            //store state of response
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log('Success');
            }
        });
        
        $A.enqueueAction(action);*/
    },
    //Row Marked for delete status update
    editselectedRowStatus: function (component,Name) {
        var oldAid=component.get('v.oldSelectedAccount');
        var Aid=component.get('v.SelectedAccount');
        var Marked_for_Delete;
        if(Name=='C1')
        	var Accounts = component.get('v.AccountsC1');
        if(Name=='C2')
            var Accounts = component.get('v.AccountsC2');
        if(Name=='C3')
            var Accounts = component.get('v.AccountsC3');
        for(var i = 0; i < Accounts.length; i++){
            if(Accounts[i].Id == Aid ){ 
                if(Accounts[i].Marked_for_Delete__c=='Yes')
                    Accounts[i].Marked_for_Delete__c='No';
                Accounts[i].Disabled__c=true;
            	Marked_for_Delete=Accounts[i].Marked_for_Delete__c;
            }
        }
        if(Name=='C1')
        	component.set("v.AccountsC1", Accounts);
        if(Name=='C2')
        	component.set("v.AccountsC2", Accounts);
        if(Name=='C3')
        	component.set("v.AccountsC3", Accounts);
        /*
        var action = component.get('c.UpdateMFD');
        action.setParams({"Accountid" : Aid, "status" : Marked_for_Delete}); 
        action.setCallback(this, function(response) {
            //store state of response
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log('Success');
            }
        });
        $A.enqueueAction(action);
        */
        var AccountsC1 = component.get('v.AccountsC1');
        var AccountsC2 = component.get('v.AccountsC2');
        var AccountsC3 = component.get('v.AccountsC3');
        for(var i = 0; i < AccountsC1.length; i++){
            if(AccountsC1[i].Id == oldAid )
                AccountsC1[i].Disabled__c=false;
        }
        for(var i = 0; i < AccountsC2.length; i++){
            if(AccountsC2[i].Id == oldAid )
                AccountsC2[i].Disabled__c=false;
        }
        for(var i = 0; i < AccountsC3.length; i++){
            if(AccountsC3[i].Id == oldAid )
                AccountsC3[i].Disabled__c=false;
        }
        component.set("v.AccountsC1", AccountsC1);
        component.set("v.AccountsC2", AccountsC2);
        component.set("v.AccountsC3", AccountsC3);
    },
    redirecttoAc: function (component, row,action,Name) {
        var Aid=row.Id;
        window.open("/lightning/r/Account/"+Aid+'/view');
    }
})