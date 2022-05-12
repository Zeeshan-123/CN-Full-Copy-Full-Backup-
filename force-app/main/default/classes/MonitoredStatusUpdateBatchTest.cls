/**********************************
@author: Shams
@date: 1/10/2020
@purpose: Test Class for MonitoredStatusUpdateBatch
***********************************/

@isTest
public class MonitoredStatusUpdateBatchTest {
	@isTest
    public static void AInsert(){
        Daily_Followup_Task__mdt DFT=[SELECT AdminID__c,Negative_Test_Symptoms__c,InactiveError__c,DailyFollowUpTaskSubject__c,AdditionalDays__c,daystoFollowup__c,Exposed__c,Negative_Test__c,Positive_Test_No_Symptoms__c,Positive_Test_Symptoms__c,Positive_Test__c FROM Daily_Followup_Task__mdt LIMIT 1];
        Id recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
        Account TA1=TestDataFactory.createTestPersonAccountRecords('TestAccount1',recordTypeId);
        TA1.Date_of_when_symptoms_onset__c=system.today()-1;
        TA1.Latest_Status_Picklist__pc='Monitored';
        update TA1;
        database.executeBatch(new MonitoredStatusUpdateBatch());
    }
	
}