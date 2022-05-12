/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba Asif
@Date: 23/02/2021
@Purpose: This class is used as controller for WIC_requestForm aura component.
---------------------------------------------------------------------------------------------------------------*/


public without sharing class WIC_requestFormController {

    private static final String getAlphaChars = '' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789+/';

    /**
     * Retrieve Data on EBT Form Load
     */
    @AuraEnabled
    public static Map<String, Object> retrieveDataOnInit(String strObjectName, string strparentField, string strchildField) {
        Map<String, Object> rst = new Map<String, Object>();

        //get user id
        String UserId = UserInfo.getUserId();

        //get contact id against user id
        String contactId = utility.getUserContactId(UserId);

        if(String.isNotBlank(contactId)) {
            // Cherokee Nation Citizen found
            rst.put('isCNCitizen', true);
        
            String strWicsProgramStartDate = System.Label.WIC_Program_StartDate;
            List<String> lstDateVars = strWicsProgramStartDate.split('/');
            Date wicsProgStartDate = Date.newInstance(Integer.valueOf(lstDateVars[2]), Integer.valueOf(lstDateVars[0]), Integer.valueOf(lstDateVars[1]));

            //Get Current CN User Open Case
            List<Case> lstCases  = [SELECT Id, CaseNumber, Request_Reason__c
                                    FROM Case
                                    WHERE ContactId =:contactId 
                                    AND Request_Reason__c = 'Summer EBT'
                                    AND CreatedDate >= :wicsProgStartDate
                                    ORDER BY CreatedDate DESC 
                                    LIMIT 1];

            if(!lstCases.isEmpty()) {
                rst.put('existingCase', lstCases[0]);
            } else {
                Account currentUserAcc = [SELECT Id, Suffix__c, FirstName, Middle_Name__c, LastName, HealthCloudGA__Gender__pc,
                                          Date_of_Birth__c, PersonEmail, Phone, PersonMobilePhone , PersonOtherPhone , 
                                          PersonMailingStreet, PersonMailingCity, PersonMailingState, PersonMailingCountry, PersonMailingPostalCode,
                                          PersonOtherStreet, PersonOtherCity, PersonOtherState, PersonOtherCountry, PersonOtherPostalCode
                                          FROM Account 
                                          WHERE PersonContactId =: contactId LIMIT 1];
                rst.put('currentUserAcc', currentUserAcc);
                rst.put('picklistMapping', getPicklistValues(strObjectName, strparentField, strchildField));
            }
        } else {
            // Cherokee Nation Citizen NOT found
            rst.put('isCNCitizen', false);
            rst.put('picklistMapping', getPicklistValues(strObjectName, strparentField, strchildField));
        }
        return rst;
    }
 
    /**
     * Get picklist values for the form
     */
    public static WIC_requestFormWrapper getPicklistValues(String strObjectName, string strparentField, string strchildField) {
        WIC_requestFormWrapper objList 		    = 	new WIC_requestFormWrapper();
        objList.gender 						    = 	new Map<String, String>();
        objList.ethnicity 					    = 	new Map<String, String>();
        objList.tribe                           = 	new Map<String, String>();
        objList.lowLactoseOptionRequired        = 	new Map<String, String>();
        objList.grade 						    = 	new Map<String, String>();
        objList.school 						    = 	new Map<String, String>();
        objList.fosterChild 				    = 	new Map<String, String>();
        objList.migrant 					    = 	new Map<String, String>();
        objList.homeLanguage 				    = 	new Map<String, String>();
        objList.incomeFrequency 			    = 	new Map<String, String>();
		Map<String,List<String>> pickListMap    = 	new Map<String,List<String>>();
        objList.pickListMap					    =   pickListMap;


        // Describe call for gender picklist values
        Schema.DescribeFieldResult fieldResult2 = Account.HealthCloudGA__Gender__pc.getDescribe();
        List<Schema.PicklistEntry> picklist2 = fieldResult2.getPicklistValues();
        for(Schema.PicklistEntry s : picklist2)
        {
            objList.gender.put(s.getValue(), s.getLabel());
        }  

        // Describe call for ethnicity picklist values
        Schema.DescribeFieldResult fieldResult3 = Account.Ethnicity__c.getDescribe();
        List<Schema.PicklistEntry> picklist3 = fieldResult3.getPicklistValues();
        for(Schema.PicklistEntry s : picklist3)
        {
            objList.ethnicity.put(s.getValue(), s.getLabel());
        }  
        
        // Describe call for tribe picklist values
        Schema.DescribeFieldResult fieldResult4 = Account.Tribe__c.getDescribe();
        List<Schema.PicklistEntry> picklist4 = fieldResult4.getPicklistValues();
        for(Schema.PicklistEntry s : picklist4)
        {
            objList.tribe.put(s.getValue(), s.getLabel());
        }

        // CNHPHOMS-16, CNHPHOMS-32: Vikash: Added Low-Lactose Option Required?
        fieldResult4 = Account.Low_Lactose_Option_Required__c.getDescribe();
        picklist4 = fieldResult4.getPicklistValues();
        for(Schema.PicklistEntry s : picklist4)
        {
            objList.lowLactoseOptionRequired.put(s.getValue(), s.getLabel());
        }  

        // Describe call for grade picklist values
        Schema.DescribeFieldResult fieldResult5 = Account.Grade__c.getDescribe();
        List<Schema.PicklistEntry> picklist5 = fieldResult5.getPicklistValues();
        
        for(Schema.PicklistEntry s : picklist5)
        {
            objList.grade.put(s.getValue(), s.getLabel());
        }  
        
        // Describe call for school picklist values
        Schema.DescribeFieldResult fieldResult6 = Account.School__c.getDescribe();
        List<Schema.PicklistEntry> picklist6 = fieldResult6.getPicklistValues();
        for(Schema.PicklistEntry s : picklist6)
        {
            objList.school.put(s.getValue(), s.getLabel());
        }  
        
        // Describe call for fosterChild picklist values
        Schema.DescribeFieldResult fieldResult7 = Account.Foster_Child__c.getDescribe();
        List<Schema.PicklistEntry> picklist7 = fieldResult7.getPicklistValues();
        for(Schema.PicklistEntry s : picklist7)
        {
            objList.fosterChild.put(s.getValue(), s.getLabel());
        }  
        
        // Describe call for migrant picklist values
        Schema.DescribeFieldResult fieldResult8 = Account.Migrant__c.getDescribe();
        List<Schema.PicklistEntry> picklist8 = fieldResult8.getPicklistValues();
        for(Schema.PicklistEntry s : picklist8)
        {
            objList.migrant.put(s.getValue(), s.getLabel());
        }  

        // Describe call for homeLanguage picklist values
        Schema.DescribeFieldResult fieldResult9 = Account.Home_Language__c.getDescribe();
        List<Schema.PicklistEntry> picklist9 = fieldResult9.getPicklistValues();
        for(Schema.PicklistEntry s:picklist9)
        {
            objList.homeLanguage.put(s.getValue(), s.getLabel());
        }  
        
        // Describe call for incomeFrequency picklist values
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
        
        for (customPicklistEntryWrapper plew : depEntriesList) {
            String validForBits = alphaBaseToBits(plew.validFor);
            for (Integer i = 0; i < validForBits.length(); i++) {
                String bit = validForBits.mid(i, 1);
                if (bit == '1') {
                    pickListMap.get(controllingValues.get(i)).add(plew.label);
                }
            }
        }
        objList.pickListMap = pickListMap;
        
        return objList;
    }
    
	// create parent child accounts and add them in a household account   
    @AuraEnabled
    public static Map<String, Object> saveAccounts(List<Account> childsAccountList, String spokenHomeLanguage, String otherLanguage, String[] programParticipated, 
                                     String householdIncome, String incomeFrequency, String householdSize,
                                     String priConFirstName, String priConMiddleName, String priConLastName, String priConSuffix, Date dob, String priConCitizenNumber,
                                     String physicalStreet, String physicalCity, String physicalCountry, String physicalState,  String physicalZip,String mailingStreet,
                                     String mailingCity, String mailingCountry, String mailingState, String mailingZip, String priConEmail,
                                     String priHomePhone, String priMobilePhone, String priWorkPhone, String secConFirstName, String secConLastName, String secConPhone,
                                     String secConEmail, Map<String, Object> mapWicsFormData)
    {
        Map<String, Object> mapRst = new Map<String, Object>();
        try {
            Set<Id> insertedChildsAccountIds		=	new Set<Id>();
            List<Account> childsAccountListToInsert = 	new List<Account>();
            List<Account> insertedChildsAccountList = 	new List<Account>();
            List<AccountContactRelation> AccountContactRelationChildList = new List<AccountContactRelation>();

            Guest_Records_Owner__mdt guestRecordOwnerId	=	[SELECT MasterLabel FROM Guest_Records_Owner__mdt WHERE DeveloperName = 'Guest_Records_Owner'];

            Boolean isCNCitizen = (Boolean)mapWicsFormData.get('isCNCitizen');
            String strDeviceType = (String)mapWicsFormData.get('deviceType');
            Boolean boolAbtAssociateConsent = (Boolean)mapWicsFormData.get('abtAssociateConsent');

            String pPrograms = '';
            if(programParticipated != null && programParticipated.size() > 0)
            {
                for(integer i=0 ; i < programParticipated.size() ; i++)
                {
                    pPrograms += programParticipated[i]+ ';';
                }
            }
            
            /** Check for Cherokee Nation Citizen */
            Account acc = new Account();
            Account userAccount = new Account();
            String contactId;
            if(isCNCitizen) {
                // Get user logged id
                String UserId = UserInfo.getUserId();

                // Get contact id against user id
                contactId = utility.getUserContactId(UserId);

                //query logged in user account information
                userAccount = [SELECT Id, FirstName, LastName, Tribe_Id__c, PersonContactId FROM Account WHERE PersonContactId =: contactId limit 1];

                // update parent account
                acc = new Account();
                acc.Id = userAccount.Id;
                acc.Household_Income__c = householdIncome;
                acc.Income_Frequency__c = incomeFrequency;
                acc.Household_Size__c = householdSize;
                acc.Home_Language__c = spokenHomeLanguage;
                acc.Other_Language__c = otherLanguage;
                acc.Participated_Programs__c = pPrograms;
                update acc;
            }
            else {
                Id parentRecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('Parent_Guardian').getRecordTypeId();
                
                // create parent account
                acc.RecordTypeId 					=		parentRecordTypeId;
                acc.OwnerId 						=		guestRecordOwnerId.MasterLabel;
                acc.FirstName						= 		priConFirstName;
                acc.Middle_Name__c					= 		priConMiddleName;
                acc.LastName						= 		priConLastName;
                acc.Suffix__c						= 		priConSuffix;
                acc.Household_Income__c				=		householdIncome;
                acc.Income_Frequency__c				=		incomeFrequency;
                acc.Household_Size__c				=		householdSize;
                acc.Home_Language__c				=		spokenHomeLanguage;
                acc.Other_Language__c				=		otherLanguage;
                acc.Participated_Programs__c		=		pPrograms;
                acc.PersonMailingStreet				= 		mailingStreet;
                acc.PersonMailingCity				=		mailingCity;
                acc.PersonMailingCountry			=		mailingCountry;
                acc.PersonMailingState				=		mailingState;
                acc.PersonMailingPostalCode			= 		mailingZip;
                acc.PersonOtherStreet				= 		physicalStreet;
                acc.PersonOtherCity					=		physicalCity;
                acc.PersonOtherCountry				=		physicalCountry;
                acc.PersonOtherState				=		physicalState;
                acc.PersonOtherPostalCode			= 		physicalZip;
                acc.PersonEmail						=		priConEmail;
                acc.Date_of_Birth__c				=		dob;
                acc.Citizenship_Number__c			=		priConCitizenNumber;
                acc.Phone							=		priHomePhone;
                acc.PersonMobilePhone				=		priMobilePhone;
                acc.PersonOtherPhone				=		priWorkPhone;
                
                insert acc;
                userAccount = [SELECT Id, FirstName, LastName, Tribe_Id__c, PersonContactId FROM Account WHERE Id =:acc.Id LIMIT 1];
            }
            
            //create household account with parent/guardian name
            Id householdRecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('Parent_Guardian_Household').getRecordTypeId();
            Account houseHoldAccount = new Account();
            houseHoldAccount.RecordTypeId = householdRecordTypeId;
            if(!isCNCitizen) {
                houseHoldAccount.Name       = priConFirstName + ' ' + priConLastName + ' ' + 'Household';
                houseHoldAccount.OwnerId    = guestRecordOwnerId.MasterLabel;
            }
            else {
                houseHoldAccount.Name       = userAccount.FirstName + ' ' + userAccount.LastName + ' ' + 'Household';
            }
            insert houseHoldAccount;
            
            // Add parent in household
            AccountContactRelation acctCnt = new AccountContactRelation();
            acctCnt.AccountId = houseHoldAccount.Id;
            acctCnt.ContactId = userAccount.PersonContactId;
            acctCnt.Roles = 'Parent/Guardian';
            insert acctCnt;
            
            // Get Student record type id
            Id studentRecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('Student').getRecordTypeId();
            
            // insert child records
            if(childsAccountList != null && childsAccountList.size() > 0) {
                for(Account a : childsAccountList) {
                    a.RecordTypeId = studentRecordTypeId;
                    if(!isCNCitizen) a.OwnerId = guestRecordOwnerId.MasterLabel;

                    childsAccountListToInsert.add(a);
                }
                insert childsAccountListToInsert;
            }
            
            for(Account accIn : childsAccountListToInsert) {
                insertedChildsAccountIds.add(accIn.Id); 
            }
            
            insertedChildsAccountList = [SELECT Id, PersonContactId,firstname,lastname,Middle_Name__c
                                        FROM Account WHERE Id IN : insertedChildsAccountIds];      
            
            // Insert child records in household
            if(insertedChildsAccountList != null && insertedChildsAccountList.size() > 0) {
                for(Account nc : insertedChildsAccountList) {
                    AccountContactRelationChildList.add(
                        new  AccountContactRelation(AccountId = houseHoldAccount.id, ContactId = nc.PersonContactId, Roles = 'Child/Dependent')
                    );
                }
                insert AccountContactRelationChildList;
            }
            
            // Get EBT Request record type id
            Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('EBT_Request').getRecordTypeId();
            
            // create case record
            Case cse 							=       new Case();
            cse.RecordTypeId 					=       caseRecordTypeId;
            cse.Status							=       'New';
            cse.Origin							=       'Portal';
            cse.Priority						=       'Medium';
            cse.Request_Reason__c				=       'Summer EBT';
            cse.AccountId						=       userAccount.Id;
            cse.Child_Account__c				=       houseHoldAccount.id;
            cse.Primary_Contact_First_Name__c 	=       priConFirstName;
            cse.Primary_Contact_Middle_Name__c	=       priConMiddleName;
            cse.Primary_Contact_Last_Name__c	=       priConLastName;
            cse.Primary_Contact_Suffix__c		=       priConSuffix;
            cse.Primary_Contact_Date_of_Birth__c=       dob;
            cse.Household_Income__c				=       householdIncome;
            cse.Income_Frequency__c				=       incomeFrequency;
            cse.Household_Size__c				=       householdSize;
            cse.Spoken_Home_Language__c			=       spokenHomeLanguage;
            cse.Other_Language__c				=       otherLanguage;
            cse.Participated_Programs__c		=       pPrograms;
            cse.Ebt_Email__c					=       priConEmail;
            cse.Ebt_Home_Phone__c				=       priHomePhone;
            cse.Ebt_Mobile_Phone__c				=       priMobilePhone;
            cse.Ebt_Work_Phone__c				=       priWorkPhone;
            cse.Mailing_Street__c				=       mailingStreet;
            cse.Mailing_City__c					=       mailingCity;
            cse.Mailing_ZipPostal_Code__c		=       mailingZip;
            cse.Mailing_Countries__c			=       mailingCountry;
            cse.Mailing_States__c				=       mailingState;
            cse.Physical_Street__c				=       physicalStreet;
            cse.Physical_City__c				=       physicalCity;
            cse.Physical_ZipPostal_Code__c  	=       physicalZip;
            cse.Physical_Countries__c			=       physicalCountry;
            cse.Physical_States__c				=       physicalState;
            cse.Sec_First_Name__c				=       secConFirstName;
            cse.Sec_Last_Name__c				=       secConLastName;
            cse.Sec_Phone__c					=       secConPhone;
            cse.Sec_Email__c					=       secConEmail;
            cse.ContactId                       =       userAccount.PersonContactId;
            cse.WICS_Form_Submission_Year__c    =       String.valueOf(Date.today().year());
            cse.Device_Used__c                  =       strDeviceType;
            cse.Abt_Associates_Consent__c       =       boolAbtAssociateConsent;

            if(!isCNCitizen) {
                cse.OwnerId = guestRecordOwnerId.MasterLabel;
                cse.Citizenship_Number__c = priConCitizenNumber;
            }
            else {
                cse.ContactId = contactId;
            }
            insert cse;
            
            //query inserted case to get confirmation number generated by trigger for this particular case
            Case userCase = [SELECT Id, CaseNumber, EBT_Confirmation_Number__c FROM Case WHERE Id =: cse.Id limit 1];
            
            // Create AccountContactJunction record for children
            List<AccountCaseJunction__c> ACJList = new list<AccountCaseJunction__c>();
            if(insertedChildsAccountList != null && insertedChildsAccountList.size() > 0) {
                for(Account nc : insertedChildsAccountList) {
                    AccountCaseJunction__c acj = new AccountCaseJunction__c();
                    if(nc.Middle_Name__c != null) acj.name = nc.FirstName+' '+nc.Middle_Name__c + ' ' + nc.LastName;
                    else acj.name = nc.FirstName + ' ' + nc.LastName;
                    
                    acj.Request__c = cse.id;
                    acj.Account__c = nc.id;

                    if(!isCNCitizen) acj.OwnerId = guestRecordOwnerId.MasterLabel;

                    ACJList.add(acj);
                }
                insert ACJList;
            }
            mapRst.put('isSuccess', true);
            mapRst.put('userCase', userCase);
            return mapRst;
        } 
        catch(Exception ex) {
            mapRst.put('isSuccess', false);
            mapRst.put('strErrorMesage', ex.getMessage());
            return mapRst;
        }
    }
         
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