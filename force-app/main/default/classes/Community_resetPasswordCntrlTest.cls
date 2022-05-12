@isTest
public class Community_resetPasswordCntrlTest 
{
    // Community_resetPasswordCntrl class test methods
  @isTest    
	static void getUserName()
    {
        Test.startTest();
        Date dDate = Date.newInstance(2002, 12, 14);
        Account a = Community_TestDataFactory.createAccount('NewTest','User','testUser@g.com','0321',dDate);
        User u = Community_TestDataFactory.createUser('NewTest','User','testUser@g.com',a.id);
   		Community_resetPasswordCntrl.getUserName(u.Id);
        Test.stopTest();
        
        }
    
      @isTest    
	static void changeUserPassword()
    {
        Test.startTest();
        Date dDate = Date.newInstance(2002, 12, 14);
        Account a = Community_TestDataFactory.createAccount('NewTest','User','testUser@g.com','0321',dDate);
        User u = Community_TestDataFactory.createUser('NewTest','User','testUser@g.com',a.id);
   		Community_resetPasswordCntrl.ChangePassword(u.Id,'Hello12!'); // password change request with correct user id
        Community_resetPasswordCntrl.ChangePassword(u.Id+'false','Hello12!'); // password change request with a user id that doesn't exist
        Community_resetPasswordCntrl.ChangePassword(u.Id,null);
        Test.stopTest();
        
        }
}