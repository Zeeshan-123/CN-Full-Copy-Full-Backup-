@isTest
private class Community_registrationControllerTest
{
    
    @isTest    
    static void userRegistration()
    {
        Test.startTest();
        Date dDate = Date.newInstance(2002, 12, 14);
        Date fDate = Date.newInstance(2001, 12, 15);
        Account a = Community_TestDataFactory.createAccount('NewTest','User','','0321',dDate); 
        Community_registrationController.userSignUp('test@g.com','0321',dDate, 'NewTest','User'); // when account exist to associate with user
        Community_registrationController.userSignUp('test@g.com','654',fDate, 'NewTest','User');  // when account doesn't exist to associate with user
        
        a.Is_Void__c = 'Yes';
        update a;
        Community_registrationController.userSignUp('test@g.com','0321',dDate, 'NewTest','User');
        
        a.DOD__c = system.today();
        update a;
        Community_registrationController.userSignUp('test@g.com','0321',dDate, 'NewTest','User');
        
        Community_registrationController.createUser('NewTest','User','test@g.com','0321',dDate,'Hello12!');
        Community_registrationController.userLogin('test@g.com','Hello12!'); 
        Community_registrationController.userLogin(null,'Hello12!'); 
        Community_registrationController.validateEnteredPIN('0321',dDate, '12345');
        Test.stopTest();
    }
    
}