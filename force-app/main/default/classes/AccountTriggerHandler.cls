/**********************************
@author: Shams
@date: 21/08/2020
@purpose: Create Daily Followup Tasks, Track Owner Change, Convert date to text for duplication rule, Validate account marked for closure and create Person Life Events
***********************************/

public class AccountTriggerHandler { 
    
    @future
    public static void DeactivateUserFM(Set<String> userIds) {
        List<User> userListToDeactivate = [SELECT Id, isActive FROM User WHERE Id IN: userIds];
        for(User usr : userListToDeactivate) {
            usr.isActive = false;
        }
        update userListToDeactivate;
    }
	
    @future
    public static void ActivateUserFM(Set<String> userIds) {
        List<User> userListToAactivate = [SELECT Id, isActive FROM User WHERE Id IN: userIds];
        for(User usr : userListToAactivate){
            usr.isActive = True;
        }
        update userListToAactivate;
    }
    
    /* CNHPHOMS-113: Commented as we moved the logc to EHR Observation records
    @future(callout=true)
    public static void updateTestResultLinks(Set<Id> accIds) {   
        List<Daily_Followup_Task__mdt> getAccessToken=[select Access_Token__c from Daily_Followup_Task__mdt];
        List<Account> Aup=  new List<Account>(); 
        for(Account acc : [SELECT Id, Test_Result_Link__c, RecordType.DeveloperName FROM Account WHERE Id IN : accIds] ) {
            String url = System.Label.CN_HealthBaseURL + '/s/verify-test-results?Id=' + EncodingUtil.base64Encode(Blob.valueOf(acc.Id));
            
            Http http = new Http();
            HttpRequest req = 	new HttpRequest();
            req.setEndpoint(
                'callout:Bitly/v3/shorten' +
                '?access_token=' + getAccessToken[0].Access_Token__c.trim()+
                '&longUrl=' + EncodingUtil.urlEncode( url, 'UTF-8' ) +
                '&format=txt'
            );
            req.setMethod('GET');
            
            HttpResponse res = http.send(req);
            acc.Flu_Test_Result_Link__c = res.getBody();
            
            Aup.add(acc);
        }
        
        // Update Account with flu links
        if(!Aup.isEmpty()) Update Aup;
    }*/
    
    //Create Lists for holding Accounts and Tasks
    list<Account> ExposedAccounts;
    list<Account> PositiveAccounts;
    list<Account> PositiveSymptomsAccounts;
    list<Account> AccountsTaskDel;
    list<Account> TenDaysFollowupAccount;
    list<task> TaskList;
    list<Account> InactiveAccountTasks;
    List<Account> PMT;
    List<id> PMTOwnerid;
    List<User> PMTOwner;
    //Days to followup count
    Integer daystoFollowup;
    //Additional days to follow if Tested positive and symptomatic
    Integer AdditionalDays;
    //Testing status picklist field values used by the code
    String exposed;
    String NegativeTest;
    String NegativeTestSymptoms;
    String PositiveTest;
    String PositiveTestSymptoms;
    String PositiveTestNoSymptoms;
    String DailyFollowUpTaskSubject;
    String DailyFollowUpTaskPMTSubject;
    String InactiveError;
    String AdminID;
    String PMTCritical;
    Integer PMTCriticalTasks;
    Integer PMTOtherTasks;
    String PMTTaskSubject;
    String CILeadRole;
    String CIRole;
    String CINurseRole;
    String CTNurseRole;
    String CTMRole;
    Group  ContactQueue;
    Group  PatientQueue;
    Group  VerifyTestResultQueue;
    Final String Active='Active';
    Final String Inactive='Inactive';
    Final String Completed='Completed';
    Final String CaseA='Case';
    Final String Contact='Contact';
    Final String Positive='Positive';
    String DeleteError;
    String TSUnknown;
    Id recordTypeId;
    
    public void getRT(){
        recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
    }
    
    //If a new account is created
    public void AInsert(List<Account> Accounts){
   		/*
   	 	integer latestNumber;
        List<Account_Case_ID__c> ACIlist=[select id,Latest_Case_ID__c from Account_Case_ID__c limit 1];
        if(ACIlist.size()>0)
            latestNumber=integer.valueof(ACIlist[0].Latest_Case_ID__c);
        
        //Identify the Exposed Accounts
        for(Account AC:Accounts){   
            if(AC.Date_of_Birth__c!=null && AC.RecordTypeId==recordTypeId){
                AC.date_of_birth_text__c=String.valueof(AC.Date_of_Birth__c);
            }
            //Set Case ID on new Cases
            if(AC.RecordTypeId==recordTypeId && AC.Contact_OR_Case__pc=='Case' && AC.Legacy_Case_Number__c==null && ACIlist.size()>0 && (AC.Do_you_want_to_be_followed__c == 'Yes' || AC.Test_Site_Type_1st__c=='Cherokee Nation Health Services')){
                AC.Legacy_Case_Number__c=String.valueof(latestNumber);
                latestNumber++;
            }
            //set last modified date
            if(AC.RecordTypeId==recordTypeId){
                AC.Account_Last_Modified_Date__c=system.now();
                AC.Latest_Last_Modified_Date__c=system.now();
            }
        }
        if(ACIlist.size()>0){
            if(integer.valueof(ACIlist[0].Latest_Case_ID__c)!=latestNumber){
                ACIlist[0].Latest_Case_ID__c=String.valueof(latestNumber);
                update ACIlist[0];
            }
        }
		*/
    }
    
    //If a new account is created
    public void AInsertAfter(List<Account> Accounts){
        setqueue();
        //List<Account> ATMlist=new list<Account>();
        Daily_Followup_Task__mdt DFT=[SELECT CT_Nurse_Role__c,CI_TeamLead_Role__c,CI_TeamMember_Role__c,Nurse_Role__c,PMTCriticalTasks__c,PMTCrititcal__c,PMTOtherTasks__c,PMTTaskSubject__c,AdminID__c,Negative_Test_Symptoms__c,Exposed_Symptomatic__c,Exposed_Asymptomatic__c,InactiveError__c,DailyFollowUpTaskSubject__c,AdditionalDays__c,daystoFollowup__c,Exposed__c,Negative_Test__c,Positive_Test_No_Symptoms__c,Positive_Test_Symptoms__c,Positive_Test__c FROM Daily_Followup_Task__mdt LIMIT 1];
        //Testing status picklist field values used by the code retrieved from metadata
        PMTCritical=DFT.PMTCrititcal__c;
        PMTCriticalTasks=DFT.PMTCriticalTasks__c.intValue();
        PMTOtherTasks=DFT.PMTOtherTasks__c.intValue();
        PMTTaskSubject=DFT.PMTTaskSubject__c;
        exposed=DFT.Exposed__c;
        NegativeTest=DFT.Negative_Test__c;
        PositiveTest=DFT.Positive_Test__c;
        PositiveTestSymptoms=DFT.Positive_Test_Symptoms__c;
        PositiveTestNoSymptoms=DFT.Positive_Test_No_Symptoms__c;
        DailyFollowUpTaskSubject=DFT.DailyFollowUpTaskSubject__c;
        InactiveError=DFT.InactiveError__c;
        AdminID=DFT.AdminID__c;
        NegativeTestSymptoms=DFT.Negative_Test_Symptoms__c;
        CILeadRole=DFT.CI_TeamLead_Role__c;
        CIRole=DFT.CI_TeamMember_Role__c;
        CINurseRole=DFT.Nurse_Role__c;
        CTNurseRole=DFT.CT_Nurse_Role__c;
        //Days to followup count retrieved from metadata
        daystoFollowup=Integer.valueOf(DFT.daystoFollowup__c);
        //Additional days to follow if Tested positive and symptomatic retrieved from metadata
        AdditionalDays=Integer.valueOf(DFT.AdditionalDays__c);
        //Initialize the Lists 
        TenDaysFollowupAccount=new list<Account>();
        InactiveAccountTasks=new List<Account>();
        ExposedAccounts=new List<Account>();
        AccountsTaskDel=new List<Account>();
        PositiveSymptomsAccounts=new List<Account>();
        PositiveAccounts=new List<Account>();
        PMT=new List<Account>();
        
        /* CNHPHOMS-113: Commented as we moved the logc to EHR Observation records
        // CNHPHOMS-8 & 9: Vikash: Fetch account record type for FLU Notification
        Set<Id> accListToUpdateResultLinks  =  new Set<Id>();
        Id fluAccRecordType =  Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('Flu_Account').getRecordTypeId();*/
        
        //Identify the Exposed Accounts
        for(Account AC:Accounts){
            //string ownerrole=AC.Owner_Role_Developer_Name__c;
            //if(AC.Case_Status__c==Active && AC.Contact_OR_Case__pc==CaseA && (AC.Date_of_when_symptoms_onset__c!=null || AC.Date_of_Test_1st__c!=null)){
            //    if(ownerrole==CILeadRole || ownerrole==CIRole || ownerrole==NurseRole)
            //        PMT.add(AC);
            //}
            if(Ac.RecordTypeId==recordTypeId){
                if(AC.Case_Status__c==Active 
                   && 
                   (AC.When_do_you_think_you_were_exposed__c!=null || AC.Date_of_when_symptoms_onset__c!=null)
                   && (AC.HealthCloudGA__Testing_Status__pc==NegativeTestSymptoms || AC.HealthCloudGA__Testing_Status__pc==DFT.Exposed_Symptomatic__c)){
                       if(AC.Date_of_when_symptoms_onset__c!=null && AC.When_do_you_think_you_were_exposed__c!=null){
                           {
                               if(AC.Date_of_when_symptoms_onset__c+daystoFollowup-5 <=system.today())
                                   ExposedAccounts.add(AC);
                               else 
                                   TenDaysFollowupAccount.add(AC);    
                           }    
                       }else if(AC.Date_of_when_symptoms_onset__c!=null)
                           TenDaysFollowupAccount.add(AC);
                       else
                           ExposedAccounts.add(AC);
                   }
                //Proceed if Account is 'Active', 'Exposure Date is not blank' and 'Testing Status is set'
                else if(AC.Case_Status__c==Active 
                        && AC.When_do_you_think_you_were_exposed__c!=null)
                {
                    //Case 1 Account is exposed or Negative Test
                    if(AC.HealthCloudGA__Testing_Status__pc==exposed || AC.HealthCloudGA__Testing_Status__pc==NegativeTest || AC.HealthCloudGA__Testing_Status__pc==DFT.Exposed_Asymptomatic__c){
                        //Add to the Exposed Account List
                        ExposedAccounts.add(AC);
                    }//Case 2 Account has tested positive or tested positive with no symptoms
                }
            }
            //for adding an account team member
            //if(AC.PMTOwner__c!=null)
            //    ATMlist.add(AC);
            
            /* CNHPHOMS-113: Commented as we moved the logc to EHR Observation records
            // CNHPHOMS-8 & 9: Vikash: Filter the flu accounts
            if(AC.RecordTypeId == fluAccRecordType && AC.Flu_Test_Result_Link__c == null) {
                accListToUpdateResultLinks.add(AC.Id);
            }*/
        }
        
        /* CNHPHOMS-113: Commented as we moved the logc to EHR Observation records
        if(!accListToUpdateResultLinks.isEmpty()){
            // call future method for callouts
            updateTestResultLinks(accListToUpdateResultLinks);
        }*/
       	
        //if(ATMlist.size()>0)
        //    AssignTeamMember(ATMlist);
        if(PMT.size()>0) createPMTtasks(PMT);
        
        //Call Helper function to Create Tasks for Case 1
        if(ExposedAccounts.size()>0) CreateTasks(ExposedAccounts);
        
        //New requirement: Create tasks 14 days from exposure date or 10 days from Symptoms Onset date
        //onset or exposure date whichever comes later
        if(TenDaysFollowupAccount.size()>0) TenDaysFollowup(TenDaysFollowupAccount);
    }
    
    //validation on deletion
    public void DeleteValidate(List<Account> Accounts) {
        Daily_Followup_Task__mdt DFT=[SELECT delete_error__c,Unknown__c,CT_Member_Role__c,CT_Nurse_Role__c,CI_TeamLead_Role__c,CI_TeamMember_Role__c,Nurse_Role__c,PMTCriticalTasks__c,PMTCrititcal__c,PMTOtherTasks__c,PMTTaskSubject__c,AdminID__c,Negative_Test_Symptoms__c,Exposed_Symptomatic__c,Exposed_Asymptomatic__c,InactiveError__c,DailyFollowUpTaskSubject__c,AdditionalDays__c,daystoFollowup__c,Exposed__c,Negative_Test__c,Positive_Test_No_Symptoms__c,Positive_Test_Symptoms__c,Positive_Test__c FROM Daily_Followup_Task__mdt LIMIT 1];
        DeleteError=DFT.delete_error__c;
        List<Users_with_delete_rights__mdt> Users=[SELECT Label FROM Users_with_delete_rights__mdt];
        Id userid=userinfo.getUserId();
        boolean usernotfound=true;
        for(Users_with_delete_rights__mdt U:Users)
        {
            if(U.Label==userid)
                usernotfound=false;
        }
        if(usernotfound)
        {
            for(Account a:Accounts){
                if(a.MasterRecordId == null && a.RecordTypeId==recordTypeId)
                    a.addError(DeleteError);
            }
        }
    }
    
    //before update
    public void ABefUpdate(List<Account> Accounts,Map<id,Account> OldAccountMap){
        integer latestNumber;
        List<Account_Case_ID__c> ACIlist=[select id,Latest_Case_ID__c from Account_Case_ID__c limit 1];
        if(ACIlist.size()>0)
            latestNumber=integer.valueof(ACIlist[0].Latest_Case_ID__c);
        Daily_Followup_Task__mdt DFT=[SELECT Unknown__c,CT_Member_Role__c,CT_Nurse_Role__c,CI_TeamLead_Role__c,CI_TeamMember_Role__c,Nurse_Role__c,PMTCriticalTasks__c,PMTCrititcal__c,PMTOtherTasks__c,PMTTaskSubject__c,AdminID__c,Negative_Test_Symptoms__c,Exposed_Symptomatic__c,Exposed_Asymptomatic__c,InactiveError__c,DailyFollowUpTaskSubject__c,AdditionalDays__c,daystoFollowup__c,Exposed__c,Negative_Test__c,Positive_Test_No_Symptoms__c,Positive_Test_Symptoms__c,Positive_Test__c FROM Daily_Followup_Task__mdt LIMIT 1];
        PMTCritical=DFT.PMTCrititcal__c;
        PMTCriticalTasks=DFT.PMTCriticalTasks__c.intValue();
        PMTOtherTasks=DFT.PMTOtherTasks__c.intValue();
        PMTTaskSubject=DFT.PMTTaskSubject__c;
        exposed=DFT.Exposed__c;
        NegativeTest=DFT.Negative_Test__c;
        PositiveTest=DFT.Positive_Test__c;
        PositiveTestSymptoms=DFT.Positive_Test_Symptoms__c;
        PositiveTestNoSymptoms=DFT.Positive_Test_No_Symptoms__c;
        DailyFollowUpTaskSubject=DFT.DailyFollowUpTaskSubject__c;
        InactiveError=DFT.InactiveError__c;
        AdminID=DFT.AdminID__c;
        TSUnknown=DFT.Unknown__c;
        NegativeTestSymptoms=DFT.Negative_Test_Symptoms__c;
        CILeadRole=DFT.CI_TeamLead_Role__c;
        CIRole=DFT.CI_TeamMember_Role__c;
        CINurseRole=DFT.Nurse_Role__c;
        CTNurseRole=DFT.CT_Nurse_Role__c;
        CTMRole=DFT.CT_Member_Role__c;
        AdminID=DFT.AdminID__c;
        InactiveError=DFT.InactiveError__c;
        InactiveAccountTasks=new List<Account>();
        for(Account AC:Accounts){ 
            if(Ac.RecordTypeId==recordTypeId){
                //set last modified date
                AC.Account_Last_Modified_Date__c=system.now();
                AC.Latest_Last_Modified_Date__c=system.now();
                Account oldAC=OldAccountMap.get(AC.id);
                if(oldAC.Case_Status__c!=AC.Case_Status__c && AC.Case_Status__c==Active)
                    ac.Skip_Quarantine__c=false;
                if(oldAC.Date_of_Birth__c!=AC.Date_of_Birth__c && AC.Date_of_Birth__c!=null)
                    AC.date_of_birth_text__c=String.valueof(AC.Date_of_Birth__c);
                else if(oldAC.Date_of_Birth__c!=AC.Date_of_Birth__c && AC.Date_of_Birth__c==null)
                    AC.date_of_birth_text__c='';
                //Store last owner
                if(AC.OwnerId!=oldAC.OwnerId){
                    AC.Contact_Tracer__c=oldAC.OwnerId;
                }
                if(AC.When_do_you_think_you_were_exposed__c!=oldAC.When_do_you_think_you_were_exposed__c && AC.Contact_OR_Case__pc=='Contact' && AC.When_do_you_think_you_were_exposed__c!=null)
                    AC.Case_Status__c='Active';
                //Validation rule to Check if the account has tasks before marking it inactive
                if(AC.Case_Status__c!=oldAC.Case_Status__c && (AC.Case_Status__c==Inactive || AC.Case_Status__c==null || AC.Case_Status__c==''))
                {
                    InactiveAccountTasks.add(AC);
                }
                
                try{
                    //Set Case ID on new Cases
                    if((AC.Contact_OR_Case__pc=='Case' && (!oldAC.HealthCloudGA__Testing_Status__pc.startsWith('Positive') || oldAC.Test_Site_Type_1st__c!=AC.Test_Site_Type_1st__c) && ACIlist.size()>0) 
                       && AC.Legacy_Case_Number__c==null  && (AC.Do_you_want_to_be_followed__c=='Yes' || AC.Test_Site_Type_1st__c=='Cherokee Nation Health Services'))
                    {
                        AC.Legacy_Case_Number__c=String.valueof(latestNumber);
                        latestNumber++;
                    }
                    else if((AC.Contact_OR_Case__pc=='Case' && (!oldAC.HealthCloudGA__Testing_Status__pc.startsWith('Positive') || oldAC.Test_Site_Type_1st__c!=AC.Test_Site_Type_1st__c) && ACIlist.size()>0) 
                            && AC.Legacy_Case_Number__c==null  && AC.Do_you_want_to_be_followed__c !='Yes' && AC.Test_Site_Type_1st__c!='Cherokee Nation Health Services' && !AC.CE__c && AC.HH_Case_ID__c!=null)
                    {
                        AC.Legacy_Case_Number__c='C2C-'+AC.HH_Case_ID__c;
                        AC.Verify_test_result__c=true;
                    }
                }
                catch(Exception e) {
                    if((AC.Contact_OR_Case__pc=='Case' && (oldAC.Test_Site_Type_1st__c!=AC.Test_Site_Type_1st__c) && ACIlist.size()>0) 
                       && AC.Legacy_Case_Number__c==null 
                       && (AC.Do_you_want_to_be_followed__c=='Yes' || AC.Test_Site_Type_1st__c=='Cherokee Nation Health Services')) 
                    {
                        AC.Legacy_Case_Number__c=String.valueof(latestNumber);
                        latestNumber++;
                    }
                    else if((AC.Contact_OR_Case__pc=='Case' && (oldAC.Test_Site_Type_1st__c!=AC.Test_Site_Type_1st__c) && ACIlist.size()>0) 
                            && AC.Legacy_Case_Number__c==null 
                            && AC.Do_you_want_to_be_followed__c !='Yes' 
                            && AC.Test_Site_Type_1st__c!='Cherokee Nation Health Services' 
                            && !AC.CE__c && AC.HH_Case_ID__c!=null)
                    {
                        AC.Legacy_Case_Number__c='C2C-'+AC.HH_Case_ID__c;
                        AC.Verify_test_result__c=true;
                    }
                }
            }
        }
        
        if(ACIlist.size()>0){
            if(integer.valueof(ACIlist[0].Latest_Case_ID__c)!=latestNumber){
                ACIlist[0].Latest_Case_ID__c=String.valueof(latestNumber);
                update ACIlist[0];
            }
        }
        
        //Call Helper function to validate if account can be closed
        if(InactiveAccountTasks.size()>0) ValidateAccountClose(InactiveAccountTasks);
    }
    
    //If Account is updated
    public void AUpdate(List<Account> Accounts,Map<id,Account> OldAccountMap){
        setqueue();
        Daily_Followup_Task__mdt DFT=[SELECT Unknown__c,CT_Member_Role__c,CT_Nurse_Role__c,CI_TeamLead_Role__c,CI_TeamMember_Role__c,Nurse_Role__c,PMTCriticalTasks__c,PMTCrititcal__c,PMTOtherTasks__c,PMTTaskSubject__c,AdminID__c,Negative_Test_Symptoms__c,Exposed_Symptomatic__c,Exposed_Asymptomatic__c,InactiveError__c,DailyFollowUpTaskSubject__c,AdditionalDays__c,daystoFollowup__c,Exposed__c,Negative_Test__c,Positive_Test_No_Symptoms__c,Positive_Test_Symptoms__c,Positive_Test__c FROM Daily_Followup_Task__mdt LIMIT 1];
        //Testing status picklist field values used by the code retrieved from metadata
        PMTCritical=DFT.PMTCrititcal__c;
        PMTCriticalTasks=DFT.PMTCriticalTasks__c.intValue();
        PMTOtherTasks=DFT.PMTOtherTasks__c.intValue();
        PMTTaskSubject=DFT.PMTTaskSubject__c;
        exposed=DFT.Exposed__c;
        NegativeTest=DFT.Negative_Test__c;
        PositiveTest=DFT.Positive_Test__c;
        PositiveTestSymptoms=DFT.Positive_Test_Symptoms__c;
        PositiveTestNoSymptoms=DFT.Positive_Test_No_Symptoms__c;
        DailyFollowUpTaskSubject=DFT.DailyFollowUpTaskSubject__c;
        InactiveError=DFT.InactiveError__c;
        AdminID=DFT.AdminID__c;
        TSUnknown=DFT.Unknown__c;
        NegativeTestSymptoms=DFT.Negative_Test_Symptoms__c;
        CILeadRole=DFT.CI_TeamLead_Role__c;
        CIRole=DFT.CI_TeamMember_Role__c;
        CINurseRole=DFT.Nurse_Role__c;
        CTNurseRole=DFT.CT_Nurse_Role__c;
        CTMRole=DFT.CT_Member_Role__c;
        //Days to followup count retrieved from metadata
        daystoFollowup=Integer.valueOf(DFT.daystoFollowup__c);
        //Additional days to follow if Tested positive and symptomatic retrieved from metadata
        AdditionalDays=Integer.valueOf(DFT.AdditionalDays__c);
        //Initialize the Lists 
        TenDaysFollowupAccount=new list<Account>();
        ExposedAccounts=new List<Account>();
        AccountsTaskDel=new List<Account>();
        PositiveSymptomsAccounts=new List<Account>();
        PositiveAccounts=new List<Account>();
        List<Account> AlignPLE=new List<Account>();
        //List<Account> ATMdellist=new list<Account>();
        //List<Account> ATMnewlist=new list<Account>();
        
        Id RegAcntRecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('CN_Registration').getRecordTypeId();
        Set<String> AccListWithFlagsToDeActivateUser = new Set<String>();
        Set<String> AccListWithFlagsToActivateUser = new Set<String>();
        Set<String> usersToBeActivated = new Set<String>();
        Set<String> usersToBeDeactivated = new Set<String>();
        
        PMT=new List<Account>();
        for(Account AC:Accounts){
            if(Ac.RecordTypeId==recordTypeId){
                string ownerrole=AC.Owner_Role_Developer_Name__c;
                //system.debug('OwnerRole:'+ownerrole);
                //Get older account values
                Account oldAC=OldAccountMap.get(AC.id);
                //for PMT task creation
                if( AC.Contact_OR_Case__pc==CaseA && AC.Case_Status__c==Active && (AC.Date_of_when_symptoms_onset__c!=null || AC.Initial_test_date__c!=null) && (AC.Do_you_want_to_be_followed__c=='Yes' || AC.Test_Site_Type_1st__c=='Cherokee Nation Health Services' || AC.Test_Site_Type_1st__c=='')){
                    if(((AC.Date_of_when_symptoms_onset__c!=oldAc.Date_of_when_symptoms_onset__c) || (AC.Initial_test_date__c!=oldAC.Initial_test_date__c) ||
                       (AC.Contact_or_Case_new__c!=oldAc.Contact_or_Case_new__c) || (AC.HealthCloudGA__Testing_Status__pc !=oldAc.HealthCloudGA__Testing_Status__pc)
                       || (test.isRunningTest()) || (AC.Extended_Isolation__c!=oldAc.Extended_Isolation__c) 
                        || (AC.Create_Patient_Task__c!=oldac.Create_Patient_Task__c) || (AC.Is_this_a_rapid_CI_mode__c!=oldac.Is_this_a_rapid_CI_mode__c) || (AC.Case_Status__c!=oldAC.Case_Status__c)
                       || (AC.Is_a_Healthcare_Worker__c!=oldac.Is_a_Healthcare_Worker__c))
                      && AC.Create_Patient_Task__c  )
                    {
                        PMT.add(AC);
                        AlignPLE.add(AC);
                    }else if((AC.Date_of_when_symptoms_onset__c!=oldAc.Date_of_when_symptoms_onset__c) || (AC.Initial_test_date__c!=oldAC.Initial_test_date__c) ||
                       (AC.Contact_or_Case_new__c!=oldAc.Contact_or_Case_new__c) || (AC.HealthCloudGA__Testing_Status__pc !=oldAc.HealthCloudGA__Testing_Status__pc)
                       || (test.isRunningTest()) || (AC.Extended_Isolation__c!=oldAc.Extended_Isolation__c) 
                             || (AC.Create_Patient_Task__c!=oldac.Create_Patient_Task__c) || (AC.Is_this_a_rapid_CI_mode__c!=oldac.Is_this_a_rapid_CI_mode__c) || (AC.Is_a_Healthcare_Worker__c!=oldac.Is_a_Healthcare_Worker__c))
                    {
                        AlignPLE.add(AC);     
                        AccountsTaskDel.add(AC);   
                    }
                }
                else if(AC.Contact_OR_Case__pc==CaseA && ((AC.Date_of_when_symptoms_onset__c==null && AC.Initial_test_date__c==null) || (AC.Do_you_want_to_be_followed__c!='Yes' && AC.Test_Site_Type_1st__c!='Cherokee Nation Health Services')) )
                {
                    if((AC.Date_of_when_symptoms_onset__c!=oldAC.Date_of_when_symptoms_onset__c) || (AC.Initial_test_date__c!=oldAC.Initial_test_date__c) || (AC.Contact_or_Case_new__c!=oldAC.Contact_or_Case_new__c)
                       || (AC.Is_a_Healthcare_Worker__c!=oldac.Is_a_Healthcare_Worker__c) || (oldAC.Do_you_want_to_be_followed__c!=AC.Do_you_want_to_be_followed__c) || (oldAC.Test_Site_Type_1st__c!=AC.Test_Site_Type_1st__c))
                    {
                        AlignPLE.add(AC);
                        AccountsTaskDel.add(AC);
                    }    
                }
                //New requirement: Create tasks 14 days from exposure date or 10 days from Symptoms Onset date
                //onset or exposure date whichever comes later
                else if(AC.Case_Status__c==Active  
                        && 
                        (AC.When_do_you_think_you_were_exposed__c!=null || AC.Date_of_when_symptoms_onset__c!=null)
                        && (
                            (oldAC.When_do_you_think_you_were_exposed__c!=AC.When_do_you_think_you_were_exposed__c) 
                            || 
                            (AC.HealthCloudGA__Testing_Status__pc!=oldAC.HealthCloudGA__Testing_Status__pc)
                            ||
                            (AC.Date_of_when_symptoms_onset__c!=oldAC.Date_of_when_symptoms_onset__c)
                            ||
                            (AC.Case_Status__c!=oldAC.Case_Status__c)
                        )
                        && (AC.HealthCloudGA__Testing_Status__pc==NegativeTestSymptoms || AC.HealthCloudGA__Testing_Status__pc==DFT.Exposed_Symptomatic__c)){
                            //Delete old tasks
                            AccountsTaskDel.add(AC);
                            if(AC.Date_of_when_symptoms_onset__c!=null && AC.When_do_you_think_you_were_exposed__c!=null){
                                {
                                    if(AC.Date_of_when_symptoms_onset__c+daystoFollowup-5 <=system.today())
                                        ExposedAccounts.add(AC);
                                    else 
                                        TenDaysFollowupAccount.add(AC);    
                                }    
                            }    
                            else if(AC.Date_of_when_symptoms_onset__c!=null)
                                TenDaysFollowupAccount.add(AC);
                            else
                                ExposedAccounts.add(AC);
                        }
                //Proceed if Account is 'Active', 'Exposure Date is not blank' and 'Testing Status is set'
                else if(AC.Case_Status__c==Active
                        && AC.When_do_you_think_you_were_exposed__c!=null 
                        && ((oldAC.When_do_you_think_you_were_exposed__c!=AC.When_do_you_think_you_were_exposed__c) 
                            || (AC.HealthCloudGA__Testing_Status__pc!=oldAC.HealthCloudGA__Testing_Status__pc)
                            || (AC.Case_Status__c!=oldAC.Case_Status__c)
                           )
                       )
                {
                    //Case 0 Exposure date is incorrect or in future
                    if(AC.When_do_you_think_you_were_exposed__c>system.today()){
                        //Add old system generated Daily Tasks to the list to mark them for deletion
                        AccountsTaskDel.add(AC);
                    } 
                    //Case 1 Account is exposed or Negative Test
                    else if(AC.HealthCloudGA__Testing_Status__pc==exposed || AC.HealthCloudGA__Testing_Status__pc==NegativeTest || AC.HealthCloudGA__Testing_Status__pc==DFT.Exposed_Asymptomatic__c){
                        //Add old system generated Daily Tasks to the list to mark them for deletion
                        AccountsTaskDel.add(AC);
                        //Add to the Exposed Account List
                        ExposedAccounts.add(AC);
                    }//Case 2 Account has tested positive or tested positive with no symptoms
                    else if(AC.HealthCloudGA__Testing_Status__pc==PositiveTestNoSymptoms){
                        //Add old system generated Daily Tasks to the list to mark them for deletion
                        AccountsTaskDel.add(AC);
                    }//Case 3 Account has tested positive with Symptoms
                    else if(AC.HealthCloudGA__Testing_Status__pc==PositiveTestSymptoms || AC.HealthCloudGA__Testing_Status__pc==Positive || AC.HealthCloudGA__Testing_Status__pc==TSUnknown){
                        //Add old system generated Daily Tasks to the list to mark them for deletion
                        AccountsTaskDel.add(AC);
                    }
                }//Case 4 If due date was removed
                else if(AC.Case_Status__c==Active
                        && AC.When_do_you_think_you_were_exposed__c==null 
                        && (oldAC.When_do_you_think_you_were_exposed__c!=AC.When_do_you_think_you_were_exposed__c))
                {
                    //Add old system generated Daily Tasks to the list to mark for deletion
                    AccountsTaskDel.add(AC);
                }else if(AC.Case_Status__c==Active
                         && AC.When_do_you_think_you_were_exposed__c==null && AC.Date_of_when_symptoms_onset__c==null
                         && (oldAC.Date_of_when_symptoms_onset__c!=AC.Date_of_when_symptoms_onset__c))
                {
                    //Add old system generated Daily Tasks to the list to mark for deletion
                    AccountsTaskDel.add(AC);
                }
            }
            //accounts with DOD not null or Is Void true or CN Citizen Flag False
            else if(AC.RecordTypeId == RegAcntRecordTypeId && (AC.DOD__c  != null || AC.Is_Void__c == 'Yes' || AC.If_CN_Citizen__c  == 'No')){
                AccListWithFlagsToDeActivateUser.add(AC.Id);     
            }
           
             //accounts with DOD null or Is Void false and CN Citizen Flag true
            else if(AC.RecordTypeId == RegAcntRecordTypeId && (AC.DOD__c  == null && (AC.Is_Void__c == 'No' || AC.Is_Void__c == null ) && AC.If_CN_Citizen__c  == 'Yes')){
                AccListWithFlagsToActivateUser.add(AC.Id);     
            }
        }
        
        //AUTOMATION FOR CN REGISTRATION ACCOUNTS
      
        if(AccListWithFlagsToDeActivateUser != null && AccListWithFlagsToDeActivateUser.size() > 0)
        {
            for(User us : [SELECT Id, AccountId, Account.DOD__c, Account.Is_Void__c, Account.If_CN_Citizen__c  FROM User WHERE AccountId IN: AccListWithFlagsToDeActivateUser ])
            {
                Account oldAccount =(Account)Trigger.oldMap.get(us.Account.Id);
                if(us.Account.DOD__c != oldAccount.DOD__c || us.Account.Is_Void__c != oldAccount.Is_Void__c || us.Account.If_CN_Citizen__c != oldAccount.If_CN_Citizen__c)
                {
                    usersToBeDeactivated.add(us.Id);
                }
            }
        }
        
        if(AccListWithFlagsToActivateUser != null && AccListWithFlagsToActivateUser.size() > 0){
             // query users to get user list to be activated
            for(User us : [SELECT Id, AccountId, Account.DOD__c, Account.Is_Void__c, Account.Stop_Flag__c, Account.If_CN_Citizen__c  FROM User WHERE AccountId IN: AccListWithFlagsToActivateUser ]){
                Account oldAccount =(Account)Trigger.oldMap.get(us.Account.Id);
                if(us.Account.DOD__c != oldAccount.DOD__c || us.Account.Is_Void__c != oldAccount.Is_Void__c || us.Account.If_CN_Citizen__c != oldAccount.If_CN_Citizen__c){
                    usersToBeActivated.add(us.Id);
                }
            }
        }
        
        if(usersToBeDeactivated != null && usersToBeDeactivated.size() > 0)
            DeactivateUserFM(usersToBeDeactivated);
        
        if(usersToBeActivated != null && usersToBeActivated.size() > 0)
            ActivateUserFM(usersToBeActivated);
        
         //END AUTOMATION FOR CN REGISTRATION ACCOUNTS
        
        //Call Helper function to Delete old system generated Daily Tasks for all Cases (1 to 4)
        if(AccountsTaskDel.size()>0) DeleteOpenTasks(AccountsTaskDel);
        
        //Call Helper function to Create Tasks for Case 1
        if(ExposedAccounts.size()>0) CreateTasks(ExposedAccounts);
        
        //New requirement: Create tasks 14 days from exposure date or 10 days from Symptoms Onset date
        //onset or exposure date whichever comes later
        if(TenDaysFollowupAccount.size()>0) TenDaysFollowup(TenDaysFollowupAccount);
        
        if(PMT.size()>0) createPMTtasks(PMT);
        
        if(AlignPLE.size()>0) AlignLifeEvents(AlignPLE);
    }
    
    public void setqueue(){
        ContactQueue=[SELECT Id FROM Group WHERE DeveloperName = 'Contact_Daily_Followup_Tasks_Queue' limit 1];
        PatientQueue=[SELECT Id FROM Group WHERE DeveloperName = 'Patient_Daily_Followup_Tasks_Queue' limit 1];
        VerifyTestResultQueue=[SELECT Id FROM Group WHERE DeveloperName = 'Verify_Test_Result' limit 1];
    }
    
    //Helper function to validate if account can be closed
    public void ValidateAccountClose(List<Account> ClosedAccount){
        List<Account> Aclose=new List<Account>();
        Map<id,boolean> AccounthasTask=new map<id,boolean>();
        Id TaskRecordTypeId = Schema.SObjectType.Task.getRecordTypeInfosByDeveloperName().get('Contact_Tracing').getRecordTypeId();
        //Fetch all open tasks against the accounts marked as Inactive and are not yet completed
        List<Task> Tasklist=[select id,whatid from task where Status!='Completed' and IsRecurrence=false and (subject=:DailyFollowUpTaskSubject OR subject=:PMTTaskSubject)  and recordtypeid=:TaskRecordTypeId and WhatId=:ClosedAccount];
        for(Task t:Tasklist)
        {
            //Create Task-Account Map
            if(AccounthasTask.get(t.WhatId)==null)
                AccounthasTask.put(t.WhatId, true);
        }
        for(Account AC:ClosedAccount){
            if(AccounthasTask.get(AC.id)!=null){
                //If incomplete task found throw an error
                if(AccounthasTask.get(AC.id)==true){
                    AC.Case_Status__c.addError(InactiveError);
                }
            }else{
                //else close the account and Change the owner to Admin
                AC.Contact_Tracer__c=AC.OwnerId;
                AC.OwnerId=AdminID;
                AC.stage__c='Released';
                AC.HealthCloudGA__StatusGroup__pc='NotMonitored';
                AC.verify_task_created__c=false;
                AC.Verify_test_result__c=false;
                Aclose.add(AC);
            }
        }
    }
    
    //Helper function for Creating tasks for 10 days from symptoms onset
    public void TenDaysFollowup(List<Account> ExposedAccounts){
        AlignLifeEvents(ExposedAccounts);
        //Initialize list
        TaskList = new List<Task>();
        for(Account AC:ExposedAccounts)
        {
            //Calculate exposure date with respect to current date
            Date exposure=AC.Date_of_when_symptoms_onset__c+(daystoFollowup-5);
            //Identify days left for daily tasks
            Integer daysLeft=system.today().daysBetween(exposure);
            //If days left proceed 
            if(daysLeft>0){
                Integer dailytask=daysleft;
                for(integer i=1;i<=dailytask;i++){
                    //Helper function to create daily tasks for 10 days
                    TaskList.add(CreateTask(AC,i));
                }
            }
            if(AC.When_do_you_think_you_were_exposed__c!=null){
                //Calculate exposure date with respect to current date
                Date exposure2=AC.When_do_you_think_you_were_exposed__c+(daystoFollowup-1);
                //Identify days left for daily tasks
                Integer daysLeft2=system.today().daysBetween(exposure);
                daysLeft=exposure.daysBetween(exposure2);
                if(daysLeft>8){
                    Integer dailytask=daysLeft2-8;
                    for(integer i=1;i<=dailytask;i++){
                        TaskList.add(CreateTask(AC,i));
                    }
                    //Helper function to Create task on 9th, 12th and 14th day
                    TaskList.add(CreateTask(AC,daysLeft2+3));
                    TaskList.add(CreateTask(AC,daysLeft2+6));
                    TaskList.add(CreateTask(AC,daysLeft2+8));
                }else if(daysLeft>7){
                    //Helper function to Create task on 9th, 12th and 14th day
                    TaskList.add(CreateTask(AC,daysLeft2+3));
                    TaskList.add(CreateTask(AC,daysLeft2+6));
                    TaskList.add(CreateTask(AC,daysLeft2+8));
                }else if(daysLeft>6){
                    //Helper function to Create task on 9th, 12th and 14th day
                    TaskList.add(CreateTask(AC,daysLeft2+2));
                    TaskList.add(CreateTask(AC,daysLeft2+5));
                    TaskList.add(CreateTask(AC,daysLeft2+7));
                }else if(daysLeft>5){
                    //Helper function to Create task on 9th, 12th and 14th day
                    TaskList.add(CreateTask(AC,daysLeft2+1));
                    TaskList.add(CreateTask(AC,daysLeft2+4));
                    TaskList.add(CreateTask(AC,daysLeft2+6));
                }else if(daysLeft>4){
                    //Helper function to Create task on 12th and 14th day
                    TaskList.add(CreateTask(AC,daysLeft2+3));
                    TaskList.add(CreateTask(AC,daysLeft2+5));
                }else if(daysLeft>3){
                    //Helper function to Create task on 12th and 14th day
                    TaskList.add(CreateTask(AC,daysLeft2+2));
                    TaskList.add(CreateTask(AC,daysLeft2+4));
                }else if(daysLeft>2){
                    //Helper function to Create task on 12th and 14th day
                    TaskList.add(CreateTask(AC,daysLeft2+1));
                    TaskList.add(CreateTask(AC,daysLeft2+3));
                }else if(daysLeft>1){
                    //Helper function to Create task on 14th day
                    TaskList.add(CreateTask(AC,daysLeft2+2));
                }else if(daysLeft==1){
                    TaskList.add(CreateTask(AC,daysLeft2+1));
                }
            }}
        //Create Tasks
        if(TaskList.size()>0)
            Database.insert(TaskList,false);
    }
    
    //Helper function to Delete old system generated Daily Tasks for all Cases (1 to 4)
    public void DeleteOpenTasks(List<Account> Account){
        //Fetch all open tasks which were auto generated by system
        List<Task> TaskDel=[select id from task where Status!='Completed' and IsRecurrence=false and Send_Survey_Invite__c  = true and WhatId=:Account];
        if(TaskDel.size()!=null){
            //If tasks exist delete them
            if(TaskDel.size()>0)
                Database.delete(TaskDel, false);
        }
    }
    
    //Helper function for Task creation
    public Task CreateTask(Account AC,Integer Days){
        //Initialize Task object
        Task t=new Task();
        //Get Contact Tracing Record type id for task dynamically
        Id recordTypeId = Schema.SObjectType.Task.getRecordTypeInfosByDeveloperName().get('Contact_Tracing').getRecordTypeId();
        t.RecordTypeId=recordTypeId;
        //Set Owner, Subject, STatus, Assigned to and Due date
        //if(AC.PMT_Condition__c!=null && AC.PMTOwner__c!=null && AC.Contact_OR_Case__pc==CaseA)
        //    t.OwnerId=AC.PMTOwner__c;
        //else
        //    t.OwnerId=AC.OwnerId;
        if(/*AC.PMT_Condition__c!=null && AC.PMTOwner__c!=null &&*/ AC.Contact_OR_Case__pc==CaseA){
            t.Subject=PMTTaskSubject;
            t.OwnerId=PatientQueue.id;
        }
        else{
            t.Subject=DailyFollowUpTaskSubject;
            t.OwnerId=ContactQueue.id;
        }
        t.Priority=AC.Priority__c;
        t.Status='Not Started';
        t.WhatId=AC.id;
        t.ActivityDate=system.today()+Days;
        t.Send_Survey_Invite__c=true;
        //Return the Task to be added to the list
        return t;
    }
    
    //Helper function for Creating PMT Tasks
    public void createPMTtasks(List<Account> Account){
        DeleteOpenTasks(Account);
        integer tasksCount=0;
        TaskList = new List<Task>();
        for(Account AC:Account)
        {
            if(AC.Extended_Isolation__c) 
                tasksCount=PMTCriticalTasks;
            else if(AC.Is_this_a_rapid_CI_mode__c=='Yes')
                tasksCount=PMTOtherTasks+3;
            else
                tasksCount=PMTOtherTasks;
            Date tasksDate;Date Tdate=null;
            
            
            
            //new requirement CNCPP-411 
            boolean HCW=AC.Is_a_Healthcare_Worker__c;
            //boolean symptomatic=false;
            //if(AC.HealthCloudGA__Testing_Status__pc==PositiveTestSymptoms)
            //    symptomatic=true;
            if(Ac.Initial_test_date__c!=null){
                DateTime dT = AC.Initial_test_date__c;
                Tdate = date.newinstance(dT.year(), dT.month(), dT.day());
            }
            
            //if(Ac.Date_of_when_symptoms_onset__c!=null && Tdate!=null && symptomatic)
            //{
            //    if(Ac.Date_of_when_symptoms_onset__c<Tdate)
            //        tasksDate=Ac.Date_of_when_symptoms_onset__c;
            //    else
            //        tasksDate=Tdate;
            //}
            //else 
            if(Ac.Date_of_when_symptoms_onset__c!=null) tasksDate=Ac.Date_of_when_symptoms_onset__c;
            else if(Tdate!=null) tasksDate=Tdate;
            if(HCW)
                tasksCount=tasksCount+2;
            
            if(tasksDate!=null){
                Date diff=tasksDate+tasksCount; 
                //Identify days left for daily tasks
                Integer daysLeft=system.today().daysBetween(diff);
                //Helper function to Create Daily tasks for first 6 days
                if(daysLeft>0){
                    for(integer i=1;i<=daysleft;i++){
                        TaskList.add(CreateTask(AC,i));
                    }
                }
            }
        }
        //Create tasks
        if(TaskList.size()>0)
            Database.insert(TaskList,false);
    }
    
    //Helper function for Creating tasks for Case 1
    public void CreateTasks(List<Account> ExposedAccounts){
        AlignLifeEvents(ExposedAccounts);
        //Initialize list
        TaskList = new List<Task>();
        for(Account AC:ExposedAccounts)
        {
            //Calculate exposure date with respect to current date
            Date exposure=AC.When_do_you_think_you_were_exposed__c+(daystoFollowup-1);
            //Identify days left for daily tasks
            Integer daysLeft=system.today().daysBetween(exposure);
            //Helper function to Create Daily tasks for first 6 days
            if(daysLeft>8){
                Integer dailytask=daysleft-8;
                for(integer i=1;i<=dailytask;i++){
                    TaskList.add(CreateTask(AC,i));
                }
                //Helper function to Create task on 9th, 12th and 14th day
                TaskList.add(CreateTask(AC,dailytask+3));
                TaskList.add(CreateTask(AC,dailytask+6));
                TaskList.add(CreateTask(AC,dailytask+8));
            }else if(daysLeft>7){
                //Helper function to Create task on 9th, 12th and 14th day
                TaskList.add(CreateTask(AC,3));
                TaskList.add(CreateTask(AC,6));
                TaskList.add(CreateTask(AC,8));
            }else if(daysLeft>6){
                //Helper function to Create task on 9th, 12th and 14th day
                TaskList.add(CreateTask(AC,2));
                TaskList.add(CreateTask(AC,5));
                TaskList.add(CreateTask(AC,7));
            }else if(daysLeft>5){
                //Helper function to Create task on 9th, 12th and 14th day
                TaskList.add(CreateTask(AC,1));
                TaskList.add(CreateTask(AC,4));
                TaskList.add(CreateTask(AC,6));
            }else if(daysLeft>4){
                //Helper function to Create task on 12th and 14th day
                TaskList.add(CreateTask(AC,3));
                TaskList.add(CreateTask(AC,5));
            }else if(daysLeft>3){
                //Helper function to Create task on 12th and 14th day
                TaskList.add(CreateTask(AC,2));
                TaskList.add(CreateTask(AC,4));
            }else if(daysLeft>2){
                //Helper function to Create task on 12th and 14th day
                TaskList.add(CreateTask(AC,1));
                TaskList.add(CreateTask(AC,3));
            }else if(daysLeft>1){
                //Helper function to Create task on 14th day
                TaskList.add(CreateTask(AC,2));
            }else if(daysLeft==1){
                TaskList.add(CreateTask(AC,1));
            }
        }
        //Create tasks
        if(TaskList.size()>0)
            Database.insert(TaskList,false);
    }
    
    //align life events life events
    public void AlignLifeEvents(List<Account> Acc){
        List<personlifeevent> PLEupdate=new list<personlifeevent>();
        List<personlifeevent> PLEinsert=new list<personlifeevent>();
        List<personlifeevent> PLEdelete=new list<personlifeevent>();
        Map<id,Account> contactid=new Map<id,Account>();
        Map<id,PersonLifeEvent> CasePLEmap=new map<id,PersonLifeEvent>();
        Map<id,PersonLifeEvent> ContactPLEmap=new map<id,PersonLifeEvent>();
        //Create contact map to fetch life events
        for(Account Ac:Acc)
            contactid.put(Ac.PersonContactId,Ac);
        //Fetch Isolated and Quarantined Life Events
        List<personlifeevent> CasePLElist=[select id,eventtype,EventDate,Name,ExpirationDate,OwnerId,PrimaryPersonId,IsExpired from personlifeevent where primarypersonid =:contactid.keyset() and IsExpired=false and eventtype='Isolated' order by createddate desc];
        List<personlifeevent> ContactPLElist=[select id,eventtype,EventDate,Name,ExpirationDate,OwnerId,PrimaryPersonId,IsExpired from personlifeevent where primarypersonid =:contactid.keyset() and IsExpired=false and eventtype='Quarantined'  order by createddate desc];
        //Create map of life events
        for(personlifeevent ple:CasePLElist){
            if(CasePLEmap.get(ple.PrimaryPersonId)==null)
                CasePLEmap.put(ple.PrimaryPersonId,ple);
        }
        for(personlifeevent ple:ContactPLElist){
            if(ContactPLEmap.get(ple.PrimaryPersonId)==null)
                ContactPLEmap.put(ple.PrimaryPersonId,ple);
        }
        //Iterate through all accounts to align their respective life event
        for(Account Ac:Acc){
            //If account is a case
            if(Ac.Contact_OR_Case__pc=='Case')
            {
                //Update Quarantined LifeEvent if there is one
                if(ContactPLEmap.get(Ac.PersonContactId)!=null)
                {
                    PersonLifeEvent PLE=ContactPLEmap.get(Ac.PersonContactId);
                    if(PLE.ExpirationDate>system.now())
                    {
                        PLE.IsExpired=true;
                        PLE.ExpirationDate=system.now();
                        PLEupdate.add(PLE);
                    }
                }
                DateTime Onsetdate=null;DateTime testdate=null;
                if(Ac.Date_of_when_symptoms_onset__c!=null)
                	Onsetdate=ac.Date_of_when_symptoms_onset__c;//DateTime.newInstance(ac.Date_of_when_symptoms_onset__c.year(), ac.Date_of_when_symptoms_onset__c.month(), ac.Date_of_when_symptoms_onset__c.day());
                if(Ac.Initial_test_date__c!=null)
                    testdate=ac.Initial_test_date__c;//DateTime.newInstance(ac.Initial_test_date__c.year(), ac.Initial_test_date__c.month(), ac.Initial_test_date__c.day());
                //boolean symptomatic=false;
                //if(AC.HealthCloudGA__Testing_Status__pc==PositiveTestSymptoms)
                //    symptomatic=true;
                boolean HCW=AC.Is_a_Healthcare_Worker__c;
                //Update existing Isolated life event
                if(CasePLEmap.get(Ac.PersonContactId)!=null)
                {
                    PersonLifeEvent PLE=CasePLEmap.get(Ac.PersonContactId);
                    if((Ac.Initial_test_date__c !=null) || (Ac.Date_of_when_symptoms_onset__c!=null)){ 
                        /*if(Onsetdate!=null && testdate!=null && symptomatic)
                            {
                                if(Onsetdate<testdate)
                                    PLE.EventDate=Onsetdate;
                                else
                                    PLE.EventDate=testdate;
                            }
                        else*/ 
                        if(Ac.Date_of_when_symptoms_onset__c!=null){
                            PLE.EventDate=Onsetdate;
                        }
                        else if(Ac.Initial_test_date__c!=null ){
                            PLE.EventDate=testdate;
                        }
                        if(Ac.Extended_Isolation__c){
                            Date d = PLE.EventDate.date().addDays(PMTCriticalTasks);
                            Time t = PLE.EventDate.time();
                            PLE.ExpirationDate=DateTime.newInstance(d, t);
                        }
                        else if(HCW){
                            Date d = PLE.EventDate.date().addDays(PMTOtherTasks+2);
                            Time t = PLE.EventDate.time();
                            PLE.ExpirationDate=DateTime.newInstance(d, t);
                        }
                        else{
                            Date d = PLE.EventDate.date().addDays(PMTOtherTasks);
                            Time t = PLE.EventDate.time();
                            PLE.ExpirationDate=DateTime.newInstance(d, t);
                        }
                        PLEupdate.add(PLE);
                    }else{
                        PLE.IsExpired=true;
                        PLEupdate.add(PLE);
                    }
                        //PLEdelete.add(PLE);
                }
                //Create new Isolated life event
                else{
                    if((Ac.Initial_test_date__c !=null) || (Ac.Date_of_when_symptoms_onset__c!=null)){
                        PersonLifeevent PLE=new PersonLifeEvent();
                        PLE.name='test';
                        /*if(Onsetdate!=null && testdate!=null && symptomatic)
                            {
                                if(Onsetdate<testdate)
                                    PLE.EventDate=Onsetdate;
                                else
                                    PLE.EventDate=testdate;
                            }
                        else*/ 
                        if(Ac.Date_of_when_symptoms_onset__c!=null){
                            PLE.EventDate=Onsetdate;
                        }
                        else if(Ac.Initial_test_date__c!=null){
                            PLE.EventDate=testdate;
                        }
                        if(Ac.Extended_Isolation__c){
                            Date d = PLE.EventDate.date().addDays(PMTCriticalTasks);
                            Time t = PLE.EventDate.time();
                            PLE.ExpirationDate=DateTime.newInstance(d, t);
                        }
                        else if(HCW){
                            Date d = PLE.EventDate.date().addDays(PMTOtherTasks+2);
                            Time t = PLE.EventDate.time();
                            PLE.ExpirationDate=DateTime.newInstance(d, t);
                        }
                        else{
                            Date d = PLE.EventDate.date().addDays(PMTOtherTasks);
                            Time t = PLE.EventDate.time();
                            PLE.ExpirationDate=DateTime.newInstance(d, t);
                        }
                        PLE.PrimaryPersonId=ac.PersonContactId;
                        PLE.EventType='Isolated';
                        PLEinsert.add(PLE);
                    }
                }
            }
            //If account is a contact
            else{
                //Update existing Isolated event if there is any
                if(CasePLEmap.get(Ac.PersonContactId)!=null)
                {
                    PersonLifeEvent PLE=CasePLEmap.get(Ac.PersonContactId);
                    if(PLE.ExpirationDate>system.now())
                    {
                        PLE.IsExpired=true;
                        PLE.ExpirationDate=system.now();
                        PLEupdate.add(PLE);
                    }
                }
                //Update existing Quarantined Life event
                if(ContactPLEmap.get(Ac.PersonContactId)!=null)
                {
                    PersonLifeEvent PLE=ContactPLEmap.get(Ac.PersonContactId);
                    if(Ac.When_do_you_think_you_were_exposed__c !=null){
                        PLE.EventDate=DateTime.newInstance(ac.When_do_you_think_you_were_exposed__c.year(), ac.When_do_you_think_you_were_exposed__c.month(), ac.When_do_you_think_you_were_exposed__c.day());   
                        //PLE.ExpirationDate=PLE.EventDate.adddays(daystoFollowup -1);
                        Date d = PLE.EventDate.date().addDays(daystoFollowup -1);
                            Time t = PLE.EventDate.time();
                            PLE.ExpirationDate=DateTime.newInstance(d, t);
                    }
                    else if(Ac.Date_of_when_symptoms_onset__c!=null){
                        PLE.EventDate=DateTime.newInstance(ac.Date_of_when_symptoms_onset__c.year(), ac.Date_of_when_symptoms_onset__c.month(), ac.Date_of_when_symptoms_onset__c.day());
                        PLE.ExpirationDate=ac.Date_of_when_symptoms_onset__c.adddays(daystoFollowup -5);
                    }
                    PLEupdate.add(PLE);
                }
                //Create new quarantined life event
                else{
                    if(!ac.Skip_Quarantine__c){
                        PersonLifeevent PLE=new PersonLifeEvent();
                        PLE.name='test';
                        if(Ac.When_do_you_think_you_were_exposed__c !=null){
                            PLE.EventDate=DateTime.newInstance(ac.When_do_you_think_you_were_exposed__c.year(), ac.When_do_you_think_you_were_exposed__c.month(), ac.When_do_you_think_you_were_exposed__c.day());   
                            //PLE.ExpirationDate=PLE.EventDate.adddays(daystoFollowup -1);
                        	Date d = PLE.EventDate.date().addDays(daystoFollowup -1);
                            Time t = PLE.EventDate.time();
                            PLE.ExpirationDate=DateTime.newInstance(d, t);
                        }
                        else if(Ac.Date_of_when_symptoms_onset__c!=null){
                            PLE.EventDate=DateTime.newInstance(ac.Date_of_when_symptoms_onset__c.year(), ac.Date_of_when_symptoms_onset__c.month(), ac.Date_of_when_symptoms_onset__c.day());
                            PLE.ExpirationDate=ac.Date_of_when_symptoms_onset__c.adddays(daystoFollowup -5);
                        }
                        PLE.PrimaryPersonId=ac.PersonContactId;
                        PLE.EventType='Quarantined';
                        PLEinsert.add(PLE);
                    }
                }
            }
        }
        List<bypass_validation__c> bv=[select id,bypass__c from bypass_validation__c];
        if(bv.size()<=0){
            bypass_validation__c bva=new bypass_validation__c();
            bv.add(bva);
        }
        bv[0].bypass__c=true;
        upsert bv[0];
        if(PLEupdate.size()>0)
            //update pleupdate;
            database.update(pleupdate,false);
        if(PLEinsert.size()>0)
            //insert PLEinsert;
            database.insert(PLEInsert,false);
        if(PLEdelete.size()>0)
            //delete PLEdelete;
            database.delete(PLEdelete,false);
        bv[0].bypass__c=false;
        update bv[0];
    }
}