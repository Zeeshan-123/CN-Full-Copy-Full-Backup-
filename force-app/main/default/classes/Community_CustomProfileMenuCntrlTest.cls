@isTest
private class Community_CustomProfileMenuCntrlTest {
     @isTest    
static void test1()
    {
        Date dDate = Date.newInstance(2002, 12, 14);
	 	Account acc = Community_TestDataFactory.createAccount('Barin','David','nike@g.com','14124',dDate);
     	User usr = Community_TestDataFactory.createUser('Barin','David','barin@g.com',acc.id);   
   
        User userForTesting = [SELECT Id FROM User WHERE Id =: usr.Id LIMIT 1];
        
        system.runAs(userForTesting)
        {
            test.startTest();
            Community_CustomProfileMenuController.getUserInfo();
            test.stopTest();
            
        }
     
    }
    
}