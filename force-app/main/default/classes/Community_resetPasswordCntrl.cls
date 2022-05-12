/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba Asif
@Date: 30/09/2020
@Purpose: This class is used as controller for Community_resetPassword aura component.
---------------------------------------------------------------------------------------------------------------*/


public without sharing  class Community_resetPasswordCntrl {

    // this method fetches username
   @AuraEnabled
        public static String getUserName(String userid)
        { 
        User userName = [Select Id,Email From User WHERE id =: userid LIMIT 1];
        return userName.Email;
        } 
    
    
  // this method sets a password for a user
    @AuraEnabled
        public static String ChangePassword(string userid,string newpassword)
        { 
        try
        {
              // query to check if user exist?
            User[] userdata = [Select Id,Name,Username From User WHERE id =: userid LIMIT 1];
             if (userdata.size() > 0)
             {
                 	// set new passowrd againt user id
                    System.setPassword(userdata[0].Id, newpassword);
                    String startURL = '/s/';
                    // logging in user into community
                    ApexPages.PageReference lgn = Site.login(userdata[0].username, newpassword,startURL);
                    aura.redirect(lgn);
                 
              return 'SUCCESS';  
             }
            
            else
            {
              return  'User does not exist';
            }
        }
        catch (Exception ex) 
        {
           
 			 
            return ex.getMessage();            
        }
           
}
}