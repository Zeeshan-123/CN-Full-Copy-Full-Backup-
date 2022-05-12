/*--------------------------------------------------------------------------------------------------------------
@Author: Sami Haroon
@Date: Nov/25/2021
@Purpose: This class is used as controller for Community_CAMPCaseApplication aura component.
---------------------------------------------------------------------------------------------------------------*/

public without sharing class Community_CAMPCaseCntrl {
    // custom exception class
    public class CA_Exception extends Exception{}
    //get contact id of user
    private static final Id CONTACT_ID = [Select ContactId from User where Id =: Userinfo.getUserId()].ContactId;
    //get CA RecordTypeId
    private static final Id CA_RECORDTYPEID = utility.getRT(AppConstants.OBJ_CASE,AppConstants.RT_CAMP_Case);
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
    public static Community_ClothingVoucherWrapper validateApplicantEligibility(){
        //initialize wrapper class
        Community_ClothingVoucherWrapper obj;
        Map<String, String> gradeMap = new Map<String, String>();
        Map<String, String> categoryMap = new Map<String, String>();
        Map<String, String> relationMap = new Map<String, String>();
        Map<String, String> HHMRelationMap = new Map<String, String>();
        //get CN Registration account for loggedIn user
        Account accnt = utility.getAccount(CONTACT_ID);
        
      
        //query case Clothing application information, if any
        list<Case> rCase  = [SELECT Id, Request_Reason__c, RRR_Request_Edit_Status__c, CaseNumber, Status  FROM Case
                             WHERE ContactId =: CONTACT_ID and RecordTypeId =: CA_RECORDTYPEID limit 1];
        
        //logged in user had submitted a Clothing Application
        if(rCase.size() > 0) {
            obj 	= 	new Community_ClothingVoucherWrapper(rCase[0]);
        }
        else{
            //    Describe call for grade picklist values
            Schema.DescribeFieldResult fieldResult1 = Case.Grade__c.getDescribe();
            List<Schema.PicklistEntry> picklist1 = fieldResult1.getPicklistValues();
            
            for(Schema.PicklistEntry s : picklist1) {
                gradeMap.put(s.getValue(), s.getLabel());
            }  
            
            //    Describe call for category picklist values
            Schema.DescribeFieldResult fieldResultCategory = CA_Student2__c.Category__c.getDescribe();
            List<Schema.PicklistEntry> picklistCategory = fieldResultCategory.getPicklistValues();
            
            for(Schema.PicklistEntry s : picklistCategory){
                categoryMap.put(s.getValue(), s.getLabel());
            }  
            
            //    Describe call for relation picklist values
            Schema.DescribeFieldResult fieldResultRel = Case.Relation__c.getDescribe();
            List<Schema.PicklistEntry> picklistRel = fieldResultRel.getPicklistValues();
            
            for(Schema.PicklistEntry s : picklistRel) {
                relationMap.put(s.getValue(), s.getLabel());
            } 
            
            //    Describe call for HH Members relation picklist values
            Schema.DescribeFieldResult fieldResultRelHHM = Case.T_Shirt_Size__c.getDescribe();
            List<Schema.PicklistEntry> picklistRelHHM = fieldResultRelHHM.getPicklistValues();
            
            for(Schema.PicklistEntry s : picklistRelHHM) {
                HHMRelationMap.put(s.getValue(), s.getLabel());
            } 
            
            //get picklist values
            Map<String,List<String>> mapOfDependentPL = utility.getPicklistValues('Case', 'Physical_Countries__c', 'Physical_States__c');
            //get state mapping
            Map<string, string> mapOfStates = utility.getStates();            
            obj 	= 	new Community_ClothingVoucherWrapper(accnt, mapOfStates, mapOfDependentPL, gradeMap, categoryMap, relationMap, HHMRelationMap);
        }
         
        return obj;
    }    
    
  
    // create clothing assistance request 
    @AuraEnabled
    public static case saveCARequest(Case CVRequest, List<CA_Student2__c> StudentsList, List<HH_Member__c> HHMembersList,String addressFreeForm, Boolean isManual, Boolean isAddressChanged,
                                     String phyAddressFreeForm, Boolean isPhyAddManual, Boolean isPhyAddressChanged, List<ContentDocument> incomeUploadedFiles, List<ContentDocument> custodyUploadedFiles){
        List<CA_Student2__c> StudentsListToInsert		= 		new List<CA_Student2__c>();
        List<HH_Member__c> HHMembersListToInsert		= 		new List<HH_Member__c>();
        List<ContentDocumentLink> CDCustodyFiles		=		new List<ContentDocumentLink>();
        List<ContentDocumentLink> CDIncomeFiles			=		new List<ContentDocumentLink>();
        User usr  = [SELECT Name, Email, Account.Date_of_Birth__c, Account.FirstName, Account.LastName, Account.Id FROM User where id =: UserInfo.getUserId() limit 1];
        Integer days = usr.Account.Date_of_Birth__c.daysBetween(Date.Today());
        Integer age = Integer.valueOf(days/365);
        
        if(!test.isRunningTest() && age <18 && (String.isBlank(CVRequest.PG_First_Name__c) || String.isBlank(CVRequest.PG_Last_Name__c) || String.isBlank(CVRequest.PG_Mobile_Phone__c))){
                throw new CA_Exception('You must fill all of the Primary Guardian information.');
        }
        else if(!test.isRunningTest() && String.isBlank(CVRequest.Physical_Street__c) || String.isBlank(CVRequest.Physical_City__c) ||  String.isBlank(CVRequest.Physical_Countries__c) || 
                   String.isBlank(CVRequest.Physical_ZipPostal_Code__c ) || String.isBlank(CVRequest.Physical_States__c)) {
                    if(!test.isRunningTest() && String.isBlank(CVRequest.Physical_Street__c))
                                  throw new CA_Exception('Please enter a valid Physical Address Line1.'); 
                    
                        else if(!test.isRunningTest() && String.isBlank(CVRequest.Physical_City__c))
                                  throw new CA_Exception('Please enter a valid Physical City.'); 
                    
                       else if(!test.isRunningTest() && String.isBlank(CVRequest.Physical_ZipPostal_Code__c))
                                  throw new CA_Exception('Please enter a valid Physical Zip Code.');     
                       else
                           	     throw new CA_Exception('Please ensure the address information is complete.');     
          }
           else if(!test.isRunningTest() && (String.isNotBlank(CVRequest.Sec_First_Name__c) || String.isNotBlank(CVRequest.Sec_Last_Name__c) || String.isNotBlank(CVRequest.Sec_Phone__c) || 
                  String.isNotBlank(CVRequest.Relation__c)) && (String.isBlank(CVRequest.Sec_First_Name__c) || String.isBlank(CVRequest.Sec_Last_Name__c) || 
                                                         String.isBlank(CVRequest.Sec_Phone__c) || String.isBlank(CVRequest.Relation__c))){  throw new CA_Exception('You must fill all of the Emergency Contact information.');                                           
        }
       else if( incomeUploadedFiles == null ||  incomeUploadedFiles.size() == 0){   throw new CA_Exception('At least one file must be uploaded to support income mentioned.');    }
        else {
            try{
                // create case record
                Case cse 		=		new Case(RecordTypeId = CA_RECORDTYPEID, Status = 'New', Origin = 'Portal', Priority = 'Medium', Request_Reason__c = 'CASE Camp',
                                                 Primary_Contact_First_Name__c = usr.Account.FirstName, Primary_Contact_Last_Name__c = usr.Account.LastName, 
                                                 Ebt_Mobile_Phone__c = CVRequest.Ebt_Mobile_Phone__c, AccountId = usr.Account.Id, ContactId = CONTACT_ID, Ebt_Email__c = usr.Email,
                                                 Melissa_Address__c = addressFreeForm, Is_Address_Changed__c = isAddressChanged, Is_Manual_Address__c = isManual,
                                                 Physical_Street__c = CVRequest.Physical_Street__c, Physical_City__c = CVRequest.Physical_City__c, Physical_ZipPostal_Code__c = CVRequest.Physical_ZipPostal_Code__c,
                                                 Physical_Countries__c = CVRequest.Physical_Countries__c, Physical_States__c = CVRequest.Physical_States__c, Physical_Suite__c = CVRequest.Physical_Suite__c,
                                                 Physical_IsManual__c = isPhyAddManual, Physical_Melissa_Address__c = phyAddressFreeForm, Is_Physical_Address_Changed__c = isPhyAddressChanged, Physical_Address2__c = CVRequest.Physical_Address2__c,
                                                 Sec_First_Name__c = CVRequest.Sec_First_Name__c, Sec_Last_Name__c = CVRequest.Sec_Last_Name__c, Sec_Phone__c = CVRequest.Sec_Phone__c,
                                                 Relation__c = CVRequest.Relation__c, PG_First_Name__c = CVRequest.PG_First_Name__c, PG_Last_Name__c = CVRequest.PG_Last_Name__c,
                                                 PG_Mobile_Phone__c = CVRequest.PG_Mobile_Phone__c,High_School__c = CVRequest.High_School__c,Grade__c = CVRequest.Grade__c,Services_roles_titles__c = CVRequest.Services_roles_titles__c,
                                                 GPA__c = CVRequest.GPA__c,List_of_current_medical_issues__c = CVRequest.List_of_current_medical_issues__c,T_Shirt_Size__c = CVRequest.T_Shirt_Size__c,PG_Email__c= CVRequest.PG_Email__c,
                                                 List_of_current_medications__c = CVRequest.List_of_current_medications__c,College_Career_Goal_Statement__c = CVRequest.College_Career_Goal_Statement__c);
                insert cse;
                
                //query inserted case to get case number
                Case userCase = [SELECT Id, CaseNumber FROM Case WHERE Id =: cse.Id limit 1];
                //insert CA Students
                
                //Insert Content Document Link for Custody Files If Any
                if(custodyUploadedFiles != null && custodyUploadedFiles.size() > 0){
                    for(ContentDocument custodyFiles : custodyUploadedFiles){   
                        ContentDocumentLink CDLink=new ContentDocumentLink();
                        CDLink.ContentDocumentId=custodyFiles.Id;
                        CDLink.LinkedEntityId=cse.Id;
                        CDCustodyFiles.add(CDLink);
                    }   
                    insert CDCustodyFiles;
                }
                
                for(ContentDocument incomeFiles : incomeUploadedFiles){   
                    ContentDocumentLink CDLink=new ContentDocumentLink();
                    CDLink.ContentDocumentId=incomeFiles.Id;
                    CDLink.LinkedEntityId=cse.Id;
                    CDIncomeFiles.add(CDLink);
                }   
                insert CDIncomeFiles;
                
                return userCase;
            }
            catch(Exception ex){
                // Throw an AuraHandledException
                throw new AuraHandledException(ex.getMessage());  
                               }
        }
        
       
    } 
    
    // to delete files
    @AuraEnabled
    public static void RemoveFile(List<string> fileIds)   {
        system.debug('Begin delete');
        List<ContentDocument> contentDocumentToDelete = [Select Id From ContentDocument Where Id in: fileIds];
        if(contentDocumentToDelete != null && contentDocumentToDelete.size() > 0)
        {
            try{
                delete contentDocumentToDelete;
            }catch(Exception ex){
                // Throw an AuraHandledException
               throw new AuraHandledException(ex.getMessage());  
            }	
        }
    }
    
}