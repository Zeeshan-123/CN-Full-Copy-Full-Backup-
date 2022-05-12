/*--------------------------------------------------------------------------
@author: Sami Haroon
@date: July/17/2021
@purpose: test class for Community_MobileHotspotControllerTest
---------------------------------------------------------------------------*/
@istest
public class Community_MobileHotspotControllerTest {
	  @istest
    public static void runTest()
    {
        Date dDate = Date.newInstance(2002, 12, 14);
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
        List<Sub_Applicant__c> StudentsListToInsert = new List<Sub_Applicant__c>();
        Sub_Applicant__c St1 = new  Sub_Applicant__c (Citizen_Id__c = '987432', Date_of_Birth__c = dDate2);
        Sub_Applicant__c St2 = new Sub_Applicant__c ( Citizen_Id__c = '76541', Date_of_Birth__c =dDate2);
    	StudentsListToInsert.add(St1);   
        StudentsListToInsert.add(St2);
        
        List<Sub_Applicant__c> StudentsListInsert2 = new List<Sub_Applicant__c>();
        Sub_Applicant__c St3 = new  Sub_Applicant__c (Citizen_Id__c = '51243', Date_of_Birth__c = dDate2);
        Sub_Applicant__c St4 = new  Sub_Applicant__c (Citizen_Id__c = '44511', Date_of_Birth__c = dDate2);
    	StudentsListInsert2.add(St3);   
        StudentsListInsert2.add(St4);   
        
        system.runAs(userForTesting)
        {
            test.startTest();
            Community_MobileHotspotController.getData('Case','Physical_Countries__c','Physical_States__c',null);
            Community_MobileHotspotController.getData('Case','Physical_Countries__c','Physical_States__c',null);
            Community_MobileHotspotController.validateApplicantEligibility();
            Community_MobileHotspotController.validateInternalApplicantEligibility(acc.Id);
            Community_MobileHotspotController.getStates();
            Community_MobileHotspotController.getMelissaAddresses('1234 11th Ave, Phenix City, AL', 'United States');
            
            Community_MobileHotspotController.validateStudentsList(StudentsListToInsert);
            Community_MobileHotspotController.validateStudentsList(StudentsListInsert2);
            Community_MobileHotspotController.sendOTP(acc.Id, '9876543210');
            Community_MobileHotspotController.validateEnteredOTP(acc.Id, '543216');
            Community_MobileHotspotController.saveCARequest(StudentsListToInsert, 'Street: 123 ', 'Murrieta', 'United States', 'California', 'Other St', '97232',
                                                            '2234567891', '', '', '123 Murrieta California United States 97232', true, false,
                                                            'Lilly', 'Murdock', '2931124110',cse,null);
            
             Community_MobileHotspotController.CaseDetails(cse1.id);
            Community_MobileHotspotController.CaseDetails(null);
            test.stopTest(); 
        }
    }
}