/**********************************
@author: Shams
@date: 1/18/2021
@purpose:  Test class for CernerQueue Trigger and TriggerHandler for translating the Site Code to Site Name
***********************************/
@istest
public class CernerQueueTriggerTest {
    @istest
    public static void test(){
         Id recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
       
		Test_Site_Translation__c TST=new Test_Site_Translation__c();
        TST.name='CNHS: Sam Hider Health Center';
        TST.Test_Site_Code__c='JAY-HC-ANC=CNHS';
        TST.Test_Site_Type__c='Cherokee Nation Health Services';
        insert TST;
        
        List<Account> accts = new List<Account>();
        Account a = new Account();
        a.LastName='Testing';
        a.Case_Status__c='Active';
        a.RecordTypeId = recordTypeId;
        a.HealthCloudGA__Testing_Status__pc='Positive';
        a.Initial_test_date__c=system.today();
        a.When_do_you_think_you_were_exposed__c=system.today();
        a.MRN__c='12345';
        //a.HealthCloudGA__Testing_Status__pc='Exposed';
        insert a;
        
         Account acc1 = new Account();
        acc1.LastName='Testing';
        acc1.Case_Status__c='Active';
        acc1.RecordTypeId = recordTypeId;
        acc1.HealthCloudGA__Testing_Status__pc='Positive';
        acc1.When_do_you_think_you_were_exposed__c=system.today();
        acc1.Initial_test_date__c=system.today();
        acc1.MRN__c='67895';
        //a.HealthCloudGA__Testing_Status__pc='Exposed';
        insert acc1;
        
        Cerner_Queue__c CQ=new Cerner_Queue__c();
        CQ.First_Name__c = 'Test';
        CQ.Last_Name__c = 'Testing';
        CQ.MRN__c='12345';
        CQ.Applies_Date_Time__c = DateTime.now();
        CQ.Email__c='test@g.com';
        CQ.Test_Site_1st__c='JAY-HC-ANC=CNHS';
        insert CQ;
        
        test.startTest();
        Cerner_Queue__c CQ2=new Cerner_Queue__c();
        CQ2.First_Name__c = 'Test2';
        CQ2.Last_Name__c = 'Testing2';
        CQ2.Applies_Date_Time__c = DateTime.now();
        CQ2.MRN__c='12345';
        CQ2.Email__c='test@test.com';
        CQ2.Test_Site_1st__c='JAY-HC-ANC=CNHS';
        insert CQ2;
        
        Cerner_Queue__c CQ3=new Cerner_Queue__c();
        CQ3.First_Name__c = 'Test2';
        CQ3.Last_Name__c = 'Testing2';
        CQ3.Applies_Date_Time__c = DateTime.parse('12/12/2021, 11:23 AM');
        CQ3.MRN__c='12345';
        CQ3.Email__c='test@test.com';
        CQ3.Test_Site_1st__c='JAY-HC-ANC=CNHS';
        insert CQ3;
        
        CQ2.Email__c='test@h.com';
        update CQ2;
        
        CQ2.Email__c='test@.com';
        update CQ2;
        
        CQ2.Email__c='';
        update CQ2;
        
        CQ3.Applies_Date_Time__c = DateTime.parse('12/12/2021, 11:23 AM');
        update CQ3;
        
        CQ2.Applies_Date_Time__c = DateTime.parse('02/01/2022, 11:23 AM');
        update CQ2;
        
         CQ2.Applies_Date_Time__c = DateTime.parse('03/15/2022, 11:23 AM');
        update CQ2;
        test.stopTest(); 
    }
}