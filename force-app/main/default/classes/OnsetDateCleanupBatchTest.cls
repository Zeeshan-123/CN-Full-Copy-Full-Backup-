/**********************************
@author: Shams
@date: 12/17/2020
@purpose: Test Class for OnsetDateCleanupBatch
***********************************/
@isTest
public class OnsetDateCleanupBatchTest {
	@isTest
    public static void runtest(){
        Id recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
        Account TA3=TestDataFactory.createTestPersonAccountRecords('TestAccount3',recordTypeId);
        List<Task> t=[select id from task where account__c=:TA3.id];
        delete t;
        TA3.Date_of_when_symptoms_onset__c=system.today()-20;
        Update TA3;
        TA3.HealthCloudGA__Testing_Status__pc='Positive - Asymptomatic';
        TA3.Case_Status__c='Inactive';
        try{Update TA3;}
        catch(Exception e){}
        database.executeBatch(new OnsetDateCleanupBatch());
    }
}