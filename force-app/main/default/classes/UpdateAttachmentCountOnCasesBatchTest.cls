@isTest
private class UpdateAttachmentCountOnCasesBatchTest 
{

    @isTest    
    static void test1()
    {
        Test.startTest();
        //get RRR Request record type id
    	Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('CA').getRecordTypeId();
        Date dDate 		= 	Date.newInstance(2002, 12, 14);
    	Date fDate 		= 	Date.newInstance(2014, 12, 15);
    	Date sDate 		= 	Date.newInstance(2014, 12, 16);
        
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
        
        Case cse = new Case();
        cse.Status='New';
        cse.Origin='Portal';
        cse.Priority='Medium';
        cse.AccountId=a2.Id;
        cse.Request_Reason__c = 'CA';
        cse.RecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('CA').getRecordTypeId();// CA RecordType id
        insert cse;
        
        Database.executeBatch(new UpdateAttachmentCountOnCasesBatch());
    	Test.stopTest();
    }
    
    @isTest    
    static void test2()
    {
        System.schedule('UpdateAttachmentCountOnCasesBatch Job Test', '0 0 * * * ?', new UpdateAttachmentCountOnCasesScheduler());
        
    }
}