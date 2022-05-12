/**********************************
@author: Shams
@date: 1/1/2021
@purpose: Test Class for CernerQueue_DuplicateMerge
***********************************/

@isTest
public class CernerQueue_DuplicateMergeTest {
	@isTest
    public static void test(){
        Id recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
        Account TA1=TestDataFactory.createTestPersonAccountRecords('TestAccount1',recordTypeId);
        TA1.When_do_you_think_you_were_exposed__c=system.today();
        ta1.Create_Patient_Task__c=true;
        ta1.MRN__c='123';
        TA1.HealthCloudGA__Testing_Status__pc='Exposed';
        Cerner_Queue__c CQ=new Cerner_Queue__c();
        CQ.MRN__c='123';
        CQ.Last_Name__c='test';
        insert CQ;
        Update TA1;
        List<Account> A=new list<Account>();
        A.add(ta1);
        CernerQueue_DuplicateMergeController.GetAccountrecord(ta1.id);
        CernerQueue_DuplicateMergeController.GetCQrecord(CQ.id);
        CernerQueue_DuplicateMergeController.GetCQrecordList(CQ.id);
        CernerQueue_DuplicateMergeController.getDuplicatesCriteria1(CQ.id);
        CernerQueue_DuplicateMergeController.getDuplicatesCriteria2(CQ.id);
        CernerQueue_DuplicateMergeController.getDuplicatesCriteria3(CQ.id);
        CernerQueue_DuplicateMergeController.updateAccount(ta1, CQ);
        CernerQueue_DuplicateMergeController.UpdateMFD(A,A,A);
        CernerQueue_DuplicateMergeController.getlistview();
    }
}