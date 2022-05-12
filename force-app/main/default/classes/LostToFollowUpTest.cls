/**********************************
@author: Shams
@date: 2/16/2021
@purpose: Test Class for LostToFollowUp
***********************************/

@isTest
public class LostToFollowUpTest {
	@isTest
    public static void Test(){
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
        //delete TA3;
        Update TA1;
        List<id> Alist=new List<id>();
        Alist.add(TA1.id);
        LostToFollowUp.LostToFollowupUpdate(Alist);
        Test.stoptest();
    }
}