/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba
@Date: Sept/23/2021
@Purpose: This class is used as controller for Community_UpdateUserInfo aura component.
---------------------------------------------------------------------------------------------------------------*/

public without sharing class Community_UpdateCommPreferencesCntrl {
    public class InfoMissing_Exception extends Exception{} 
    //get contact id of user
    private static final Id CONTACT_ID = [Select ContactId from User where Id =: Userinfo.getUserId()].ContactId;
    //get CN Registration RecordTypeId
   private static final Id CNREG_RECORDTYPEID = utility.getRT(AppConstants.OBJ_ACCOUNT,AppConstants.RT_CNREGISTRATION);
    
    // update user's person account
    @AuraEnabled
    public static Account UpdateAccnt(Account userAccount) {
        try {
            User usr = [SELECT Id, Email, Account.HealthCloudGA__Gender__pc, Account.LastName, Account.Opt_In_To_Email__c, Account.Opt_In_To_SMS__c  FROM User WHERE Id =: Userinfo.getUserId()];
     
          
     
                //update account
                system.debug('Opt in to email' + userAccount.Opt_In_to_Email__c); 
            	system.debug('Opt in to SMS' + userAccount.Opt_In_to_SMS__c);
                Account PersonAccount  = new Account(Id = userAccount.Id, Opt_In_To_SMS__c = userAccount.Opt_In_to_SMS__c, Opt_In_To_Email__c = userAccount.Opt_In_to_Email__c);
                update PersonAccount;
                
                //get updated CN Registration account for loggedIn user
                Account Accnt = utility.getAccount(CONTACT_ID);
                return Accnt;
            
            
        } 
        catch (AuraHandledException ex){
            //    CustomExceptionData data = new CustomExceptionData(ex.getTypeName(),ex.getMessage());
            throw new AuraHandledException(ex.getMessage());  
            
        }
    }
}