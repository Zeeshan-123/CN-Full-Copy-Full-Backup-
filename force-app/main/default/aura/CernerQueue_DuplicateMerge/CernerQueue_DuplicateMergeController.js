({
    //handle record selected from first list
    updateSelectedrecordc1 : function(component, event,helper) {
        var selectedRow = event.getParam('selectedRows'); 
     
        if (selectedRow.length > 0)
        {
            component.set('v.t1HasData',true);
            var tablTwoHasData=component.get('v.t2HasData');
            var tablThreeHasData=component.get('v.t3HasData');
          	var prevselectedrow;
           // does table two contains data?
            if(tablTwoHasData)
            {
                // clear table two data
                var selectedrow=component.find("tblTwo").get("v.selectedRows");
                if(selectedrow.length>0)
                    prevselectedrow=selectedrow[0];
 				component.find("tblTwo").set("v.selectedRows", '');
            }
            
            // does table three contains data?
             if(tablThreeHasData)
            {
                // clear table three data
                var selectedrow=component.find("tblThree").get("v.selectedRows");
                if(selectedrow.length>0)
                    prevselectedrow=selectedrow[0];
 				component.find("tblThree").set("v.selectedRows", '');
            }
            if(prevselectedrow!=undefined)
                helper.MarkforDeletePS(component,prevselectedrow);
        }
        else
        {
            component.set('v.t1HasData',false);
        }
        component.set('v.AllowNext',true);
        component.set('v.oldSelectedAccount', component.get('v.SelectedAccount'));
        component.set('v.SelectedAccount',selectedRow[0].Id);
        //console.log(selectedRow[0].Id);
        helper.editselectedRowStatus(component,'C1');
        
    },
    //handle record selected from second list
    updateSelectedrecordc2 : function(component, event,helper) {
        var selectedRow = event.getParam('selectedRows'); 
        if (selectedRow.length > 0)
        {
            component.set('v.t2HasData',true);
            var tablOneHasData =component.get('v.t1HasData');
           	var tablThreeHasData=component.get('v.t3HasData');
			var prevselectedrow;            
            // does table one contains data?
            if(tablOneHasData)
            {
                // clear table one data
                var selectedrow=component.find("tblOne").get("v.selectedRows");
                if(selectedrow.length>0)
                    prevselectedrow=selectedrow[0];
 				component.find("tblOne").set("v.selectedRows", '');
            }
            
             // does table three contains data?
              if(tablThreeHasData)
            {
                // clear table three data
                var selectedrow=component.find("tblThree").get("v.selectedRows");
                if(selectedrow.length>0)
                    prevselectedrow=selectedrow[0];
 				component.find("tblThree").set("v.selectedRows", '');
            }
            if(prevselectedrow!=undefined)
                helper.MarkforDeletePS(component,prevselectedrow);
        }
          else
          {
            component.set('v.t2HasData',false);
        }
        component.set('v.AllowNext',true);
        component.set('v.oldSelectedAccount', component.get('v.SelectedAccount'));
        component.set('v.SelectedAccount',selectedRow[0].Id);
        //console.log(selectedRow[0].Id);
        helper.editselectedRowStatus(component,'C2');
    },
    //handle record selected from third list
    updateSelectedrecordc3 : function(component, event,helper) {
        var selectedRow = event.getParam('selectedRows'); 
        if (selectedRow.length > 0)
        {
            component.set('v.t3HasData',true);
            var tablOneHasData =component.get('v.t1HasData');
           	var tablTwoHasData=component.get('v.t2HasData');
            var prevselectedrow;
            // does table one contains data?
            if(tablOneHasData)
            {
                // clear table one data
                var selectedrow=component.find("tblOne").get("v.selectedRows");
                if(selectedrow.length>0)
                    prevselectedrow=selectedrow[0];
 				component.find("tblOne").set("v.selectedRows", '');
            }
            
             // does table two contains data?
              if(tablTwoHasData)
            {
                // clear table two data
                var selectedrow=component.find("tblTwo").get("v.selectedRows");
                if(selectedrow.length>0)
                    prevselectedrow=selectedrow[0];
 				component.find("tblTwo").set("v.selectedRows", '');
            }
            if(prevselectedrow!=undefined)
                helper.MarkforDeletePS(component,prevselectedrow);
        }
          else
          {
            component.set('v.t3HasData',false);
        }
        component.set('v.AllowNext',true);
        component.set('v.oldSelectedAccount', component.get('v.SelectedAccount'));
        component.set('v.SelectedAccount',selectedRow[0].Id);
        //console.log(selectedRow[0].Id);
        helper.editselectedRowStatus(component,'C3');
    },
    //init function
    doInit : function(component,event,helper){
        
        component.set('v.AccountColumns', [{
                label: 'Name',
            	initialWidth: 170,
                fieldName: 'Name',
                type: 'text'
            },
            {
                label: 'DOB',
                fieldName: 'Date_of_Birth__c',
                initialWidth: 100,
                type: 'date-local'
            },
            {
                label: 'Contact or Case',
                fieldName: 'Contact_OR_Case__pc',
                type: 'text'
            },
            {
                label: 'Latest Test Date',
                fieldName: 'Test_Date__c',
                initialWidth: 190,
                type: 'date', typeAttributes: {  
                            day: 'numeric',  
                            month: 'short',  
                            year: 'numeric',  
                            hour: '2-digit',  
                            minute: '2-digit',  
                            second: '2-digit',  
                            hour12: true}
            },
            {
                label: 'Days passed after the first test?',
                fieldName: 'Days_passed_after_first_test__c',
                type: 'text'
            },
            {
                label: 'Active or Inactive?',
                fieldName: 'Case_Status__c',
                type: 'text'
            },
            {
                label: 'Phone',
                fieldName: 'Phone',
                type: 'text'
            },
            {
                label: 'MRN',
                fieldName: 'MRN__c',
                type: 'text'
            },
            {
                label: 'Marked for Delete', type: 'button',initialWidth: 130, typeAttributes:
                { label: { fieldName: 'Marked_for_Delete__c'}, title: 'Click to Edit', name: 'edit_status', iconName: 'utility:edit',disabled: {fieldName: 'Disabled__c'}, class: 'btn_next'}
            },
                                           {
                label: 'View Details', type: 'button', initialWidth: 100, typeAttributes:
                { label:'View',   title: 'View', name: 'view_Details'}                             
            },
        ]);
        
        component.set('v.CQColumns', [{
                label: 'First Name',
            	initialWidth: 170,
                fieldName: 'First_Name__c',
                type: 'text'
            },
            {
                label: 'Middle Name',
                fieldName: 'Middle_Name__c',
                type: 'text'
            },
            {
                label: 'Last Name',
                fieldName: 'Last_Name__c',
                type: 'text'
            },
            {
                label: 'Test Date',
                fieldName: 'Applies_Date_Time__c',
                initialWidth: 200,
                type: 'date', typeAttributes: {  
                            day: 'numeric',  
                            month: 'short',  
                            year: 'numeric',  
                            hour: '2-digit',  
                            minute: '2-digit',  
                            second: '2-digit',  
                            hour12: true}
            },
            {
                label: 'DOB',
                fieldName: 'Date_of_Birth__c',
                type: 'date-local'
            },
            {
                label: 'Phone',
                fieldName: 'Phone__c',
                type: 'text'
            },
            {
                label: 'MRN',
                fieldName: 'MRN__c',
                type: 'text'
            }
        ]);
        //Get matching accounts
        var recordid = component.get('v.recordId');
        var action1 = component.get('c.getDuplicatesCriteria1');
        action1.setParams({"CQid" : recordid}); 
        action1.setCallback(this, function(response) {
            //store state of response
            var state = response.getState();
            if (state === "SUCCESS") {
                //set response value in lstPLA attribute on component.
                component.set('v.AccountsC1', response.getReturnValue());
                //console.log(response.getReturnValue());
            }
        });
        $A.enqueueAction(action1); 
        var action2 = component.get('c.getDuplicatesCriteria2');
        action2.setParams({"CQid" : recordid}); 
        action2.setCallback(this, function(response) {
            //store state of response
            var state = response.getState();
            if (state === "SUCCESS") {
                //set response value in lstPLA attribute on component.
                component.set('v.AccountsC2', response.getReturnValue());
                //console.log(response.getReturnValue());
            }
        });
        $A.enqueueAction(action2);
        var action3 = component.get('c.getDuplicatesCriteria3');
        action3.setParams({"CQid" : recordid}); 
        action3.setCallback(this, function(response) {
            //store state of response
            var state = response.getState();
            if (state === "SUCCESS") {
                //set response value in lstPLA attribute on component.
                component.set('v.AccountsC3', response.getReturnValue());
                //console.log(response.getReturnValue());
            }
        });
        $A.enqueueAction(action3);
                                           
        var setCQr = component.get('c.GetCQrecord');
        setCQr.setParams({"Recordid" : recordid}); 
        setCQr.setCallback(this, function(response) {
            //store state of response
            var state = response.getState();
            if (state === "SUCCESS") {
                //set response value in lstPLA attribute on component.
                component.set('v.SelectedCernerQueueR', response.getReturnValue());
                //component.set('v.SelectedCernerQueueRL', response.getReturnValue());
            }
        });
        $A.enqueueAction(setCQr);
        var setCQrL = component.get('c.GetCQrecordList');
        setCQrL.setParams({"Recordid" : recordid}); 
        setCQrL.setCallback(this, function(response) {
            //store state of response
            var state = response.getState();
            if (state === "SUCCESS") {
                //set response value in lstPLA attribute on component.
                //component.set('v.SelectedCernerQueueR', response.getReturnValue());
                component.set('v.SelectedCernerQueueRL', response.getReturnValue());
            }
        });
        $A.enqueueAction(setCQrL);
        
        var getlv = component.get('c.getlistview');
        getlv.setCallback(this, function(response) {
            //store state of response
            var state = response.getState();
            if (state === "SUCCESS") {
                //set response value in lstPLA attribute on component.
                //component.set('v.SelectedCernerQueueR', response.getReturnValue());
                component.set('v.listviewid', response.getReturnValue());
            }
        });
        $A.enqueueAction(getlv);
                                           
        // for Display Model,set the "isOpen" attribute to "true"
      component.set("v.isOpen", true);
        
    },
    //to handle row action on first list
    handleRowActionC1: function (component, event, helper) {
        var action = event.getParam('action');
        var row = event.getParam('row');
        //console.log(row.Id);                    
		//console.log(action.name);
        switch (action.name) {
            case 'edit_status':
                helper.editRowStatus(component, row, action,'C1');
                break;
            case 'view_Details':
                helper.redirecttoAc(component, row, action);
                break;                           
			default:
                break;
        }
    },
    //to handle row action on second list
    handleRowActionC2: function (component, event, helper) {
        var action = event.getParam('action');
        var row = event.getParam('row');
        //console.log(row.Id);                    
		//console.log(action.name);
        switch (action.name) {
            case 'edit_status':
                helper.editRowStatus(component, row, action,'C2');
                break;
            case 'view_Details':
                helper.redirecttoAc(component, row, action);
                break;  
			default:
                break;
        }
    },
    //to handle row action on third list
    handleRowActionC3: function (component, event, helper) {
        var action = event.getParam('action');
        var row = event.getParam('row');
        //console.log(row.Id);                    
		//console.log(action.name);
        switch (action.name) {
            case 'edit_status':
                helper.editRowStatus(component, row, action,'C3');
                break;
            case 'view_Details':
                helper.redirecttoAc(component, row, action);
                break;  
			default:
                break;
        }
    },
    
   closeModel: function(component, event, helper) {
    // for Hide/Close Model,set the "isOpen" attribute to "False"  
      component.set("v.isOpen", false);
   },
 	//clicked on next button
    moveNext : function(component,event,helper){
     // control the next button based on 'currentStep' attribute value    
     var getCurrentStep = component.get("v.currentStep");
        
        //Move to the second screen
        if(getCurrentStep == "1"){
                           
            var Aid=component.get('v.SelectedAccount');                               
            var setAr = component.get('c.GetAccountrecord');
        	setAr.setParams({"Recordid" : Aid}); 
        	setAr.setCallback(this, function(response) {
                //store state of response
                var state = response.getState();
                if (state === "SUCCESS") {
                    //set response value in lstPLA attribute on component.
                    component.set('v.SelectedAccountR',response.getReturnValue() );
                    var account = response.getReturnValue();                                           
                    var CernerQueue=component.get('v.SelectedCernerQueueR');
                    var AFname=account.FirstName;
                    var CQFname;
                    if(CernerQueue.Middle_Name__c!=null)
                                           CQFname=CernerQueue.First_Name__c+' '+CernerQueue.Middle_Name__c;
                    else 
                                           CQFname=CernerQueue.First_Name__c;
                    var AcDOB,CQDOB;
                    if(account.Date_of_Birth__c!=null)
                    AcDOB=$A.localizationService.formatDate(account.Date_of_Birth__c, "MM/DD/YYYY");
                    if(CernerQueue.Date_of_Birth__c!=null)
        			CQDOB=$A.localizationService.formatDate(CernerQueue.Date_of_Birth__c, "MM/DD/YYYY");
                                           
                    var FNameOps =  [{'label': CQFname, 'value': 'CQ'+CQFname},{'label': AFname, 'value': 'AC'+AFname}];
                    component.set('v.FNameOps',FNameOps); 
                        component.set('v.FName','CQ'+CQFname);
        			
        			var LNameOps =  [{'label': CernerQueue.Last_Name__c, 'value': 'CQ'+CernerQueue.Last_Name__c},{'label': account.LastName, 'value': 'AC'+account.LastName}];
        			component.set('v.LNameOps',LNameOps); 
                        component.set('v.LName','CQ'+CernerQueue.Last_Name__c);
        
        			var MRNOps =  [{'label': CernerQueue.MRN__c, 'value': 'CQ'+CernerQueue.MRN__c},{'label': account.MRN__c, 'value': 'AC'+account.MRN__c}];
        			component.set('v.MRNOps',MRNOps); 
        			if(account.MRN__c==undefined && CernerQueue.MRN__c!=undefined)
                        component.set('v.MRN','CQ'+CernerQueue.MRN__c);
        			else
        				component.set('v.MRN','AC'+account.MRN__c); 
        
        			var DOBOps =  [{'label': CQDOB, 'value': 'CQ'+CernerQueue.Date_of_Birth__c},{'label': AcDOB, 'value': 'AC'+account.Date_of_Birth__c}];
        			component.set('v.DOBOps',DOBOps);
        			if(account.Date_of_Birth__c==undefined && CernerQueue.Date_of_Birth__c!=undefined)
                        component.set('v.DOB','CQ'+CernerQueue.Date_of_Birth__c);
        			else
        				component.set('v.DOB','AC'+account.Date_of_Birth__c); 
        
        			var GenderOps =  [{'label': CernerQueue.Gender_Code__c, 'value': 'CQ'+CernerQueue.Gender_Code__c},{'label': account.HealthCloudGA__Gender__pc , 'value': 'AC'+account.HealthCloudGA__Gender__pc }];
        			component.set('v.GenderOps',GenderOps); 
        			if(account.HealthCloudGA__Gender__pc ==undefined && CernerQueue.Gender_Code__c!=undefined)
                        component.set('v.Gender','CQ'+CernerQueue.Gender_Code__c);
        			else
        				component.set('v.Gender','AC'+account.HealthCloudGA__Gender__pc );
        
        			//var MaritalStatusOps =  [{'label': CernerQueue.Marital_Status__c, 'value': 'CQ'+CernerQueue.Marital_Status__c},{'label': account.Marital_Status__c, 'value': 'AC'+account.Marital_Status__c}];
        			//component.set('v.MaritalStatusOps',MaritalStatusOps);
        			//if(account.Marital_Status__c==undefined && CernerQueue.Marital_Status__c!=undefined)
                    //    component.set('v.MaritalStatus','CQ'+CernerQueue.Marital_Status__c);
        			//else
        			//	component.set('v.MaritalStatus','AC'+account.Marital_Status__c);
        
        			var PhoneOps =  [{'label': CernerQueue.Phone__c, 'value': 'CQ'+CernerQueue.Phone__c},{'label': account.Phone, 'value': 'AC'+account.Phone}];
        			component.set('v.PhoneOps',PhoneOps); 
        			if(account.Phone==undefined && CernerQueue.Phone__c!=undefined)
                        component.set('v.Phone','CQ'+CernerQueue.Phone__c);
        			else
        				component.set('v.Phone','AC'+account.Phone);
                    
                    var MobileOps =  [{'label': CernerQueue.Mobile_Phone__c, 'value': 'CQ'+CernerQueue.Mobile_Phone__c},{'label': account.PersonMobilePhone, 'value': 'AC'+account.PersonMobilePhone}];
        			component.set('v.MobileOps',MobileOps); 
        			if(account.PersonMobilePhone==undefined && CernerQueue.Mobile_Phone__c!=undefined)
                        component.set('v.Mobile','CQ'+CernerQueue.Mobile_Phone__c);
        			else
        				component.set('v.Mobile','AC'+account.PersonMobilePhone);
        
        			var EmailOps =  [{'label': CernerQueue.Email__c, 'value': 'CQ'+CernerQueue.Email__c},{'label': account.PersonEmail, 'value': 'AC'+account.PersonEmail}];
        			component.set('v.EmailOps',EmailOps); 
        			if(account.PersonEmail==undefined && CernerQueue.Email__c!=undefined)
                        component.set('v.Email','CQ'+CernerQueue.Email__c);
        			else
        				component.set('v.Email','AC'+account.PersonEmail);
        
        			var StreetOps =  [{'label': CernerQueue.Street__c, 'value': 'CQ'+CernerQueue.Street__c},{'label': account.PersonMailingStreet, 'value': 'AC'+account.PersonMailingStreet}];
        			component.set('v.StreetOps',StreetOps); 
        			if(account.PersonMailingStreet==undefined && CernerQueue.Street__c!=undefined)
                        component.set('v.Street','CQ'+CernerQueue.Street__c);
        			else
        				component.set('v.Street','AC'+account.PersonMailingStreet); 
        
        			var CityOps =  [{'label': CernerQueue.City__c, 'value': 'CQ'+CernerQueue.City__c},{'label': account.PersonMailingCity, 'value': 'AC'+account.PersonMailingCity}];
        			component.set('v.CityOps',CityOps); 
        			if(account.PersonMailingCity==undefined && CernerQueue.City__c!=undefined)
                        component.set('v.City','CQ'+CernerQueue.City__c);
        			else
        				component.set('v.City','AC'+account.PersonMailingCity); 
        
        			var StateOps =  [{'label': CernerQueue.State__c, 'value': 'CQ'+CernerQueue.State__c},{'label': account.PersonMailingStateCode, 'value': 'AC'+account.PersonMailingStateCode}];
        			component.set('v.StateOps',StateOps); 
        			if(account.PersonMailingStateCode==undefined && CernerQueue.State__c!=undefined)
                        component.set('v.State','CQ'+CernerQueue.State__c);
        			else
        				component.set('v.State','AC'+account.PersonMailingStateCode);
        
        			var CountryOps =  [{'label': CernerQueue.Country__c, 'value': 'CQ'+CernerQueue.Country__c},{'label': account.PersonMailingCountryCode, 'value': 'AC'+account.PersonMailingCountryCode}];
        			component.set('v.CountryOps',CountryOps); 
        			if(account.PersonMailingCountryCode==undefined && CernerQueue.Country__c!=undefined)
                        component.set('v.Country','CQ'+CernerQueue.Country__c);
        			else
        				component.set('v.Country','AC'+account.PersonMailingCountryCode); 
        
        			//var CountyOps =  [{'label': CernerQueue.CountyParish_Code__c, 'value': 'CQ'+CernerQueue.CountyParish_Code__c},{'label': account.Mailing_County__c, 'value': 'AC'+account.Mailing_County__c}];
        			//component.set('v.CountyOps',CountyOps); 
        			//if(account.Mailing_County__c==undefined && CernerQueue.CountyParish_Code__c!=undefined)
                    //    component.set('v.County','CQ'+CernerQueue.CountyParish_Code__c);
        			//else
        			//	component.set('v.County','AC'+account.Mailing_County__c); 
        
        			var PostalCodeOps =  [{'label': CernerQueue.Postal_Code__c, 'value': 'CQ'+CernerQueue.Postal_Code__c},{'label': account.PersonMailingPostalCode, 'value': 'AC'+account.PersonMailingPostalCode}];
        			component.set('v.PostalCodeOps',PostalCodeOps); 
        			if(account.PersonMailingPostalCode==undefined && CernerQueue.Postal_Code__c!=undefined)
                        component.set('v.PostalCode','CQ'+CernerQueue.Postal_Code__c);
        			else
        				component.set('v.PostalCode','AC'+account.PersonMailingPostalCode); 
        
        			component.set("v.currentStep", "2");
            }
            });
            $A.enqueueAction(setAr);
                                    
            console.log('step 2');
        }
        
        //Move to the third screen
        else if(getCurrentStep == 2){
            component.set("v.currentStep", "3");
            var Account=component.get('v.SelectedAccountR'); 
            var CernerQueue=component.get('v.SelectedCernerQueueR');
            		var CQFname;
                    if(CernerQueue.Middle_Name__c!=null)
                                           CQFname=CernerQueue.First_Name__c+' '+CernerQueue.Middle_Name__c;
                    else 
                                           CQFname=CernerQueue.First_Name__c;
            if(component.get('v.FName').substring(0, 2)=='CQ')
            	Account.FirstName=CQFname; 
            if(component.get('v.LName').substring(0, 2)=='CQ')
            	Account.LastName=CernerQueue.Last_Name__c; 
            if(component.get('v.MRN').substring(0, 2)=='CQ')
            	Account.MRN__c=CernerQueue.MRN__c;
            if(component.get('v.DOB').substring(0, 2)=='CQ')
            	Account.Date_of_Birth__c=CernerQueue.Date_of_Birth__c;
            if(component.get('v.Gender').substring(0, 2)=='CQ')
            	Account.HealthCloudGA__Gender__pc =CernerQueue.Gender_Code__c;
            //if(component.get('v.MaritalStatus').substring(0, 2)=='CQ')
            //	Account.Marital_Status__c=CernerQueue.Marital_Status__c	;
            if(component.get('v.Phone').substring(0, 2)=='CQ')
            	Account.Phone=CernerQueue.Phone__c;
            if(component.get('v.Mobile').substring(0, 2)=='CQ')
            	Account.PersonMobilePhone=CernerQueue.Mobile_Phone__c;
            if(component.get('v.Street').substring(0, 2)=='CQ')
            	Account.PersonMailingStreet=CernerQueue.Street__c;
            if(component.get('v.City').substring(0, 2)=='CQ')
            	Account.PersonMailingCity=CernerQueue.City__c;
            if(component.get('v.State').substring(0, 2)=='CQ')
            	Account.PersonMailingStateCode=CernerQueue.State__c;
            if(component.get('v.Country').substring(0, 2)=='CQ')
            	Account.PersonMailingCountryCode=CernerQueue.Country__c;
            if(component.get('v.PostalCode').substring(0, 2)=='CQ')
            	Account.PersonMailingPostalCode=CernerQueue.Postal_Code__c;
            //Account.HealthCloudGA__Testing_Status__pc ='Positive';
            //if(component.get('v.County').substring(0, 2)=='CQ')
            //	Account.Mailing_County__c=CernerQueue.CountyParish_Code__c;
            if(component.get('v.Email').substring(0, 2)=='CQ')
            	Account.PersonEmail=CernerQueue.Email__c;
            Account.Updated_by_Cerner__c=true;
            
            
            var updateAc = component.get('c.updateAccount');
            updateAc.setParams({"A" : Account,"CQ" : CernerQueue}); 
            updateAc.setCallback(this, function(response) {
                //store state of response
                var state = response.getState();
                console.log(state);
                if (state === "SUCCESS") {
                    component.set("v.result", "success"); 
                }
                else if(state === "ERROR"){
                    var err='Error:';
                    var errors = response.getError();
                    errors.forEach( function (error){

                        //top-level error.  there can be only one
                        if (error.message){
                            err=err+' '+error.message;					
                        }
        
                        //page-level errors (validation rules, etc)
                        if (error.pageErrors){
                            error.pageErrors.forEach( function(pageError) {
                                err=err+' '+pageError.message;					
                            });					
                        }
        
                        if (error.fieldErrors){
                            //field specific errors--we'll say what the field is					
                            for (var fieldName in error.fieldErrors) {
                                //each field could have multiple errors
                                error.fieldErrors[fieldName].forEach( function (errorList){	
                                    err=err+' '+errorList.message, "Field Error on " + fieldName + " : ";						
                                });                                
                            };  //end of field errors forLoop					
                        } //end of fieldErrors if
                    }); //end Errors forEach
                    component.set("v.result", "fail"); 
                    component.set("v.error", err);
                }
            });
            $A.enqueueAction(updateAc);
            
        	var AccountsC1 = component.get('v.AccountsC1');
            var AccountsC2 = component.get('v.AccountsC2');
            var AccountsC3 = component.get('v.AccountsC3');
            var action = component.get('c.UpdateMFD');
            action.setParams({"C1":AccountsC1,"C2":AccountsC2,"C3":AccountsC3}); 
            action.setCallback(this, function(response) {
                //store state of response
                var state = response.getState();
                if (state === "SUCCESS") {
                    console.log('Success');
                }
            });
            $A.enqueueAction(action);
        }
    },
    //move back
    moveBack : function(component,event,helper){
      // control the back button based on 'currentStep' attribute value    
        var getCurrentStep = component.get("v.currentStep");
         if(getCurrentStep == "2"){
            component.set("v.currentStep", "1");
         }
         else if(getCurrentStep == 3){
            component.set("v.currentStep", "1"); 
            component.set("v.result", ""); 
            component.set("v.error", "");
         }
    },
    //cliked on close
    finish : function(component,event,helper){
      // on last step show the alert msg, hide popup modal box and reset the currentStep attribute  
        var lvid=component.get("v.listviewid"); 
        component.set("v.isOpen", false); 
        component.set("v.currentStep", "1");
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            workspaceAPI.closeTab({tabId: focusedTabId});
        })
        .catch(function(error) {
            console.log(error);
        });
        window.open("/lightning/o/Cerner_Queue__c/list?filterName="+lvid,"_self");
    },
   
    //Clicked on select all
    handleselectAll : function(component, event, helper) {
        var Account=component.get('v.SelectedAccountR');                                     
        var CernerQueue=component.get('v.SelectedCernerQueueR');
        var SelectAll = component.get("v.type");
        if(SelectAll=='CQ'){
            //var CQFname;
            //if(CernerQueue.Middle_Name__c!=null)
            //	  CQFname=CernerQueue.First_Name__c+' '+CernerQueue.Middle_Name__c;
            //else
            //    CQFname=CernerQueue.First_Name__c;
            //component.set('v.FName','CQ'+CQFname); 
            //component.set('v.LName','CQ'+CernerQueue.Last_Name__c);
            component.set('v.MRN','CQ'+CernerQueue.MRN__c); 
            component.set('v.DOB','CQ'+CernerQueue.Date_of_Birth__c); 
            component.set('v.Gender','CQ'+CernerQueue.Gender_Code__c);
            //component.set('v.MaritalStatus','CQ'+CernerQueue.Marital_Status__c);
            component.set('v.Phone','CQ'+CernerQueue.Phone__c);
            component.set('v.Mobile','CQ'+CernerQueue.Mobile_Phone__c);
            component.set('v.Street','CQ'+CernerQueue.Street__c); 
            component.set('v.City','CQ'+CernerQueue.City__c); 
            component.set('v.State','CQ'+CernerQueue.State__c);
            component.set('v.Country','CQ'+CernerQueue.Country__c); 
            //component.set('v.County','CQ'+CernerQueue.CountyParish_Code__c); 
            component.set('v.PostalCode','CQ'+CernerQueue.Postal_Code__c); 
            component.set('v.Email','CQ'+CernerQueue.Email__c); 
        }else{
            //component.set('v.FName','AC'+Account.FirstName); 
            //component.set('v.LName','AC'+Account.LastName);
            component.set('v.MRN','AC'+Account.MRN__c); 
            component.set('v.DOB','AC'+Account.Date_of_Birth__c); 
            component.set('v.Gender','AC'+Account.HealthCloudGA__Gender__pc );
            //component.set('v.MaritalStatus','AC'+Account.Marital_Status__c);
            component.set('v.Phone','AC'+Account.Phone);
            component.set('v.Mobile','AC'+Account.PersonMobilePhone);
            component.set('v.Street','AC'+Account.PersonMailingStreet); 
            component.set('v.City','AC'+Account.PersonMailingCity); 
            component.set('v.State','AC'+Account.PersonMailingStateCode);
            component.set('v.Country','AC'+Account.PersonMailingCountryCode); 
            //component.set('v.County','AC'+Account.Mailing_County__c); 
            component.set('v.PostalCode','AC'+Account.PersonMailingPostalCode);
            component.set('v.Email','AC'+Account.PersonEmail); 
        }
        
    },
    //Clicked on open updated account
    redirecttoMergedAccount: function (component, row,action,Name) {
        var Account=component.get('v.SelectedAccountR');   
        window.open("/lightning/r/Account/"+Account.Id+'/view');
    }
})