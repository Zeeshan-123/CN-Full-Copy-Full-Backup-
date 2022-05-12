/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba Asif
@Date: 11/02/2021
@Purpose: This class is used as controller for Community_registrationController aura component.
---------------------------------------------------------------------------------------------------------------*/



public without sharing class Community_registrationController {

    @future
    public static void sendEmail(String conId, String email, String eCheck, String accntId)
    {   
           // send email contaning OTP to user        
                Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
                message.setTargetObjectId(conId); 
                message.setSaveAsActivity(false); 
                //set org wide email address
                OrgWideEmailAddress OWE=[SELECT Id FROM OrgWideEmailAddress WHERE DisplayName = 'Gadugi Portal'];
                //OrgWideEmailAddress OWE=[SELECT Id FROM OrgWideEmailAddress WHERE DisplayName = 'CN Registration'];
                message.setOrgWideEmailAddressId(OWE.id);
                message.setUseSignature(false);
                //get email template
                EmailTemplate emailTemplate = [Select Id,Subject,Description,HtmlValue,DeveloperName,Body from EmailTemplate where DeveloperName =: 'Community_OTPEmail']; // query Community_OtpEmail
                message.setTemplateID(emailTemplate.Id); //set template id
                message.setWhatId(conId); //This is important for the merge fields in template to work
                message.toAddresses =  new String[] { email};
                    Messaging.SingleEmailMessage[] messages = new List<Messaging.SingleEmailMessage> {message};
                        if(!test.isRunningTest())
                        Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);
        
        if(eCheck == 'True')
        {
            //Commented by Shams for CHERNCP-176
            //Account accnt = new Account();
            //accnt.Id		=	accntId;
            //accnt.PersonEmail	=	'';
            contact con=[select TempEmail__c,id,email from contact where accountid=:accntId];
            con.Email=con.TempEmail__c;
            con.TempEmail__c='';
            //End of change for CHERNCP-176
            update con;
        }
        
    }

    //verify user data
    @AuraEnabled
    public static String userSignUp(String email,String tribeID, Date dob, String uFirstName, String uLastName)
    {
       try
       {
        String citizenId = tribeID.normalizeSpace(); 
        String accountId = ''; // save account id
        String AccountRecordType = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('CN_Registration').getRecordTypeId();   
        Account CitizenAccnt;
        List<User> uAcc;
           
        //get meta data
        CNPortal_UserName_PostFix__mdt userPostFix=[Select MasterLabel from CNPortal_UserName_PostFix__mdt where DeveloperName = 'CNPortal_UserName_PostFix'];
       //append keyword with username
        String userNameFull=email+userPostFix.MasterLabel;
     
        // query user to check does username already exist on a user record
        List<User> usr =[SELECT Id, Username, Name, Email FROM User WHERE Username =: userNameFull limit 1]; 
         
        // query account to validate tribe/Citizen id and DOB 
        List<Account> lstAccount = [SELECT Id, TempEmail__c,Tribe_Id__c,If_CN_Citizen__c, DOD__c, Is_Void__c, Stop_Flag__c, PersonEmail FROM account 
                                    WHERE Tribe_Id__c =: citizenId and Tribe_Id__c != '' and  Date_of_Birth__c =: dob and RecordTypeId =: AccountRecordType limit 1];
       
        if(lstAccount != null && lstAccount.size() > 0 )
		{
		    CitizenAccnt = lstAccount[0];
         
            //  query user to check does account id exist on a user record as a lookup
            uAcc =[SELECT Id, AccountId, Username, Name FROM User where AccountId =: CitizenAccnt.Id limit 1];
        }
       
           
       // when an email address/username has already been used on a user record
         if(usr != null && usr.size() > 0)
           {
              return System.Label.Community_UserEmailAddress; 
           } 
        
       // when account id has already been populated as a lookup on a user record
        else if(uAcc != null && uAcc.size() > 0 )
        {
            return System.Label.Community_UserAlreadyRegistered;
        }
       
        // when all conditions are valid and provided tribe/Citizen id and Dob is correct
        else  if(lstAccount != null && lstAccount.size() > 0 )
        {
        
            if(lstAccount[0].DOD__c != null)
            {
                return System.Label.Community_PersonDeceased;
            }
            else if(lstAccount[0].If_CN_Citizen__c != 'Yes' || lstAccount[0].Is_Void__c == 'Yes')
            {
                return System.Label.Community_VoidedUser;
            }
            else
            {
                // generate random OTP
                String rand = string.valueof(Math.abs(Crypto.getRandomInteger()));
                String OTP = rand.substring(0,6); 
                String eCheck = 'False';
                
                Contact us =[SELECT Id, Email, User_Email__c, OTP_Generated_Time__c, OTP_Counter__c, OTP__c, Name FROM Contact where AccountId =: CitizenAccnt.Id limit 1];
                
                //Commented by Shams for CHERNCP-176
                //if(CitizenAccnt.PersonEmail == '' || CitizenAccnt.PersonEmail ==null)
                //{
                //    eCheck = 'True';
                //    CitizenAccnt.PersonEmail	=	email;
                //    update CitizenAccnt;
                //}
                eCheck = 'True';
                //CitizenAccnt.TempEmail__c=CitizenAccnt.PersonEmail;
                //CitizenAccnt.PersonEmail	=	email;
                //update CitizenAccnt;
                //End of change for CHERNCP-176
                
                //get OTP on user record so we can set merge field
                us.User_Name__c				=	uFirstName + ' ' + uLastName;
                us.User_Email__c			=	email;
                us.OTP__c					=	OTP;
                us.OTP_Counter__c			=	3;
                us.OTP_Generated_Time__c	=System.now();
                us.TempEmail__c=us.email;
                us.email=email;
                
                update us;
                
                sendEmail(us.Id, email, eCheck, CitizenAccnt.Id);
                
                
                return 'Verified'; 
            }
     
		}
           
         // when all conditions are valid but provided citizen id or date of birht is wrong
		else
		{
          return System.Label.Community_FailedToRegister;  
		}
    }
             catch(exception ex)
            {
			   //System.debug('AK '+ex.getMessage());
               return ex.getMessage(); 
			}
		
        
    }
    
    //validate OTP (non funtional)
    @AuraEnabled
    public static String validateEnteredPIN(String tribeID, Date dob,String OTP)
    {
            String citizenId = tribeID.normalizeSpace(); 
            String profileId = null; // save profile id
            String accountId = ''; // save account id
            String AccountRecordType = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('CN_Registration').getRecordTypeId(); 
        
            // query Account
            List<Account> lstAccount = [SELECT Id,Tribe_Id__c FROM account WHERE Tribe_Id__c =: citizenId and Tribe_Id__c != '' 
                                        and Date_of_Birth__c =: dob and RecordTypeId =: AccountRecordType limit 1];
            if(lstAccount != null && lstAccount.size() > 0 )
            {
                Account a = lstAccount[0];
                accountId = a.Id;	
            }
        
        	//Query Contact
            Contact us =[SELECT Id,User_Email__c,OTP_Generated_Time__c,OTP_Counter__c,OTP__c, Name FROM Contact where AccountId =: accountId limit 1];
            //Check otp and return the result
        	if(us.OTP_Counter__c>0 && us.OTP__c==OTP)
            {
                return 'Success';
            }
        	else if(us.OTP_Counter__c>1)
            {
                us.OTP_Counter__c=us.OTP_Counter__c-1;
                update us;
                return 'Failed';
            }
            else
            {   
                    return 'MaxAttemptsReached';
            }    
    }
    
      //create community user
    @AuraEnabled
    public static String createUser(String firstName,String lastName,String email,String tribeID, Date dob, String password )
    {
       try
       {
        String citizenId = tribeID.normalizeSpace(); 
        String profileId = null; // save profile id
        String accountId = ''; // save account id
        String citId = ''; // save citizen/tribal id
        String AccountRecordType = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('CN_Registration').getRecordTypeId();
           
        //get meta data
        CNPortal_UserName_PostFix__mdt userPostFix=[Select MasterLabel from CNPortal_UserName_PostFix__mdt where DeveloperName = 'CNPortal_UserName_PostFix'];
       //append keyword with username
        String userNameFull=email+userPostFix.MasterLabel;
           
        //get profile id  
        Profile p = [SELECT Id FROM profile WHERE name='CN Customer Community Plus Login User'];
        profileId = p.Id;
        
        // get account data
        List<Account> lstAccount = [SELECT Id,Tribe_Id__c FROM account WHERE Tribe_Id__c =: citizenId and Tribe_Id__c != '' 
                                    and Date_of_Birth__c =: dob and RecordTypeId =: AccountRecordType limit 1];
       
        if(lstAccount != null && lstAccount.size() > 0 )
		{
			Account a = lstAccount[0];
			accountId = a.Id;	
            citId=a.Tribe_Id__c;

            String nickName = firstName+citId;
            
			User u = new User();
			u.Username = userNameFull;
			u.Email = email;
			u.FirstName = firstName;
			u.LastName = lastName;
            u.CommunityNickname = nickName;   
            u.TimeZoneSidKey = 'America/Chicago';
            u.LocaleSidKey = 'en_US';
            u.LanguageLocaleKey = 'en_US';
			u.ProfileId = profileId;
			String communityUser;
			communityUser = Site.createExternalUser(u, accountId, password);
            
            Account accnt 		= new Account();
            accnt.Id			=	accountId;
            accnt.PersonEmail	=	email;
            update accnt;
            
            return 'SUCCESS';
			}

           else{
               return 'Unknown error occurred.';
           }
    }
             catch(exception ex)
            {
			   //System.debug('AK '+ex.getMessage());
               return ex.getMessage(); 
			}
		
		       
    }
    
      @AuraEnabled
    public static String userLogin(String username, String password)
        {
   
        try 
        {
            String usrName = username.normalizeSpace(); 
            // get meta data to add with user name
            CNPortal_UserName_PostFix__mdt userPostFix=[Select MasterLabel from CNPortal_UserName_PostFix__mdt where DeveloperName = 'CNPortal_UserName_PostFix'];
      		String userNameWithPostfix =usrName+userPostFix.MasterLabel;
            system.debug('AK login usrname ' + userNameWithPostfix); 
     		String startURL = '/s/';

            ApexPages.PageReference lgn = Site.login(userNameWithPostfix, password,startURL);
            //if credentials are correct logged user into community
            aura.redirect(lgn);
             return 'SUCCESS';
        }
            
        catch (Exception ex)
        {
            //system.debug('AK login user '+ ex.getMessage());
            return ex.getMessage();            
        }
        }
}