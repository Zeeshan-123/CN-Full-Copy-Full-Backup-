/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba Asif
@Date: AUG/20/2021
@Purpose: This class is used as test class for Community_ApplicationCntrl aura component.
---------------------------------------------------------------------------------------------------------------*/

@isTest
private class Community_ApplicationsCntrlTest {
    
          @isTest    
static void t1()
    {
         Date dDate = Date.newInstance(2002, 12, 14);
	 	Account acc = Community_TestDataFactory.createAccount('Barin','David','nike@g.com','14124',dDate);
     	User usr = Community_TestDataFactory.createUser('Barin','David','barin@g.com',acc.id);   
   
        User userForTesting = [SELECT Id FROM User WHERE Id =: usr.Id LIMIT 1];
        
          system.runAs(userForTesting)   {
            test.startTest();

             String contactId=utility.getUserContactId(userForTesting.Id);  
             Case cs=Community_TestDataFactory.createCaseforCA(contactId); // create case with loggedin user id, so we can fetch it with our case method
             Account acnt = [SELECT Id FROM Account WHERE PersonContactId =: contactId];
             Case cse = [SELECT Id FROM Case WHERE ContactId =: contactId];
             Community_ApplicationsCntrl.getInfo();
              Community_ApplicationsCntrl.getAccount();
            test.stopTest();
    }
}
}