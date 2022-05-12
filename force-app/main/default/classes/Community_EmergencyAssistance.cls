/*--------------------------------------------------------------------------------------------------------------
@Author: Ariella
@Date: Jan/17/2021
@Purpose: This class is used as controller for Community_HousingStipend aura component.
---------------------------------------------------------------------------------------------------------------*/

public without sharing class Community_EmergencyAssistance {
    // custom exception class
    public class CA_Exception extends Exception{}
    //get contact id of user
    private static final Id CONTACT_ID = [Select ContactId from User where Id =: Userinfo.getUserId()].ContactId;
    //get CA RecordTypeId
    private static final Id EA_RT = utility.getRT(AppConstants.OBJ_CASE,AppConstants.RT_EA);
    //get CN Registration RecordTypeId
    private static final Id CNREG_RECORDTYPEID = utility.getRT(AppConstants.OBJ_ACCOUNT,AppConstants.RT_CNREGISTRATION);
    //get CA2(HH Member) RecordTypeId
    private static final Id CA_HH_MEMBER_RECORDTYPEID = utility.getRT(AppConstants.OBJ_HH_MEMBER,AppConstants.RT_HH_MEMEBER_CA);
    //get CA2(HH Member) RecordTypeId
    private static final Id CA_STUDENT_RECORDTYPEID = utility.getRT(AppConstants.OBJ_CA_STUDENT2,AppConstants.RT_CA_STUDENT2_CA2);
    
    //Call Melissa Data API
    @AuraEnabled
    public static String getMelissaAddresses(String input, String country){
        return MelissaDataController.SendRequest(input, country);
    }
    
    // get  case information
    @AuraEnabled 
    public static Community_EmergencyAssistanceWrapper getInfo(){
        //initialize wrapper class
        Community_EmergencyAssistanceWrapper obj;
        
        Map<String, String> eventMap = new Map<String, String>();
        Map<String, String> relationshipMap = new Map<string, String>();
        Map<String, String> employedMap = new Map<string, String>();
        Map<String, String> insuranceMap = new Map<string, String>();
        
        //get CN Registration account for loggedIn user
        Account accnt = utility.getAccount(CONTACT_ID);
        system.debug('Account: ' + accnt.Date_Of_Birth__c);
        //query case Clothing application information, if any
        list<Case> rCase  = [SELECT Id, Request_Reason__c, RRR_Request_Edit_Status__c, CaseNumber, Status, Scholarship_Application__c, Student_type__c, Degree__c  FROM Case
                             WHERE ContactId =: CONTACT_ID and RecordTypeId =: EA_RT limit 1];
        
        //logged in user had submitted a Clothing Application
        
        
        //    Describe call for event picklist values
        Schema.DescribeFieldResult eventList = Case.Event__c.getDescribe();
        List<Schema.PicklistEntry> eventPicklist = eventList.getPicklistValues();
        
        for(Schema.PicklistEntry s : eventPicklist) {
            eventMap.put(s.getValue(), s.getLabel());
        }  
        
        //    Describe call for Sub Applicant Relationship picklist values
        Schema.DescribeFieldResult relationshipList = Sub_Applicant__c.Relationship__c.getDescribe();
        List<Schema.PicklistEntry> relationshipPicklist = relationshipList.getPicklistValues();
        
        for(Schema.PicklistEntry s : relationshipPicklist) {
            relationshipMap.put(s.getValue(), s.getLabel());
        }  
        
        //    Describe call for Sub Applicant Relationship picklist values
        Schema.DescribeFieldResult employedList = Case.Are_You_Employed__c.getDescribe();
        List<Schema.PicklistEntry> employedPicklist = employedList.getPicklistValues();
        
        for(Schema.PicklistEntry s : employedPicklist) {
            employedMap.put(s.getValue(), s.getLabel());
        }  
        
         //    Describe call for Sub Applicant Relationship picklist values
        Schema.DescribeFieldResult insuranceList = Case.Do_you_have_home_owner_s_insurance__c.getDescribe();
        List<Schema.PicklistEntry> insurancePicklist = insuranceList.getPicklistValues();
        
        for(Schema.PicklistEntry s : insurancePicklist) {
            insuranceMap.put(s.getValue(), s.getLabel());
        }  
        
        
        //get picklist values
        Map<String,List<String>> mapOfDependentPL = utility.getPicklistValues('Case', 'Physical_Countries__c', 'Physical_States__c');
        system.debug('Map of Dependent'  + mapOfDependentPL);
        //get state mapping
        Map<string, string> mapOfStates = utility.getStates();            
        obj     =   new Community_EmergencyAssistanceWrapper(accnt, mapOfStates, mapOfDependentPL, eventMap, relationshipMap, employedMap);
        
        
        return obj;
    }    
    
    //validate legit students
    @AuraEnabled
    public static Community_ClothingAssistanceWrapper validateStudentsList(List<Sub_Applicant__c> HHMembersCitizen)
    {
        system.debug('StudentsList::' +HHMembersCitizen);
        Map<String, Date> StudentsMap					  =		new Map<String, Date>();
        Map<String, Date> accMap						  = 		new Map<String, Date>();
        List<String> InvalidCitizenIdsList				  = 		new List<String>();
        List<String> ValidCitizenIdsList				  = 		new List<String>();
        List<Sub_Applicant__c> existingStudentsOnCA       = 		new List<Sub_Applicant__c>();
        List<Account> accntsWithDoDNotNull				  = 		new List<Account>();
        List<Account> RelinquishedAccounts				  = 		new List<Account>();
        List<Account> legitAccountsList					  = 		new List<Account>();
        Id cn_RecTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('CN_Registration').getRecordTypeId();
        system.debug('StudentsList::' +HHMembersCitizen);
        //initialize wrapper class
        Community_ClothingAssistanceWrapper obj = 		new Community_ClothingAssistanceWrapper();
        obj.InvalidCitizenIds					= 		new list<String>();
        obj.CitizenIdsOfAccntsWithDoDNN			= 		new list<String>();
        obj.CitizenIdsOfRelinquishedAccounts	= 		new list<String>();
        obj.accList								=		new List<Account>();
        
        // check for valid/invalid citizen ids   
        if(HHMembersCitizen != null && HHMembersCitizen.size() > 0)
        {
            for(Sub_Applicant__c StudentsIn : HHMembersCitizen)
            {   
                StudentsMap.put(StudentsIn.Citizen_ID__c, StudentsIn.Date_of_Birth__c); 
            }
            
            if (StudentsMap != null && StudentsMap.size() > 0)
            {                
                //get legit accounts on basis of citizen id
                for(Account ac : [SELECT Id, FirstName, LastName, Name, Tribe_Id__c, Date_of_Birth__c, DOD__c, HealthCloudGA__Gender__pc FROM Account
                                  WHERE Tribe_Id__c IN : StudentsMap.keySet() AND RecordTypeId = :cn_RecTypeId])
                {
                    accMap.put(ac.Tribe_Id__c, ac.Date_of_Birth__c);
                    legitAccountsList.add(ac);
                }
            }
        }
        
        if (StudentsMap != null && StudentsMap.size() > 0)
        {
            //iterate through map
            for(String v : StudentsMap.keySet())
            {
                //when citizen id is valid
                if(accMap.containskey(v))
                {
                    system.debug('AKK have acc id');
                    // when citizen id is valid but date of birth is incorrect
                    if(accMap.get(v) != StudentsMap.get(v))
                    {
                        InvalidCitizenIdsList.add(v);
                    }
                    // when citizen id and date of birth both are correct
                    else
                    {
                        ValidCitizenIdsList.add(v);
                    }
                }
                // when citizen id invalid.
                else
                {
                    InvalidCitizenIdsList.add(v);
                }
            }
        }
        
        if (InvalidCitizenIdsList != null && InvalidCitizenIdsList.size() > 0)
        {
            obj.InvalidCitizenIds = InvalidCitizenIdsList;
        }
        // end check for valid/invalid citizen ids 
        
        if (ValidCitizenIdsList != null && ValidCitizenIdsList.size() > 0)
        {
            //query account to check DOD
            accntsWithDoDNotNull		=	[SELECT Id, Name, Tribe_Id__c, Date_of_Birth__c, DOD__c FROM Account 
                                             WHERE Tribe_Id__c IN : ValidCitizenIdsList AND DOD__c != null AND RecordTypeId = :cn_RecTypeId];
            
            //query account to check if citizenship is relinquished 
            RelinquishedAccounts		=	[SELECT Id, Tribe_Id__c, If_CN_Citizen__c FROM Account 
                                             WHERE Tribe_Id__c IN : ValidCitizenIdsList AND RecordTypeId = :cn_RecTypeId AND (If_CN_Citizen__c = 'No' OR Is_Void__c = 'Yes') ];	
        }
        
        // get citizen ids of accounts DOD field is not null
        if (accntsWithDoDNotNull != null && accntsWithDoDNotNull.size() > 0)
        {
            for(Account ac : accntsWithDoDNotNull)
            {
                obj.CitizenIdsOfAccntsWithDoDNN.add(ac.Tribe_Id__c);
            }
        }
        
        // get citizen ids of Relinquished Accounts
        if (RelinquishedAccounts != null && RelinquishedAccounts.size() > 0)
        {
            for(Account ac : RelinquishedAccounts)
            {
                obj.CitizenIdsOfRelinquishedAccounts.add(ac.Tribe_Id__c);
            }
        }
        
        if (StudentsMap != null && StudentsMap.size() > 0)
        {
            if(obj.InvalidCitizenIds.size() == 0  &&  obj.CitizenIdsOfAccntsWithDoDNN.size() == 0 && obj.CitizenIdsOfRelinquishedAccounts.size() == 0 )
            {
                obj.accList	=	legitAccountsList;
            }
        }
        return obj;
    } 
    
    // create clothing assistance request 
    @AuraEnabled
    public static case saveCARequest(Case CVRequest, Account accnt, String addressFreeForm, String physAddressFreeForm, Boolean isManual, Boolean isPAManual, Boolean isAddressChanged, Boolean isPhyAddressChanged, List<Sub_Applicant__c> citizens, List<Sub_Applicant__c> noncitizens
                                    ){
                                        User usr  = [SELECT Name, Email, Account.Date_of_Birth__c, Account.FirstName, Account.LastName, Account.Id FROM User where id =: UserInfo.getUserId() limit 1];
                                        Integer days = usr.Account.Date_of_Birth__c.daysBetween(Date.Today());
                                        Integer age = Integer.valueOf(days/365);
                                        List<ContentDocumentLink> CDIncomeFiles			=		new List<ContentDocumentLink>();
                                        
                                        /*if(!test.isRunningTest() && age <18 && (String.isBlank(CVRequest.PG_First_Name__c) || String.isBlank(CVRequest.PG_Last_Name__c) || String.isBlank(CVRequest.PG_Mobile_Phone__c))){
throw new CA_Exception('You must fill all of the Primary Guardian information.');
}*/
                                        if(!test.isRunningTest() && String.isBlank(CVRequest.Mailing_Street__c) || String.isBlank(CVRequest.Mailing_City__c) || 
                                           String.isBlank(CVRequest.Mailing_Countries__c) || String.isBlank(CVRequest.Mailing_ZipPostal_Code__c) || (CVRequest.Mailing_Countries__c == 'United States' &&
                                                                                                                                                     String.isBlank(CVRequest.Mailing_States__c)) || (CVRequest.Mailing_Countries__c != 'United States' &&  String.isBlank(CVRequest.Other_Mailing_State__c))){
                                                                                                                                                         if(!test.isRunningTest() && String.isBlank(CVRequest.Mailing_Street__c)){
                                                                                                                                                             throw new CA_Exception('Please enter a valid Address Line1.'); 
                                                                                                                                                         } else if(!test.isRunningTest() && String.isBlank(CVRequest.Mailing_City__c)){
                                                                                                                                                             throw new CA_Exception('Please enter a valid City.'); 
                                                                                                                                                         } else if(!test.isRunningTest() && String.isBlank(CVRequest.Mailing_Countries__c)){
                                                                                                                                                             throw new CA_Exception('Please select a valid Country.'); 
                                                                                                                                                         } else if(!test.isRunningTest() && String.isBlank(CVRequest.Mailing_ZipPostal_Code__c)){
                                                                                                                                                             throw new CA_Exception('Please enter a valid Zip Code.'); 
                                                                                                                                                         } else if(!test.isRunningTest() && CVRequest.Mailing_Countries__c == 'United States' &&
                                                                                                                                                                   String.isBlank(CVRequest.Mailing_States__c)){
                                                                                                                                                                       throw new CA_Exception('Please select a valid State.'); 
                                                                                                                                                                   }   else if(!test.isRunningTest() && CVRequest.Mailing_Countries__c != 'United States' &&
                                                                                                                                                                               String.isBlank(CVRequest.Other_Mailing_State__c)){
                                                                                                                                                                                   throw new CA_Exception('Please enter a valid Other State.'); 
                                                                                                                                                                               }  else{
                                                                                                                                                                                   throw new CA_Exception('Please ensure the address information is complete.');
                                                                                                                                                                               }
                                                                                                                                                     } 
                                        
                                        
                                        /* else if(!test.isRunningTest() && (String.isNotBlank(CVRequest.Sec_First_Name__c) || String.isNotBlank(CVRequest.Sec_Last_Name__c) || String.isNotBlank(CVRequest.Sec_Phone__c) || 
String.isNotBlank(CVRequest.Relation__c)) && (String.isBlank(CVRequest.Sec_First_Name__c) || String.isBlank(CVRequest.Sec_Last_Name__c) || 
String.isBlank(CVRequest.Sec_Phone__c) || String.isBlank(CVRequest.Relation__c))){  throw new CA_Exception('You must fill all of the Alternate Contact information.');                                           
}*/
                                        
                                        // try{
                                        // create case record
                                        Case cse        =       new Case(RecordTypeId = EA_RT, Status = 'New', Origin = 'Portal', Priority = 'Medium', Event__c = CVRequest.Event__c, Request_Reason__c = 'Emergency Assistance',
                                                                         Primary_Contact_First_Name__c = usr.Account.FirstName, Primary_Contact_Last_Name__c = usr.Account.LastName, 
                                                                         Ebt_Mobile_Phone__c = CVRequest.Ebt_Mobile_Phone__c, AccountId = usr.Account.Id, ContactId = CONTACT_ID, Ebt_Email__c = usr.Email,
                                                                         Mailing_Street__c = CVRequest.Mailing_Street__c, mailing_address2__c = CVRequest.mailing_address2__c,
                                                                         mailing_suite__c = CVRequest.mailing_suite__c, Mailing_City__c = CVRequest.Mailing_City__c, 
                                                                         Mailing_ZipPostal_Code__c = CVRequest.Mailing_ZipPostal_Code__c, Mailing_Countries__c = CVRequest.Mailing_Countries__c,
                                                                         Mailing_States__c = CVRequest.Mailing_States__c, Other_Mailing_State__c = CVRequest.Other_Mailing_State__c,
                                                                         Melissa_Address__c = addressFreeForm, Physical_Melissa_Address__c = physAddressFreeForm, Is_Address_Changed__c = isAddressChanged, Is_Manual_Address__c = isManual, Physical_IsManual__c = isPAManual,
                                                                         Physical_Street__c = CVRequest.Physical_Street__c, Physical_City__c = CVRequest.Physical_City__c, Physical_States__c = CVRequest.Physical_States__c, 
                                                                         Other_Physical_State__c = CVRequest.Other_Physical_State__c, Physical_ZipPostal_Code__c = CVRequest.Physical_ZipPostal_Code__c, Physical_Country__c = CVRequest.Physical_Country__c, 
                                                                         Physical_Suite__c = CVRequest.Physical_Suite__c, Physical_Address2__c = CVRequest.Physical_Address2__c, 
                                                                         Impact_of_Storm__c = CVRequest.Impact_of_Storm__c, Additional_info_COVID19_Impact__c  = CVRequest.Additional_info_COVID19_Impact__c, Is_Physical_Address_Changed__c = isPhyAddressChanged
                                                                        );
                                        
                                        
                                        
                                        
                                        
                                        insert cse;
                                        
                                        
                                        system.debug('Case created');
                                        
                                        
                                        Id SubApplicantRecordTypeId = Schema.SObjectType.Sub_Applicant__c.getRecordTypeInfosByDeveloperName().get('Emergency_Assistance').getRecordTypeId();
                                        List<Sub_Applicant__c> createSubApplicants = new List<Sub_Applicant__c>();
                                        
                                        List<Sub_Applicant__c> subApps = new List<Sub_Applicant__c>(); 
                                        subApps.addAll(citizens);
                                        subApps.addAll(noncitizens);
                                        system.debug(citizens);
                                        system.debug(noncitizens);
                                        If(subApps.Size() > 0  && subApps!=null){
                                            for(Sub_Applicant__c subApp : subApps)
                                            {    
                                                Sub_Applicant__c newSubApp =new Sub_Applicant__c();
                                                newSubApp.Request__c	=	cse.Id;
                                                //stu.Account__c=student.Account__c;
                                               system.debug('Account?' + subApp.Account__c);
                                                   newSubApp.Account__c = subApp.Account__c;
                                               
                                                newSubApp.Citizen_ID__c = subApp.Citizen_ID__c;
                                                newSubApp.Date_of_Birth__c = subApp.Date_of_Birth__c;
                                                newSubApp.First_Name_Text__c = subApp.First_Name_Text__c; 
                                                newSubApp.Last_Name_Text__c = subApp.Last_Name_Text__c; 
                                                newSubApp.RecordTypeId = SubApplicantRecordTypeId;
                                                createSubApplicants.add(newSubApp);
                                            }
                                            
                                            insert createSubApplicants;
                                        }
                                        
                                        
                                        
                                        
                                        
                                        
                                        
                                        
                                        //query inserted case to get case number
                                        Case userCase = [SELECT Id, CaseNumber, Student_Type__c, Degree__c, Scholarship_Application__c FROM Case WHERE Id =: cse.Id limit 1];
                                        
                                        
                                        
                                        
                                        
                                        
                                        
                                        return userCase;
                                        /* }
catch(Exception ex){
// Throw an AuraHandledException
throw new AuraHandledException(ex.getMessage());  
}*/
                                        
                                        
                                        
                                    }
    
     public class CaseDetailWrapper {
        @AuraEnabled
        public CASE CVCase {get; set;}
        @AuraEnabled
        public List<Sub_Applicant__c> Sub_ApplicantList {get; set;}
        
    }
    // get  case information
    @AuraEnabled 
    public static CaseDetailWrapper CaseDetails(string recordId)
    {
        system.debug(recordId);
        //get user id
        String UserId=UserInfo.getUserId();
        
        //get contact id against user id
        String contactId=utility.getUserContactId(UserId); 
        
        Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Emergency_Assistance').getRecordTypeId();
        list<Case> rCase = new list<Case>();
        list<Sub_Applicant__c> Sub_Applicant=new list<Sub_Applicant__c>();
        //initialize wrapper class
        CaseDetailWrapper obj1 =new CaseDetailWrapper();
        
        if(recordId!='' || recordId!=null){
            rCase  = [SELECT Id, CaseNumber, Status,Origin,Priority,Citizen_ID__c,Account_DOB__c,Primary_Contact_First_Name__c,Primary_Contact_Last_Name__c,Ebt_Mobile_Phone__c				
                      ,AccountId,ContactId,Mailing_Street__c,Mailing_City__c,Mailing_ZipPostal_Code__c,Mailing_Countries__c,Mailing_States__c				
                      ,Other_Mailing_State__c,Physical_Street__c,Physical_City__c,Physical_ZipPostal_Code__c,Physical_Countries__c,Physical_States__c				
                      ,Other_Physical_State__c,Ebt_Email__c,mailing_suite__c,mailing_address2__c,physical_suite__c,physical_address2__c,Melissa_Address__c,Is_Address_Changed__c					
                      ,Is_Manual_Address__c, Impact_of_Storm__c, Additional_info_COVID19_Impact__c, Event__c
                      
                      
                      FROM Case
                      WHERE Id =: recordId limit 1];
            
            if(rCase != null && rCase.size() > 0)
            {
                obj1.CVCase =rCase[0];
            }else{
                obj1.CVCase=null;
            }
            
            system.debug(rCase[0].Event__c);
            
            Sub_Applicant =[SELECT Id, Name, Citizen_ID__c, Account__c, First_Name_Text__c, First_Name__c, Last_Name_Text__c, Last_Name__c, Request__c, Date_of_Birth__c FROM Sub_Applicant__c
                            Where Request__c =: rCase[0].Id]; 
            if(Sub_Applicant != null && Sub_Applicant.size() > 0)
            {
                obj1.Sub_ApplicantList =Sub_Applicant;
            }else{
                obj1.Sub_ApplicantList=null;
            }
            
            
        }
        
       
        return obj1;   
    }
    
    
    
    
    
    
}