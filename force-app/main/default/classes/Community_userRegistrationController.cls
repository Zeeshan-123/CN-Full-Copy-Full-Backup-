/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba Asif
@Date: 25/09/2020
@Purpose: This class is used as controller for Community_userRegistrationController aura component.
---------------------------------------------------------------------------------------------------------------*/



public without sharing class Community_userRegistrationController {

    //register a user on community
    @AuraEnabled
    public static String userSignUp(String firstName,String lastName,String email,String tribeID, Date dob)
    {
       try
       {
        String citizenId = tribeID.normalizeSpace(); 
        String profileId = null; // save profile id
        String accountId = ''; // save account id
        String citId = ''; // save citizen/tribal id
        List<User> uAcc;
           
        //get meta data
        CNPortal_UserName_PostFix__mdt userPostFix=[Select MasterLabel from CNPortal_UserName_PostFix__mdt where DeveloperName = 'CNPortal_UserName_PostFix'];
       //append keyword with username
        String userNameFull=email+userPostFix.MasterLabel;
           
        //get profile id  
        Profile p = [SELECT Id FROM profile WHERE name='CN Customer Community Plus Login User'];
        profileId = p.Id;
        
        // query to check if provided tribe/Citizen id and DOB are valid?
        List<Account> lstAccount = [SELECT Id,Tribe_Id__c FROM account WHERE Tribe_Id__c =: citizenId and  Date_of_Birth__c =: dob  limit 1];
       
        if(lstAccount != null && lstAccount.size() > 0 )
		{
			Account a = lstAccount[0];
			accountId = a.Id;	
            citId=a.Tribe_Id__c;
         
        // query to check if the account that we have get
        // Is already associated with any user?
        uAcc =[SELECT Id, AccountId, Username, Name FROM User where AccountId =: accountId limit 1];
      
        }
           
       
        // query to check if user exist?
        List<User> usr =[SELECT Id, Username, Name, Email FROM User WHERE Username =: userNameFull limit 1]; 
       
       // if user exists  (email entered is same)
         if(usr != null && usr.size() > 0)
           {
              return System.Label.Community_UserAlreadyRegistered; 
           } 
        
       //  if account is already associated with a portal user? (email entered is different)
        else if(uAcc != null && uAcc.size() > 0 )
        {
            return System.Label.Community_UserAlreadyRegistered;
        }
       
        // if user doesn't exists and provided tribe/Citizen id is valid then register a user
        else  if(lstAccount != null && lstAccount.size() > 0 )
		{
            String nickName = firstName+lastName+citId;
            Integer nickNameLenght = nickName.length();
            
			User u = new User();
			u.Username = userNameFull;
			u.Email = email;
			u.FirstName = firstName;
			u.LastName = lastName;
            
            if(nickNameLenght < 40)
            {
             u.CommunityNickname = firstName+lastName+citId;   
            } 
            else
            {
            u.CommunityNickname = firstName+citId;     
            }
            
            u.TimeZoneSidKey = 'America/Chicago';
            u.LocaleSidKey = 'en_US';
            u.LanguageLocaleKey = 'en_US';
			u.ProfileId = profileId;
			String communityUser;
			communityUser = Site.createExternalUser(u, accountId);
			system.debug('userId is'+communityUser);
            
            return 'SUCCESS';
			}
           
         // if user doesn't exists and provided tribe/Citizen id is invalid
		else
		{
          return System.Label.Community_FailedToRegister;  
		}
    }
             catch(Site.ExternalUserCreateException ex)
            {
			   System.debug('AK '+ex.getMessage());
               return ex.getMessage(); 
			}
		
		       
    }
    
    
}