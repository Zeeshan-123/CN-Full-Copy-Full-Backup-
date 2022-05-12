/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba
@Date: April/16/2021
@Purpose: This class is used as controller for Community_RRREdit aura component.
---------------------------------------------------------------------------------------------------------------*/


public without sharing class Community_RRREditController
{
    public class Covid_Exception extends Exception 
     {}
    
   private static final String getAlphaChars = '' +
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz' +
        '0123456789+/'; 
    
    
     //Call Melissa Data API
    @AuraEnabled
    public static String getMelissaAddresses(String input, String country)
    {
        return MelissaDataController.SendRequest(input, country);
    }
    
 
	// get  initial data
    @AuraEnabled
    public static Community_RRRFormWrapper getPicklistValues(String strObjectName, string strparentField, string strchildField, String caseId)
    {
        //get user logged id
        String UserId=UserInfo.getUserId();
        //get contact id against user id
        String contactId=utility.getUserContactId(UserId);  
        
        Community_RRRFormWrapper objList 		= 		new Community_RRRFormWrapper();
        objList.acnt							= 		new Account();
        Map<String,List<String>> pickListMap 	= 		new Map<String,List<String>>();
        objList.pickListMap						= 		pickListMap;
        objList.userEmail						= 		'';
        objList.RRRCase							= 		new Case();
        
        Schema.sObjectType objType = Schema.getGlobalDescribe().get(strObjectName).newSObject().getSObjectType();
        Map<String, Schema.SObjectField> objFieldMap = objType.getDescribe().fields.getMap();
        
        List<customPicklistEntryWrapper> depEntriesList = (List<customPicklistEntryWrapper>)JSON.deserialize(JSON.serialize(objFieldMap.get(strChildField).getDescribe().getPicklistValues()), List<customPicklistEntryWrapper>.class);
        List<String> controllingValues = new List<String>();
        
        for (Schema.PicklistEntry ple : objFieldMap.get(strparentField).getDescribe().getPicklistValues()) 
        {
            pickListMap.put(ple.getLabel(), new List<String>());
            controllingValues.add(ple.getLabel());
        }
        
        for (customPicklistEntryWrapper plew : depEntriesList) 
        {
            String validForBits = alphaBaseToBits(plew.validFor);
            for (Integer i = 0; i < validForBits.length(); i++) 
            {
                String bit = validForBits.mid(i, 1);
                if (bit == '1') 
                {
                    pickListMap.get(controllingValues.get(i)).add(plew.label);
                }
            }
        }
        
        objList.pickListMap = pickListMap;
        
        //get user account information
            Account acc 	= 	[SELECT Id, FirstName, HealthCloudGA__Gender__pc, Tribe_Id__c, Middle_Name__c, LastName, Date_of_Birth__c, PersonEmail, PersonMobilePhone , 
                       			PersonMailingStreet, PersonMailingCity, PersonMailingState, PersonMailingCountry, PersonMailingPostalCode
                       			FROM Account WHERE PersonContactId =: contactId limit 1];

        list<Case> rCase	=	[SELECT Id, mailing_suite__c, mailing_address2__c, Request_Reason__c, Account.Name, CaseNumber, Status, COVID19_Impact_on_the_Household__c, Ebt_Mobile_Phone__c,
                      	 		Mailing_Street__c, Mailing_City__c, Mailing_ZipPostal_Code__c, Mailing_Countries__c, Mailing_States__c, Other_Mailing_State__c,
                      	 		Ebt_Email__c,Is_Address_Changed__c,Is_Manual_Address__c,Melissa_Address__c, Primary_Contact_Last_Name__c, Add_on__c,
                                (SELECT Id, First_Name__c, Last_Name__c, AccountId__r.HealthCloudGA__Gender__pc, Gender__c, Date_of_Birth__c, Citizen_Id__c FROM Household_Members__r WHERE Citizen_id__c !=: acc.Tribe_Id__c) FROM Case 
                          		WHERE ContactId =:contactId and Request_Reason__c = 'RRR' and  Id =: caseId limit 1];
        
        //logged in user had submitted an RRR request
        if(rCase.size() > 0)
        {
            objList.RRRCase 	= 	rCase[0];
       }
        
        
        objList.acnt		=	acc;
        User usr 			= 	[SELECT Name, Email FROM User where id =: UserId limit 1];
        objList.userEmail	=	usr.Email;
        
        objList.statesMap = getStates();
        // return wrapper
        return objList;
    } 
    
        @AuraEnabled
    public static Map<string, string> getStates()
    {
        Map<string, US_States__c> mapCodes = US_States__c.getAll();
        Map<string, string> mapStateCodes = new Map<string, string>();
        for(string key:mapCodes.keySet())
        {
            mapStateCodes.put(mapCodes.get(key).ISO_Code__c, key);
        }
        return mapStateCodes;
    }
   
     // create case
    @AuraEnabled
    public static case updateRequest( Id caseId, List<Household_Member__c> HMslist, List<Household_Member__c> HMslistToUpdate, String[] ImpactofCovid,
                                    String mailingStreet, String mailingCity, String mailingCountry, String mailingState, String mailingOtherState,
                              		String mailingZip, String priMobilePhone, String email, String applicantLName, String suite, String addressLine2,
                                  	String addressFreeForm, Boolean isManual, Boolean isAddressChanged)
    {
        //get user logged id
        String UserId=UserInfo.getUserId();
        //get contact id against user id
        String contactId=utility.getUserContactId(UserId); 
        
        //get RRR request information, if any
        Case rCase  = [SELECT Id, Request_Reason__c, Account.HealthCloudGA__Gender__pc, RRR_Request_Edit_Status__c, CaseNumber  FROM Case
                             WHERE ContactId =:contactId and Request_Reason__c = 'RRR' and Id =: caseId limit 1];
        
        if(rCase.RRR_Request_Edit_Status__c == false)
        {
            return null;
        }
        else if(String.isBlank(applicantLName) || String.isBlank(priMobilePhone)){
            if(String.isBlank(applicantLName)){
                throw new Covid_Exception('Please enter a valid Last Name for primary applicant.');
            } else if(String.isBlank(priMobilePhone)){
                throw new Covid_Exception('Please enter a valid Phone for primary applicant.');
            } else{
                throw new Covid_Exception('You must fill all of the Primary Contact information.');
            }
          } else if(String.isBlank(mailingStreet) || String.isBlank(mailingCity) || 
          String.isBlank(mailingCountry) || String.isBlank(mailingZip) || ((mailingCountry == 'United States' || mailingCountry == 'Canada') &&
          String.isBlank(mailingState)) || (mailingCountry != 'United States' && mailingCountry != 'Canada' &&
                                            String.isBlank(mailingOtherState))){
              if(String.isBlank(mailingStreet)){
                                                    throw new Covid_Exception('Please enter a valid address in Address Line 1.'); 
                                                } else if(String.isBlank(mailingCity)){
                                                    throw new Covid_Exception('Please enter a valid City.'); 
                                                } else if(String.isBlank(mailingCountry)){
                                                    throw new Covid_Exception('Please select a valid Country.'); 
                                                } else if(String.isBlank(mailingZip)){
                                                    throw new Covid_Exception('Please enter a valid Zip Code.'); 
                                                } else if((mailingCountry == 'United States' &&
                                                           String.isBlank(mailingState))){
                                                               throw new Covid_Exception('Please select a valid State.'); 
                                                           }
                                                else if((mailingCountry != 'United States' &&
                                                         String.isBlank(mailingOtherState))){
                                                             throw new Covid_Exception('Please enter a valid Other State.'); 
                                                         }
                                                else{
               										throw new Covid_Exception('Please ensure the address information is complete.');
                                                }
          } else if((HMslist != null && HMslist.size() > 0) || (HMslistToUpdate != null && HMslistToUpdate.size() > 0)){
              for(Household_Member__c Member : HMslist)
              {
                    if(String.isBlank(Member.First_Name__c) || String.isBlank(Member.Last_Name__c) || Member.Date_of_Birth__c == null ||
                       String.isBlank(Member.Citizen_Id__c)){
                           if(String.isBlank(Member.First_Name__c)){
                               throw new Covid_Exception('Please enter a valid First Name for Household member with citizen id '+Member.Citizen_Id__c+' on the form.');
                           } else if(String.isBlank(Member.Last_Name__c)){
                               throw new Covid_Exception('Please enter a valid Last Name for Household member with citizen id '+Member.Citizen_Id__c+' on the form.');
                           } else if(Member.Date_of_Birth__c == null){
                               throw new Covid_Exception('Please enter a valid Date of Birth for Household member with citizen id '+Member.Citizen_Id__c+' on the form.');
                           } else if(String.isBlank(Member.Citizen_Id__c)){
                               throw new Covid_Exception('Please enter a valid Citizen ID for Household Member.');
                           } else{
                           	throw new Covid_Exception('You must fill all of the Household Member information.');
                           }
                       }
              }
              for(Household_Member__c Member : HMslistToUpdate)
              {
                    if(String.isBlank(Member.First_Name__c) || String.isBlank(Member.Last_Name__c) || Member.Date_of_Birth__c == null ||
                       String.isBlank(Member.Citizen_Id__c)){
                           if(String.isBlank(Member.First_Name__c)){
                               throw new Covid_Exception('Please enter a valid First Name for Household Member.');
                           } else if(String.isBlank(Member.Last_Name__c)){
                               throw new Covid_Exception('Please enter a valid Last Name for Household Member.');
                           } else if(Member.Date_of_Birth__c == null){
                               throw new Covid_Exception('Please enter a valid Date of Birth for Household Member.');
                           } else if(String.isBlank(Member.Citizen_Id__c)){
                               throw new Covid_Exception('Please enter a valid Citizen ID for Household Member.');
                           } else{
                           	throw new Covid_Exception('You must fill all of the Household Member information.');
                           }
                       }
              }
              List<Household_Member__c> HMsListToInsert		= 		new List<Household_Member__c>();
            List<Household_Member__c> HMListToUpdate		= 		new List<Household_Member__c>();
            
            //query logged in user account information
            Account userAccount = [SELECT Id, FirstName, LastName, Tribe_Id__c FROM Account WHERE PersonContactId =: contactId limit 1];
            String accId =  userAccount.Id;
            
            String impacts='';
            if(ImpactofCovid != null && ImpactofCovid.size() > 0)
            {
                for(integer i=0 ; i < ImpactofCovid.size() ; i++)
                {
                    impacts += ImpactofCovid[i]+ ';';
                }
            }        
            
            //get RRR Request record type id
            Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('RRR').getRecordTypeId();
            
            // create case record
            Case cse 									=		new Case();
            cse.Id										=		caseId;
            cse.COVID19_Impact_on_the_Household__c		=		impacts;
            cse.Ebt_Mobile_Phone__c						=		priMobilePhone;
            cse.Mailing_Street__c						=		mailingStreet;
            cse.Mailing_City__c							=		mailingCity;
            cse.Mailing_ZipPostal_Code__c				=		mailingZip;
            cse.Mailing_Countries__c					=		mailingCountry;
            cse.Mailing_States__c						=		mailingState;
            cse.Other_Mailing_State__c					=		mailingOtherState;
            if (rCase.Account.HealthCloudGA__Gender__pc == 'Female')
            {
                 cse.Primary_Contact_Last_Name__c		=		applicantLName;
            }
            cse.mailing_suite__c 						=		suite;
            cse.mailing_address2__c						=		addressLine2;
            cse.Melissa_Address__c						=		addressFreeForm;
            cse.Is_Address_Changed__c					=		isAddressChanged;
            cse.Is_Manual_Address__c					=		isManual;
            
            update cse;
            
            //query inserted case to get case number
            Case userCase = [SELECT Id, CaseNumber FROM Case WHERE Id =: caseId limit 1];
            
            if(HMslist != null && HMslist.size() > 0)
            {
                for(Household_Member__c Member : HMslist)
                {
                    Member.Request__c=caseId;
                    HMsListToInsert.add(Member);
                }
                
                insert HMsListToInsert;
            }
            
            if(HMslistToUpdate != null && HMslistToUpdate.size() > 0)
            {
                for(Household_Member__c Member : HMslistToUpdate)
                {
                    if(Member.AccountId__r.HealthCloudGA__Gender__pc == 'Female')
                    {
                        HMListToUpdate.add(Member);
                    }
                }
                
                update HMListToUpdate;
            }
            return userCase;
          }
        else
        {
            List<Household_Member__c> HMsListToInsert		= 		new List<Household_Member__c>();
            List<Household_Member__c> HMListToUpdate		= 		new List<Household_Member__c>();
            
            //query logged in user account information
            Account userAccount = [SELECT Id, FirstName, LastName, Tribe_Id__c FROM Account WHERE PersonContactId =: contactId limit 1];
            String accId =  userAccount.Id;
            
            String impacts='';
            if(ImpactofCovid != null && ImpactofCovid.size() > 0)
            {
                for(integer i=0 ; i < ImpactofCovid.size() ; i++)
                {
                    impacts += ImpactofCovid[i]+ ';';
                }
            }        
            
            //get RRR Request record type id
            Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('RRR').getRecordTypeId();
            
            // create case record
            Case cse 									=		new Case();
            cse.Id										=		caseId;
            cse.COVID19_Impact_on_the_Household__c		=		impacts;
            cse.Ebt_Mobile_Phone__c						=		priMobilePhone;
            cse.Mailing_Street__c						=		mailingStreet;
            cse.Mailing_City__c							=		mailingCity;
            cse.Mailing_ZipPostal_Code__c				=		mailingZip;
            cse.Mailing_Countries__c					=		mailingCountry;
            cse.Mailing_States__c						=		mailingState;
            cse.Other_Mailing_State__c					=		mailingOtherState;
            if (rCase.Account.HealthCloudGA__Gender__pc == 'Female')
            {
                 cse.Primary_Contact_Last_Name__c		=		applicantLName;
            }
            cse.mailing_suite__c 						=		suite;
            cse.mailing_address2__c						=		addressLine2;
            cse.Melissa_Address__c						=		addressFreeForm;
            cse.Is_Address_Changed__c					=		isAddressChanged;
            cse.Is_Manual_Address__c					=		isManual;
            
            update cse;
            
            //query inserted case to get case number
            Case userCase = [SELECT Id, CaseNumber FROM Case WHERE Id =: caseId limit 1];
            
            if(HMslist != null && HMslist.size() > 0)
            {
                for(Household_Member__c Member : HMslist)
                {
                    Member.Request__c=caseId;
                    HMsListToInsert.add(Member);
                }
                
                insert HMsListToInsert;
            }
            
            if(HMslistToUpdate != null && HMslistToUpdate.size() > 0)
            {
                for(Household_Member__c Member : HMslistToUpdate)
                {
                    if(Member.AccountId__r.HealthCloudGA__Gender__pc == 'Female')
                    {
                        HMListToUpdate.add(Member);
                    }
                }
                
                update HMListToUpdate;
            }
            return userCase;
        }
        
    } 
    
     //validate household member list
    @AuraEnabled
    public static Community_RRRFormWrapperReturn validateHMList(List<Household_Member__c> HMlist)
    {
        Map<String, Date> HMsMap						=		new Map<String, Date>();
        Map<String, Date> accMap						= 		new Map<String, Date>();
        List<String> InvalidCitizenIdsList				= 		new List<String>();
        List<String> ValidCitizenIdsList				= 		new List<String>();
        List<Household_Member__c> caseHasCitizenIds		= 		new List<Household_Member__c>();
        List<Account> accntsWithDoDNotNull				= 		new List<Account>();
        List<Account> RelinquishedAccounts				= 		new List<Account>();
        List<Account> legitAccountsList					= 		new List<Account>();
        Id cn_RecTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('CN_Registration').getRecordTypeId();
        
        //initialize wrapper class
        Community_RRRFormWrapperReturn obj 		= 		new Community_RRRFormWrapperReturn();
        obj.InvalidCitizenIds					= 		new list<String>();
        obj.CitizenIdsOnExCases					= 		new list<String>();
        obj.CitizenIdsOfAccntsWithDoDNN			= 		new list<String>();
        obj.CitizenIdsOfRelinquishedAccounts	= 		new list<String>();
 		obj.accList								=		new List<Account>();
        
     // check for valid/invalid citizen ids   
        if(HMlist != null && HMlist.size() > 0)
        {
          
           for(Household_Member__c HMsIn : HMlist)
        	{   
            	HMsMap.put(HMsIn.Citizen_Id__c, HMsIn.Date_of_Birth__c); 
        	}
           
             if (HMsMap != null && HMsMap.size() > 0)
            {
               //get legit accounts on basis of citizen id
               for(Account ac : [SELECT Id, FirstName, LastName, Name, Tribe_Id__c, Date_of_Birth__c, DOD__c, HealthCloudGA__Gender__pc FROM Account
                                 WHERE Tribe_Id__c IN : HMsMap.keySet() AND RecordTypeId = :cn_RecTypeId])
                {
                   accMap.put(ac.Tribe_Id__c, ac.Date_of_Birth__c);
                   legitAccountsList.add(ac);
                }
            }
        }
        
          if (HMsMap != null && HMsMap.size() > 0)
            {
                 //iterate through map
                for(String v : HMsMap.keySet())
                {
                    //when citizen id is valid
                    if(accMap.containskey(v))
                    {
                        // when citizen id is valid but date of birth is incorrect
                        if(accMap.get(v) != HMsMap.get(v))
                        {
                             InvalidCitizenIdsList.add(v);
                        }
                        // when citizen id and date of birth both are correct
                        else
                        {
                            ValidCitizenIdsList.add(v);
                        }
                    }
                    // when citizen id invalid.
                    else
                    {
                        InvalidCitizenIdsList.add(v);
                    }
                }
            }
        
         if (InvalidCitizenIdsList != null && InvalidCitizenIdsList.size() > 0)
            {
                obj.InvalidCitizenIds = InvalidCitizenIdsList;
            }
        // end check for valid/invalid citizen ids 
       
        if (ValidCitizenIdsList != null && ValidCitizenIdsList.size() > 0)
        {
            //query requests to check if provided Household Member's Citizen id already exists on any request
            caseHasCitizenIds			=	[SELECT id, request__c, Citizen_ID__c FROM Household_Member__c where citizen_id__c IN : ValidCitizenIdsList];
            
            //query account to check DOD
            accntsWithDoDNotNull		=	[SELECT Id, Name, Tribe_Id__c, Date_of_Birth__c, DOD__c FROM Account 
                                   			WHERE Tribe_Id__c IN : ValidCitizenIdsList AND DOD__c != null AND RecordTypeId = :cn_RecTypeId];
            
            //query account to check if citizenship is relinquished 
            RelinquishedAccounts		=	[SELECT Id, Tribe_Id__c, If_CN_Citizen__c FROM Account 
                                   			WHERE Tribe_Id__c IN : ValidCitizenIdsList AND RecordTypeId = :cn_RecTypeId AND (If_CN_Citizen__c = 'No' OR Is_Void__c = 'Yes') ];	
        }

        // get household member citizen ids that exist on existing case records, if any
        if (caseHasCitizenIds != null && caseHasCitizenIds.size() > 0)
        {
             for(Household_Member__c hm : caseHasCitizenIds)
             {
                      obj.CitizenIdsOnExCases.add(hm.Citizen_ID__c);
             }
       
        }
        
        // get citizen ids of accounts DOD field is not null
        if (accntsWithDoDNotNull != null && accntsWithDoDNotNull.size() > 0)
        {
            for(Account ac : accntsWithDoDNotNull)
             {
                 obj.CitizenIdsOfAccntsWithDoDNN.add(ac.Tribe_Id__c);
             }
        }
        
        // get citizen ids of Relinquished Accounts
        if (RelinquishedAccounts != null && RelinquishedAccounts.size() > 0)
        {
            for(Account ac : RelinquishedAccounts)
             {
                 obj.CitizenIdsOfRelinquishedAccounts.add(ac.Tribe_Id__c);
             }
        }
        
       if (HMsMap != null && HMsMap.size() > 0)
        {
            if(obj.InvalidCitizenIds.size() == 0 && obj.CitizenIdsOnExCases.size() == 0 && 
               obj.CitizenIdsOfAccntsWithDoDNN.size() == 0 && obj.CitizenIdsOfRelinquishedAccounts.size() == 0 )
            {
                obj.accList	=	legitAccountsList;
            }
        }
        return obj;
    } 

	@AuraEnabled
    public static String dltHouseholdMember(Id HmRecIdToDelete)
    {
        //get user logged id
        String UserId=UserInfo.getUserId();
        //get contact id against user id
        String contactId=utility.getUserContactId(UserId); 
        
        //get RRR request information, if any
        list<Case> rCase  = [SELECT Id, Request_Reason__c, RRR_Request_Edit_Status__c, CaseNumber  FROM Case
                             WHERE ContactId =:contactId and Request_Reason__c = 'RRR' limit 1];
        
        if(rCase[0].RRR_Request_Edit_Status__c == false)
        {
            return null;
        }
        else
        {
            Household_Member__c hm	=	 new Household_Member__c();
            hm.Id					=	 HmRecIdToDelete;
            delete hm;
            return 'SUCCESS';
        }
    }        // supportting methods start for dependent picklists
    private static String decimalToBinary(Integer val) 
    {
        String bits = '';
        while (val > 0) 
        {
            Integer remainder = Math.mod(val, 2);
            val = Integer.valueOf(Math.floor(val / 2));
            bits = String.valueOf(remainder) + bits;
        }
        return bits;
    }
    
    private static String alphaBaseToBits(String validFor) 
    {
        if (String.isEmpty(validFor)) return '';
        
        String validForBits = '';
        
        for (Integer i = 0; i < validFor.length(); i++)
        {
            String thisChar = validFor.mid(i, 1);
            Integer val = getAlphaChars.indexOf(thisChar);
            String bits = decimalToBinary(val).leftPad(6, '0');
            validForBits += bits;
        }
        
        return validForBits;
    }
    
    
    private class customPicklistEntryWrapper
    {
        public String active;
        public String defaultValue;
        public String label;
        public String value;
        public String validFor;
        
    }
    
}