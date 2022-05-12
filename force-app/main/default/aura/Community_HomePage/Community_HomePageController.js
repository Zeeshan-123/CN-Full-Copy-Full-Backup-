({
    doInit : function(component, event) {
        component.set("v.firstOptIn", true);

        component.set("v.isLoading", true);
        
        var RRRrequest = 'No';
        
        var action = component.get("c.getUserInfo");
        action.setCallback(this,function(response){
            var state = response.getState();
            if (state === "SUCCESS"){
                var resultData = response.getReturnValue();
                /* commented for the closure of Surveys
                if (!$A.util.isEmpty(resultData.acnt.Interested_in_Survey__c)) {
                    if(resultData.acnt.Interested_in_Survey__c === "Not Interested")
                        component.set("v.IsInterestedInSurvey", false);
                    else
                        component.set("v.IsInterestedInSurvey",true);
                } */
                console.log('Opt In Shown? ' + resultData.acnt.Opt_In_Initially_Shown__c);
                  component.set("v.firstOptIn", resultData.acnt.Opt_In_Initially_Shown__c);
                /*if(resultData.acnt.Opt_In_Initially_Shown__c === "FALSE"){
                   component.set("v.firstOptIn", true);
                }
                        
                else{
                    component.set("v.firstOptIn",false);

                     */   
                
                component.set("v.accnt",resultData.acnt); 
                component.set("v.CloneAccnt",JSON.parse(JSON.stringify(resultData.acnt)));
                var Accnt=component.get("v.accnt");
                var CloneAccnt=component.get("v.CloneAccnt");
                component.set("v.userName",resultData.acnt.Name); 
                                   component.set("v.Email",resultData.acnt.Users[0].Email); 
                                   component.set("v.userTribeId",resultData.acnt.Tribe_Id__c); 
                                   component.set("v.Phone",resultData.acnt.Phone); 
                                   component.set("v.street",resultData.acnt.PersonOtherStreet); 
                                   component.set("v.state",resultData.acnt.PersonOtherState); 
                                   component.set("v.city",resultData.acnt.PersonOtherCity); 
                                   component.set("v.country",resultData.acnt.PersonOtherCountry); 
                //format Date of birth
                if(!$A.util.isUndefinedOrNull(resultData.acnt.Date_of_Birth__c)){
                    var splitDate = resultData.acnt.Date_of_Birth__c.split('-');
                    var year = splitDate[0];
                    var month = splitDate[1];
                    var day = splitDate[2];
                    var uDob = month+'/'+day+'/'+year;
                    Accnt.Date_of_Birth__c = uDob;
                    CloneAccnt.Date_of_Birth__c = uDob;
                }
                
                //format mobile phone
                if (!$A.util.isUndefinedOrNull(resultData.acnt.PersonMobilePhone)) {
                    var number = resultData.acnt.PersonMobilePhone.replace(/\D/g, '').slice(-10);
                    Accnt.PersonMobilePhone = '('+number.substring(0,3)+') '+number.substring(3,6)+'-'+number.substring(6,10);
                    CloneAccnt.PersonMobilePhone = '('+number.substring(0,3)+') '+number.substring(3,6)+'-'+number.substring(6,10);
                }
                
                 //format home phone
                if (!$A.util.isUndefinedOrNull(resultData.acnt.Phone)) {
                    var number = resultData.acnt.Phone.replace(/\D/g, '').slice(-10);
                    Accnt.Phone = '('+number.substring(0,3)+') '+number.substring(3,6)+'-'+number.substring(6,10);
                    CloneAccnt.Phone = '('+number.substring(0,3)+') '+number.substring(3,6)+'-'+number.substring(6,10);
                }
                var cases 	= 	resultData.cases;
                debugger;
                for (var i = 0; i < cases.length; i++) {
                    if(cases[i].Request_Reason__c == "Mobile Hotspot Connectivity"){
                        cases[i]["url"] = '/s/mobile-hotspot-detail?id='+cases[i].Id;
                    }
                    /*else if(cases[i].RecordType.Name == "Emergency Assistance"){
                        cases[i]["url"] = '/s/emergency-assistance-detail?id='+cases[i].Id;
                    }*/
                    else if(cases[i].RecordType.Name == "Utility Assistance"){
                        cases[i]["url"] = '/s/utility-assistance-detail?id='+cases[i].Id;
                    }
                    else{
                        cases[i]["url"] = '/s/detail/'+cases[i].Id;
                    }
                }
                console.log(cases);
                
                component.set("v.accnt" ,Accnt );
                component.set("v.CloneAccnt" ,CloneAccnt );
                component.set("v.caseList",resultData.cases); 
                component.set("v.StatesWithStateCodes",resultData.mapOfStates);  
                component.set("v.getPickListMap",resultData.mapOfDependentPL);  
                for (var i = 0; i < cases.length; i++){
                    if(cases[i].Request_Reason__c == 'RRR'){
                        component.set("v.showHideBanner",false);
                        RRRrequest = 'Yes';
                    }
                    /*
                    if(cases[i].Request_Reason__c == 'VL')
                    {
                        cases[i].Request_Reason__c = 'Vaccine Lottery';
                    }*/
                }
                
                if (RRRrequest == 'No')
                    component.set("v.showHideBanner",true);

                component.set("v.isLoading", false);                
            }
            
            if (state === "ERROR") {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title : 'SUCCESS',
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
    

    hideModal: function (component, event, helper) {
        component.set("v.IsInterestedInSurvey", false);
    },
    hideCommPref: function (component, event, helper) {
        console.log(component.get("v.accnt.Opt_In_to_SMS__c"));
        component.set("v.showCommModal", false);
    },
    hideOptIn: function (component, event, helper) {
        component.set("v.firstOptIn", true);
    },
    
    rrrApp : function(component, event){
        window.location.replace('/s/covid19-assistance');
    },
    
    CaApplication : function(component, event){
        window.location.replace('/s/clothing-assistance');
    },
    
    doRender : function(component, event, helper){
        var frames = document.getElementsByName("frm");
        for (var j = 0; j < frames.length; j++) {
            var frame = frames[j];
            frame.setAttribute("allowfullscreen", "true");
            frame.setAttribute("src", "https://www.youtube.com/embed/t5-llxItFDs");
        }        
    },
    
    //show info edit modal
    OnInfoEdit: function(component, event, helper) {
        component.set("v.showMyInfoModel", false);
        component.set("v.showMyInfoModel", true);
    },
    //show Comm Preference edit modal
    onCommPrefEdit: function(component, event, helper) {
        component.set("v.showCommModal", false);
        component.set("v.showCommModal", true);
    },

    
    //close info edit modal
    closeInfoEdit: function(component, event, helper){
        var ClonedAccnt = component.get("v.CloneAccnt");
        component.set("v.accnt",JSON.parse(JSON.stringify(ClonedAccnt)));
        component.set("v.showMyInfoModel", false);
        console.log('Close Info Edit');
        debugger; 
    },
    
    closeCommEdit: function(component, event, helper){
      //  var ClonedAccnt = component.get("v.CloneAccnt");
      //  component.set("v.accnt",JSON.parse(JSON.stringify(ClonedAccnt)));
        component.set("v.showCommModal", false);
    },
    
    updateAccount : function(component,event,helper){
        var accountObj = event.getParam("Accnt");
        console.log(accountObj);
        component.set("v.accnt",JSON.parse(JSON.stringify(accountObj)));
        component.set("v.CloneAccnt",JSON.parse(JSON.stringify(accountObj)));
        component.set("v.showMyInfoModel", false);
        component.set("v.showCommModal", false);
        var UserEmail = event.getParam("UserEmail");
    },
    
})