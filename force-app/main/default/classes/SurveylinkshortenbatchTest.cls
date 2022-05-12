/**********************************
@author: Shams
@date: 2/22/2020
@purpose: Test Class for Surveylinkshortenbatch
***********************************/
@istest
public class SurveylinkshortenbatchTest {
		@istest
        public static void LinkShortenBatch(){
        Daily_Followup_Task__mdt DFT=[SELECT AdminID__c,Negative_Test_Symptoms__c,InactiveError__c,DailyFollowUpTaskSubject__c,AdditionalDays__c,daystoFollowup__c,Exposed__c,Negative_Test__c,Positive_Test_No_Symptoms__c,Positive_Test_Symptoms__c,Positive_Test__c FROM Daily_Followup_Task__mdt LIMIT 1];
        Id recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
        Account TA1=TestDataFactory.createTestPersonAccountRecords('TestAccount1',recordTypeId);
        TA1.When_do_you_think_you_were_exposed__c=system.today();
        TA1.HealthCloudGA__Testing_Status__pc='Exposed';
        TA1.Send_Survey_via_SMS__c=false;
        TA1.Survey_Link__c=Label.Survey_Link_Shorten+'-test.com';
        Ta1.PersonMobilePhone='3454354321';
        Update TA1;
        Task t3=TestDataFactory.createTestTask(TA1);
        t3.Send_Survey_Invite__c=true;
        t3.ActivityDate=system.today();
        update t3;
        Database.executeBatch(new Surveylinkshortenbatch());
    }
    @istest(seealldata=true)
    public static void SurveyBatch(){
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
        Test.stopTest();
	}
}