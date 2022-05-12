/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba
@Date: June/28/2021
@Purpose: This class is used as controller for Community_ClothingAssistance aura component.
---------------------------------------------------------------------------------------------------------------*/

public without sharing class Community_ClothingAssistanceController {
    // custom exception class
     public class CA_Exception extends Exception 
     {}
    
      //Call Melissa Data API
    @AuraEnabled
    public static String getMelissaAddresses(String input, String country){
        return MelissaDataController.SendRequest(input, country);
    }
    
    @AuraEnabled
    public static Map<string, string> getStates(){
        Map<string, US_States__c> mapCodes = US_States__c.getAll();
        Map<string, string> mapStateCodes = new Map<string, string>();
        for(string key:mapCodes.keySet()){
            mapStateCodes.put(mapCodes.get(key).ISO_Code__c, key);
        }
        return mapStateCodes;
    }
    
    @AuraEnabled
    public static void sendOTP(id accountId,String Mobile){
        // generate random OTP
        String rand = string.valueof(Math.abs(Crypto.getRandomInteger()));
        String OTP = rand.substring(0,6); 
        Contact us =[SELECT Id, Email, User_Email__c,OTP_Gen_from_Portal__c,OtherPhone, OTP_Generated_Time__c, OTP_Counter__c, OTP__c, Name FROM Contact where AccountId =: accountId limit 1];

        //get OTP on user record so we can set merge field
        us.OTP_Gen_from_Portal__c	=	true;
        us.OTP__c					=	OTP;
        us.OTP_Counter__c			=	3;
        us.OtherPhone				=	Mobile;
        us.OTP_Generated_Time__c	=System.now();
        update us;
    } 
    
    @AuraEnabled
    public static String validateEnteredOTP(id accountId,String otp){
        Contact us =[SELECT Id, Email, User_Email__c,OTP_Validity__c,OTP_Gen_from_Portal__c,OtherPhone, OTP_Generated_Time__c, OTP_Counter__c, OTP__c, Name FROM Contact where AccountId =: accountId limit 1];
	
        if(us.OTP_Validity__c && us.OTP_Counter__c>0 && us.OTP__c==otp){
            return 'success';
        }
        else if(us.OTP_Validity__c && us.OTP_Counter__c>0 && us.OTP__c!=otp){
            Decimal count=us.OTP_Counter__c;
            us.OTP_Counter__c			=	count-1;
            update us;
        }
        if(!us.OTP_Validity__c || us.OTP_Counter__c==0){
            return 'failed';
        }else{
            return 'wrong otp';
        }
    }
    
    // get  case information
    @AuraEnabled 
    public static Community_ClothingAssistanceWrapper validateApplicantEligibility()
    {
        //get user id
        String UserId=UserInfo.getUserId();
        
        //get contact id against user id
        String contactId=utility.getUserContactId(UserId); 
        
         //get CA Request record type id
        Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('CA').getRecordTypeId();
        
        //initialize wrapper class
        Community_ClothingAssistanceWrapper obj = 		new Community_ClothingAssistanceWrapper();
        obj.ClothingApplication 				= 		new Case();
        obj.userClothingApplication				= 		'';
        obj.noClothingApplicationSubmitted		=		'';
        obj.IsMinor								=		'';
        
        //get user account information
        Account userAccount = [SELECT Id,  Date_of_Birth__c FROM Account WHERE PersonContactId =: contactId limit 1];
        
        Integer days = userAccount.Date_of_Birth__c.daysBetween(Date.Today());
        Integer age = Integer.valueOf(days/365);
        
            //query case Clothing application information, if any
            list<Case> rCase  = [SELECT Id, Request_Reason__c, RRR_Request_Edit_Status__c, CaseNumber, Status  FROM Case
                                 WHERE ContactId =:contactId and Request_Reason__c = 'CA' and RecordTypeId =: caseRecordTypeId limit 1];
            
             
            //logged in user had submitted a Clothing Application
            if(rCase.size() > 0)
            {
                obj.ClothingApplication 	= 	rCase[0];
                obj.userClothingApplication =   'True';
            }
            
            //logged in user has no Clothing Application
            else
            {
                obj.noClothingApplicationSubmitted	=	'True';
                obj.wrp = getData('Case', 'Physical_Countries__c', 'Physical_States__c');
                obj.statesMap = getStates();
                
                system.debug('AKKK age '+age);
                // if logged in user is a minor
                if( age < 18)
                {
                    obj.IsMinor	= 'Yes'; 
                }
            }
       
        return obj;
    }    
    
    
	// get initial data
    @AuraEnabled
    public static Community_ClothingAssistanceDataWrapper getData(String strObjectName, string strparentField, string strchildField)
    {
        //get user logged id
        String UserId=UserInfo.getUserId();
        //get contact id against user id
        String contactId=utility.getUserContactId(UserId);  
        
        Id cn_RecTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('CN_Registration').getRecordTypeId();
        
        Community_ClothingAssistanceDataWrapper obj 	= 		new Community_ClothingAssistanceDataWrapper();
        obj.acnt										= 		new Account();
        Map<String,List<String>> pickListMap 			= 		new Map<String,List<String>>();
        obj.pickListMap									= 		pickListMap;
        obj.grade 										= 		new Map<String, String>();
        obj.relation 									= 		new Map<String, String>();
        obj.category 									= 		new Map<String, String>();
        
         //    Describe call for grade picklist values
        Schema.DescribeFieldResult fieldResult1 = CA_Household_Member__c.Grade__c.getDescribe();
        List<Schema.PicklistEntry> picklist1 = fieldResult1.getPicklistValues();
        
         for(Schema.PicklistEntry s : picklist1)
         {
            obj.grade.put(s.getValue(), s.getLabel());
        }  
        
         //    Describe call for grade picklist values
        Schema.DescribeFieldResult fieldResultCategory = CA_Household_Member__c.Sector__c.getDescribe();
        List<Schema.PicklistEntry> picklistCategory = fieldResultCategory.getPicklistValues();
        
         for(Schema.PicklistEntry s : picklistCategory)
         {
            obj.category.put(s.getValue(), s.getLabel());
        }  
        
       //    Describe call for grade picklist values
        Schema.DescribeFieldResult fieldResultRel = Case.Relation__c.getDescribe();
        List<Schema.PicklistEntry> picklistRel = fieldResultRel.getPicklistValues();
        
         for(Schema.PicklistEntry s : picklistRel)
         {
            obj.relation.put(s.getValue(), s.getLabel());
        }  
        
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
        
        obj.pickListMap = pickListMap;
        
        //query logged in user account information
        Account acc = [SELECT Id, FirstName, Tribe_Id__c, Middle_Name__c, LastName, Date_of_Birth__c, PersonEmail, PersonMobilePhone , HealthCloudGA__Gender__pc ,
                       PersonMailingStreet, PersonMailingCity, PersonMailingState, PersonMailingCountry, PersonMailingPostalCode, Mailing_Suite__c,
                       PersonOtherStreet, PersonOtherCity, PersonOtherState,  PersonOtherCountry, PersonOtherPostalCode, Physical_Suite__c
                       FROM Account WHERE PersonContactId =: contactId  AND RecordTypeId = :cn_RecTypeId limit 1];
        
        obj.acnt	= acc;
        
        User usr 	  = [SELECT Name, Email FROM User where id =: UserId limit 1];
        obj.userEmail = usr.Email;

        // return wrapper
        return obj;
    }  
    
    //validate legit students
    @AuraEnabled
    public static Community_ClothingAssistanceWrapper validateStudentsList(List<CA_Household_Member__c> StudentsList)
    {
        Map<String, Date> StudentsMap					  =		new Map<String, Date>();
        Map<String, Date> accMap						  = 		new Map<String, Date>();
        List<String> InvalidCitizenIdsList				  = 		new List<String>();
        List<String> ValidCitizenIdsList				  = 		new List<String>();
        List<CA_Household_Member__c> existingStudentsOnCA = 		new List<CA_Household_Member__c>();
        List<Account> accntsWithDoDNotNull				  = 		new List<Account>();
        List<Account> RelinquishedAccounts				  = 		new List<Account>();
        List<Account> legitAccountsList					  = 		new List<Account>();
        Id cn_RecTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('CN_Registration').getRecordTypeId();

        //initialize wrapper class
        Community_ClothingAssistanceWrapper obj = 		new Community_ClothingAssistanceWrapper();
        obj.InvalidCitizenIds					= 		new list<String>();
        obj.CitizenIdsOfAccntsWithDoDNN			= 		new list<String>();
        obj.CitizenIdsOfRelinquishedAccounts	= 		new list<String>();
 		obj.accList								=		new List<Account>();
        
     // check for valid/invalid citizen ids   
        if(StudentsList != null && StudentsList.size() > 0)
        {
           for(CA_Household_Member__c StudentsIn : StudentsList)
        	{   
            	StudentsMap.put(StudentsIn.Citizen_ID__c, StudentsIn.Date_of_Birth__c); 
        	}
           
            if (StudentsMap != null && StudentsMap.size() > 0)
            {                
                //get legit accounts on basis of citizen id
                for(Account ac : [SELECT Id, FirstName, LastName, Name, Tribe_Id__c, Date_of_Birth__c, DOD__c, HealthCloudGA__Gender__pc FROM Account
                                  WHERE Tribe_Id__c IN : StudentsMap.keySet() AND RecordTypeId = :cn_RecTypeId])
                {
                    accMap.put(ac.Tribe_Id__c, ac.Date_of_Birth__c);
                    legitAccountsList.add(ac);
                }
            }
        }
        
          if (StudentsMap != null && StudentsMap.size() > 0)
            {
                 //iterate through map
                for(String v : StudentsMap.keySet())
                {
                    //when citizen id is valid
                    if(accMap.containskey(v))
                    {
                         system.debug('AKK have acc id');
                        // when citizen id is valid but date of birth is incorrect
                        if(accMap.get(v) != StudentsMap.get(v))
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
            //query account to check DOD
            accntsWithDoDNotNull		=	[SELECT Id, Name, Tribe_Id__c, Date_of_Birth__c, DOD__c FROM Account 
                                   			WHERE Tribe_Id__c IN : ValidCitizenIdsList AND DOD__c != null AND RecordTypeId = :cn_RecTypeId];
            
            //query account to check if citizenship is relinquished 
            RelinquishedAccounts		=	[SELECT Id, Tribe_Id__c, If_CN_Citizen__c FROM Account 
                                   			WHERE Tribe_Id__c IN : ValidCitizenIdsList AND RecordTypeId = :cn_RecTypeId AND (If_CN_Citizen__c = 'No' OR Is_Void__c = 'Yes') ];	
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
        
       if (StudentsMap != null && StudentsMap.size() > 0)
        {
            if(obj.InvalidCitizenIds.size() == 0  &&  obj.CitizenIdsOfAccntsWithDoDNN.size() == 0 && obj.CitizenIdsOfRelinquishedAccounts.size() == 0 )
            {
                obj.accList	=	legitAccountsList;
            }
        }
        return obj;
    } 

    // create clothing assistance request 
    @AuraEnabled
    public static case saveCARequest(List<CA_Household_Member__c> StudentsList,
                                   String mailingStreet, String mailingCity, String mailingCountry, String mailingState, String mailingOtherState,
                                   String mailingZip, String priMobilePhone, String suite, String addressLine2, String addressFreeForm, Boolean isManual, Boolean isAddressChanged,
                                   String SecConFirstName, String SecConLastName, String SecConPhone, String SecConRelation, String PriGuardianFirstName,
                                   String PriGuardianLastName, String PriGuardianPhone)
    {
        List<CA_Household_Member__c> StudentsListToInsert		= 		new List<CA_Household_Member__c>();
        //get user logged id
        String UserId		=	UserInfo.getUserId();
        //get contact id against user id
        String contactId	=	utility.getUserContactId(UserId); 
        
        User usr  = [SELECT Name, Email, Account.Date_of_Birth__c, Account.FirstName, Account.LastName, Account.Id FROM User where id =: UserId limit 1];
        
        //get CA Request record type id
        Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('CA').getRecordTypeId();
       
        Integer days = usr.Account.Date_of_Birth__c.daysBetween(Date.Today());
        Integer age = Integer.valueOf(days/365);
        
        if(age <18 && (String.isBlank(PriGuardianFirstName) || String.isBlank(PriGuardianLastName) || String.isBlank(PriGuardianPhone)))
        {
            if(String.isBlank(PriGuardianFirstName)){
                throw new CA_Exception('Please enter a valid First Name.');
            } else if(String.isBlank(PriGuardianLastName)){
                throw new CA_Exception('Please enter a valid Last Name.');
            } else if(String.isBlank(PriGuardianPhone)){
                throw new CA_Exception('Please enter a valid Phone.');
            } else{
                throw new CA_Exception('You must fill all of the Primary Guardian information.');
            }
        } else if(String.isBlank(mailingStreet) || String.isBlank(mailingCity) || 
          String.isBlank(mailingCountry) || String.isBlank(mailingZip) || (mailingCountry == 'United States' &&
          String.isBlank(mailingState)) || (mailingCountry != 'United States' &&
                                            String.isBlank(mailingOtherState))){
                                                if(String.isBlank(mailingStreet)){
                                                    throw new CA_Exception('Please enter a valid Address Line1.'); 
                                                } else if(String.isBlank(mailingCity)){
                                                    throw new CA_Exception('Please enter a valid City.'); 
                                                } else if(String.isBlank(mailingCountry)){
                                                    throw new CA_Exception('Please select a valid Country.'); 
                                                } else if(String.isBlank(mailingZip)){
                                                    throw new CA_Exception('Please enter a valid Zip Code.'); 
                                                } else if((mailingCountry == 'United States' &&
                                                           String.isBlank(mailingState))){
                                                               throw new CA_Exception('Please select a valid State.'); 
                                                           }
                                                else if((mailingCountry != 'United States' &&
                                                         String.isBlank(mailingOtherState))){
                                                             throw new CA_Exception('Please enter a valid Other State.'); 
                                                         }
                                                else{
               										throw new CA_Exception('Please ensure the address information is complete.');
                                                }
        } else if((String.isNotBlank(SecConFirstName) || String.isNotBlank(SecConLastName) || String.isNotBlank(SecConPhone) || 
                  String.isNotBlank(SecConRelation)) && (String.isBlank(SecConFirstName) || String.isBlank(SecConLastName) || 
                                                         String.isBlank(SecConPhone) || String.isBlank(SecConRelation))){
                  throw new CA_Exception('You must fill all of the Alternate Contact information.');                                           
        }
        else
        {
            // create case record
            Case cse 									=		new Case();
            cse.RecordTypeId 							=		caseRecordTypeId;
            cse.Status									=		'New';
            cse.Origin									=		'Portal';
            cse.Priority								=		'Medium';
            cse.Request_Reason__c						=		'CA';
            cse.Primary_Contact_First_Name__c 			=		usr.Account.FirstName;
            cse.Primary_Contact_Last_Name__c			=		usr.Account.LastName; 
            cse.Ebt_Mobile_Phone__c						=		priMobilePhone;
            cse.AccountId								=		usr.Account.Id;
            cse.ContactId								=		contactId;
            //    cse.Mobile_Verified__c						=		priConPhonerVerStatus;
            cse.Mailing_Street__c						=		mailingStreet;
            cse.Mailing_City__c							=		mailingCity;
            cse.Mailing_ZipPostal_Code__c				=		mailingZip;
            cse.Mailing_Countries__c					=		mailingCountry;
            cse.Mailing_States__c						=		mailingState;
            cse.Other_Mailing_State__c					=		mailingOtherState;
            cse.Ebt_Email__c							=		usr.Email;
            cse.mailing_suite__c 						=		suite;
            cse.mailing_address2__c						=		addressLine2;
            cse.Melissa_Address__c						=		addressFreeForm;
            cse.Is_Address_Changed__c					=		isAddressChanged;
            cse.Is_Manual_Address__c					=		isManual;
            cse.Sec_First_Name__c						=		SecConFirstName;
            cse.Sec_Last_Name__c						=		SecConLastName;
            cse.Sec_Phone__c							=		SecConPhone;
            cse.Relation__c								=		SecConRelation;
            cse.PG_First_Name__c			 			=		PriGuardianFirstName;
            cse.PG_Last_Name__c							=		PriGuardianLastName; 
            cse.PG_Mobile_Phone__c						=		PriGuardianPhone;
            
            
            
            
            insert cse;
            
            //query inserted case to get case number
            Case userCase = [SELECT Id, CaseNumber FROM Case WHERE Id =: cse.Id limit 1];
            
            //insert CA Students
            
            for(CA_Household_Member__c student : StudentsList)
            { 
                student.Request__c	=	cse.Id;
                StudentsListToInsert.add(student);
            }
            
            insert StudentsListToInsert;
            
            
            return userCase;
        }
        
       
    } 
         private static final String getAlphaChars = '' +
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz' +
        '0123456789+/';
    
    // private methods for dependent picklist
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