@isTest
public class WIC_TestDataFactory 
{
	// creates portal user account
    public static Account createAccount(String firstName,String lastName,String email,String tribeID,Date dob)
    {
        
       Account a = new Account();
       a.firstName = firstName;
       a.LastName = lastName;
       a.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('CN_Registration').getRecordTypeId();// CN Registration RecordType id
       a.PersonEmail=email;
       a.Tribe_Id__c=tribeID;
       a.Date_of_Birth__c=dob;
       insert a;
     
        return a;
    }
    
    // creates case
    public static Case createCase(String contactId, String reason)
    {
        Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('EBT_Request').getRecordTypeId();
         Case cse = new Case();
         cse.RecordTypeId 		=		caseRecordTypeId;
         cse.Status				=		'New';
         cse.Origin				=		'Portal';
         cse.Priority			=		'Medium';
         cse.ContactId			=		contactId;
         cse.Request_Reason__c	=	reason;
         insert cse;
     
        return cse;
    }
    
    
    // takes account id and fetche associated contact with it and then create user with that contact
    public static User createUser(String firstName,String lastName,String email,String accountID)
    {
        Profile profileID = [SELECT Id, Name FROM Profile WHERE Name= 'CN Customer Community Plus Login User'];
        List<Contact> lstContact = [SELECT Id FROM contact WHERE  accountId   =:  accountID];
        Contact con = lstContact[0];
        
	 	User u = new User();
        u.LastName = lastName;
        u.FirstName = firstName;
        u.Email = email;
   		u.Alias = lastName+'00';
        u.Username = email+'.cherokee.org.full';
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
    

 
}