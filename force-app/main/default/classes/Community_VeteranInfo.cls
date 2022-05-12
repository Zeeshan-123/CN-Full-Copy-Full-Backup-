/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba Asif
@Date: 12/Nov/2020
@Purpose: This class is used as controller for Community_CherokeeWarrior aura component.
---------------------------------------------------------------------------------------------------------------*/


public  without sharing class Community_VeteranInfo {
    
     // fetches logged in user information
   @AuraEnabled
        public static list<Veteran_Service__c> getUserInfo()
        { 
         //get user id
         String UserId=UserInfo.getUserId();
         //get contact id against user id
         String contactId=utility.getUserContactId(UserId);  
         
          //get user veteran details
    	 list<Veteran_Service__c> vs = [SELECT Id,(SELECT id, ContentDocumentId, ContentDocument.title FROM ContentDocumentLinks ),
                                        Service_Branch__c, Veteran_Contact__c,Enlistment_Month__c, Enlistment_Year__c, Number_of_Service_Years__c,Number_of_Service_Months__c
                          				FROM Veteran_Service__c WHERE Veteran_Contact__c =: contactId];
            
        return vs;
        } 

  
}