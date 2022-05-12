/**********************************
@author: Shams
@date: 2/3/2021
@purpose: Test Class for IsolationExpiryDateEndedBatch
***********************************/

@isTest
public class IsolationExpiryDateEndedBatchTest {
	@isTest
    public static void AInsert(){
        Daily_Followup_Task__mdt DFT=[SELECT AdminID__c,Negative_Test_Symptoms__c,InactiveError__c,DailyFollowUpTaskSubject__c,AdditionalDays__c,daystoFollowup__c,Exposed__c,Negative_Test__c,Positive_Test_No_Symptoms__c,Positive_Test_Symptoms__c,Positive_Test__c FROM Daily_Followup_Task__mdt LIMIT 1];
        Id recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
        Account TA1=TestDataFactory.createTestPersonAccountRecords('TestAccount1',recordTypeId);
        TA1.HealthCloudGA__Testing_Status__pc='Positive';
        TA1.Test_Site_Type_1st__c = 'Cherokee Nation Health Services';
        TA1.Bypass_Cerner_Queue__c = false;
        update TA1;
        system.debug([select Contact_or_Case_new__c, Case_Status__c, Isolatied_End_Date__pc from account where id = :ta1.id]);
        Account TA2 = [Select PersonContactId From Account];
        
        List<bypass_validation__c> bv=[select id,bypass__c from bypass_validation__c];
        if(bv.size()<=0){
            bypass_validation__c bva=new bypass_validation__c();
            bv.add(bva);
        }
        bv[0].bypass__c = TRUE;
        UPSERT bv[0];

        TA2.Date_of_when_symptoms_onset__c=system.today()-20;
        update TA2;
        
        bv[0].bypass__c = FALSE;
        UPDATE bv[0];
        
        database.executeBatch(new IsolationExpiryDateEndedBatch());
    }
	
}