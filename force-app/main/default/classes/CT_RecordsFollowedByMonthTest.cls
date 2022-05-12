/**********************************
@author: Shams
@date: 17/10/2020
@purpose: Test Class for CT_RecordsFollowedByMonth
***********************************/

@isTest
public class CT_RecordsFollowedByMonthTest {
	@isTest 
    public static void PLE(){
        Daily_Followup_Task__mdt DFT=[SELECT AdminID__c,Negative_Test_Symptoms__c,InactiveError__c,DailyFollowUpTaskSubject__c,AdditionalDays__c,daystoFollowup__c,Exposed__c,Negative_Test__c,Positive_Test_No_Symptoms__c,Positive_Test_Symptoms__c,Positive_Test__c FROM Daily_Followup_Task__mdt LIMIT 1];
        Id recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
        Account TA1=TestDataFactory.createTestPersonAccountRecords('TestAccount1',recordTypeId);
        Account TA2 = [Select PersonContactId From Account Where Id = :TA1.id];
        PersonLifeEvent PLE=new PersonLifeEvent();
        PLE.EventType='Quarantined';
        PLE.EventDate=System.now();
        PLE.ExpirationDate=System.now()+100;
        PLE.name='test';
        PLE.PrimaryPersonId=TA2.PersonContactId;
        List<bypass_validation__c> bv=[select id,bypass__c from bypass_validation__c];
        if(bv.size()<=0){
            bypass_validation__c bva=new bypass_validation__c();
            bv.add(bva);
        }
        bv[0].bypass__c=true;
        upsert bv[0];
        Insert PLE;
        Date startdateNew=system.today();
        startdateNew.addYears(-1);
        startdateNew=Date.newInstance(startdateNew.year()-1,startdateNew.month(), startdateNew.day());
        CT_RecordsFollowedByMonth.enddate();
        CT_RecordsFollowedByMonth.startdate();
        CT_RecordsFollowedByMonthCount.enddate();
        CT_RecordsFollowedByMonthCount.startdate();
        TA2.HealthCloudGA__Testing_Status__pc='Positive';
        Update Ta2;
        bv[0].bypass__c=true;
        upsert bv[0];
        PLE=new PersonLifeEvent();
        PLE.EventType='Isolated';
        PLE.EventDate=System.now();
        PLE.ExpirationDate=System.now()+100;
        PLE.name='test';
        PLE.PrimaryPersonId=TA2.PersonContactId;
        Insert PLE;
        CT_RecordsFollowedByMonth.fetchPLA(startdateNew,system.today()+100,'Contact');
        CT_RecordsFollowedByMonth.fetchPLA(null,null,'Contact');
        CT_RecordsFollowedByMonth.fetchPLA(startdateNew,system.today()+100,'Case');
        CT_RecordsFollowedByMonth.fetchPLA(null,null,'Case');
        CT_RecordsFollowedByMonthCount.fetchPLA(startdateNew,system.today()+100,'Contact');
        CT_RecordsFollowedByMonthCount.fetchPLA(null,null,'Contact');
        CT_RecordsFollowedByMonthCount.fetchPLA(startdateNew,system.today()+100,'Case');
        CT_RecordsFollowedByMonthCount.fetchPLA(null,null,'Case');
    }
}