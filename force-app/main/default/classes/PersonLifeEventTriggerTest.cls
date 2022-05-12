/**********************************
@author: Shams
@date: 2/10/2020
@purpose: Test Class for PersonLifeEventTrigger and PersonLifeEventTriggerHanlder
***********************************/

@isTest
public class PersonLifeEventTriggerTest {
	@isTest 
    public static void PLE(){
        Daily_Followup_Task__mdt DFT=[SELECT AdminID__c,Negative_Test_Symptoms__c,InactiveError__c,DailyFollowUpTaskSubject__c,AdditionalDays__c,daystoFollowup__c,Exposed__c,Negative_Test__c,Positive_Test_No_Symptoms__c,Positive_Test_Symptoms__c,Positive_Test__c FROM Daily_Followup_Task__mdt LIMIT 1];
        Id recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
        Account TA1=TestDataFactory.createTestPersonAccountRecords('TestAccount1',recordTypeId);
        Account TA2 = [Select PersonContactId From Account Where Id = :TA1.id];
        PersonLifeEvent PLE=new PersonLifeEvent();
        PLE.EventDate=system.today()-10;
        PLE.EventType='Recovered';
        PLE.ExpirationDate=system.today()-5;
        PLE.Name='Recovered';
        PLE.PrimaryPersonId=TA2.PersonContactId;
        List<bypass_validation__c> bv=[select id,bypass__c from bypass_validation__c];
        if(bv.size()<=0){
            bypass_validation__c bva=new bypass_validation__c();
            bv.add(bva);
        }
        bv[0].bypass__c=true;
        upsert bv[0];
        insert PLE;
        update PLE;
        Delete PLE;
        PLE=new PersonLifeEvent();
        PLE.EventType='Quarantined';
        PLE.EventDate=System.now();
        PLE.ExpirationDate=System.now()+100;
        PLE.name='test';
        PLE.PrimaryPersonId=TA2.PersonContactId;
        Insert PLE;
    }
}