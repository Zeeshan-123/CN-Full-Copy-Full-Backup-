/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba Asif
@Date: feb/24/2020
@Purpose: This class is used as controller for Community_changeEmail aura component.
---------------------------------------------------------------------------------------------------------------*/


public without sharing  class  Community_changeEmailController
{
    // fetches logged in user information
    @AuraEnabled
    public static User getUserInfo()
    { 
        
        return [SELECT Id, Name, Email
                FROM User WHERE Id =: UserInfo.getUserId()];
    } 
    
    // change logged in user email and username
   @AuraEnabled
        public static void changeUserEmail(String newEmail)
        { 
            try
            {   
                //query user
                User usr = [SELECT Id, Name, Email, Username
                            FROM User WHERE Id =: UserInfo.getUserId()];
                
                usr.Email 		=	 newEmail;
                update usr;
            }
            catch (AuraHandledException ex) 
            {
                 throw new AuraHandledException(ex.getMessage());             
            }
      }
}