/*--------------------------------------------------------------------------
@author: Sami Haroon
@date: July/17/2021
@purpose: test class for CustCom_SubApplicant_HandlerTest
---------------------------------------------------------------------------*/
@istest
public class CustCom_SubApplicant_HandlerTest {
    @istest
    public static void runTest()
    {
        Date dDate = Date.newInstance(2016, 12, 14);
        Date dDate2 = Date.newInstance(2016, 12, 14);
        
        Account HMAcc1 = Community_TestDataFactory.createAccount('Leo','Rogger','leo@test.com','987432',dDate2);
        Account HMAcc2 = Community_TestDataFactory.createAccount('Clara','Rogger','clara@test.com','76541',dDate2);
        Account HMAcc3 = Community_TestDataFactory.createAccount('Smith','Murdock','smith@test.com','44511',dDate);
        
        Account acc = Community_TestDataFactory.createAccount('Barin','David','nike@g.com','14124',dDate);
        User usr = Community_TestDataFactory.createUser('Barin','David','barin@g.com',acc.id);   
        User userForTesting = [SELECT Id FROM User WHERE Id =: usr.Id LIMIT 1];
        Account a = [Select PersonContactId From Account Where Id = :acc.id];
        Case cse = new Case();
        cse.Status='New';
        cse.Origin='Portal';
        cse.Priority='Medium';
        cse.ContactId=a.PersonContactId;
        cse.Request_Reason__c = 'CA';
        cse.RecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Mobile_Hotspot_Connectivity').getRecordTypeId();// Mobile_Hotspot_Connectivity RecordType id
        Case cse1 = new Case();
        cse1.Status='New';
        cse1.Origin='Portal';
        cse1.Priority='Medium';
        cse1.ContactId=a.PersonContactId;
        cse1.Request_Reason__c = 'CA';
        cse1.RecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('CA').getRecordTypeId();// CA RecordType id
        insert cse1;
        
        String RecordTypeId1 = Schema.SObjectType.Sub_Applicant__c.getRecordTypeInfosByDeveloperName().get('Mobile_Hotspot_Connectivity').getRecordTypeId();// Mobile_Hotspot_Connectivity RecordType id
        String RecordTypeId2 = Schema.SObjectType.Sub_Applicant__c.getRecordTypeInfosByDeveloperName().get('Utility_Assistance').getRecordTypeId();// Mobile_Hotspot_Connectivity RecordType id
        
        List<Sub_Applicant__c> StudentsListToInsert = new List<Sub_Applicant__c>();
        Sub_Applicant__c St1 = new  Sub_Applicant__c (Citizen_Id__c = '987432', Date_of_Birth__c = dDate2,Request__c=cse1.Id,RecordTypeId=RecordTypeId1);
        Sub_Applicant__c St2 = new Sub_Applicant__c ( Citizen_Id__c = '76541', Date_of_Birth__c =dDate2,Request__c=cse1.Id,RecordTypeId=RecordTypeId1);
        StudentsListToInsert.add(St1);   
        StudentsListToInsert.add(St2);
        
        
        List<Sub_Applicant__c> StudentsListInsert2 = new List<Sub_Applicant__c>();
        //   Sub_Applicant__c St3 = new  Sub_Applicant__c (Citizen_Id__c = '51243', Date_of_Birth__c = dDate2,Request__c=cse1.Id);
        Sub_Applicant__c St4 = new  Sub_Applicant__c (Citizen_Id__c = '44511', Date_of_Birth__c = dDate,Request__c=cse1.Id,RecordTypeId=RecordTypeId2);
        //   StudentsListInsert2.add(St3);   
        StudentsListInsert2.add(St4);   
        
        insert StudentsListToInsert;
        update StudentsListToInsert;
        insert StudentsListInsert2;
        update StudentsListInsert2;
    }
}