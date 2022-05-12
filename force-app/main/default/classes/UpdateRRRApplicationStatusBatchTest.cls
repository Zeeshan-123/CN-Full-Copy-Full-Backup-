@isTest
private class UpdateRRRApplicationStatusBatchTest 
{

    @isTest    
    static void test1()
    {
        Test.startTest();
        //get RRR Request record type id
    	Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('RRR').getRecordTypeId();
        Date dDate 		= 	Date.newInstance(2002, 12, 14);
    	Date fDate 		= 	Date.newInstance(2014, 12, 15);
    	Date sDate 		= 	Date.newInstance(2014, 12, 16);
        
        Account a = new Account();
        a.firstName = 'NewTest';
        a.LastName = 'User';
        a.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('CN_Registration').getRecordTypeId();// CN Registration RecordType id
        a.PersonEmail='test@g.com';
        a.Tribe_Id__c='0321';
        a.Date_of_Birth__c=dDate;
        a.If_CN_Citizen__c = 'Yes';
        insert a;
        
        Account a2 = new Account();
        a2.firstName = 'Martin';
        a2.LastName = 'Test';
        a2.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('CN_Registration').getRecordTypeId();// CN Registration RecordType id
        a2.PersonEmail='martin@test.com';
        a2.Tribe_Id__c='0221';
        a2.Date_of_Birth__c=fDate;
        a2.If_CN_Citizen__c = 'Yes';
        a2.HealthCloudGA__Gender__pc = 'Female';
        insert a2;
        
        Account a3 = new Account();
        a3.firstName = 'Emma';
        a3.LastName = 'Test';
        a3.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('CN_Registration').getRecordTypeId();// CN Registration RecordType id
        a3.PersonEmail='emma@test.com';
        a3.Tribe_Id__c='0111';
        a3.Date_of_Birth__c=sDate;
        a3.If_CN_Citizen__c = 'Yes';
        a3.HealthCloudGA__Gender__pc = 'Female';
        insert a3;
        
        Account a4 = new Account();
        a4.firstName = 'Paula';
        a4.LastName = 'Test';
        a4.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('CN_Registration').getRecordTypeId();// CN Registration RecordType id
        a4.PersonEmail='paula@test.com';
        a4.Tribe_Id__c='0333';
        a4.Date_of_Birth__c=sDate;
        a4.If_CN_Citizen__c = 'Yes';
        a4.HealthCloudGA__Gender__pc = 'Female';
        insert a4;
        
        Account a5 = new Account();
        a5.firstName = 'Christie';
        a5.LastName = 'Test';
        a5.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('CN_Registration').getRecordTypeId();// CN Registration RecordType id
        a5.PersonEmail='paula@test.com';
        a5.Tribe_Id__c='0444';
        a5.Date_of_Birth__c=sDate;
        a5.If_CN_Citizen__c = 'Yes';
        a5.HealthCloudGA__Gender__pc = 'Female';
        insert a5;
        
        Case cse 		= 	new Case();
        cse.Status		=	'New';
        cse.Origin		=	'Portal';
        cse.Priority	=	'Medium';
        cse.AccountId	=	a.Id;
        cse.RecordTypeId			= caseRecordTypeId;
        cse.New_Name__c = 'Testing';
        cse.Mailing_Address__c = '40702 California Oaks Rd';
        cse.Mailing_Street__c = '40702 California Oaks Rd';
        cse.Mailing_City__c = 'Murrieta';
        cse.Mailing_Countries__c = 'United States';
        cse.Mailing_States__c = 'Alabama';
        cse.mailing_address2__c = 'test';
        cse.mailing_suite__c = '1234';
        cse.Mailing_ZipPostal_Code__c = '92562';
        cse.Is_Manual_Address__c = true;
        insert cse;
        
        Case cse2 		= 	new Case();
        cse2.Status		=	'New';
        cse2.Origin		=	'Portal';
        cse2.Priority	=	'Medium';
        cse2.AccountId	=	a4.Id;
        cse2.RecordTypeId			= caseRecordTypeId;
        cse2.New_Name__c = 'Testing';
        insert cse2;
        
        Case cse3 		= 	new Case();
        cse3.Status		=	'New';
        cse3.Origin		=	'Portal';
        cse3.Priority	=	'Medium';
        cse3.AccountId	=	a5.Id;
        cse3.RecordTypeId			= caseRecordTypeId;
        cse3.Mailing_Address__c = '40702 California Oaks Rd';
        cse3.Mailing_Street__c = '40702 California Oaks Rd';
        cse3.Mailing_City__c = 'Murrieta';
        cse3.Mailing_Countries__c = 'United States';
        cse3.Mailing_States__c = 'Alabama';
        cse3.mailing_address2__c = 'test';
        cse3.mailing_suite__c = '1234';
        cse3.Mailing_ZipPostal_Code__c = '92562';
        cse3.Is_Manual_Address__c = true;
        insert cse3;
        
        
        
        Household_Member__c hm 	= 	new Household_Member__c();
        hm.Request__c			=	cse.Id;
        hm.First_Name__c		=	'Martin';
        hm.Last_Name__c			=	'Testing';
        hm.Citizen_Id__c		=	'0221';
        hm.Date_of_Birth__c		=	fDate;
        hm.AccountId__c = a2.Id;
        
        insert hm;
        
        Household_Member__c hm2 	= 	new Household_Member__c();
        hm2.Request__c			=	cse.Id;
        hm2.First_Name__c		=	'Emma';
        hm2.Last_Name__c			=	'Testing';
        hm2.Citizen_Id__c		=	'0111';
        hm2.Date_of_Birth__c		=	sDate;
        hm2.AccountId__c = a3.Id;
        insert hm2;
        
        
        Database.executeBatch(new UpdateRRRApplicationStatusBatch());
    	Test.stopTest();
    }
    
    @isTest    
    static void test2()
    {
        System.schedule('UpdateRRRApplicationStatusBatch Job Test', '0 0 * * * ?', new UpdateRRRApplicationStatusScheduler());
        
    }
}