@isTest
private class UpdateCommunityUserAccountBatchTest 
{

    @isTest    
    static void test1()
    {
        
        Date dDate = Date.newInstance(2002, 12, 14);
	 	Account acc = Community_TestDataFactory.createAccount('Barin','David','nike@g.com','14124',dDate);
     	User usr = Community_TestDataFactory.createUser('Barin','David','barin@g.com',acc.id);   
   
        User u1 = [SELECT Id, Email FROM User WHERE Id =: usr.Id LIMIT 1];
        Account acc1 = [SELECT Id, PersonEmail FROM Account WHERE Id =: acc.Id LIMIT 1];
        
        acc1.PersonEmail = u1.Email;
        update acc1;
        
        Test.startTest();
        Database.executeBatch(new UpdateCommunityUserAccountBatch(), 200);
    	Test.stopTest();
    }
    
    
     @isTest    
    static void test2()
    {
        System.schedule('UpdateCommunityUserAccountBatch Job Test', '0 0 * * * ?', new UpdateCommunityUserAccountScheduler());
        
    }
    
  
}