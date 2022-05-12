/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba Asif
@Date: 23/10/2020
@Purpose: This class is used as controller for Community_HomePage aura component.
---------------------------------------------------------------------------------------------------------------*/


public without sharing class Community_Home {
    //get contact id of user
    private static final Id CONTACT_ID = [Select ContactId from User where Id =: Userinfo.getUserId()].ContactId;
    //get CN Registration RecordTypeId
    private static final Id CNREG_RECORDTYPEID = utility.getRT(AppConstants.OBJ_ACCOUNT,AppConstants.RT_CNREGISTRATION);
     //get Survey Request RecordTypeId
    private static final Id SURVEY_RECORDTYPEID = utility.getRT(AppConstants.OBJ_CASE,AppConstants.RT_SUREVEY_REQUEST);
    
    
    // fetches logged in user account information and other required data
    @AuraEnabled
    public static Community_HomeWrapper getUserInfo(){ 
        Community_HomeWrapper obj;
        
        //get CN Registration account for loggedIn user
        Account accnt = utility.getAccount(CONTACT_ID);
        
        //get user open cases
        list<Case> cse = [SELECT CaseNumber, EBT_Confirmation_Number__c, RecordType.Name, toLabel(Request_Reason__c) , Status, Id, CreatedDate
                          FROM Case WHERE ContactId =: CONTACT_ID and RecordTypeId !=: SURVEY_RECORDTYPEID ORDER BY CreatedDate DESC];
        
        //get picklist values
        Map<String,List<String>> mapOfDependentPL = utility.getPicklistValues('Account', 'PersonMailingCountryCode', 'PersonMailingStateCode');
        //get state mapping
        Map<string, string> mapOfStates = utility.getStates();
        //initialize wrapper
        obj 		= 	new Community_HomeWrapper(accnt, cse, mapOfStates, mapOfDependentPL);
        
        return obj;
    } 
    
     @AuraEnabled
	public static Boolean isSurveyExists(){
		//check for case existance
		//get Hunt Draw Request record type id
		List<Case> hCase = [SELECT Id, Request_Reason__c, CaseNumber, Status
		                    FROM Case
		                    WHERE ContactId = :CONTACT_ID and Request_Reason__c = 'Survey' and RecordTypeId = : SURVEY_RECORDTYPEID
		                    limit 1];
		if (hCase.size() > 0){
			return true;
		}
		return false;
	}
    
    @AuraEnabled
    public static void setInterestedInSurveyField(String accId){
        Account acc = [Select Id, Interested_in_Survey__c from Account
                      Where Id = :accId];
        acc.Interested_in_Survey__c = 'Not Interested';
        update acc;
    }
    
    
    @AuraEnabled
    public static Account setOptIn(Account accId){
        system.debug(accId);
        Account accRec = new Account();
        accRec.Id = accId.id; 
        accRec.Opt_In_Initially_Shown__c = true; 
        system.debug('Opt In Updated ' + accRec.Opt_In_Initially_Shown__c);
        
        if(accId.Opt_In_To_Email__c != NULL){
             accRec.Opt_In_to_Email__c = accId.Opt_In_To_Email__c;

        }
        if( accId.Opt_In_To_SMS__c != NULL){
            accRec.Opt_In_to_SMS__c = accId.Opt_In_To_SMS__c; 
        }
        
        update accRec; 
        

        
        Account updateAcc = [SELECT Id, Name, LastName, FirstName, Tribe_Id__c, Date_of_Birth__c, PersonMobilePHone, Phone, PersonMailingStreet, Other_Mailing_State__c, PersonMailingCountry, PersonMailingPostalCode, Mailing_Suite__c, 
                            Mailing_Add_Melissa_Verified__c, Mailing_Address_Line_2__c, Physical_Add_Melissa_Verified__c, Physical_Address_Line_2__c, PersonOtherStreet, PersonOtherState, Other_Physical_State__c, 
                            PersonOtherCity, PersonOtherCountry, PersonOtherPostalCode, Physical_Suite__c, Opt_In_to_Email__c, Opt_In_to_SMS__c, (SELECT Id, Email from Users Limit 1) FROM Account WHERE ID = : accRec.Id ];
        
        return updateAcc; 
    }
 
}