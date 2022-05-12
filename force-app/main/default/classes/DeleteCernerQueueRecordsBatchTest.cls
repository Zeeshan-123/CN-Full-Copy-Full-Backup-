@isTest
private  class DeleteCernerQueueRecordsBatchTest {

     @isTest    
    static void test1(){
        Test_Site_Translation__c TST=new Test_Site_Translation__c();
        TST.name='CNHS: Sam Hider Health Center';
        TST.Test_Site_Code__c='JAY-HC-ANC=CNHS';
        TST.Test_Site_Type__c='Cherokee Nation Health Services';
        insert TST;
        
        Cerner_Queue__c CQ=new Cerner_Queue__c();
        CQ.First_Name__c = 'Test';
        CQ.Last_Name__c = 'Testing';
        CQ.MRN__c='12345';
        CQ.Applies_Date_Time__c = DateTime.now();
        CQ.Email__c='test@g.com';
        CQ.Test_Site_1st__c='JAY-HC-ANC=CNHS';
        insert CQ;
        
        Test.startTest();
        Database.executeBatch(new DeleteCernerQueueRecordsBatch(), 200);
    	Test.stopTest();
    }
    
    
     @isTest    
    static void test2(){
        System.schedule('Delete CQ Records Job Test', '0 0 * * * ?', new DeleteCernerQueueRecordsBatch());
    }
    
}