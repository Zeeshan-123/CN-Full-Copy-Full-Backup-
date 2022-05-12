@isTest
public class Community_TestDataFactory 
{
	// creates account
    public static Account createAccount(String firstName,String lastName,String email,String tribeID,Date dob)
    {
        
       Account a = new Account();
       a.firstName = firstName;
       a.LastName = lastName;
       a.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('CN_Registration').getRecordTypeId();// CN Registration RecordType id
       a.PersonEmail=email;
       a.Tribe_Id__c=tribeID;
       a.Date_of_Birth__c=dob;
       a.If_CN_Citizen__c = 'Yes';
       insert a;
     
        return a;
    }
    
    // creates account
    public static Account createAccountWithGen(String firstName,String lastName,String email,String tribeID,Date dob, String Gender)
    {
        
       Account a = new Account();
       a.firstName = firstName;
       a.LastName = lastName;
       a.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('CN_Registration').getRecordTypeId();// CN Registration RecordType id
       a.PersonEmail=email;
       a.Tribe_Id__c=tribeID;
       a.Date_of_Birth__c=dob;
       a.HealthCloudGA__Gender__pc = Gender; 
       a.If_CN_Citizen__c = 'Yes';
       insert a;
     
        return a;
    }
    
    
    // creates case
    public static Case createCase(String contactId)
    {
         Case cse = new Case();
         cse.Status='New';
         cse.Origin='Portal';
         cse.Priority='Medium';
         cse.ContactId=contactId;
         insert cse;
     
        return cse;
    }
    
     // creates case
    public static Case createCaseforCA(String contactId)
    {
         Case cse = new Case();
         cse.Status='New';
         cse.Origin='Portal';
         cse.Priority='Medium';
         cse.ContactId=contactId;
         cse.Request_Reason__c = 'CA';
         cse.RecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('CA').getRecordTypeId();// CA RecordType id
         insert cse;
     
        return cse;
    }
    
     // creates veteran record
    public static Veteran_Service__c createVeteranRecord(String contactId, String serviceBranch)
    {
         Veteran_Service__c veteran = new Veteran_Service__c();
        	veteran.Service_Branch__c=serviceBranch;
			veteran.Enlistment_Month__c='June';
            veteran.Enlistment_Year__c='2000';
            veteran.Number_of_Service_Months__c='1 Month';
            veteran.Number_of_Service_Years__c='10 Years';
            veteran.Veteran_Contact__c = contactId;  
         insert veteran;
     
        return veteran;
    }
    
    // takes account id and fetche associated contact with it and then create user with that contact
    public static User createUser(String firstName,String lastName,String email,String accountID)
    {
        CNPortal_UserName_PostFix__mdt userPostFix=[SELECT MasterLabel FROM CNPortal_UserName_PostFix__mdt 
                                                        WHERE DeveloperName = 'CNPortal_UserName_PostFix'];
        String userNameWithPostfix =email+userPostFix.MasterLabel;
        
        Profile profileID = [SELECT Id, Name FROM Profile WHERE Name= 'CN Customer Community Plus Login User'];
        List<Contact> lstContact = [SELECT Id FROM contact WHERE  accountId   =:  accountID];
        Contact con = lstContact[0];
        
	 	User u = new User();
        u.LastName = lastName;
        u.FirstName = firstName;
        u.Email = email;
   		u.Alias = lastName+'00';
        u.Username = userNameWithPostfix;
        u.CommunityNickname =firstName + ' '+ lastName;
        u.ContactId = con.Id;
        u.LocaleSidKey = 'en_US';
        u.TimeZoneSidKey = 'America/Chicago';
        u.IsActive = true;
        u.ProfileID = profileID.id; // CN Customer Community Plus Login User Profile id
        u.LanguageLocaleKey = 'en_US';
        u.EmailEncodingKey = 'UTF-8';    
                 
		insert u;
        return u;
   }
    
    public static User createDeactivatedUser(String firstName,String lastName,String email,String accountID)
    {
        CNPortal_UserName_PostFix__mdt userPostFix=[SELECT MasterLabel FROM CNPortal_UserName_PostFix__mdt 
                                                        WHERE DeveloperName = 'CNPortal_UserName_PostFix'];
        String userNameWithPostfix =email+userPostFix.MasterLabel;
        
        Profile profileID = [SELECT Id, Name FROM Profile WHERE Name= 'CN Customer Community Plus Login User'];
        List<Contact> lstContact = [SELECT Id FROM contact WHERE  accountId   =:  accountID];
        Contact con = lstContact[0];
        
	 	User u = new User();
        u.LastName = lastName;
        u.FirstName = firstName; 
        u.Email = email;
   		u.Alias = lastName+'00';
        u.Username = userNameWithPostfix;
        u.CommunityNickname =firstName + ' '+ lastName;
        u.ContactId = con.Id;
        u.LocaleSidKey = 'en_US';
        u.TimeZoneSidKey = 'America/Chicago';
        u.IsActive = false;
        u.ProfileID = profileID.id; // CN Customer Community Plus Login User Profile id
        u.LanguageLocaleKey = 'en_US';
        u.EmailEncodingKey = 'UTF-8';    
                 
		insert u;
        return u;
   }
 
}