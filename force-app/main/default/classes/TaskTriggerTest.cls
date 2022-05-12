/**********************************
@author: Shams
@date: 12/14/2020
@purpose: Test Class for Task trigger and handler
***********************************/

@isTest
public class TaskTriggerTest {
	@isTest
    public static void test(){
        Daily_Followup_Task__mdt DFT=[SELECT AdminID__c,Negative_Test_Symptoms__c,InactiveError__c,DailyFollowUpTaskSubject__c,AdditionalDays__c,daystoFollowup__c,Exposed__c,Negative_Test__c,Positive_Test_No_Symptoms__c,Positive_Test_Symptoms__c,Positive_Test__c FROM Daily_Followup_Task__mdt LIMIT 1];
        Id recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
        
        Account TA3=TestDataFactory.createTestPersonAccountRecords('TestAccount3',recordTypeId);
        Account Acc1=[select id from Account where name='TestAccount3'];
        test.startTest();
        recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('IndustriesHousehold').getRecordTypeId();
        Account HH1=new Account();
        HH1.Name='testHH1';HH1.RecordTypeId=recordTypeId;
        insert HH1;
        AccountContactRelation ACR=new AccountContactRelation();
        Contact Con=[select id from Contact where name='TestAccount3'];
        Account Acc=[select id from Account where name='testHH1'];
        ACR.AccountId=Acc.id;
        ACR.ContactId=Con.id;
        insert ACR;
        Task t3=TestDataFactory.createTestTask(Acc1);
        t3.ActivityDate=system.today();
        update t3;
        Test.stopTest();
}
}