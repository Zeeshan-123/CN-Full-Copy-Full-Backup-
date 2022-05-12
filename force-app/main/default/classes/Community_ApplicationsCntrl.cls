/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba Asif
@Date: AUG/20/2021
@Purpose: This class is used as controller for Community_Application aura component.
---------------------------------------------------------------------------------------------------------------*/

public class Community_ApplicationsCntrl {
    
    //get contact id of user
    private static final Id CONTACT_ID = [Select ContactId from User where Id =: Userinfo.getUserId()].ContactId;
    
    private static final Id CNREG_RECORDTYPEID = utility.getRT(AppConstants.OBJ_ACCOUNT,AppConstants.RT_CNREGISTRATION);
    // fetches logged in user information
    @AuraEnabled
    public static list<Case> getInfo(){ 
        return [SELECT CaseNumber, EBT_Confirmation_Number__c, Request_Reason__c , Status, Id 
                FROM Case WHERE ContactId =:CONTACT_ID];
    } 
    @AuraEnabled
    public static Account getAccount(){
        return [SELECT Id, If_CN_Citizen__c, Suffix__c, Prefix__c, Name, Maiden_Name__c, FirstName, LastName, Date_of_Birth__c, PersonOtherPhone, Phone, PersonMobilePhone, Interested_in_Survey__c,
                Tribe_Id__c, HealthCloudGA__Gender__pc, Marital_Status__c, Driver_License__c, Mailing_Add_Melissa_Verified__c, Physical_Add_Melissa_Verified__c,
                PersonMailingStreet, PersonMailingCity, PersonMailingState, PersonMailingCountry, PersonMailingPostalCode, Other_Mailing_State__c, Mailing_Suite__c, Mailing_Address_Line_2__c,
                PersonOtherCountry,  PersonOtherStreet, PersonOtherCity, PersonOtherState, PersonOtherPostalCode, Other_Physical_State__c, Physical_Suite__c,Physical_Address_Line_2__c, Eligible_For_Housing_Stipend__c, 
                Opt_In_to_Email__c, Opt_In_to_SMS__c, Opt_In_Initially_Shown__c, Social_Security__c, Tribe__c,Hotspot_Eligible__c, Gender__c,
                (SELECT Id, Email from Users Limit 1)  FROM Account WHERE PersonContactId =: CONTACT_ID AND RecordTypeId =: CNREG_RECORDTYPEID LIMIT 1];
        
    }
    
}