/**********************************
@author: Shams
@date: 21/08/2020
@purpose: Send Daily Survey Invites test
***********************************/
@istest
public class SendDailyAssessmentSurveybatchTest {
	@istest(seealldata=true)
    public static void SurveyBatch(){
        Daily_Followup_Task__mdt DFT=[SELECT AdminID__c,Negative_Test_Symptoms__c,InactiveError__c,DailyFollowUpTaskSubject__c,AdditionalDays__c,daystoFollowup__c,Exposed__c,Negative_Test__c,Positive_Test_No_Symptoms__c,Positive_Test_Symptoms__c,Positive_Test__c FROM Daily_Followup_Task__mdt LIMIT 1];
        Id recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
        Account TA1=TestDataFactory.createTestPersonAccountRecords('TestAccount1',recordTypeId);
        TA1.When_do_you_think_you_were_exposed__c=system.today();
        TA1.HealthCloudGA__Testing_Status__pc='Exposed';
        TA1.Opt_out_from_the_survey_invites__c=false;
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
}