/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba Asif
@Date: 13/Nov/2020
@Purpose: This class is used as controller for Community_myProfileDetails aura component.
---------------------------------------------------------------------------------------------------------------*/


public  without sharing class Community_myProfileDetailsController{
	private static final Id CONTACT_ID = [Select ContactId from User where Id =: Userinfo.getUserId()].ContactId;
   // fetches logged in user details  
    @AuraEnabled 
    public static Account userDetails(){
     //query logged in user account information
      Account acc =  utility.getAccount(CONTACT_ID);
     return acc;
        
       
    }
}