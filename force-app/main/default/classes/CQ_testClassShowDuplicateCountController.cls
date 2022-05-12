@isTest
public class CQ_testClassShowDuplicateCountController 
{

@isTest    
public static void ShowDuplicateCountAndAccount()
{
   		 Test.startTest();
    	 Date dob = Date.newInstance(1990, 12, 14);
		 Cerner_Queue__c cq = TestDataFactory.createCQ('PATIENT', '', 'MACK', 'test@g.com', '832321', dob, '19123414'); 
    	 Cerner_Queue__c cq2 = TestDataFactory.createCQ('PATIENT', 'SAM', 'DEMO', 'test@h.com', '83233348', dob, '12981414'); 
    	 CernerQueue_ShowDuplicateCountController.geDuplicateRecCount(cq.Id);
    	 CernerQueue_ShowDuplicateCountController.geDuplicateRecCount(cq2.Id);
    	 CernerQueue_ShowDuplicateCountController.createAccount(cq.Id);
    	 CernerQueue_ShowDuplicateCountController.createAccount(cq2.Id);
    	 Test.stopTest();
}
    
    
}