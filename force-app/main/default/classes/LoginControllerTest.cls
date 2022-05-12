@isTest
private class LoginControllerTest {
    
    @future
    public static void DeactivateUserFM(String UserId) {
        User usr				=  	new User();
        usr.Id					=  	UserId;
        usr.IsActive 			=  	false;
    	//usr.IsPortalEnabled 	=  	false;
        update usr;
    }
    
    @isTest    
    static void userLogin() {
        Test.startTest();
        Date dDate = Date.newInstance(2002, 12, 14);
        Account a = Community_TestDataFactory.createAccount('NewTest','User','testUser@g.com','0321',dDate);
        User u = Community_TestDataFactory.createUser('NewTest','User','testUser@g.com',a.id);

        // CNHPHOMS-42/16/37: Vikash: Added 3rd param as per updates on LoginController
        LoginController.login(null, null, null);
        LoginController.login(u.email, 'Fpwd12234', null);   		// when user exist
        LoginController.login(u.email+'fake', 'fpwd', null); 		// when user doesn't exist
        
        // CNHPHOMS-42/16/37: Vikash: Added 3rd param as per updates on LoginController
        LoginController.login(null, null, 'wics_program');
        
		/*
		Account uAcc = [SELECT id, DOD__c FROM ACCOUNT WHERE Id =: a2.Id];
        uAcc.DOD__c =  System.today(); 
		update uAcc;       
        User thisUser = [ select Id from User where Id = :UserInfo.getUserId() ];
      	
        System.runAs ( new User(Id = UserInfo.getUserId()) ) {
            User usr = [SELECT id, isActive, email FROM USER WHERE Id =: u.Id];
            usr.IsActive = false;
            update usr;
            LoginController.login(u.email, 'fpwd');
        }
        LoginController.login(u2.email, 'fpwd');
		*/
        Test.stopTest();
    }
    
    @isTest    
    static void userForgotPassword() {
        Test.startTest();
        Date dDate = Date.newInstance(2002, 12, 14);
        Account a = Community_TestDataFactory.createAccount('NewTest','User','testUser@g.com','0321',dDate);
        User u = Community_TestDataFactory.createUser('NewTest','User','testUser@g.com',a.id);
        LoginController.forgotPassword(u.email); // correct username
        LoginController.forgotPassword(u.email+'fake'); // wrong username
        LoginController.forgotPassword(null);
        //for forgot username
        LoginController.forgotUsername('123', system.today());
        Test.stopTest();
    }
    // end LoginController class test methods
}