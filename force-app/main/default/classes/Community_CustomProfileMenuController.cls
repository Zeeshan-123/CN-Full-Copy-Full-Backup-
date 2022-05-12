/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba Asif
@Date: feb/23/2021
@Purpose: This class is used as controller for Community_CustomProfileMenu aura component.
---------------------------------------------------------------------------------------------------------------*/


public without sharing class Community_CustomProfileMenuController 
{
  // fetches logged in user information
   @AuraEnabled
        public static User getUserInfo()
        { 
         //get user id
         String UserId=UserInfo.getUserId();
            
          //get user account
    	 User usr = [SELECT Id, Name
                    FROM User WHERE Id =: UserId];
            
        return usr;
        } 
    
 
}