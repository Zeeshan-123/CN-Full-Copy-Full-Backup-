/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba Asif
@Date: March/06/2021
@Purpose: This class is used as test class for Community_WICebtFormController class.
---------------------------------------------------------------------------------------------------------------*/


@isTest
private class Community_WICebtFormControllerTest 
{
		      @isTest    
static void tstMethod()
    {
        Date dDate = Date.newInstance(2002, 12, 14);
	 	Account acc = WIC_TestDataFactory.createAccount('Eva','Rogger','eva@test.com','14124',dDate);
     	User usr = WIC_TestDataFactory.createUser('Eva','Rogger','eva@test.com',acc.id);   
   
        List<Account> childsAccountListToInsert = new List<Account>();
        Account childAccount1 = new  Account (firstName = 'Leo', LastName = 'Rogger', PersonEmail = 'leo@test.com', Date_of_Birth__c = dDate);
        Account childAccount2 = new Account (firstName = 'Clara', LastName = 'Rogger', PersonEmail = 'clara@test.com', Date_of_Birth__c = dDate);
        Account childAccount3 = new Account (firstName = 'Murdock', LastName = 'Rogger', PersonEmail = 'murdock@test.com', Date_of_Birth__c = dDate);
        
        childsAccountListToInsert.add(childAccount1);
        childsAccountListToInsert.add(childAccount2);
        childsAccountListToInsert.add(childAccount3);
        
        List<String> programs = new List<String>();
        programs.add('SNAP');
        
        User userForTesting = [SELECT Id FROM User WHERE Id =: usr.Id LIMIT 1];
        
          system.runAs(userForTesting)
        {
            test.startTest();
			 
             String contactId=utility.getUserContactId(userForTesting.Id);  
             Case cs=WIC_TestDataFactory.createCase(contactId, 'Summer EBT'); // create case with loggedin user id, so we can fetch it with our case method
             Account acnt = [SELECT Id FROM Account WHERE PersonContactId =: contactId];
             Case cse = [SELECT Id FROM Case WHERE ContactId =: contactId];
		     Community_WICebtFormController.ebtRequestCheck();
			 Community_WICebtFormController.getPicklistValues('Case', 'Physical_Countries__c', 'Physical_States__c');  
             Community_WICebtFormController.saveAccounts(childsAccountListToInsert, 'Other', 'Chinees', programs, '1000$', 'Monthly', '3',
                                                        'Eva', 'J.' ,'Rogger',  '.Sr', dDate,
                                                        '123', 'Murrieta', 'United States', 'California', '97232',
                                                        '9862 St', 'Temecula', 'United States', 'California', '92592',
                                                        'eva@test.com', '192412144', '192412144', '192412144' , 'George', 'Rogger', '19523525', 'george@test.com');
            test.stopTest();

        }
     
    }
}