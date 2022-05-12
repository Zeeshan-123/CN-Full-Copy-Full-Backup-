/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba
@Date: April/16/2021
@Purpose: This class is used as controller for Community_RRREmergencyAssistanceForm aura component.
@Revised By: Alishba
@At: Dec/20/2021
---------------------------------------------------------------------------------------------------------------*/


public without sharing class TestController {
    // custom exception class
    public class RRR_Exception extends Exception{    }
    //get contact id of user
    private static final Id CONTACT_ID = [Select ContactId from User where Id =: Userinfo.getUserId()].ContactId;
    //get Case RRR RecordTypeId
    private static final Id RRR_RECORDTYPEID = utility.getRT(AppConstants.OBJ_CASE,AppConstants.RT_RRR);
    //get Account CN Registration RecordTypeId
    private static final Id CNREG_RECORDTYPEID = utility.getRT(AppConstants.OBJ_ACCOUNT,AppConstants.RT_CNREGISTRATION);
    
    //Call Melissa Data API
    @AuraEnabled
    public static String getMelissaAddresses(String input, String country){
        return MelissaDataController.SendRequest(input, country);
    }
    
    @AuraEnabled 
    public static Community_RRRWrapper validateApplicantEligibility(){        
        //initialize wrapper class
        Community_RRRWrapper obj = new Community_RRRWrapper();        
        
        //get CN Registration account for loggedIn user
        Account accnt = utility.getAccount(CONTACT_ID);
        obj.acnt = utility.getAccount(CONTACT_ID);     
        Integer days = accnt.Date_of_Birth__c.daysBetween(Date.Today());
        Integer age = Integer.valueOf(days/365);
        
        if(accnt.If_CN_Citizen__c != 'No')  {
            //get picklist values
            obj.mapOfDependentPL = utility.getPicklistValues('Case', 'Physical_Countries__c', 'Physical_States__c');
            //get state mapping
            obj.mapOfStates = utility.getStates();
            obj.IsAddOneAllowed = False;
            //query case for RRR application information(if any)
            list<Case> rCase  = [SELECT Id, Request_Reason__c, Add_on__c, RRR_Request_Edit_Status__c, CaseNumber, Status  FROM Case
                                 WHERE ContactId =: CONTACT_ID AND RecordTypeId =: RRR_RECORDTYPEID];
            
            //query latest submitted RRR Application
            list<Case> lastestRRRApp  = [SELECT Id, Request_Reason__c, Add_on__c, RRR_Request_Edit_Status__c, CaseNumber, Status, 
                                         mailing_suite__c, mailing_address2__c, Account.Name , COVID19_Impact_on_the_Household__c, Ebt_Mobile_Phone__c,
                                         Mailing_Street__c, Mailing_City__c, Mailing_ZipPostal_Code__c, Mailing_Countries__c, Mailing_States__c, Other_Mailing_State__c,
                                         Ebt_Email__c,Is_Address_Changed__c,Is_Manual_Address__c,Melissa_Address__c, Primary_Contact_First_Name__c, Primary_Contact_Last_Name__c,
                                         (SELECT Id, First_Name__c, Last_Name__c, AccountId__r.HealthCloudGA__Gender__pc, Gender__c, Date_of_Birth__c, Citizen_Id__c FROM Household_Members__r
                                          WHERE Citizen_id__c !=: accnt.Tribe_Id__c) FROM Case
                                          WHERE ContactId =: CONTACT_ID AND RecordTypeId =: RRR_RECORDTYPEID ORDER BY CreatedDate desc limit 1];
            
            //query case for RRR application information to check if user exist on another exisiting RRR request
            list<Household_Member__c> ExRRRCase=[SELECT Id, Request__c FROM Household_Member__c WHERE citizen_id__c =: accnt.Tribe_Id__c
                                                 AND Request__r.ContactId !=: CONTACT_ID AND Request__r.RecordTypeId =: RRR_RECORDTYPEID  limit 1];
            
            //logged in user have submitted a RRR Application
            if(rCase.size() > 0) {
                obj.RRRApplication	= lastestRRRApp[0];
                if(rCase.size() >= 1){
                    if(!lastestRRRApp[0].RRR_Request_Edit_Status__c && lastestRRRApp[0].Status == System.Label.Community_RRR_EligibleStatus && age >= 18) 
                        obj.IsAddOneAllowed = True;
                    
                    else
                        obj.IsAddOneAllowed = False; 
                }
            }
            //logged in user exists on a RRR request, created by another portal user
            else if(ExRRRCase.size() > 0){
                obj.throwWaring	=	 True;
            }
            // if logged in user is a minor
            if( age < 18)
                obj.IsApplicationMinor	= True; 
        }
        
        return obj;
    }
    
    @AuraEnabled 
    public static String dltHouseholdMember(Id HmRecIdToDelete, String caseId) {
       
        //get RRR request information, if any
        Case rCase  = [SELECT Id, Request_Reason__c, RRR_Request_Edit_Status__c, CaseNumber  FROM Case WHERE Id =: caseId];
        
        if(rCase.RRR_Request_Edit_Status__c == false) {
            return null;
        }
        else {
            Household_Member__c hm	=	 new Household_Member__c();
            hm.Id					=	 HmRecIdToDelete;
            delete hm;
            return 'SUCCESS';
        }
    }
    
    // create request along with household member records(if any)  
    @AuraEnabled
    public static case saveRequest(List<Household_Member__c> HMslist, Case RRR_Request) {
        try{
        if(String.isBlank(RRR_Request.Primary_Contact_Last_Name__c) || String.isBlank(RRR_Request.Ebt_Mobile_Phone__c)){
           if(String.isBlank(RRR_Request.Primary_Contact_Last_Name__c)){
                throw new RRR_Exception('Please enter a valid Last Name for primary applicant.');
            } else if(String.isBlank(RRR_Request.Ebt_Mobile_Phone__c)){
                throw new RRR_Exception('Please enter a valid Phone for primary applicant.');
            } else{
                throw new RRR_Exception('You must fill all of the Primary Contact information.');
            }
          } 
        else if(String.isBlank(RRR_Request.Mailing_Street__c) || String.isBlank(RRR_Request.Mailing_City__c) || 
          String.isBlank(RRR_Request.Mailing_Countries__c) || String.isBlank(RRR_Request.Mailing_ZipPostal_Code__c) || ((RRR_Request.Mailing_Countries__c == 'United States' || RRR_Request.Mailing_Countries__c == 'Canada') &&
          String.isBlank(RRR_Request.Mailing_States__c)) || (RRR_Request.Mailing_Countries__c != 'United States' && RRR_Request.Mailing_Countries__c != 'Canada' && String.isBlank(RRR_Request.Other_Mailing_State__c))){
                                                if( RRR_Request.Mailing_Countries__c == 'United States' &&
                                                           String.isBlank(RRR_Request.Mailing_States__c)){
                                                               throw new RRR_Exception('Please select a valid State.'); 
                                                           }
                                                else if( RRR_Request.Mailing_Countries__c != 'United States' &&
                                                         String.isBlank(RRR_Request.Other_Mailing_State__c)){
                                                             throw new RRR_Exception('Please enter a valid Other State.'); 
                                                         }
                                                else{
               										throw new RRR_Exception('Please ensure the Mailing Address information is complete.');
                                                }
          }
        else if(HMslist != null && HMslist.size() > 0){
              for(Household_Member__c Member : HMslist)   {
                    if(String.isBlank(Member.First_Name__c) || String.isBlank(Member.Last_Name__c) || Member.Date_of_Birth__c == null || String.isBlank(Member.Citizen_Id__c))
                           	throw new RRR_Exception('You must fill all of the information for Household Member with citizen id '+Member.Citizen_Id__c+' on the form.');
              }
             return createRequest(HMslist, RRR_Request);
          } 
        else {
             return createRequest(HMslist, RRR_Request);
          }
            }
        catch (Exception ex) {
            system.debug('ex.getMessage()::'+ex.getMessage());
            // Throw an AuraHandledException with custom data
            RRR_Exception data = new RRR_Exception(ex.getMessage());
            throw new AuraHandledException(JSON.serialize(data));
        }
    } 
    
    private static case createRequest(List<Household_Member__c> HMslist, Case RRR_Request) {
        List<Household_Member__c> HMsListToInsert		= 		new List<Household_Member__c>();
        //query user to get  information
        User usr  = [SELECT Name, Email, Account.HealthCloudGA__Gender__pc, Account.FirstName, Account.LastName, Account.Id FROM User where id =: UserInfo.getUserId() limit 1];
		System.debug('Akk '+RRR_Request.Add_on__c);
        System.debug('Akk '+RRR_Request.Primary_Contact_First_Name__c);
        System.debug('Akk '+RRR_Request.Primary_Contact_Last_Name__c);
        // create case record
        Case cse 		=		new Case(RecordTypeId = RRR_RECORDTYPEID, Status = 'New', Origin = 'Portal', Priority = 'Medium', Request_Reason__c = 'RRR', AccountId = usr.Account.Id,
                                         ContactId = CONTACT_ID, COVID19_Impact_on_the_Household__c = RRR_Request.COVID19_Impact_on_the_Household__c, Ebt_Mobile_Phone__c = RRR_Request.Ebt_Mobile_Phone__c,
                                         Mailing_Street__c = RRR_Request.Mailing_Street__c, Mailing_City__c = RRR_Request.Mailing_City__c, Mailing_ZipPostal_Code__c = RRR_Request.Mailing_ZipPostal_Code__c,
                                         Mailing_Countries__c = RRR_Request.Mailing_Countries__c, Mailing_States__c = RRR_Request.Mailing_States__c, Other_Mailing_State__c = RRR_Request.Other_Mailing_State__c,
                                         Melissa_Address__c = RRR_Request.Melissa_Address__c, Is_Address_Changed__c = RRR_Request.Is_Address_Changed__c, Is_Manual_Address__c = RRR_Request.Is_Manual_Address__c,
                                         mailing_address2__c = RRR_Request.mailing_address2__c, mailing_suite__c = RRR_Request.mailing_suite__c, Ebt_Email__c = usr.Email, 
                                         Primary_Contact_First_Name__c = RRR_Request.Primary_Contact_First_Name__c, Add_on__c = RRR_Request.Add_on__c,
                                         Primary_Contact_Last_Name__c = usr.Account.HealthCloudGA__Gender__pc == 'Female' ? RRR_Request.Primary_Contact_Last_Name__c : usr.Account.LastName);
        
        insert cse;
        
        //query inserted case to get case number
        Case userCase = [SELECT Id, CaseNumber FROM Case WHERE Id =: cse.Id limit 1];
        
        //insert household members
        if(HMslist != null && HMslist.size() > 0)  {
            for(Household_Member__c Member : HMslist) {
                Member.Request__c=cse.Id;
                HMsListToInsert.add(Member);
            }
            insert HMsListToInsert;
        }
        
        return userCase;
    }
    
       @AuraEnabled
    public static case updateRequest( Id caseId, List<Household_Member__c> HMslist, List<Household_Member__c> HMslistToUpdate, Case RRR_Request) {
        Case rCase  = [SELECT Id, Request_Reason__c, Account.HealthCloudGA__Gender__pc, RRR_Request_Edit_Status__c, CaseNumber  FROM Case  WHERE Id =: caseId];
        
        if(!rCase.RRR_Request_Edit_Status__c)  {
            return null;
        }
        else  if(String.isBlank(RRR_Request.Primary_Contact_Last_Name__c) || String.isBlank(RRR_Request.Ebt_Mobile_Phone__c)){
           if( String.isBlank(RRR_Request.Primary_Contact_Last_Name__c)){
                throw new RRR_Exception('Please enter a valid Last Name for primary applicant.');
            } else if(String.isBlank(RRR_Request.Ebt_Mobile_Phone__c)){
                throw new RRR_Exception('Please enter a valid Phone for primary applicant.');
            } else{
                throw new RRR_Exception('You must fill all of the Primary Contact information.');
            }
          }   else if(String.isBlank(RRR_Request.Mailing_Street__c) || String.isBlank(RRR_Request.Mailing_City__c) || 
          String.isBlank(RRR_Request.Mailing_Countries__c) || String.isBlank(RRR_Request.Mailing_ZipPostal_Code__c) || ((RRR_Request.Mailing_Countries__c == 'United States' || RRR_Request.Mailing_Countries__c == 'Canada') &&
          String.isBlank(RRR_Request.Mailing_States__c)) || (RRR_Request.Mailing_Countries__c != 'United States' && RRR_Request.Mailing_Countries__c != 'Canada' &&  String.isBlank(RRR_Request.Other_Mailing_State__c))){{
               										  if(RRR_Request.Mailing_Countries__c == 'United States' &&
                                                           String.isBlank(RRR_Request.Mailing_States__c)){
                                                               throw new RRR_Exception('Please select a valid State.'); 
                                                           }
                                                else if(RRR_Request.Mailing_Countries__c != 'United States' &&
                                                         String.isBlank(RRR_Request.Other_Mailing_State__c)){
                                                             throw new RRR_Exception('Please enter a valid Other State.'); 
                                                         }
                                                else{
               										throw new RRR_Exception('Please ensure the Mailing Address information is complete.');
                                                  }
                                                }
          } else if((HMslist != null && HMslist.size() > 0) || (HMslistToUpdate != null && HMslistToUpdate.size() > 0)){
              for(Household_Member__c Member : HMslist) {
                    if(String.isBlank(Member.First_Name__c) || String.isBlank(Member.Last_Name__c) || Member.Date_of_Birth__c == null || String.isBlank(Member.Citizen_Id__c))
                           	throw new RRR_Exception('You must fill all of the information for Household Member with citizen id '+Member.Citizen_Id__c+' on the form.');
              }
              for(Household_Member__c Member : HMslistToUpdate)  {
                    if(String.isBlank(Member.First_Name__c) || String.isBlank(Member.Last_Name__c) || Member.Date_of_Birth__c == null || String.isBlank(Member.Citizen_Id__c))
                           throw new RRR_Exception('You must fill all of the information for Household Member with citizen id '+Member.Citizen_Id__c+' on the form.');
              }

              return updateRequestWithHH(caseId, HMslist, HMslistToUpdate, RRR_Request);
          }
        else   {
           return updateRequestWithHH(caseId, HMslist, HMslistToUpdate, RRR_Request);
        }
        
    } 
    
    private static case updateRequestWithHH(Id caseId, List<Household_Member__c> HMslist, List<Household_Member__c> HMslistToUpdate, Case RRR_Request) {
        List<Household_Member__c> HMsListToInsert		= 		new List<Household_Member__c>();
        List<Household_Member__c> HMListToUpdate		= 		new List<Household_Member__c>();
        //query user to get  information
        User usr  = [SELECT Name, Email, Account.HealthCloudGA__Gender__pc, Account.FirstName, Account.LastName, Account.Id FROM User where id =: UserInfo.getUserId() limit 1];
        // update application
        Case cse 		=		new Case(Id = caseId,  COVID19_Impact_on_the_Household__c = RRR_Request.COVID19_Impact_on_the_Household__c, Ebt_Mobile_Phone__c = RRR_Request.Ebt_Mobile_Phone__c,
                                         Mailing_Street__c = RRR_Request.Mailing_Street__c, Mailing_City__c = RRR_Request.Mailing_City__c, Mailing_ZipPostal_Code__c = RRR_Request.Mailing_ZipPostal_Code__c,
                                         Mailing_Countries__c = RRR_Request.Mailing_Countries__c, Mailing_States__c = RRR_Request.Mailing_States__c, Other_Mailing_State__c = RRR_Request.Other_Mailing_State__c,
                                         Melissa_Address__c = RRR_Request.Melissa_Address__c, Is_Address_Changed__c = RRR_Request.Is_Address_Changed__c, Is_Manual_Address__c = RRR_Request.Is_Manual_Address__c,
                                         mailing_address2__c = RRR_Request.mailing_address2__c, mailing_suite__c = RRR_Request.mailing_suite__c, Ebt_Email__c = usr.Email, 
                                         Primary_Contact_First_Name__c = RRR_Request.Primary_Contact_First_Name__c, Add_on__c = RRR_Request.Add_on__c,
                                         Primary_Contact_Last_Name__c = usr.Account.HealthCloudGA__Gender__pc == 'Female' ? RRR_Request.Primary_Contact_Last_Name__c : usr.Account.LastName);
        
        update cse;
        
        //insert household members
        if(HMslist != null && HMslist.size() > 0)  {
            for(Household_Member__c Member : HMslist) {
                Member.Request__c=caseId;
                HMsListToInsert.add(Member);
            }
            insert HMsListToInsert;
        }
        
        if(HMslistToUpdate != null && HMslistToUpdate.size() > 0)     {
            for(Household_Member__c Member : HMslistToUpdate)  {
                if(Member.AccountId__r.HealthCloudGA__Gender__pc == 'Female'){
                    HMListToUpdate.add(Member);
                }
            }
            update HMListToUpdate;
        }
        
        return cse;
    }
  
    //validate legit Househol Members
    @AuraEnabled
    public static Community_RRRWrapper validateHMList(List<Household_Member__c> HMlist) {
        Map<String, Date> HHM_Map		=	new Map<String, Date>();
        Map<String, Date> accMap			= 	new Map<String, Date>();
        List<String> InvalidCitizenIdsList	= 	new List<String>();
        List<String> ValidCitizenIdsList    = 	new List<String>();
        List<Account> legitAccountsList		= 	new List<Account>();
        List<Household_Member__c> existingHHMembersList		= 		new List<Household_Member__c>();
        Community_RRRWrapper obj = new Community_RRRWrapper(); 
        
        // check for valid/invalid citizen ids   
        if(HMlist != null && HMlist.size() > 0){
            for(Household_Member__c HHMIn : HMlist){   
                HHM_Map.put(HHMIn.Citizen_ID__c, HHMIn.Date_of_Birth__c); 
            }
            
            //get legit accounts on basis of citizen id
            for(Account ac : [SELECT Id, FirstName, LastName, Name, Tribe_Id__c, Date_of_Birth__c, DOD__c, HealthCloudGA__Gender__pc FROM Account
                              WHERE Tribe_Id__c IN : HHM_Map.keySet() AND RecordTypeId =: CNREG_RECORDTYPEID 
                              AND If_CN_Citizen__c = 'Yes' AND DOD__c = null AND (Is_Void__c = 'No' OR Is_Void__c = '')]){
               accMap.put(ac.Tribe_Id__c, ac.Date_of_Birth__c);
               legitAccountsList.add(ac);
            }
        }
        
        if (HHM_Map != null && HHM_Map.size() > 0){
            //iterate through map
            for(String v : HHM_Map.keySet()){
                //when citizen id is valid
                if(accMap.containskey(v)){
                    // but wrong date of birth
                    if(accMap.get(v) != HHM_Map.get(v))
                        InvalidCitizenIdsList.add(v);
                    // valid date of birth
                    else
                        ValidCitizenIdsList.add(v);
                }
                // invalid citizen id
                else  {
                    InvalidCitizenIdsList.add(v);
                }
            }
        }
        
        if (InvalidCitizenIdsList != null && InvalidCitizenIdsList.size() > 0) 
            obj.NonVerifiedHHMList = InvalidCitizenIdsList;

        if (ValidCitizenIdsList != null && ValidCitizenIdsList.size() > 0) {
            //query HH Member to check if provided Household Member record already exists
            existingHHMembersList	=	[SELECT id, request__c, Citizen_Id__c FROM Household_Member__c where Citizen_Id__c IN : ValidCitizenIdsList];
        }
        if (existingHHMembersList != null && existingHHMembersList.size() > 0) {
            obj.ExistingHHMList = new list<String>();
            for(Household_Member__c hm : existingHHMembersList) {
                obj.ExistingHHMList.add(hm.Citizen_Id__c);
            }
        }
        if(InvalidCitizenIdsList.size() == 0 && existingHHMembersList.size() == 0 )
            obj.legitHHMAccountsList	=	legitAccountsList;
        
        return obj;
    } 

    
    public class Community_RRRWrapper{
        
        @AuraEnabled public Map<String, List<String>> mapOfDependentPL;
        @AuraEnabled public Account acnt {get;set;}
        @AuraEnabled public Boolean throwWaring {get;set;}
        @AuraEnabled public Boolean IsApplicationMinor {get;set;}
        @AuraEnabled public Boolean IsAddOneAllowed {get;set;}
        @AuraEnabled public Case RRRApplication {get;set;}
        @AuraEnabled public Map<string, string> mapOfStates {get;set;}
        @AuraEnabled public list<String> NonVerifiedHHMList {get;set;}
        @AuraEnabled public list<Account> legitHHMAccountsList {get;set;}
        @AuraEnabled public list<String> ExistingHHMList {get;set;}
        
    }
    
}