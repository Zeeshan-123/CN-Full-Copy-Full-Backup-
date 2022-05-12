@isTest
private class Community_testClass 
{
 
// CNPortal_PassResetVfcCtrl  class test methods
          @isTest    
static void getUserId()
    {
        Test.startTest();
        Date dDate = Date.newInstance(2002, 12, 14);
        Account a = Community_TestDataFactory.createAccount('NewTest','User','testUser@g.com','0321',dDate); // create account for user
        User u = Community_TestDataFactory.createUser('NewTest','User','testUser@g.com',a.id);        // create user with account id
        CNPortal_PassResetVfcCtrl cntrl = new CNPortal_PassResetVfcCtrl();     // create class instance
        cntrl.setcId(u.ContactId); // pass user's contact id
        cntrl.getuEmail();
        cntrl.getuLastName();
        cntrl.getuFirstName();
        cntrl.getuId();
        Test.stopTest();
    }
    
   // end CNPortal_PassResetVfcCtrl  class test methods
   
    
       // Community_myProfileDetailsController  class test methods
       @isTest    
static void getUserDetails()
    {
        Date dDate = Date.newInstance(2002, 12, 14);
	 	Account acc = Community_TestDataFactory.createAccount('Barin','David','nike@g.com','14124',dDate);
     	User usr = Community_TestDataFactory.createUser('Barin','David','barin@g.com',acc.id);   
   
        User userForTesting = [SELECT Id FROM User WHERE Id =: usr.Id LIMIT 1];
        
          system.runAs(userForTesting)
        {
            test.startTest();

             String contactId=utility.getUserContactId(userForTesting.Id);  
             Account acnt = [SELECT Id FROM Account WHERE PersonContactId =: contactId];
			 Community_myProfileDetailsController.userDetails();
            
            test.stopTest();

        }
     
    }
        
    // end Community_myProfileDetailsController  class test methods
    
    
          // Community_CreateVetRecWrapper and Community_CreateVeterenRecord  class test methods
       @isTest    
static void createVetRec()
    {
        Date dDate = Date.newInstance(2002, 12, 14);
	 	Account acc = Community_TestDataFactory.createAccount('Barin','David','nike@g.com','14124',dDate);
     	User usr = Community_TestDataFactory.createUser('Barin','David','barin@g.com',acc.id);   
   
        User userForTesting = [SELECT Id FROM User WHERE Id =: usr.Id LIMIT 1];
        
          system.runAs(userForTesting)
        {
            test.startTest();

             String contactId=utility.getUserContactId(userForTesting.Id); 
             Community_CreateVeterenRecord.getBranchServicePl();
			 Community_CreateVeterenRecord.createVeterantRecord('Navy','1995','June','10 Years','2 Months', true);
            test.stopTest();

        }
     
    }
        
    
    // end Community_CreateVetRecWrapper and Community_CreateVeterenRecord class test methods
    
    
    
    
  // Community_VeteranInfo  class test methods
       @isTest    
static void getVeteranInfo()
    {
        Date dDate = Date.newInstance(2002, 12, 14);
	 	Account acc = Community_TestDataFactory.createAccount('Barin','David','nike@g.com','14124',dDate);
     	User usr = Community_TestDataFactory.createUser('Barin','David','barin@g.com',acc.id);   
   
        User userForTesting = [SELECT Id FROM User WHERE Id =: usr.Id LIMIT 1];
        
          system.runAs(userForTesting)
        {
            test.startTest();

             String contactId=utility.getUserContactId(userForTesting.Id);  
             Veteran_Service__c veteran =Community_TestDataFactory.createVeteranRecord(contactId, 'Navy');
             Veteran_Service__c vet = [SELECT Id FROM Veteran_Service__c WHERE Veteran_Contact__c =: contactId];
			 Community_VeteranInfo.getUserInfo();
            
            test.stopTest();

        }
     
    }
        
    // end Community_VeteranInfo class test methods
   
     // Community_OTPGenerator  class test methods
       @isTest    
static void OTPGenerator()
    {
   
        Community_OTPGenerator plugin = new Community_OTPGenerator();
        Map<String, Object> inputParams = new Map<String, Object>();
        String rand = string.valueof(Math.abs(Crypto.getRandomInteger()));
        String otp = rand.substring(0,6);
        inputParams.put('OTP', otp);
        
        
        Process.PluginRequest request = new Process.PluginRequest(inputParams);
        
        plugin.invoke(request);
        Process.PluginDescribeResult result = plugin.describe();
    } 
     
    
        
    // end Community_OTPGenerator class test methods
}