/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba Asif
@Date: 25/09/2020
@Purpose: This class is used as controller for Community_UserLogin and Community_forgotPassword aura components.
---------------------------------------------------------------------------------------------------------------*/
public without sharing class LoginController {
  
    // controller method for Community_UserLogin
    @AuraEnabled
    public static String login(String username, String password, String formTypeVal) {
        try {
            String usrName = username.normalizeSpace(); 
            // get meta data to add with username
            CNPortal_UserName_PostFix__mdt userPostFix=[SELECT MasterLabel FROM CNPortal_UserName_PostFix__mdt 
                                                        WHERE DeveloperName = 'CNPortal_UserName_PostFix'];
            String userNameWithPostfix = usrName + userPostFix.MasterLabel;
            
            String startURL = '/s/';
            
            // CNHPHOMS-42/16/37: Added logic to redirect to "citizen-summer-ebt" when form type is "wics_program"
            if(String.isNotBlank(formTypeVal) && formTypeVal.equalsIgnoreCase('wics_program')) {
                startURL += 'citizen-summer-ebt';
            }
            
            // query user to check if username exist?
            list<user> lstUsr =  [SELECT Id, Username, Email, IsActive FROM User WHERE Username =: userNameWithPostfix];
            
            //if user exists 
            if(lstUsr != null && lstUsr.size() > 0 ) {
                //user is active
                if(lstUsr[0].IsActive == True) {
                    ApexPages.PageReference lgn = Site.login(userNameWithPostfix, password, startURL);
                    //if credentials are correct logged user into community
                    aura.redirect(lgn);
                    return 'SUCCESS';
                }
                //user is deactived
                else {
                    return System.Label.Community_UserDeactivated;
                }
            }
            //else display error that user name doesn't exist(query return result is zero)
            else {
                return System.Label.Community_UserNotExistMessage;
            }
        }
        catch (Exception ex) {
            return ex.getMessage();
        }
    }
    
    // controller method for Community_forgotPassword
    @AuraEnabled
    public static String forgotPassword(String username) {
        try {
            String usrName = username.normalizeSpace();
            // get meta data to add with user name     
            CNPortal_UserName_PostFix__mdt userPostFix=[SELECT MasterLabel FROM CNPortal_UserName_PostFix__mdt 
                                                        WHERE DeveloperName = 'CNPortal_UserName_PostFix'];
            String userNameWithPostfix =usrName+userPostFix.MasterLabel;
            // query to user to check if username exist?
            list<user> lstUsr =  [SELECT Id, Username, IsActive, Email FROM User WHERE Username =: userNameWithPostfix];
            
            if(lstUsr != null && lstUsr.size() > 0 ) {
                //user is active
                if(lstUsr[0].IsActive == True) {
                    //sent reset passowrd email
                    Site.forgotPassword(userNameWithPostfix);
                    return 'SUCCESS';
                }
                //user is deactived
                else {
                    return System.Label.Community_UserDeactivated;
                }
            } 
            else {
                return System.Label.Community_UsernameNotExistMessage;
            }
        }
        catch (Exception ex) {
            return ex.getMessage();
        }
    }
    
    // controller method for Community_forgotUsername
    @AuraEnabled
    public static String forgotUsername(String CitizenID,date DOB){
        try{
            String AccountRecordType = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('CN_Registration').getRecordTypeId();
            
            list<user> lstUsr =  [SELECT Id,Username,email,Account.Tribe_Id__c,Account.Date_of_Birth__c ,IsActive FROM User 
                                  WHERE Account.Tribe_Id__c =: CitizenID and Account.Tribe_Id__c != '' and 
                                  Account.Date_of_Birth__c =: DOB and Account.RecordTypeId =: AccountRecordType];
            if(lstUsr != null && lstUsr.size() > 0){
                //user is active
                if(lstUsr[0].IsActive == True){
                    return lstUsr[0].email;
                }
                //user is deactived
                else{
                    return System.Label.Community_UserDeactivated;
                }
            }
            else{
                return System.Label.Community_UserNotfound;
            }
        }  
        catch (Exception ex){
            return ex.getMessage();
        }
    }
}