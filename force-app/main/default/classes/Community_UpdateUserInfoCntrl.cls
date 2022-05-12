/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba
@Date: Sept/23/2021
@Purpose: This class is used as controller for Community_UpdateUserInfo aura component.
---------------------------------------------------------------------------------------------------------------*/

public without sharing class Community_UpdateUserInfoCntrl {
    public class InfoMissing_Exception extends Exception{} 
    //get contact id of user
    private static final Id CONTACT_ID = [Select ContactId from User where Id =: Userinfo.getUserId()].ContactId;
    //get CN Registration RecordTypeId
   private static final Id CNREG_RECORDTYPEID = utility.getRT(AppConstants.OBJ_ACCOUNT,AppConstants.RT_CNREGISTRATION);
    
      //Call Melissa Data API
    @AuraEnabled
    public static String getMelissaAddresses(String input, String country){
        return MelissaDataController.SendRequest(input, country);
    }
    
    // update user's person account
    @AuraEnabled
    public static Account UpdateAccnt(Account userAccount) {
        try {
            User usr = [SELECT Id, Email, Account.HealthCloudGA__Gender__pc, Account.LastName, Account.Opt_In_To_Email__c, Account.Opt_In_To_SMS__c  FROM User WHERE Id =: Userinfo.getUserId()];
            //check for required fields if gender is female
            if( usr.Account.HealthCloudGA__Gender__pc == 'Female' && (String.isBlank(userAccount.LastName) || String.isBlank(userAccount.PersonMobilePhone))) {
                throw new InfoMissing_Exception('Please enter all required fields.');
            }
            //check for required fields if gender is not female
            else if( usr.Account.HealthCloudGA__Gender__pc != 'Female' && String.isBlank(userAccount.PersonMobilePhone)) {
                throw new InfoMissing_Exception('Please enter all required fields.');
            }
            //check for mailing address required fields
            else if(String.isBlank(userAccount.PersonMailingStreet) || String.isBlank(userAccount.PersonMailingCity) ||  
                    String.isBlank(userAccount.PersonMailingCountry) || String.isBlank(userAccount.PersonMailingPostalCode) || 
                    ((userAccount.PersonMailingCountry == 'United States' || userAccount.PersonMailingCountry == 'Canada') &&  String.isBlank(userAccount.PersonMailingState)) ||
                    (userAccount.PersonMailingCountry != 'United States' && userAccount.PersonMailingCountry != 'Canada' &&   String.isBlank(userAccount.Other_Mailing_State__c))){
                        throw new InfoMissing_Exception('Please ensure the mailing address information is complete.');
                    }
            else{
                //update account
                Account PersonAccount  = new Account(Id = userAccount.Id, LastName = usr.Account.HealthCloudGA__Gender__pc == 'Female' ? userAccount.LastName : usr.Account.LastName, 
                                                        PersonMobilePhone = userAccount.PersonMobilePhone, Phone = userAccount.Phone, PersonMailingStreet = userAccount.PersonMailingStreet,
                                                        PersonMailingCity = userAccount.PersonMailingCity, PersonMailingState = userAccount.PersonMailingState,
                                                        Other_Mailing_State__c = userAccount.Other_Mailing_State__c, PersonMailingCountry = userAccount.PersonMailingCountry,
                                                        PersonMailingPostalCode = userAccount.PersonMailingPostalCode, Mailing_Suite__c = userAccount.Mailing_Suite__c, 
                                                        Mailing_Add_Melissa_Verified__c = userAccount.Mailing_Add_Melissa_Verified__c, Mailing_Address_Line_2__c = userAccount.Mailing_Address_Line_2__c,
                                                        Physical_Add_Melissa_Verified__c= userAccount.Physical_Add_Melissa_Verified__c,  Physical_Address_Line_2__c = userAccount.Physical_Address_Line_2__c,
                                                        PersonOtherStreet = userAccount.PersonOtherStreet, PersonOtherState = userAccount.PersonOtherState, Other_Physical_State__c = userAccount.Other_Physical_State__c,
                                                        PersonOtherCity = userAccount.PersonOtherCity,   PersonOtherCountry = userAccount.PersonOtherCountry, 
                                                        PersonOtherPostalCode = userAccount.PersonOtherPostalCode, Physical_Suite__c = userAccount.Physical_Suite__c);
                update PersonAccount;
                
                //get updated CN Registration account for loggedIn user
                Account Accnt = utility.getAccount(CONTACT_ID);
                return Accnt;
            }
            
        } 
        catch (AuraHandledException ex){
            //    CustomExceptionData data = new CustomExceptionData(ex.getTypeName(),ex.getMessage());
            throw new AuraHandledException(ex.getMessage());  
            
        }
    }
}