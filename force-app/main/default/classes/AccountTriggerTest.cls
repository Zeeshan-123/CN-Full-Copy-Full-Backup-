/**********************************
@author: Shams
@date: 21/08/2020
@purpose: Test Class for AccountTrigger and AccountTriggerHandler and SendDailyAssessmentSurveybatch and TaskCleanupBatch
***********************************/

@isTest
public class AccountTriggerTest {

    // CNHPHOMS-113: Commented as we moved the logc to EHR Observation records
    // private static Id fluAccRecordTypeId =  Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('Flu_Account').getRecordTypeId();

	@isTest
    public static void Test1() {
        Daily_Followup_Task__mdt DFT=[SELECT AdminID__c,Negative_Test_Symptoms__c,InactiveError__c,DailyFollowUpTaskSubject__c,AdditionalDays__c,daystoFollowup__c,Exposed__c,Negative_Test__c,Positive_Test_No_Symptoms__c,Positive_Test_Symptoms__c,Positive_Test__c FROM Daily_Followup_Task__mdt LIMIT 1];
        Id recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
        Account TA1=TestDataFactory.createTestPersonAccountRecords('TestAccount1',recordTypeId);
        TA1.When_do_you_think_you_were_exposed__c=system.today();
        ta1.Create_Patient_Task__c=true;
        TA1.HealthCloudGA__Testing_Status__pc='Exposed';
        Update TA1;
        Test.startTest();
        TA1.HealthCloudGA__Testing_Status__pc='Positive - Symptomatic';
        TA1.Case_Status__c='Active';
        TA1.When_do_you_think_you_were_exposed__c=system.today();
        Ta1.Date_of_when_symptoms_onset__c=system.today();
        Update TA1;
        Ta1.Date_of_when_symptoms_onset__c=system.today()-2;
        update TA1;
        Test.stoptest();
    }

    @isTest
    public static void Test2() {
        Daily_Followup_Task__mdt DFT=[SELECT AdminID__c,Negative_Test_Symptoms__c,InactiveError__c,DailyFollowUpTaskSubject__c,AdditionalDays__c,daystoFollowup__c,Exposed__c,Negative_Test__c,Positive_Test_No_Symptoms__c,Positive_Test_Symptoms__c,Positive_Test__c FROM Daily_Followup_Task__mdt LIMIT 1];
        Id recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
        Account TA1=TestDataFactory.createTestPersonAccountRecords('TestAccount1',recordTypeId);
        TA1.When_do_you_think_you_were_exposed__c=system.today();
        ta1.Create_Patient_Task__c=true;
        TA1.HealthCloudGA__Testing_Status__pc='Exposed';
        
        Test.startTest();
        Update TA1;
        TA1.Case_Status__c='Inactive';
        try{Update TA1;}
        Catch(Exception e){TA1.Case_Status__c='Active';}
        TA1.OwnerId=DFT.AdminID__c;
        Update TA1;
        TA1.HealthCloudGA__Testing_Status__pc='';
        update TA1;
        TA1.HealthCloudGA__Testing_Status__pc='Positive';
        update TA1;
        Test.stopTest();
    }
    
    @isTest
    public static void Test3() {
        Daily_Followup_Task__mdt DFT=[SELECT AdminID__c,Negative_Test_Symptoms__c,InactiveError__c,DailyFollowUpTaskSubject__c,AdditionalDays__c,daystoFollowup__c,Exposed__c,Negative_Test__c,Positive_Test_No_Symptoms__c,Positive_Test_Symptoms__c,Positive_Test__c FROM Daily_Followup_Task__mdt LIMIT 1];
        Id recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
        Account TA2=TestDataFactory.createTestPersonAccountRecords('TestAccount2',recordTypeId);
        Account TA3=TestDataFactory.createTestPersonAccountRecords('TestAccount3',recordTypeId);
        
        TA2.HealthCloudGA__Testing_Status__pc='Positive';
        ta2.Date_of_when_symptoms_onset__c=system.today()-5;
        TA2.Test_Site_Type_1st__c='Cherokee Nation Health Services';
        update TA2;
        Test.startTest();
        TA2.Create_Patient_Task__c=true;
        Update TA2;
        Task t3=TestDataFactory.createTestTask(TA3);
        TA3.HealthCloudGA__Testing_Status__pc='Exposed - Symptomatic';
        TA3.When_do_you_think_you_were_exposed__c=system.today()-4;
        TA3.Date_of_when_symptoms_onset__c=system.today();
        Update TA3;
        try {
    		merge TA3 TA2;
		} catch (DmlException e) {
    	// Process exception
    		System.debug('An unexpected error has occurred: ' + e.getMessage()); 
		}
        try {            
            delete TA3;
        } catch (DmlException e) {
    	// Process exception
    		System.debug('An unexpected error has occurred: ' + e.getMessage()); 
		}
        Test.stoptest();
    }

    @istest(seealldata=true)
    public static void SurveyBatch() {
        Daily_Followup_Task__mdt DFT=[SELECT AdminID__c,Negative_Test_Symptoms__c,InactiveError__c,DailyFollowUpTaskSubject__c,AdditionalDays__c,daystoFollowup__c,Exposed__c,Negative_Test__c,Positive_Test_No_Symptoms__c,Positive_Test_Symptoms__c,Positive_Test__c FROM Daily_Followup_Task__mdt LIMIT 1];
        Id recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
        Account TA1=TestDataFactory.createTestPersonAccountRecords('TestAccount1',recordTypeId);
        TA1.When_do_you_think_you_were_exposed__c=system.today();
        TA1.HealthCloudGA__Testing_Status__pc='Exposed';
        Update TA1;
        Task t3=TestDataFactory.createTestTask(TA1);
        t3.Send_Survey_Invite__c=true;
        t3.ActivityDate=system.today();
        update t3;
        
        Test.startTest();
        Database.executeBatch(new SendDailyAssessmentSurveybatch());
        Database.executeBatch(new TaskCleanupBatch());
        Test.stopTest();
	}
   
    @isTest
    public static void Test5() {
        Account acc 		=	 new Account();
        acc.firstName 		=	 'A.';
        acc.LastName 		= 	'Kelly';
        acc.RecordTypeId 	= 	Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('CN_Registration').getRecordTypeId();
        acc.Tribe_Id__c		=	'76542';
        acc.Is_Void__c		=	'Yes';
        acc.If_CN_Citizen__c		=	'Yes';
        insert acc;
     
        User u = TestDataFactory.createUser('NewTest','User','testUser@g.com',acc.id); 
        
        Account accUp 	= [SELECT Id, DOD__c FROM ACCOUNT WHERE Id =: acc.Id limit 1];
        accUp.Is_Void__c	=	'No';
    	update  accUp;
        
        Account accU2 	= [SELECT Id, DOD__c FROM ACCOUNT WHERE Id =: acc.Id limit 1];
        accU2.Is_Void__c	=	'Yes';
    	update  accU2;
        
        Account acc2 		=	 new Account();
        acc2.firstName 		=	 'Paul';
        acc2.LastName 		= 	'Test';
        acc2.RecordTypeId 	= 	Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('CN_Registration').getRecordTypeId();
        acc2.Tribe_Id__c	=	'765426';
        acc2.Is_Void__c		= 	'Yes';
        acc.If_CN_Citizen__c		=	'Yes';
        insert acc2;
     
        User u2 = TestDataFactory.createUser('Paul','Test','pauk@test.com',acc2.id); 
        
        Account accUp2 	= [SELECT Id, DOD__c FROM ACCOUNT WHERE Id =: acc2.Id limit 1];
        accUp2.Is_Void__c	=	'No';
    	update  accUp2;
       
    }

    @isTest
    public static void Test6() {
        Account acc 		=	 new Account();
        acc.firstName 		=	 'A.';
        acc.LastName 		= 	'Kelly';
        acc.RecordTypeId 	= 	Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('Cerner_Account').getRecordTypeId();
        acc.Test_Result_Viewed__c = false;
        acc.SMS_Sent__c  = false;
        acc.HealthCloudGA__Testing_Status__pc='Positive';
        insert acc;
    }

    /* CNHPHOMS-113: Commented as we moved the logc to EHR Observation records
    @IsTest
    public static void test_FluAcc() {
        Account acc = new Account();
        acc.firstName 		                    =   'A.';
        acc.LastName 		                    =   'Kelly';
        acc.RecordTypeId 	                    =   fluAccRecordTypeId;
        acc.Test_Result_Viewed__c               =   false;
        acc.SMS_Sent__c                         =   false;
        acc.HealthCloudGA__Testing_Status__pc   =   'Positive';
        insert acc;
    }*/
}