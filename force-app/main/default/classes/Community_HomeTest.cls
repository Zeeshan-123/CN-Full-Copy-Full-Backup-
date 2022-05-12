@isTest
private class Community_HomeTest {
     @isTest    
static void test1() {
        Date dDate = Date.newInstance(2002, 12, 14);
        Account acc = Community_TestDataFactory.createAccount('Barin','David','nike@g.com','14124',dDate);
        User usr = Community_TestDataFactory.createUser('Barin','David','barin@g.com',acc.id);   
   
        User commUser = [SELECT Id FROM User WHERE Id =: usr.Id LIMIT 1];
        
          system.runAs(commUser) {
            test.startTest();

             String contactId=utility.getUserContactId(commUser.Id);  
             Case cs=Community_TestDataFactory.createCase(contactId); // create case with loggedin user id, so we can fetch it with our case method
             Account acnt = [SELECT Id, Opt_In_to_Email__c, Opt_In_to_SMS__c, Opt_In_Initially_Shown__c FROM Account WHERE PersonContactId =: contactId];
             Case cse = [SELECT Id FROM Case WHERE ContactId =: contactId];
             Community_Home.getUserInfo();
             Community_Home.isSurveyExists();
             Community_Home.setInterestedInSurveyField(acnt.id);
             Community_Home.setOptIn(acnt);
            
            
            test.stopTest();

        }
     
    }
    
}