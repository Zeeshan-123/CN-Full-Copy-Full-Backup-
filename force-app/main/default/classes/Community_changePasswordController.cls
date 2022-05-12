/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba Asif
@Date: feb/23/2020
@Purpose: This class is used as controller for Community_changePassword aura component.
---------------------------------------------------------------------------------------------------------------*/


public without sharing  class Community_changePasswordController
{

      // this method sets a password for a user
    @AuraEnabled
        public static String ChangePassword(string currentPassword, string newPassword)
        { 
        
        try
        {
           ApexPages.PageReference lgn = Site.changePassword(newPassword, newPassword, currentPassword);
        	return 'SUCCESS';  
        }catch (Exception ex) { return ex.getMessage();     }
           
}
}