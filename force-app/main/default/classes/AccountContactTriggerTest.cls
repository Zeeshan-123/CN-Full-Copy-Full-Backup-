/**********************************
@author: Shams
@date: 12/9/2020
@purpose: AccountContactTrigger test
***********************************/
@istest
public class AccountContactTriggerTest {
	@istest
    public static void ACRInsert(){
        Id recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
        Account TA1=TestDataFactory.createTestPersonAccountRecords('TestAccount1',recordTypeId);
        recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('IndustriesHousehold').getRecordTypeId();
        Account HH1=new Account();
        HH1.Name='testHH1';HH1.RecordTypeId=recordTypeId;
        insert HH1;
        AccountContactRelation ACR=new AccountContactRelation();
        TA1.Household_1__c=HH1.id;
        update TA1;
        Contact Con=[select id from Contact limit 1];
        Account Acc=[select id from Account where name='testHH1'];
        ACR.AccountId=Acc.id;
        ACR.ContactId=Con.id;
        insert ACR;
        Delete ACR;
    }
}