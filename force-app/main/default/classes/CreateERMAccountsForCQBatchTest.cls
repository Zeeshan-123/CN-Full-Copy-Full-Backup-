/********************************************************************************************************
@author: Alishba
@date: Feb/08/2022
@purpose: test class for CreateERMAccountsForCQBatch and CreateChildsRecforCQCreatedAccountsBatch batches
********************************************************************************************************/
@isTest
private class CreateERMAccountsForCQBatchTest {
    @isTest    
    static void test1(){
        
        Id ERM_RECORDTYPEID = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
        // create ERM Account
        Account acnt = new Account();
        acnt.RecordTypeId = ERM_RECORDTYPEID;
        acnt.firstName = 'Paul';
        acnt.LastName = 'Smith';
        acnt.Date_of_Birth__c=system.today();
        acnt.HealthCloudGA__Gender__pc='Male';
        acnt.Phone='';
        acnt.PersonMobilePhone='123456789';
        acnt.Cerner_Email__c='smith@test.com';
        acnt.MRN__c='12345';
        acnt.Bypass_Cerner_Queue__c= true;
        acnt.Created_by_Cerner__c=true;
        acnt.Test_Result_Viewed__c = false;
        acnt.SMS_Sent__c  = false;
        acnt.Test_Date__c =DateTime.now();
        acnt.Case_Status__c= 'Active';
        acnt.Contact_or_Case_new__c='Case';
        acnt.Converted_Date__c = system.now();
        acnt.HealthCloudGA__StatusGroup__pc='PositiveTest';
        acnt.Stage__c= 'Case - In CI Queue';
        acnt.HealthCloudGA__Testing_Status__pc='Positive';
        acnt.Initial_test_date__c=system.today();
        insert acnt;
     
        // create ERM Account
        Account acnt2 = new Account();
        acnt2.RecordTypeId = ERM_RECORDTYPEID;
        acnt2.firstName = 'James';
        acnt2.LastName = 'Deen';
        acnt2.Date_of_Birth__c=system.today();
        acnt2.HealthCloudGA__Gender__pc='Male';
        acnt2.Phone='';
        acnt2.PersonMobilePhone='123456789';
        acnt2.Cerner_Email__c='james@test.com';
        acnt2.MRN__c='6987456';
        acnt2.Bypass_Cerner_Queue__c= true;
        acnt2.Created_by_Cerner__c=true;
        acnt2.Test_Result_Viewed__c = false;
        acnt2.SMS_Sent__c  = false;
        acnt2.Test_Date__c =DateTime.now();
        acnt2.Case_Status__c= 'Active';
        acnt2.Contact_or_Case_new__c='Case';
        acnt2.Converted_Date__c = system.now();
        acnt2.HealthCloudGA__StatusGroup__pc='PositiveTest';
        acnt2.Stage__c= 'Case - In CI Queue';
        acnt2.HealthCloudGA__Testing_Status__pc='Positive';
        insert acnt2;
     
        
        Test_Site_Translation__c TST=new Test_Site_Translation__c();
        TST.name='CNHS: Sam Hider Health Center';
        TST.Test_Site_Code__c='JAY-HC-ANC=CNHS';
        TST.Test_Site_Type__c='Cherokee Nation Health Services';
        insert TST;
        
         Cerner_Queue__c CQ31=new Cerner_Queue__c();
        CQ31.First_Name__c = 'James';
        CQ31.Middle_Name__c = 'test';
        CQ31.Last_Name__c = 'Deen';
        CQ31.MRN__c='6987456';
        CQ31.Applies_Date_Time__c = DateTime.now();
        CQ31.Email__c='james@test.com';
        CQ31.Test_Site_1st__c='JAY-HC-ANC=CNHS';
        CQ31.Delete_CQR__c = false;
        insert CQ31;    
        
        Cerner_Queue__c CQ1=new Cerner_Queue__c();
        CQ1.First_Name__c = 'Paul';
        CQ1.Middle_Name__c = 'test';
        CQ1.Last_Name__c = 'Smith';
        CQ1.MRN__c='12345';
        CQ1.Applies_Date_Time__c = DateTime.now();
        CQ1.Email__c='smith@test.com';
        CQ1.Test_Site_1st__c='JAY-HC-ANC=CNHS';
        CQ1.System_between0_10__c=true;
        CQ1.Delete_CQR__c = true;
        insert CQ1;    

        Cerner_Queue__c CQ11=new Cerner_Queue__c();
        CQ11.First_Name__c = 'Paul';
        CQ11.Middle_Name__c = 'test';
        CQ11.Last_Name__c = 'Smith';
        CQ11.MRN__c='12345';
        CQ11.Applies_Date_Time__c = DateTime.parse('11/11/2021, 11:23 AM');
        CQ11.Email__c='smith@test.com';
        CQ11.Test_Site_1st__c='JAY-HC-ANC=CNHS';
        CQ11.System_greater91__c=true;
        CQ11.Delete_CQR__c = true;
        insert CQ11;    
        
        Cerner_Queue__c CQ21=new Cerner_Queue__c();
        CQ21.First_Name__c = 'Paul';
        CQ21.Middle_Name__c = 'test';
        CQ21.Last_Name__c = 'Smith';
        CQ21.MRN__c='12345';
        CQ21.Applies_Date_Time__c = DateTime.parse('02/02/2022, 11:23 AM');
        CQ21.Email__c='smith@test.com';
        CQ21.Test_Site_1st__c='JAY-HC-ANC=CNHS';
        CQ21.System_between0_10__c=true;
        CQ21.Delete_CQR__c = true;
        insert CQ21;     
        	
        Cerner_Queue__c CQ2=new Cerner_Queue__c();
        CQ2.First_Name__c = 'Paul';
        CQ2.Middle_Name__c = 'test';
        CQ2.Last_Name__c = 'Smith';
        CQ2.MRN__c='12345';
        CQ2.Applies_Date_Time__c = DateTime.now();
        CQ2.Email__c='smith@test.com';
        CQ2.Test_Site_1st__c='JAY-HC-ANC=CNHS';
        CQ2.Delete_CQR__c = false;
        insert CQ2; 
        
        Cerner_Queue__c CQ3=new Cerner_Queue__c();
        CQ3.First_Name__c = 'George';
        CQ3.Middle_Name__c = 'test';
        CQ3.Last_Name__c = 'Mathew';
        CQ3.Applies_Date_Time__c = DateTime.now();
        CQ3.MRN__c='123456';
        CQ3.Email__c='mathew@test.com';
        CQ3.Test_Site_1st__c='JAY-HC-ANC=CNHS';
        CQ3.Delete_CQR__c = true;
        insert CQ3;
        
        Test.startTest();
        Database.executeBatch(new CreateERMAccountsForCQBatch(), 50);
        Test.stopTest();
    }
  
}