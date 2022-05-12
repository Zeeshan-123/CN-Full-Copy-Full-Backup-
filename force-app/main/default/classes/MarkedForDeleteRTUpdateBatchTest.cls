/**********************************
@author: Shams
@date: 1/5/2021
@purpose: Test Class for MarkedForDeleteRTUpdateBatch
***********************************/

@isTest
public class MarkedForDeleteRTUpdateBatchTest {
	@isTest
    public static void AInsert(){
        Daily_Followup_Task__mdt DFT=[SELECT AdminID__c,Negative_Test_Symptoms__c,InactiveError__c,DailyFollowUpTaskSubject__c,AdditionalDays__c,daystoFollowup__c,Exposed__c,Negative_Test__c,Positive_Test_No_Symptoms__c,Positive_Test_Symptoms__c,Positive_Test__c FROM Daily_Followup_Task__mdt LIMIT 1];
        Id recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
        Account TA1=TestDataFactory.createTestPersonAccountRecords('TestAccount1',recordTypeId);
        Account TA2 = [Select PersonContactId From Account];
        TA2.When_do_you_think_you_were_exposed__c=system.today()-20;
        TA2.Marked_for_Delete__c='Yes';
        update TA2;
        database.executeBatch(new MarkedForDeleteRTUpdateBatch());
    }
	
}