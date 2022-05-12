({
    doInit : function(component, event, helper) {
      debugger;
      let action = component.get("c.getApplicantInfo");
      action.setCallback(this, function(response){
          var state = response.getState();
           if (state === "SUCCESS")
           {
               debugger;
              var resultData = response.getReturnValue();
              if (resultData.isUnder18) {
                  console.log('You are Tennager');
                  window.location.replace('/s');
                  return;
              }
              debugger
              //resultData.caseExists = false;
              //check for case is already exists or not
              if (resultData.caseExists) {
                  component.set("v.caseId",resultData.caseObj.Id);
                  component.set("v.requestNumber", resultData.caseObj.CaseNumber);
                   // show success message
                  component.set("v.showSuccessMessage", true);
                  return;
              }

              component.set("v.vaccineLotteryForm",true);

              debugger
              //Check Gender
              // resultData.acnt.HealthCloudGA__Gender__pc = "Female";
              if (resultData.acnt.HealthCloudGA__Gender__pc  === "Female") {
                  component.set("v.isFemale",true);
              }
              if (!$A.util.isEmpty(resultData.acnt)) {
                  if (!$A.util.isEmpty(resultData.acnt.Date_of_Birth__c)) {
                      var date = resultData.acnt.Date_of_Birth__c;
                      var datearray = date.split("-");
                      
                      var newdate = datearray[1] + '/' + datearray[2] + '/' + datearray[0];
                      resultData.acnt.Date_of_Birth__c = newdate;
                  }
                  if (!$A.util.isEmpty(resultData.acnt.PersonMobilePhone)) {
                      var phone = resultData.acnt.PersonMobilePhone;
                      var number = phone.replace(/\D/g, '').slice(-10);
                      resultData.acnt.PersonMobilePhone = '('+number.substring(0,3)+')'+number.substring(3,6)+'-'+number.substring(6,10);
                  }
                  
              }
              //setting the account obj values to accObj component
              component.set("v.accObj",resultData.acnt);

              
              //Check Bad Address
              var AddPhysicalAddress = false;
              var AddMailingAddress = false;
               //debugger;
               var mAddress = '';
               var pAddress = '';
               var mCity = '';
               var pCity = '';
               var mZip = '';
               var pZip = '';
               debugger;
               if(!$A.util.isUndefined(resultData.acnt.PersonMailingStreet))
               {
                   var mValAddress = resultData.acnt.PersonMailingStreet;
                   mAddress =  mValAddress.toUpperCase();
               }
                if(!$A.util.isUndefined(resultData.acnt.PersonOtherStreet))
               {
                   var pValAddress = resultData.acnt.PersonOtherStreet;
                   pAddress =  pValAddress.toUpperCase();
               }
               
               if(!$A.util.isUndefined(resultData.acnt.PersonMailingCity))
               {
                   mCity = resultData.acnt.PersonMailingCity;
               }
                if(!$A.util.isUndefined(resultData.acnt.PersonOtherCity))
               {
                   pCity = resultData.acnt.PersonOtherCity;
               }
               
               if(!$A.util.isUndefined(resultData.acnt.PersonMailingPostalCode))
               {
                   mZip = resultData.acnt.PersonMailingPostalCode;
               }
                if(!$A.util.isUndefined(resultData.acnt.PersonOtherPostalCode))
               {
                   pZip = resultData.acnt.PersonOtherPostalCode;
               }
               
               //set address information  
               //if mailing address is fully/partially complete and doesn't contain bad address
               if( (!mAddress.includes("BAD ADDRESS")  && !mCity.includes("99") && !mZip.includes("00000")) &&
                  (!$A.util.isUndefined(resultData.acnt.PersonMailingStreet) ||  !$A.util.isUndefined(resultData.acnt.PersonMailingCity)
                   ||   !$A.util.isUndefined(resultData.acnt.PersonMailingState)  ||  !$A.util.isUndefined(resultData.acnt.PersonMailingPostalCode) 
                   ||   !$A.util.isUndefined(resultData.acnt.PersonMailingCountry)))
               {
                   debugger
                   AddMailingAddress = true;
                   component.find("MailingStreetInput").set("v.value", resultData.acnt.PersonMailingStreet);
                   component.find("MailingCityInput").set("v.value", resultData.acnt.PersonMailingCity);
                   component.find("MailingzipInput").set("v.value", resultData.acnt.PersonMailingPostalCode); 
                   component.find("MailingSuiteInput").set("v.value", resultData.acnt.Mailing_Suite__c);
                   
                   component.set("v.mailingSuitOLV", resultData.acnt.Mailing_Suite__c); 
                   component.set("v.mailingStreetOLV", resultData.acnt.PersonMailingStreet);
                   component.set("v.mailingCityOLV", resultData.acnt.PersonMailingCity);
                   component.set("v.mailingZipOLV", resultData.acnt.PersonMailingPostalCode);
                   
                   if($A.util.isUndefined(resultData.acnt.PersonMailingStreet) ||  mAddress.includes("BAD ADDRESS")
                      || $A.util.isUndefined(resultData.acnt.PersonMailingCity) || $A.util.isUndefined(resultData.acnt.PersonMailingState) 
                      || $A.util.isUndefined(resultData.acnt.PersonMailingCountry) ||   $A.util.isUndefined(resultData.acnt.PersonMailingPostalCode))
                   {
                       component.set("v.UpdateAddressRequired", true);
                     //  MarkUpdateAddressRequired = true;
                   }
                   
               }
               //if mailing address is incomplete/bad, set physical address
               else if( (mAddress.includes("BAD ADDRESS") || mCity.includes("99") || mZip.includes("00000") ) ||  
                       ($A.util.isUndefined(resultData.acnt.PersonMailingStreet) &&  $A.util.isUndefined(resultData.acnt.PersonMailingCity)
                        &&   $A.util.isUndefined(resultData.acnt.PersonMailingState)  &&  $A.util.isUndefined(resultData.acnt.PersonMailingPostalCode) 
                        &&  $A.util.isUndefined(resultData.acnt.PersonMailingCountry) ))
               {
                   debugger
                   //check if physical address contains BAD ADDRESS/incomplete
                   if( pAddress.includes("BAD ADDRESS") ||  pCity.includes("99") || pZip.includes("00000") || ($A.util.isUndefined(resultData.acnt.PersonOtherStreet) 
                      &&  $A.util.isUndefined(resultData.acnt.PersonOtherCity) && $A.util.isUndefined(resultData.acnt.PersonOtherState)   
                      &&  $A.util.isUndefined(resultData.acnt.PersonOtherCountry) &&  $A.util.isUndefined(resultData.acnt.PersonOtherPostalCode)))
                   {
                       component.set("v.UpdateAddressRequired", true);
                      // MarkUpdateAddressRequired = true;
                   }
                   // set physical address
                   else
                   {
                       debugger
                       AddPhysicalAddress = true;
                       component.find("MailingStreetInput").set("v.value", resultData.acnt.PersonOtherStreet);
                       component.find("MailingCityInput").set("v.value", resultData.acnt.PersonOtherCity);
                       component.find("MailingzipInput").set("v.value", resultData.acnt.PersonOtherPostalCode); 
                       component.find("MailingSuiteInput").set("v.value", resultData.acnt.Physical_Suite__c); 
                       
                       component.set("v.mailingStreetOLV", resultData.acnt.PersonOtherStreet);
                       component.set("v.mailingCityOLV", resultData.acnt.PersonOtherCity);
                       component.set("v.mailingZipOLV", resultData.acnt.PersonOtherPostalCode); 
                       component.set("v.mailingSuitOLV", resultData.acnt.Physical_Suite__c); 
                       
                       
                       if($A.util.isUndefined(resultData.acnt.PersonOtherStreet)   ||  $A.util.isUndefined(resultData.acnt.PersonOtherCity) ||
                          $A.util.isUndefined(resultData.acnt.PersonOtherState)    ||  $A.util.isUndefined(resultData.acnt.PersonOtherCountry) ||
                          $A.util.isUndefined(resultData.acnt.PersonOtherPostalCode))
                       {
                           component.set("v.UpdateAddressRequired", true);
                       }
                   }
                   
               }
              else
              {
                    component.set("v.UpdateAddressRequired", true);
              }
                  

              //Check Bad Address


              // console.log(resultData.cs_PickListMap);

              // set phone number
              var phone = '';
              if (!$A.util.isUndefined(resultData.acnt.PersonMobilePhone))
              {       
                  phone = resultData.acnt.PersonMobilePhone;
                  var number = phone.replace(/\D/g, '').slice(-10);                         
                  component.find("aIdPhone").set("v.value", '('+number.substring(0,3)+')'+number.substring(3,6)+'-'+number.substring(6,10));
                  // component.find("aIdPhone").set("v.value", number);
              }
              else
              {
                  component.find("aIdPhone").set("v.value", '');
              }

               //-----Working---------
               //-------Set Country and States Dropdown Auto-populated-------
               debugger
               component.set("v.getPickListMap",resultData.cs_PickListMap); 
               var cs_PickListMap = component.get("v.getPickListMap");
               var parentkeys = [];
               var parentField = [];                
               
               for (var pickKey in resultData.cs_PickListMap)
               {
                   parentkeys.push(pickKey);
               }
               
               for (var i = 0; i < parentkeys.length; i++) 
               {
                   parentField.push(parentkeys[i]);
               }  
              //  component.set("v.getPG_PhysicalParentList", parentField);
              //  component.set("v.getParentList", parentField);
               component.set("v.getMailingParentList", parentField);
              //  component.set('v.states',resultData.statesMap);
              
              debugger
              //Vax PickList Map
              var fieldMap = [];
              var result = resultData.vax_PickListMap;
              for(var key in result){
                  fieldMap.push({key: key, value: result[key]});
              }
              component.set("v.getVaxPickListMap", fieldMap);
               debugger;
             
               
               //-------Set Country and States Dropdown Auto-populated-------
               // set default values for picklists


              // set default values for picklists
              window.setTimeout(
                $A.getCallback( function() 
                     {
                         // if mailing address is empty then set physical address as mailing address
                         if(AddPhysicalAddress  == true)
                         {
                           debugger
                           //set country(controlling picklist) value 
                             var mailingCountryVal = resultData.acnt.PersonOtherCountry; 
                             if ($A.util.isUndefined(mailingCountryVal))
                             {
                                 component.find("MailingCountryInput").set("v.value", 'United States');
                                 component.set("v.mailingCountryOLV", 'United States');
                             }
                             else
                             {
                                 component.find("MailingCountryInput").set("v.value", resultData.acnt.PersonOtherCountry);
                                 component.set("v.mailingCountryOLV", resultData.acnt.PersonOtherCountry);
                             }
                             
                             $A.enqueueAction(component.get('c.ObjFieldByMailingParent'));
                             
                             // set state(dependent picklist) value once country(controlling picklist) value is set
                             var mailingStateVal = resultData.acnt.PersonOtherState;
                             if ($A.util.isUndefined(mailingStateVal))
                             {
                                 setTimeout(function()
                                            {
                                                component.find("MailingStateInput").set("v.value", ''); 
                                                component.set("v.mailingStateOLV", '');
                                            }, 1000);
                             }
                             else
                             {
                                 setTimeout(function()
                                            {
                                                component.find("MailingStateInput").set("v.value", mailingStateVal);
                                                component.set("v.mailingStateOLV", mailingStateVal);
                                            }, 1000);            
                             }
                         }
                    // if mailing address is not empty 
                         else if(AddMailingAddress == true)
                         {
                          debugger
                               //set country(controlling picklist) value
                             var mailingCountryVal = resultData.acnt.PersonMailingCountry; 
                             if ($A.util.isUndefined(mailingCountryVal))
                             {
                                 component.find("MailingCountryInput").set("v.value", 'United States');
                                 component.set("v.mailingCountryOLV", 'United States');
                             }
                             else
                             {
                                 component.find("MailingCountryInput").set("v.value", resultData.acnt.PersonMailingCountry);
                                 component.set("v.mailingCountryOLV", resultData.acnt.PersonMailingCountry);
                             }
                             
                             $A.enqueueAction(component.get('c.ObjFieldByMailingParent'));
                             
                             // set state(dependent picklist) value once country(controlling picklist) value is set
                             var mailingStateVal = resultData.acnt.PersonMailingState;
                             if ($A.util.isUndefined(mailingStateVal))
                             {
                                 setTimeout(function()
                                            {
                                                component.find("MailingStateInput").set("v.value", ''); 
                                                component.set("v.mailingStateOLV", ''); 
                                            }, 1000);
                             }
                             else
                             {
                                 setTimeout(function()
                                            {
                                                component.find("MailingStateInput").set("v.value", mailingStateVal);
                                                 component.set("v.mailingStateOLV", mailingStateVal);
                                            }, 1000);            
                             }
                         }
                       else
                       {
                        debugger

                           component.find("MailingStreetInput").set("v.value", '');
                           component.find("MailingCityInput").set("v.value", '');
                           component.find("MailingzipInput").set("v.value", ''); 
                           component.find("MailingSuiteInput").set("v.value", '');
                           component.find("MailingStateInput").set("v.value", '');
                           component.find("MailingCountryInput").set("v.value", 'United States');
                           $A.enqueueAction(component.get('c.ObjFieldByMailingParent'));
                           
                           component.set("v.mailingStreetOLV", '');
                           component.set("v.mailingCityOLV", '');
                           component.set("v.mailingZipOLV", ''); 
                           component.set("v.mailingSuitOLV", '');
                           component.set("v.mailingStateOLV", '');
                           component.set("v.mailingAddreesL2OLV", '');
                           component.set("v.mailingCountryOLV", 'United States');
                       }
                     }));
            component.set('v.states',resultData.statesMap);

               //Setting the Required attributes
              //  component.set("v.physicalAddressRequired", true);
              //  component.set("v.physicalStateRequired" , true);
              //  component.set("v.physicalOtherStateRequired" , true);
          }
      });
      $A.enqueueAction(action);
    },

     // fetches state picklist values with respect to country picklist value
     ObjFieldByMailingParent : function(component, event, helper)
     {
       debugger
         //get mailing country value
         var controllerValue = component.find("MailingCountryInput").get("v.value");
         // get country state map
         var pickListMap = component.get("v.getPickListMap");
         
         //country field is not empty
         if (controllerValue != '') 
         {     
             // pass country state map key(country value) to get state values
             var childValues = pickListMap[controllerValue];            
             var childValueList = [];
             
             for (var i = 0; i < childValues.length; i++)
             {
                 childValueList.push(childValues[i]);
             }
             
             component.set("v.getMailingChildList", childValueList);
             
             //get state values against country
             if(childValues.length > 0)
             {
                 // hide other state/Territory field
                 component.set("v.showMailingOtherState", false); 
                 // show  state picklist
                 component.set("v.showMailingState", true);
                 // enable state picklist
                 component.set("v.getMailingDisabledChildField" , false); 
                 // set state field value to empty
                 component.find("MailingStateInput").set("v.value",'');
                
             }
             
             //no state values found against country
             else
             {
                 // show other state/Territory field
                 component.set("v.showMailingOtherState", true); 
                 // hide  state picklist
                 component.set("v.showMailingState", false); 
                 // disable state picklist
                 component.set("v.getMailingDisabledChildField" , true); 
                 // enable other state/Territory field
                 component.set("v.mailingOtherStateDisabled" , false);
                 // set other state/Territory field value to empty
                 component.find("MailingOtherState").set("v.value",'');
             }
             
         } 
         //country field is empty
         else 
         {
             // set state picklist value to empty
             component.set("v.getMailingChildList", '');
             // disable state  picklist
             component.set("v.getMailingDisabledChildField" , true);
             // disable state/Territory field
             component.set("v.mailingOtherStateDisabled" , true);
             // set other state field value to empty
             component.find("MailingOtherState").set("v.value",'');
             
         }
     },    
     
    handleAddreesUpdateM : function(component, event, helper) 
    {
      debugger
        if(component.get("v.addressUpdate"))
        {
            component.set("v.showLookUp", true);
        }
        else
        {
            component.set("v.showLookUp", false);
            component.set("v.isManual", false);
            component.set("v.mailingAddressRequired", false);
            component.find("MailingStreetInput").set("v.value", component.get("v.mailingStreetOLV"));
            component.find("MailingAddress2Input").set("v.value", '');
            component.find("MailingCityInput").set("v.value", component.get("v.mailingCityOLV"));
            component.find("MailingzipInput").set("v.value", component.get("v.mailingZipOLV")); 
            component.find("MailingSuiteInput").set("v.value", component.get("v.mailingSuitOLV")); 
            component.find("MailingStateInput").set("v.value", component.get("v.mailingStateOLV")); 
            component.find("MailingCountryInput").set("v.value", component.get("v.mailingCountryOLV")); 
            
             // remove has errors
            var street = component.find('MailingStreetInput');
            $A.util.removeClass(street, 'slds-has-error');
     
            var city = component.find('MailingCityInput');
            $A.util.removeClass(city, 'slds-has-error');
            
            var state = component.find('MailingStateInput');
            $A.util.removeClass(state, 'slds-has-error');
     
            var country = component.find('MailingCountryInput');
            $A.util.removeClass(country, 'slds-has-error');
            
            var zip = component.find('MailingzipInput');
            $A.util.removeClass(zip, 'slds-has-error');
                     
            var otherState = component.find('MailingOtherState');
            $A.util.removeClass(otherState, 'slds-has-error');
        }
       
    },

    handleAddressChange: function(component, event, helper)
    {
        if(event.getSource().get("v.value").length % 3 == 0)
        {
            var params = {
                input : component.get("v.location"),
                country : component.find("MailingCountryInput").get("v.value")
            }
            
            
            helper.callServer(component, "c.getMelissaAddresses", function(response){
                var resp = JSON.parse(response);
                console.log(resp);
                component.set("v.showManualCB", true);
                if(resp.Results.length > 0){
                    component.set('v.predictions',resp.Results);
                    document.getElementById("addressResult").style.display = "block";
                } else{
                    component.set('v.predictions',[]);
                    document.getElementById("addressResult").style.display = "none";
                }
            }, params);
        }
    },
  

handleAddressClick: function(component, event, helper)
{
debugger
    var details = event.currentTarget;
    var melissaResult = component.get("v.predictions");
    var states = component.get("v.states");
    var index = details.dataset.placeid;
    var address = details.dataset.place;
    component.set("v.selectedAddressIndex", index);
    component.set("v.location", address);
    component.set("v.selectedAddress", address);

    for (var i = 0; i < melissaResult.length; i++){
        if(melissaResult[i].Address.SuiteCount > 0){
            for (var j = 0; j < melissaResult[i].Address.SuiteCount; j++){
                if((melissaResult[i].Address.AddressLine1+' '+melissaResult[i].Address.SuiteList[j]+', '+
                    melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                    component.find("MailingStreetInput").set("v.value", melissaResult[i].Address.AddressLine1);
                    component.find("MailingCityInput").set("v.value", melissaResult[i].Address.City);
                    if(component.get("v.isManual") && component.find("MailingCountryInput").get("v.value") != "United States"){
                        component.find("MailingCountryInput").set("v.value", "United States");
                        //get mailing country value
                        var controllerValue = component.find("MailingCountryInput").get("v.value");
                        // get country state map
                        var pickListMap = component.get("v.getPickListMap");
                        
                        // pass country state map key(country value) to get state values
                        var childValues = pickListMap[controllerValue];            
                        var childValueList = [];
                        
                        for (var k = 0; k < childValues.length; k++)
                        {
                            childValueList.push(childValues[k]);
                        }
                        
                        component.set("v.getMailingChildList", childValueList);
                        
                        //get state values against country
                        if(childValues.length > 0)
                        {
                            component.set("v.showMailingOtherState", false);
                            component.set("v.showMailingState", true);
                            component.set("v.getMailingDisabledChildField" , false); 
                            
                            component.set("v.mailingOtherStateDisabled" , true);
                            if(component.find("MailingOtherState") != null){
                            component.find("MailingOtherState").set("v.value",'');
                            }
                        }
                    }
                    component.find("MailingStateInput").set("v.value", states[0][melissaResult[i].Address.State]);
                    component.find("MailingzipInput").set("v.value", melissaResult[i].Address.PostalCode);
                    component.find("MailingSuiteInput").set("v.value", melissaResult[i].Address.SuiteList[j]);
                }
            }
        } 
        if(melissaResult[i].Address.SuiteCount < 1){
            if((melissaResult[i].Address.AddressLine1+(melissaResult[i].Address.SuiteName != ''?' '+melissaResult[i].Address.SuiteName:'')+', '+
                melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                component.find("MailingStreetInput").set("v.value", melissaResult[i].Address.AddressLine1);
                component.find("MailingCityInput").set("v.value", melissaResult[i].Address.City);
                if(component.find("MailingCountryInput").get("v.value") != "United States"){
                    component.find("MailingCountryInput").set("v.value", "United States");
                    //get mailing country value
                    var controllerValue = component.find("MailingCountryInput").get("v.value");
                    // get country state map
                    var pickListMap = component.get("v.getPickListMap");
                    
                    // pass country state map key(country value) to get state values
                    var childValues = pickListMap[controllerValue];            
                    var childValueList = [];
                    
                    for (var k = 0; k < childValues.length; k++)
                    {
                        childValueList.push(childValues[k]);
                    }
                    
                    component.set("v.getMailingChildList", childValueList);
                    
                    //get state values against country
                    if(childValues.length > 0)
                    {
                        component.set("v.showMailingOtherState", false);
                        component.set("v.showMailingState", true);
                        component.set("v.getMailingDisabledChildField" , false); 
                        
                        component.set("v.mailingOtherStateDisabled" , true);
                        if(component.find("MailingOtherState") != null){
                            component.find("MailingOtherState").set("v.value",'');
                            }
                    }
                }
                component.find("MailingStateInput").set("v.value", states[0][melissaResult[i].Address.State]);
                component.find("MailingzipInput").set("v.value", melissaResult[i].Address.PostalCode);
                component.find("MailingSuiteInput").set("v.value", melissaResult[i].Address.SuiteName);
            }
        }
    }
    document.getElementById("addressResult").style.display = "none";
    //component.set("v.predictions", []);
},

handleToggleChange: function(component, event, helper){
  debugger
  var melissaResult = component.get("v.predictions");
  var states = component.get("v.states");
  var index = component.get("v.selectedAddressIndex");
  var address = component.get("v.selectedAddress");
  
  var mailingStreetInput = component.find("MailingStreetInput");
  var mailingStreet = mailingStreetInput.get("v.value");
  var mailingCityInput = component.find("MailingCityInput");
  var mailingCity = mailingCityInput.get("v.value");
  var mailingCountryInput = component.find("MailingCountryInput");
  var mailingCountry = mailingCountryInput.get("v.value");
  var mailingZipInput = component.find("MailingzipInput");
  var mailingZip = mailingZipInput.get("v.value");
  
  if(!component.get("v.isManual")){
       component.set("v.mailingAddressRequired", false);
      if (mailingStreet == '' ||  mailingCity == ''  || mailingCountry == '' || mailingZip == '')
      {
          //mark free form address field required
          component.set("v.FFAddressRequired", true); 
      }
      
      if(component.get("v.location") != ""){
      component.find("MailingCountryInput").set("v.value", 'United States');
      
      // get country state map
                      var pickListMap = component.get("v.getPickListMap");//get mailing country value
                    var controllerValue = component.find("MailingCountryInput").get("v.value");
                      
                      // pass country state map key(country value) to get state values
                      var childValues = pickListMap[controllerValue];            
                      var childValueList = [];
                      
                      for (var k = 0; k < childValues.length; k++)
                      {
                          childValueList.push(childValues[k]);
                      }
                      
                      component.set("v.getMailingChildList", childValueList);
                      
                      //get state values against country
                      if(childValues.length > 0)
                      {
                          component.set("v.showMailingOtherState", false);
                          component.set("v.showMailingState", true);
                          component.set("v.getMailingDisabledChildField" , false); 
                          
                          component.set("v.mailingOtherStateDisabled" , true);
          if(component.find("MailingOtherState") != null){
                          component.find("MailingOtherState").set("v.value",'');
                          }                            
                      }
      }
      // remove has errors
      var street = component.find('MailingStreetInput');
      $A.util.removeClass(street, 'slds-has-error');

      var city = component.find('MailingCityInput');
      $A.util.removeClass(city, 'slds-has-error');
      
      var state = component.find('MailingStateInput');
      $A.util.removeClass(state, 'slds-has-error');

      var country = component.find('MailingCountryInput');
      $A.util.removeClass(country, 'slds-has-error');
      
      var zip = component.find('MailingzipInput');
      $A.util.removeClass(zip, 'slds-has-error');
               
      var otherState = component.find('MailingOtherState');
      $A.util.removeClass(otherState, 'slds-has-error');
      
      if(melissaResult.length > 0 )
      {
         for (var i = 0; i < melissaResult.length; i++){
          if(melissaResult[i].Address.SuiteCount > 0){
              for (var j = 0; j < melissaResult[i].Address.SuiteCount; j++){
                  if((melissaResult[i].Address.AddressLine1+' '+melissaResult[i].Address.SuiteList[j]+', '+
                  melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                      component.find("MailingStreetInput").set("v.value", melissaResult[i].Address.AddressLine1);
                      component.find("MailingCityInput").set("v.value", melissaResult[i].Address.City);
                      if(component.find("MailingCountryInput").get("v.value") != "United States"){
                          component.find("MailingCountryInput").set("v.value", "United States");
                          //get mailing country value
                          var controllerValue = component.find("MailingCountryInput").get("v.value");
                          // get country state map
                          var pickListMap = component.get("v.getPickListMap");
                          
                          // pass country state map key(country value) to get state values
                          var childValues = pickListMap[controllerValue];            
                          var childValueList = [];
                          
                          for (var k = 0; k < childValues.length; k++)
                          {
                              childValueList.push(childValues[k]);
                          }
                          
                          component.set("v.getMailingChildList", childValueList);
                          
                          //get state values against country
                          if(childValues.length > 0)
                          {
                              component.set("v.showMailingOtherState", false);
                              component.set("v.showMailingState", true);
                              component.set("v.getMailingDisabledChildField" , false); 
                              
                              component.set("v.mailingOtherStateDisabled" , true);
                              if(component.find("MailingOtherState") != null){
                            component.find("MailingOtherState").set("v.value",'');
                          }
                          }
                      }
                      component.find("MailingStateInput").set("v.value", states[0][melissaResult[i].Address.State]);
                      component.find("MailingzipInput").set("v.value", melissaResult[i].Address.PostalCode);
                      component.find("MailingSuiteInput").set("v.value", melissaResult[i].Address.SuiteList[j]);
                      component.find("MailingAddress2Input").set("v.value", '');
                  }
              }
          } 
          if(melissaResult[i].Address.SuiteCount < 1){
              if((melissaResult[i].Address.AddressLine1+(melissaResult[i].Address.SuiteName != ''?' '+melissaResult[i].Address.SuiteName:'')+', '+
              melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                  component.find("MailingStreetInput").set("v.value", melissaResult[i].Address.AddressLine1);
                  component.find("MailingCityInput").set("v.value", melissaResult[i].Address.City);
                  //component.find("MailingCountryInput").set("v.value", "United States");
                  if(component.find("MailingCountryInput").get("v.value") != "United States"){
                      component.find("MailingCountryInput").set("v.value", "United States");
                      //get mailing country value
                      var controllerValue = component.find("MailingCountryInput").get("v.value");
                      // get country state map
                      var pickListMap = component.get("v.getPickListMap");
                      
                      // pass country state map key(country value) to get state values
                      var childValues = pickListMap[controllerValue];            
                      var childValueList = [];
                      
                      for (var k = 0; k < childValues.length; k++)
                      {
                          childValueList.push(childValues[k]);
                      }
                      
                      component.set("v.getMailingChildList", childValueList);
                      
                      //get state values against country
                      if(childValues.length > 0)
                      {
                          component.set("v.showMailingOtherState", false);
                          component.set("v.showMailingState", true);
                          component.set("v.getMailingDisabledChildField" , false); 
                          
                          component.set("v.mailingOtherStateDisabled" , true);
                          if(component.find("MailingOtherState") != null){
                            component.find("MailingOtherState").set("v.value",'');
                          }
                      }
                  }
                  component.find("MailingStateInput").set("v.value", states[0][melissaResult[i].Address.State]);
                  component.find("MailingzipInput").set("v.value", melissaResult[i].Address.PostalCode);
                  component.find("MailingSuiteInput").set("v.value", melissaResult[i].Address.SuiteName);
                  component.find("MailingAddress2Input").set("v.value", '');
              }
          }
      }  
      }
     
  }
  else
  {
      component.set("v.mailingAddressRequired", true);
      component.set("v.FFAddressRequired", false);
      
      var ffAddress = component.find('AddressFreeFormInput');
      $A.util.removeClass(ffAddress, 'slds-has-error');
  }
},

    NumberCheck: function(component, event, helper)
    { 
        debugger;
        var charCode = (event.which) ? event.which : event.keyCode;
        if (!(charCode >= 48 && charCode <= 57))
        {
            event.preventDefault();
        }
       
        var fieldId = event.currentTarget.id;
        var fieldInput = component.find(fieldId);
        
        var phoneNumber = fieldInput.get("v.value");
         var cleaned = ('' + phoneNumber) + ''.replace(/\D/g, '');
        if(cleaned.length == 10){
          var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        //   var match = cleaned.match(/^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/);
          if (match) {
            var finalOne ='(' + match[1] + ')' + match[2] + '-' + match[3];
              debugger;
             component.find(fieldId).set("v.value", finalOne);
          }
          return null;
        }
    },

     // date validator
     validateAndReplace: function (component, event)
     {
         const input = event.getSource();
         const inputValue = input.get('v.value');
         const validValue = inputValue.replace(/^(\d\d)(\d)$/g,'$1/$2')
         .replace(/^(\d\d\/\d\d)(\d+)$/g,'$1/$2')
         .replace(/[^\d\/]/g,'');
         input.set('v.value', validValue);
     },
     
    clearErrors : function(component, event) 
    {
        var fieldId = event.getSource().getLocalId();
        $A.util.removeClass(fieldId, 'slds-has-error');
    },

    handleContext: function(component, event, helper)
    {
   		 event.preventDefault(); 
	},

    handlePaste: function(component, event, helper) 
    {
    	event.preventDefault(); 
	}, 

  AlphaCharCheck : function(component, event, helper)
  {
      debugger
      var code = (event.which) ? event.which : event.keyCode;
      if (!(code > 64 && code < 91) && // upper alpha (A-Z)
              !(code > 96 && code < 123) && // lower alpha (a-z)
         	  !(code == 45)) {  //hyphen
                  event.preventDefault();
      }
  },
  
  AlphanumericWithSpecCharCheck : function(component, event, helper)
  {
      debugger
      var code = (event.which) ? event.which : event.keyCode;
      if (!(code > 47 && code < 58) && // numeric (0-9)
              !(code > 64 && code < 91) && // upper alpha (A-Z)
              !(code > 96 && code < 123) && // lower alpha (a-z)
              !(code > 43 && code < 48) && // ,-./
              !(code == 32) && !(code == 35) && !(code == 36) && !(code == 39) && !(code == 58)) {  // #$':
                  event.preventDefault();
      }
  },

  AddressCityValidationCheck : function(component, event, helper)
  {
      debugger
      var code = (event.which) ? event.which : event.keyCode;
      if (!(code > 47 && code < 58) && // numeric (0-9)
              !(code > 64 && code < 91) && // upper alpha (A-Z)
              !(code > 96 && code < 123) && // lower alpha (a-z)
              !(code > 44 && code < 47) && // -.
              !(code == 32) && !(code == 39)) {  // 'space
                  event.preventDefault();
      }
  },

  hideModal: function(component, event, helper) 
  {
      component.set("v.showReviewScreen", false); 
  },

  handleUploadFinished: function (component, event) {
    debugger
    // Get the list of uploaded files
    var uploadedFiles = event.getParam("files");
    var auraId = event.getSource().getLocalId();
    //alert("Files uploaded : " + uploadedFiles.length);
    
    // Get the file name
    uploadedFiles.forEach(file => {
            if (auraId === "firstVacDoseFileId") {
                component.set("v.fileName1",file.name);
                component.set("v.docId1", file.documentId);
                console.log(component.get("v.fileName1") +' '+ component.get("v.docId1"));
            } else {
                component.set("v.fileName2",file.name);
                component.set("v.docId2", file.documentId);
                console.log(component.get("v.fileName2") +' '+ component.get("v.docId2"));
            }
      });
  },

  ShowInfoToReview: function(component, event, helper){
    debugger
    var errorMessages = helper.checkValidation(component,event);
    debugger
    // is there any error message?
    if(errorMessages != null) {
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
    } else {
      debugger
        component.set("v.showReviewScreen", true);

        // component.set("v.mailingStreetVal", mailingStreet);
        // component.set("v.mailingCityVal", mailingCity);
        // component.set("v.mailingCountryVal", mailingCountry);
        // component.set("v.mailingStateVal", mailingState);
        // component.set("v.mailingOtherStateVal", mailingOtherState);
        // component.set("v.mailingZipVal", mailingZip);
        // component.set("v.mailingSuitVal", suite);
        // component.set("v.mailingAddreesL2Val", addressLine2);
        //setting review fields values
        //Applicant Address Fields
        component.find("Rev_MailingStreetInput").set("v.value", component.find("MailingStreetInput").get("v.value"));
        component.find("Rev_MailingAddress2Input").set("v.value", component.find("MailingAddress2Input").get("v.value"));
        component.find("Rev_MailingSuiteInput").set("v.value", component.find("MailingSuiteInput").get("v.value"));
        component.find("Rev_MailingCityInput").set("v.value", component.find("MailingCityInput").get("v.value"));
        component.find("Rev_MailingCountryInput").set("v.value", component.find("MailingCountryInput").get("v.value"));
        if (component.get("v.showMailingState")) {
            component.find("Rev_MailingStateInput").set("v.value", component.find("MailingStateInput").get("v.value"));
        } 
        if (component.get("v.showMailingOtherState")) {
            component.find("Rev_MailingOtherState").set("v.value", component.find("MailingOtherState").get("v.value"));
        }
        // component.find("Rev_MailingCounty").set("v.value", component.find("MailingCounty").get("v.value"));
        component.find("Rev_MailingzipInput").set("v.value", component.find("MailingzipInput").get("v.value"));
        
        component.find("Rev_AddressFreeFormInput").set("v.value", component.find("AddressFreeFormInput").get("v.value"));
        // // component.find("Rev_aIdFinalVaccinationDate").set("v.value", component.find("PhysicalzipInput").get("v.value"));
    }
   
    
  },

  submitForm : function(component, event, helper){
    debugger

    var errorMessages = null;
    var acc = component.get("v.accObj");
    var mobileNo = component.find("aIdPhone").get("v.value").replace(/\D/g, '');
    acc.PersonMobilePhone = mobileNo;
  
    var requiredFields = $A.get("$Label.c.CommunityFillRequiredFields");


    //-------Mailing Address--------------
    var mailingStreetInput 			= 	component.find("MailingStreetInput");
    var mailingStreet 				  = 	mailingStreetInput.get("v.value");
    var mailingCityInput 			  = 	component.find("MailingCityInput");
    var mailingCity 				    = 	mailingCityInput.get("v.value");
    var mailingCountryInput 		= 	component.find("MailingCountryInput");
    var mailingCountry 				  = 	mailingCountryInput.get("v.value");
    var mailingState 				    =	 '';
    var mailingOtherState 			=   '';
    var mailingZipInput				  = 	component.find("MailingzipInput");
    var mailingZip 					    = 	mailingZipInput.get("v.value");
    var suite 						      = 	component.find("MailingSuiteInput").get("v.value");
    var addressLine2				    = 	component.find("MailingAddress2Input").get("v.value");
    var addressFreeForm 			  = 	component.get("v.location");
    var isManual 					      = 	component.get("v.isManual");
    var isAddressChanged 			  = 	false;
    
    var melissaResult 				  =	component.get("v.predictions");
    var states 						      = 	component.get("v.states");
    var index						        = 	component.get("v.selectedAddressIndex");
    var address 					      = 	component.get("v.selectedAddress");
    
    var showMailingState 			  = 	component.get("v.showMailingState");
    var showMailingOtherState 	= 	component.get("v.showMailingOtherState");
    
     if(showMailingState == true)
    {
        mailingState = component.find("MailingStateInput").get("v.value");
    }
    
    if(showMailingOtherState == true)
    {
        mailingOtherState = component.find("MailingOtherState").get("v.value");
    }
    
    if(component.get("v.isManual")){
        for (var i = 0; i < melissaResult.length; i++){
            if(melissaResult[i].Address.SuiteCount > 0){
                for (var j = 0; j < melissaResult[i].Address.SuiteCount; j++){
                    if((melissaResult[i].Address.AddressLine1+' '+melissaResult[i].Address.SuiteList[j]+', '+
                        melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                        if(melissaResult[i].Address.AddressLine1 != component.find("MailingStreetInput").get("v.value") || 
                           melissaResult[i].Address.City != component.find("MailingCityInput").get("v.value") || 
                           states[0][melissaResult[i].Address.State] != component.find("MailingStateInput").get("v.value") || 
                           melissaResult[i].Address.PostalCode != component.find("MailingzipInput").get("v.value") || 
                           melissaResult[i].Address.SuiteList[j] != component.find("MailingSuiteInput").get("v.value") || 
                           component.find("MailingCountryInput").get("v.value") != "United States" || 
                           component.find("MailingAddress2Input").get("v.value") != ""){
                            component.set("v.isAddressChanged", true);
                            isAddressChanged = true;
                        }
                    }
                }
            } 
            if(melissaResult[i].Address.SuiteCount < 1){
                if((melissaResult[i].Address.AddressLine1+(melissaResult[i].Address.SuiteName != ''?' '+melissaResult[i].Address.SuiteName:'')+', '+
                    melissaResult[i].Address.City+', '+melissaResult[i].Address.State) == address){
                    if(melissaResult[i].Address.AddressLine1 != component.find("MailingStreetInput").get("v.value") || 
                       melissaResult[i].Address.City != component.find("MailingCityInput").get("v.value") || 
                       states[0][melissaResult[i].Address.State] != component.find("MailingStateInput").get("v.value") || 
                       melissaResult[i].Address.PostalCode != component.find("MailingzipInput").get("v.value") || 
                       melissaResult[i].Address.SuiteName != component.find("MailingSuiteInput").get("v.value") || 
                       component.find("MailingCountryInput").get("v.value") != "United States" || 
                       component.find("MailingAddress2Input").get("v.value") != ""){
                        component.set("v.isAddressChanged", true);
                        isAddressChanged = true;
                    }
                }
            }
        }
    }

    //---------MAiling Address-----------

   
    //Vaccine Fields
    debugger
    
    var vacType = component.get("v.vacType");
    var finalVaxDateStr = component.get("v.finalVaxDate");
    var finalVaxDate = new Date(finalVaxDateStr);

    //File Work
    debugger
    var docIds = [];
    if(!$A.util.isEmpty(component.get("v.docId1"))){
        docIds.push(component.get("v.docId1"));
    }
    if(!$A.util.isEmpty(component.get("v.docId2"))){
        docIds.push(component.get("v.docId2"));
    }
    
    debugger;
        //show spinner
        helper.showSpinner(component);

        var action = component.get("c.createCase");

        debugger;
        
       //making request
        var caseObj = {
           	Mailing_Street__c						  :		mailingStreet,
            Mailing_City__c							  :		mailingCity,
            Mailing_ZipPostal_Code__c			:		mailingZip,
            Mailing_Countries__c					:		mailingCountry,
            Mailing_States__c						  :		mailingState,
            Other_Mailing_State__c				:		mailingOtherState,
            mailing_suite__c 						  :		suite,
            mailing_address2__c						:		addressLine2,
            Melissa_Address__c						:		addressFreeForm,
            Is_Address_Changed__c					:		isAddressChanged,
            Is_Manual_Address__c					:		isManual,
            VL_Vaccine_Type__c            :   vacType,
            VL_Final_Vaccination_Date__c  :   finalVaxDate
        };

        //wrapper object
        var wrapperObj = {
            acnt                :   acc,
            caseObj             :   caseObj,
            fileids				      :	  docIds
        };

        debugger;
        action.setParams({
            wrapperObj  :   wrapperObj
        });
        

        debugger;
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === 'SUCCESS') {
                debugger;
                //set apex return record id to parentId attribute
                var wrapperObjRes = response.getReturnValue();
                if ($A.util.isEmpty(wrapperObjRes.exceptionMsg)) {
                    component.set('v.caseId',wrapperObjRes.caseObj.Id);
                    component.set("v.requestNumber", wrapperObjRes.caseObj.CaseNumber);
                    // call helper method to end request
                    helper.endRequest(component, event, helper);
                    // check if veteran category is selected 
                    
                } else {
                    debugger;
                    component.set("v.exceptionMsg",wrapperObjRes.exceptionMsg)
                    helper.endRequestWithException(component,event,helper);
                }
                
            } else if (state === 'ERROR') {
                debugger;
                var wrapperObjRes = response.getReturnValue();
                component.set("v.exceptionMsg",wrapperObjRes.exceptionMsg)
                helper.endRequestWithException(component,event,helper);
            }
        });

        $A.enqueueAction(action); 
},
    
      //show hunt request created by user(navigate to case detail page)
     viewRequest: function(component, event, helper)
     {
         var recId = component.get("v.caseId");
         window.location.replace('/s/detail/'+recId);
     },  
})