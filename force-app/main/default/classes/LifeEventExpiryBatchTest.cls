/**********************************
@author: Shams
@date: 11/27/2020
@purpose: Test Class for LifeEventExpiryBatch
***********************************/

@isTest
public class LifeEventExpiryBatchTest {
	@isTest 
    public static void PLE(){
        Daily_Followup_Task__mdt DFT=[SELECT AdminID__c,Negative_Test_Symptoms__c,InactiveError__c,DailyFollowUpTaskSubject__c,AdditionalDays__c,daystoFollowup__c,Exposed__c,Negative_Test__c,Positive_Test_No_Symptoms__c,Positive_Test_Symptoms__c,Positive_Test__c FROM Daily_Followup_Task__mdt LIMIT 1];
        Id recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
        Account TA1=TestDataFactory.createTestPersonAccountRecords('TestAccount1',recordTypeId);
        Account TA2 = [Select PersonContactId From Account Where Id = :TA1.id];
        PersonLifeEvent PLE=new PersonLifeEvent();
        bypass_validation__c bv=[select id,bypass__c from bypass_validation__c];
        bv.bypass__c=true;
        update bv;
        PLE.EventDate=system.today()-10;
        PLE.EventType='Recovered';
        PLE.ExpirationDate=system.today()-5;
        PLE.Name='Recovered';
        PLE.PrimaryPersonId=TA2.PersonContactId;
        insert PLE;
        update PLE;
        Delete PLE;
        PLE=new PersonLifeEvent();
        PLE.EventType='Quarantined';
        PLE.EventDate=System.now()-100;
        PLE.ExpirationDate=System.now();
        PLE.name='test';
        PLE.PrimaryPersonId=TA2.PersonContactId;
        Insert PLE;
        database.executeBatch(new LifeEventExpiryBatch());
    }
}