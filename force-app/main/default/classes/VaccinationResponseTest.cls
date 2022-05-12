/**********************************
@author: Shams
@date: 03/03/2020
@purpose: Test Class for VaccinationResponse
***********************************/

@isTest
public class VaccinationResponseTest {
	@isTest
    public static void Test(){
        
        Daily_Followup_Task__mdt DFT=[SELECT AdminID__c,Negative_Test_Symptoms__c,InactiveError__c,DailyFollowUpTaskSubject__c,AdditionalDays__c,daystoFollowup__c,Exposed__c,Negative_Test__c,Positive_Test_No_Symptoms__c,Positive_Test_Symptoms__c,Positive_Test__c FROM Daily_Followup_Task__mdt LIMIT 1];
        Id recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
        Account TA1=TestDataFactory.createTestPersonAccountRecords('TestAccount1',recordTypeId);
        TA1.When_do_you_think_you_were_exposed__c=system.today();
        ta1.Create_Patient_Task__c=true;
        TA1.HealthCloudGA__Testing_Status__pc='Exposed';
        Update TA1;
        Test.startTest();
        List<id> ContactIDs=new List<id>();
        Contact c=[select id from contact limit 1];
        ContactIDs.add(c.id);
        VaccinationResponseYes.VaccinationResponseYes(ContactIDs);
        VaccinationResponseNo.VaccinationResponseNo(ContactIDs);
        Test.stoptest();
    }
}