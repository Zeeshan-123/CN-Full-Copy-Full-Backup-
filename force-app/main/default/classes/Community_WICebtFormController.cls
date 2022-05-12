/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba Asif
@Date: March/03/2021
@Purpose: This class is used as controller for Community_WICebtForm aura component.
---------------------------------------------------------------------------------------------------------------*/


public without sharing class Community_WICebtFormController 
{
     private static final String getAlphaChars = '' +
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz' +
        '0123456789+/';
 
     // get  picklist values
       @AuraEnabled
    public static Case ebtRequestCheck()
    {
        //get user id
        String UserId=UserInfo.getUserId();
        //get contact id against user id
        String contactId=utility.getUserContactId(UserId); 
        
        //get user open cases
        list<Case> cse  = [SELECT Id, Request_Reason__c, EBT_Confirmation_Number__c  FROM Case
                           WHERE ContactId =:contactId and Request_Reason__c = 'Summer EBT' ];
        if(cse.size() > 0)
        {
             return cse[0];
             
        }
        else
        {
           return null;
        }
       
    }
    
    // get  picklist values
       @AuraEnabled
    public static Community_WICebtFormWrapper getPicklistValues(String strObjectName, string strparentField, string strchildField)
    {
        //get user logged id
        String UserId=UserInfo.getUserId();
        //get contact id against user id
        String contactId=utility.getUserContactId(UserId);  
        
        Community_WICebtFormWrapper objList 	= 		new Community_WICebtFormWrapper();
        objList.gender 							= 		new Map<String, String>();
        objList.ethnicity 						= 		new Map<String, String>();
        objList.tribe 							= 		new Map<String, String>();
        objList.grade 							= 		new Map<String, String>();
        objList.school 							= 		new Map<String, String>();
        objList.fosterChild 					= 		new Map<String, String>();
        objList.migrant 						= 		new Map<String, String>();
        objList.homeLanguage 					= 		new Map<String, String>();
        objList.incomeFrequency 				= 		new Map<String, String>();
		objList.acnt							= 		new Account();
        Map<String,List<String>> pickListMap 	= 		new Map<String,List<String>>();
        objList.pickListMap						= 		pickListMap;
        objList.userEmail						= 		'';
        
  
        //    Describe call for gender picklist values
        Schema.DescribeFieldResult fieldResult2 = Account.HealthCloudGA__Gender__pc.getDescribe();
        List<Schema.PicklistEntry> picklist2 = fieldResult2.getPicklistValues();
        
       for(Schema.PicklistEntry s : picklist2)
         {
            objList.gender.put(s.getValue(), s.getLabel());
        }  

        //    Describe call for ethnicity picklist values
        Schema.DescribeFieldResult fieldResult3 = Account.Ethnicity__c.getDescribe();
        List<Schema.PicklistEntry> picklist3 = fieldResult3.getPicklistValues();
        
         for(Schema.PicklistEntry s : picklist3)
         {
            objList.ethnicity.put(s.getValue(), s.getLabel());
        }  
        
        //    Describe call for tribe picklist values
        Schema.DescribeFieldResult fieldResult4 = Account.Tribe__c.getDescribe();
        List<Schema.PicklistEntry> picklist4 = fieldResult4.getPicklistValues();
        
         for(Schema.PicklistEntry s : picklist4)
         {
            objList.tribe.put(s.getValue(), s.getLabel());
        }  
        
        //    Describe call for grade picklist values
        Schema.DescribeFieldResult fieldResult5 = Account.Grade__c.getDescribe();
        List<Schema.PicklistEntry> picklist5 = fieldResult5.getPicklistValues();
        
         for(Schema.PicklistEntry s : picklist5)
         {
            objList.grade.put(s.getValue(), s.getLabel());
        }  
        
        
         //    Describe call for school picklist values
        Schema.DescribeFieldResult fieldResult6 = Account.School__c.getDescribe();
        List<Schema.PicklistEntry> picklist6 = fieldResult6.getPicklistValues();
        
         for(Schema.PicklistEntry s : picklist6)
         {
            objList.school.put(s.getValue(), s.getLabel());
        }  
        
        
        
         //    Describe call for fosterChild picklist values
        Schema.DescribeFieldResult fieldResult7 = Account.Foster_Child__c.getDescribe();
        List<Schema.PicklistEntry> picklist7 = fieldResult7.getPicklistValues();
        
         for(Schema.PicklistEntry s : picklist7)
         {
            objList.fosterChild.put(s.getValue(), s.getLabel());
        }  
        
        
          //    Describe call for migrant picklist values
        Schema.DescribeFieldResult fieldResult8 = Account.Migrant__c.getDescribe();
        List<Schema.PicklistEntry> picklist8 = fieldResult8.getPicklistValues();
        
         for(Schema.PicklistEntry s : picklist8)
         {
            objList.migrant.put(s.getValue(), s.getLabel());
        }  

        //    Describe call for homeLanguage picklist values
        Schema.DescribeFieldResult fieldResult9 = Account.Home_Language__c.getDescribe();
        List<Schema.PicklistEntry> picklist9 = fieldResult9.getPicklistValues();
        
       for(Schema.PicklistEntry s:picklist9)
         {
            objList.homeLanguage.put(s.getValue(), s.getLabel());
        }  
        
         //    Describe call for incomeFrequency picklist values
        Schema.DescribeFieldResult fieldResult10 = Account.Income_Frequency__c.getDescribe();
        List<Schema.PicklistEntry> picklist10 = fieldResult10 .getPicklistValues();
        
       for(Schema.PicklistEntry s:picklist10 )
         {
            objList.incomeFrequency.put(s.getValue(), s.getLabel());
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
        
        objList.pickListMap = pickListMap;
        
         //query logged in user account information
        Account acc = [SELECT Id, Suffix__c, FirstName, Middle_Name__c, LastName, HealthCloudGA__Gender__pc,
                        Date_of_Birth__c, PersonEmail, Phone, PersonMobilePhone , PersonOtherPhone , 
                        PersonMailingStreet, PersonMailingCity, PersonMailingState, PersonMailingCountry, PersonMailingPostalCode,
                        PersonOtherStreet, PersonOtherCity, PersonOtherState, PersonOtherCountry, PersonOtherPostalCode
                        FROM Account WHERE PersonContactId =: contactId limit 1];
            
       objList.acnt=acc;
        
       User usr = [SELECT Name, Email FROM User where id =: UserId limit 1];
       objList.userEmail=usr.Email;
       // return wrapper
       return objList;
    }        
  
        
     // create parent child accounts and add them in a household account   
    @AuraEnabled
    public static Case saveAccounts(List<Account> childsAccountList, String spokenHomeLanguage, String otherLanguage, String[] programParticipated, 
                                     String householdIncome, String incomeFrequency, String householdSize,
                                     String priConFirstName, String priConMiddleName, String priConLastName, String priConSuffix, Date dob,
                                     String physicalStreet, String physicalCity, String physicalCountry, String physicalState,  String physicalZip,String mailingStreet,
                                     String mailingCity, String mailingCountry, String mailingState, String mailingZip, String priConEmail,
                                     String priHomePhone, String priMobilePhone, String priWorkPhone, String secConFirstName, String secConLastName, String secConPhone,
                                     String secConEmail )
    {
        
        List<Account> childsAccountListToInsert = new List<Account>();
        List<Account> insertedChildsAccountList = new List<Account>();
        Set<Id> insertedChildsAccountIds=new Set<Id>();
        List<AccountContactRelation> AccountContactRelationChildList = new List<AccountContactRelation>();
        
        //get user logged id
        String UserId=UserInfo.getUserId();
        //get contact id against user id
        String contactId=utility.getUserContactId(UserId); 
        
        //query logged in user account information
        Account userAccount = [SELECT Id, FirstName, LastName, Tribe_Id__c FROM Account WHERE PersonContactId =: contactId limit 1];
        String accId =  userAccount.Id;
        
        String pPrograms='';
        if(programParticipated != null && programParticipated.size() > 0)
        {
            for(integer i=0 ; i < programParticipated.size() ; i++)
            {
                pPrograms += programParticipated[i]+ ';';
            }
        }
        
        
        // update parent account
        Account acc = new Account();
        acc.ID								=		accId;
        acc.Household_Income__c				=		householdIncome;
        acc.Income_Frequency__c				=		incomeFrequency;
        acc.Household_Size__c				=		householdSize;
        acc.Home_Language__c				=		spokenHomeLanguage;
        acc.Other_Language__c				=		otherLanguage;
        acc.Participated_Programs__c		=		pPrograms;
        
        update acc;
        
        //create household account with parent/guardian name
        Id householdRecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('Parent_Guardian_Household').getRecordTypeId();
        Account houseHoldAccount = new Account();
        houseHoldAccount.Name=userAccount.FirstName +' '+ userAccount.LastName+' '+'Household';
        houseHoldAccount.RecordTypeId = householdRecordTypeId;
        insert houseHoldAccount;
        
        // add parent in household
        AccountContactRelation acctCnt = new AccountContactRelation(AccountId = houseHoldAccount.Id, ContactId = contactId, Roles = 'Parent/Guardian');
        insert acctCnt; 
        
        //get Student record type id
        Id studentRecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('Student').getRecordTypeId();
        
        // insert child records
        if(childsAccountList != null && childsAccountList.size() > 0)
        {
            for(Account a : childsAccountList)
            {
                a.RecordTypeId 	= 	studentRecordTypeId;
                childsAccountListToInsert.add(a);
            }
            insert childsAccountListToInsert;
        }
        
        for(Account accIn : childsAccountListToInsert)
        {   
            insertedChildsAccountIds.add(accIn.Id); 
        }
        
        insertedChildsAccountList = 	[SELECT Id, PersonContactId,firstname,lastname,Middle_Name__c
                                         FROM Account WHERE Id IN : insertedChildsAccountIds];      
        
        // insert child records in household
        if(insertedChildsAccountList != null && insertedChildsAccountList.size() > 0)
        {
            for(Account nc : insertedChildsAccountList)
            {
                AccountContactRelationChildList.add( new  AccountContactRelation (AccountId = houseHoldAccount.id, ContactId = nc.PersonContactId, Roles = 'Child/Dependent'));
            }
            insert AccountContactRelationChildList;
        }
        
        //get EBT Request record type id
        Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('EBT_Request').getRecordTypeId();
       
        // create case record
        Case cse 							=		new Case();
        cse.RecordTypeId 					=		caseRecordTypeId;
        cse.Status							=		'New';
        cse.Origin							=		'Portal';
        cse.Priority						=		'Medium';
        cse.Request_Reason__c				=		'Summer EBT';
        cse.AccountId						=		accId;
         cse.ContactId						=		contactId;
        cse.Child_Account__c				=		houseHoldAccount.id;
        cse.Primary_Contact_First_Name__c 	=		priConFirstName;
        cse.Primary_Contact_Middle_Name__c	=		priConMiddleName;
        cse.Primary_Contact_Last_Name__c	=		priConLastName;
        cse.Primary_Contact_Suffix__c		=		priConSuffix;
        cse.Primary_Contact_Date_of_Birth__c=		dob;
        cse.Income_Frequency__c				=		incomeFrequency;
        cse.Spoken_Home_Language__c			=		spokenHomeLanguage;
        cse.Other_Language__c				=		otherLanguage;
        cse.Participated_Programs__c		=		pPrograms;
        cse.Ebt_Email__c					=		priConEmail;
        cse.Ebt_Home_Phone__c				=		priHomePhone;
        cse.Ebt_Mobile_Phone__c				=		priMobilePhone;
        cse.Ebt_Work_Phone__c				=		priWorkPhone;
        cse.Mailing_Street__c				=		mailingStreet;
        cse.Mailing_City__c					=		mailingCity;
        cse.Mailing_ZipPostal_Code__c		=		mailingZip;
        cse.Mailing_Countries__c			=		mailingCountry;
        cse.Mailing_States__c				=		mailingState;
        cse.Physical_Street__c				=		physicalStreet;
        cse.Physical_City__c				=		physicalCity;
        cse.Physical_ZipPostal_Code__c  	=		physicalZip;
        cse.Physical_Countries__c			=		physicalCountry;
        cse.Physical_States__c				=		physicalState;
        cse.Sec_First_Name__c				=		secConFirstName;
        cse.Sec_Last_Name__c				=		secConLastName;
        cse.Sec_Phone__c					=		secConPhone;
        cse.Sec_Email__c					=		secConEmail;
        
        insert cse;
        
        //query inserted case to get confirmation number generated by trigger for this particular case
        Case userCase = [SELECT Id, EBT_Confirmation_Number__c FROM Case WHERE Id =: cse.Id limit 1];
        
        List<AccountCaseJunction__c> ACJList=new list<AccountCaseJunction__c>();
           
        // create AccountContactJunction record for children
        if(insertedChildsAccountList != null && insertedChildsAccountList.size() > 0)
        {
            for(Account nc : insertedChildsAccountList)
            {
                AccountCaseJunction__c acj 		= 		new AccountCaseJunction__c();
                if(nc.Middle_Name__c!=null)
                	acj.name					=		nc.FirstName+' '+nc.Middle_Name__c + ' ' + nc.LastName;
                else
                    acj.name					=		nc.FirstName + ' ' + nc.LastName;
                acj.Request__c					=		cse.id;
                acj.Account__c					=		nc.id;
                ACJList.add(acj);
            }
            
             insert ACJList;
        }
       
        
        return userCase;
    } 
    
      // supportting methods start for dependent picklists
    public static String decimalToBinary(Integer val) 
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
    
    public static String alphaBaseToBits(String validFor) 
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
    
    
    public class customPicklistEntryWrapper
    {
        public String active;
        public String defaultValue;
        public String label;
        public String value;
        public String validFor;
        
    }

}