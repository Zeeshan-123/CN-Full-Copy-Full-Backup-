/*--------------------------------------------------------------------------------------------------------------
@Author: Ariella
@Date: Jan/17/2021
@Purpose: This class is used as controller for Community_HousingStipend aura component.
---------------------------------------------------------------------------------------------------------------*/

public without sharing class Community_ScholarshipApplication {
    // custom exception class
    public class CA_Exception extends Exception{}
    //get contact id of user
    private static final Id CONTACT_ID = [Select ContactId from User where Id =: Userinfo.getUserId()].ContactId;
    //get CA RecordTypeId
    private static final Id SCHOLARSHIP_RT = utility.getRT(AppConstants.OBJ_CASE,AppConstants.RT_SCHOLARSHIP);
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
    public static Community_ScholarshipApplicationWrapper getInfo(){
        //initialize wrapper class
        Community_ScholarshipApplicationWrapper obj;
        Map<String, String> genderMap = new Map<String, String>();
        Map<String, String> maritalMap = new Map<String, String>();
        Map<String, String> tribeMap = new Map<String, String>();
        Map<String, String> districtMap = new Map<String, String>();
        Map<String, String> semesterMap = new Map<String, String>();
        Map<String, String> classificationMap = new Map<String, String>();
        Map<String, String> monthMap = new Map<String, String>();
        Map<String, String> fieldofStudyMap = new Map<String, String>();
         Map<String, String> degreeMap = new Map<String, String>();
        Map<String, String> studentTypeMap = new Map<String, String>();
        Map<String, String> applicationTypeMap = new Map<String, String>();
                Map<String, String> relationMap = new Map<String, String>();
        Map<String, String> countyMap = new Map<String, String>();


        
        //get CN Registration account for loggedIn user
        Account accnt = utility.getAccount(CONTACT_ID);
        system.debug('Account: ' + accnt.Date_Of_Birth__c);
        //query case Clothing application information, if any
        list<Case> rCase  = [SELECT Id, Request_Reason__c, RRR_Request_Edit_Status__c, CaseNumber, Status, Scholarship_Application__c, Student_type__c, Degree__c  FROM Case
                             WHERE ContactId =: CONTACT_ID and RecordTypeId =: SCHOLARSHIP_RT limit 2];
        
        //logged in user had submitted a Clothing Application
        if(rCase.size() > 0) {
            //    Describe call for gender picklist values
            Schema.DescribeFieldResult fieldResult1 = Account.Gender__c.getDescribe();
            List<Schema.PicklistEntry> picklist1 = fieldResult1.getPicklistValues();
            
            for(Schema.PicklistEntry s : picklist1) {
                genderMap.put(s.getValue(), s.getLabel());
            }  
            
            //    Describe call for relationship picklist values
            Schema.DescribeFieldResult relationResult = Case.Relation__c.getDescribe();
            List<Schema.PicklistEntry> picklistRelation = relationResult.getPicklistValues();
            
            for(Schema.PicklistEntry s : picklistRelation) {
                relationMap.put(s.getValue(), s.getLabel());
            }  
            
           	relationMap.remove('Child/Dependent');
            relationMap.remove('Grandchild');
            //    Describe call for gender picklist values
            Schema.DescribeFieldResult maritalResult = Case.Marital_Status__c.getDescribe();
            List<Schema.PicklistEntry> picklistMarital = maritalResult.getPicklistValues();
            
            for(Schema.PicklistEntry s : picklistMarital) {
                maritalMap.put(s.getValue(), s.getLabel());
            }  
            
            
            
            
            //    Describe call for relation picklist values
            Schema.DescribeFieldResult tribeResult = Account.Tribe__c.getDescribe();
            List<Schema.PicklistEntry> picklistTribe = tribeResult.getPicklistValues();
            
            for(Schema.PicklistEntry s : picklistTribe) {
                tribeMap.put(s.getValue(), s.getLabel());
            } 
            
            
            //    Describe call for District picklist values
            Schema.DescribeFieldResult districtResult = Case.Council_District__c.getDescribe();
            List<Schema.PicklistEntry> picklistDistrict = districtResult.getPicklistValues();
            
            for(Schema.PicklistEntry s : picklistDistrict) {
                districtMap.put(s.getValue(), s.getLabel());
            } 
            
            //    Describe call for Semester picklist values
            Schema.DescribeFieldResult semesterResult = Case.Semester__c.getDescribe();
            List<Schema.PicklistEntry> picklistSemester = semesterResult.getPicklistValues();
            
            for(Schema.PicklistEntry s : picklistSemester) {
                semesterMap.put(s.getValue(), s.getLabel());
            } 
            
            semesterMap.remove('Class');
            
            //    Describe call for Student Classification picklist values
            Schema.DescribeFieldResult classificationResult = Case.Student_Classification__c.getDescribe();
            List<Schema.PicklistEntry> picklistClassification = classificationResult.getPicklistValues();
            
            for(Schema.PicklistEntry s : picklistClassification) {
                classificationMap.put(s.getValue(), s.getLabel());
            } 
            
            //    Describe call for Expected Graduation Month picklist values
            Schema.DescribeFieldResult monthResult = Case.Expected_College_Graduation_Month__c.getDescribe();
            List<Schema.PicklistEntry> picklistMonth = monthResult.getPicklistValues();
            
            for(Schema.PicklistEntry s : picklistMonth) {
                monthMap.put(s.getValue(), s.getLabel());
            } 
            
             //    Describe call for Expected Graduation Month picklist values
            Schema.DescribeFieldResult fieldofStudyResult = Case.Background_Field_of_Study__c.getDescribe();
            List<Schema.PicklistEntry> picklistFieldofStudy = fieldofStudyResult.getPicklistValues();
            
            for(Schema.PicklistEntry s : picklistFieldofStudy) {
                fieldofStudyMap.put(s.getValue(), s.getLabel());
            } 
            
            //    Describe call for Degree picklist values
            Schema.DescribeFieldResult degreeResult = Case.Degree__c.getDescribe();
            List<Schema.PicklistEntry> picklistDegree = degreeResult.getPicklistValues();
            
            for(Schema.PicklistEntry s : picklistDegree) {
                degreeMap.put(s.getValue(), s.getLabel());
            } 
            
            //    Describe call for Student Type picklist values
            Schema.DescribeFieldResult studentTypeResult = Case.Student_Type__c.getDescribe();
            List<Schema.PicklistEntry> picklistStudentType = studentTypeResult.getPicklistValues();
            
            for(Schema.PicklistEntry s : picklistStudentType) {
                studentTypeMap.put(s.getValue(), s.getLabel());
            } 
            
            //    Describe call for Application Type picklist values
            Schema.DescribeFieldResult applicationTypeResult = Case.Scholarship_Application__c.getDescribe();
            List<Schema.PicklistEntry> picklistApplicationType = applicationTypeResult.getPicklistValues();
            
            for(Schema.PicklistEntry s : picklistApplicationType) {
                applicationTypeMap.put(s.getValue(), s.getLabel());
            } 
            
             //    Describe call for County picklist values
            Schema.DescribeFieldResult countyResult = Case.County__c.getDescribe();
            List<Schema.PicklistEntry> picklistCounty = countyResult.getPicklistValues();
            
            for(Schema.PicklistEntry s : picklistCounty) {
                countyMap.put(s.getValue(), s.getLabel());
            } 
            
            //get picklist values
            Map<String,List<String>> mapOfDependentPL = utility.getPicklistValues('Case', 'Physical_Countries__c', 'Physical_States__c');
            system.debug('Map of Dependent'  + mapOfDependentPL);
            //get state mapping
            Map<string, string> mapOfStates = utility.getStates();            
            obj     =   new Community_ScholarshipApplicationWrapper(rCase, accnt, mapOfStates, mapOfDependentPL, genderMap, maritalMap, tribeMap, districtMap, semesterMap, classificationMap, monthMap, fieldofStudyMap, degreeMap, studentTypeMap, applicationTypeMap, relationMap, countyMap);
        }
        else{
            //    Describe call for gender picklist values
            Schema.DescribeFieldResult fieldResult1 = Account.Gender__c.getDescribe();
            List<Schema.PicklistEntry> picklist1 = fieldResult1.getPicklistValues();
            
            for(Schema.PicklistEntry s : picklist1) {
                genderMap.put(s.getValue(), s.getLabel());
            }  
            
            //    Describe call for relationship picklist values
            Schema.DescribeFieldResult relationResult = Case.Relation__c.getDescribe();
            List<Schema.PicklistEntry> picklistRelation = relationResult.getPicklistValues();
            
            for(Schema.PicklistEntry s : picklistRelation) {
                relationMap.put(s.getValue(), s.getLabel());
            }  
            
           	relationMap.remove('Child/Dependent');
            relationMap.remove('Grandchild');
            //    Describe call for gender picklist values
            Schema.DescribeFieldResult maritalResult = Case.Marital_Status__c.getDescribe();
            List<Schema.PicklistEntry> picklistMarital = maritalResult.getPicklistValues();
            
            for(Schema.PicklistEntry s : picklistMarital) {
                maritalMap.put(s.getValue(), s.getLabel());
            }  
            
            
            
            
            //    Describe call for relation picklist values
            Schema.DescribeFieldResult tribeResult = Account.Tribe__c.getDescribe();
            List<Schema.PicklistEntry> picklistTribe = tribeResult.getPicklistValues();
            
            for(Schema.PicklistEntry s : picklistTribe) {
                tribeMap.put(s.getValue(), s.getLabel());
            } 
            
            
            //    Describe call for District picklist values
            Schema.DescribeFieldResult districtResult = Case.Council_District__c.getDescribe();
            List<Schema.PicklistEntry> picklistDistrict = districtResult.getPicklistValues();
            
            for(Schema.PicklistEntry s : picklistDistrict) {
                districtMap.put(s.getValue(), s.getLabel());
            } 
            
            //    Describe call for Semester picklist values
            Schema.DescribeFieldResult semesterResult = Case.Semester__c.getDescribe();
            List<Schema.PicklistEntry> picklistSemester = semesterResult.getPicklistValues();
            
            for(Schema.PicklistEntry s : picklistSemester) {
                semesterMap.put(s.getValue(), s.getLabel());
            } 
            semesterMap.remove('Class');
            
            //    Describe call for Student Classification picklist values
            Schema.DescribeFieldResult classificationResult = Case.Student_Classification__c.getDescribe();
            List<Schema.PicklistEntry> picklistClassification = classificationResult.getPicklistValues();
            
            for(Schema.PicklistEntry s : picklistClassification) {
                classificationMap.put(s.getValue(), s.getLabel());
            } 
            
            //    Describe call for Expected Graduation Month picklist values
            Schema.DescribeFieldResult monthResult = Case.Expected_College_Graduation_Month__c.getDescribe();
            List<Schema.PicklistEntry> picklistMonth = monthResult.getPicklistValues();
            
            for(Schema.PicklistEntry s : picklistMonth) {
                monthMap.put(s.getValue(), s.getLabel());
            } 
            
             //    Describe call for Expected Graduation Month picklist values
            Schema.DescribeFieldResult fieldofStudyResult = Case.Background_Field_of_Study__c.getDescribe();
            List<Schema.PicklistEntry> picklistFieldofStudy = fieldofStudyResult.getPicklistValues();
            
            for(Schema.PicklistEntry s : picklistFieldofStudy) {
                fieldofStudyMap.put(s.getValue(), s.getLabel());
            } 
            
            //    Describe call for Degree picklist values
            Schema.DescribeFieldResult degreeResult = Case.Degree__c.getDescribe();
            List<Schema.PicklistEntry> picklistDegree = degreeResult.getPicklistValues();
            
            for(Schema.PicklistEntry s : picklistDegree) {
                degreeMap.put(s.getValue(), s.getLabel());
            } 
            
            //    Describe call for Student Type picklist values
            Schema.DescribeFieldResult studentTypeResult = Case.Student_Type__c.getDescribe();
            List<Schema.PicklistEntry> picklistStudentType = studentTypeResult.getPicklistValues();
            
            for(Schema.PicklistEntry s : picklistStudentType) {
                studentTypeMap.put(s.getValue(), s.getLabel());
            } 
            
            //    Describe call for Application Type picklist values
            Schema.DescribeFieldResult applicationTypeResult = Case.Scholarship_Application__c.getDescribe();
            List<Schema.PicklistEntry> picklistApplicationType = applicationTypeResult.getPicklistValues();
            
            for(Schema.PicklistEntry s : picklistApplicationType) {
                applicationTypeMap.put(s.getValue(), s.getLabel());
            } 
            
             //    Describe call for County picklist values
            Schema.DescribeFieldResult countyResult = Case.County__c.getDescribe();
            List<Schema.PicklistEntry> picklistCounty = countyResult.getPicklistValues();
            
            for(Schema.PicklistEntry s : picklistCounty) {
                countyMap.put(s.getValue(), s.getLabel());
            } 
            
            //get picklist values
            Map<String,List<String>> mapOfDependentPL = utility.getPicklistValues('Case', 'Physical_Countries__c', 'Physical_States__c');
            system.debug('Map of Dependent'  + mapOfDependentPL);
            //get state mapping
            Map<string, string> mapOfStates = utility.getStates();            
            obj     =   new Community_ScholarshipApplicationWrapper(accnt, mapOfStates, mapOfDependentPL, genderMap, maritalMap, tribeMap, districtMap, semesterMap, classificationMap, monthMap, fieldofStudyMap, degreeMap, studentTypeMap, applicationTypeMap, relationMap, countyMap);
        }
       
        return obj;
    }    
    
    //validate legit students
    @AuraEnabled
    public static Community_ClothingVoucherWrapper validateStudentsList(List<CA_Student2__c> StudentsList) {
        Map<String, Date> StudentsMap		=	new Map<String, Date>();
        Map<String, Date> accMap			= 	new Map<String, Date>();
        List<String> InvalidCitizenIdsList	= 	new List<String>();
        List<String> ValidCitizenIdsList    = 	new List<String>();
        List<Account> legitAccountsList		= 	new List<Account>();
        Community_ClothingVoucherWrapper obj;
        
        // check for valid/invalid citizen ids   
        if(StudentsList != null && StudentsList.size() > 0){
            for(CA_Student2__c StudentsIn : StudentsList){   
                StudentsMap.put(StudentsIn.Citizen_ID__c, StudentsIn.Date_of_Birth__c); 
            }
            
            //get legit accounts on basis of citizen id
            for(Account ac : [SELECT Id, FirstName, LastName, Name, Tribe_Id__c, social_Security__c, Date_of_Birth__c, DOD__c, HealthCloudGA__Gender__pc FROM Account
                              WHERE Tribe_Id__c IN : StudentsMap.keySet() AND RecordTypeId =: CNREG_RECORDTYPEID 
                              AND If_CN_Citizen__c = 'Yes' AND DOD__c = null AND (Is_Void__c = 'No' OR Is_Void__c = '')]){
               accMap.put(ac.Tribe_Id__c, ac.Date_of_Birth__c);
               legitAccountsList.add(ac);
                              }
        }
        
        if (StudentsMap != null && StudentsMap.size() > 0){
            //iterate through map
            for(String v : StudentsMap.keySet()){
                //when citizen id is valid
                if(accMap.containskey(v)){
                    // but wrong date of birth
                    if(accMap.get(v) != StudentsMap.get(v))
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
        obj = 	new Community_ClothingVoucherWrapper(InvalidCitizenIdsList, legitAccountsList);
        return obj;
    } 

    // create clothing assistance request 
    @AuraEnabled
    public static case saveCARequest(Case CVRequest, Account accnt, String addressFreeForm, Boolean isManual, Boolean isAddressChanged, List<ContentDocument> incomeUploadedFiles, List<ContentDocument> uploadedTranscriptList, List<ContentDocument> uploadedLetterList, List<ContentDocument> uploadedw9List, List<ContentDocument> uploadedOtherList
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
                Case cse        =       new Case(RecordTypeId = SCHOLARSHIP_RT, Status = 'New', Origin = 'Portal', Priority = 'Medium', Request_Reason__c = 'Scholarship Application',
                                                 Primary_Contact_First_Name__c = usr.Account.FirstName, Primary_Contact_Last_Name__c = usr.Account.LastName, 
                                                 Ebt_Mobile_Phone__c = CVRequest.Ebt_Mobile_Phone__c, AccountId = usr.Account.Id, ContactId = CONTACT_ID, Ebt_Email__c = usr.Email,
                                                 Mailing_Street__c = CVRequest.Mailing_Street__c, mailing_address2__c = CVRequest.mailing_address2__c,
                                                 mailing_suite__c = CVRequest.mailing_suite__c, Mailing_City__c = CVRequest.Mailing_City__c, 
                                                 Mailing_ZipPostal_Code__c = CVRequest.Mailing_ZipPostal_Code__c, Mailing_Countries__c = CVRequest.Mailing_Countries__c,
                                                 Mailing_States__c = CVRequest.Mailing_States__c, Other_Mailing_State__c = CVRequest.Other_Mailing_State__c,
                                                 Melissa_Address__c = addressFreeForm, Is_Address_Changed__c = isAddressChanged, Is_Manual_Address__c = isManual,
                                                 Description = CVRequest.Description, First_Generation_College_Student__c = CVRequest.First_Generation_College_Student__c, Sec_Email__c = CVRequest.Sec_Email__c, 
                                                 Do_you_speak_read_or_write_Cherokee__c = CVRequest.Do_you_speak_read_or_write_Cherokee__c, County__c = CVRequest.County__c, Council_District__c = CVRequest.Council_District__c, 
                                                Hours_Enrolled_Next_Semester__c = CVRequest.Hours_Enrolled_Next_Semester__c, Student_Classification__c = CVRequest.Student_Classification__c, 
                                                 Expected_College_Graduation_Month__c = CVRequest.Expected_College_Graduation_Month__c,Expected_College_Graduation_Year__c = CVRequest.Expected_College_Graduation_Year__c, 
                                                 Scholarship_Application__c = CVRequest.Scholarship_Application__c, Degree__c = CVRequest.Degree__c, Student_Type__c = CVRequest.Student_Type__c, Background_Field_of_Study__c = CVRequest.Background_Field_of_Study__c,
                                                 High_School__c = CVRequest.High_School__c, ACT_Score__c = CVRequest.ACT_Score__c, SAT_Score__c = CVRequest.SAT_Score__c, HS_Graduation_Date__c = CVRequest.HS_Graduation_Date__c, ROI_First_Name__c = CVRequest.ROI_First_Name__c, 
                                                 ROI_Last_Name__c = CVRequest.ROI_Last_Name__c, ROI_Relationship__c = CVRequest.ROI_Relationship__c, ROI_Mobile__c = CVRequest.ROI_Mobile__c, ROI_Home_Phone__c = CVRequest.ROI_Home_Phone__c,
                                                 ROI_Work_Phone__c = CVRequest.ROI_Work_Phone__c, ROI_Email__c = CVRequest.ROI_Email__c, HS_Counselor_First_Name__c = CVRequest.HS_Counselor_First_Name__c, HS_Counselor_Last_Name__c = CVRequest.HS_Counselor_Last_Name__c,
                                                 HS_Counselor_Phone__c = CVRequest.HS_Counselor_Phone__c, HS_Counselor_Email__c = CVRequest.HS_Counselor_Email__c, Information_May_Be_Released__c = CVRequest.Information_May_Be_Released__c, Acknowledgement_of_Guidelines__c = CVRequest.Acknowledgement_of_Guidelines__c,
                                                 Information_Is_Correct__c = CVRequest.Information_Is_Correct__c, Photo_Consent__c = CVRequest.Photo_Consent__c, Gender__c = CVRequest.Gender__c, Marital_Status__c = CVRequest.Marital_Status__c, Tribe__c = CVRequest.Tribe__c, Currently_receiving_Scholarship__c  = CVRequest.Currently_receiving_Scholarship__c, 
                                                 Vendor__c = CVRequest.Vendor__c, Primary_Contact_Maiden_Name__c = CVRequest.Primary_Contact_Maiden_Name__c, Semester__c = CVRequest.Semester__c, Student_ID__c = CVRequest.Student_ID__c,
                                                 Sec_First_Name__c = CVRequest.Sec_First_Name__c, Sec_Last_Name__c = CVRequest.Sec_Last_Name__c, Sec_Phone__c = CVRequest.Sec_Phone__c,
                                                 Relation__c = CVRequest.Relation__c, PG_First_Name__c = CVRequest.PG_First_Name__c, PG_Last_Name__c = CVRequest.PG_Last_Name__c,
                                                 PG_Mobile_Phone__c = CVRequest.PG_Mobile_Phone__c, Household_Income2__c = CVRequest.Household_Income2__c, Household_Size2__c = CVRequest.Household_Size2__c);
                
                                          
                                          
                      //Fetching the assignment rules on case
AssignmentRule AR = new AssignmentRule();
AR = [select id from AssignmentRule where SobjectType = 'Case' and Active = true limit 1];
                                          
//Creating the DMLOptions for "Assign using active assignment rules" checkbox
Database.DMLOptions dmlOpts = new Database.DMLOptions();
dmlOpts.assignmentRuleHeader.assignmentRuleId= AR.id;
                                          
                                          cse.setOptions(dmlOpts);
                                          
                                          insert cse;
                                          
                                          
                system.debug('Case created');
                
                system.debug('Social Security: ' +accnt.Social_Security__c );
                Account acnt = new Account(Id = accnt.Id, Social_Security__c = accnt.Social_Security__c);
                update acnt; 
                
                system.debug(incomeUploadedFiles);
                system.debug('Vendor' + CVRequest.Vendor__c);
                
                 for(ContentDocument incomeFiles : incomeUploadedFiles){   
                    ContentDocumentLink CDLink=new ContentDocumentLink();
                    CDLink.ContentDocumentId=incomeFiles.Id;
                    CDLink.LinkedEntityId=cse.Id;
                    CDIncomeFiles.add(CDLink);
                     system.debug('New CD Link' + CDLink);
                }  
                
                for(ContentDocument incomeFiles : uploadedTranscriptList){   
                    ContentDocumentLink CDLink=new ContentDocumentLink();
                    CDLink.ContentDocumentId=incomeFiles.Id;
                    CDLink.LinkedEntityId=cse.Id;
                    CDIncomeFiles.add(CDLink);
                     system.debug('New CD Link' + CDLink);
                }  
                
                for(ContentDocument incomeFiles : uploadedLetterList){   
                    ContentDocumentLink CDLink=new ContentDocumentLink();
                    CDLink.ContentDocumentId=incomeFiles.Id;
                    CDLink.LinkedEntityId=cse.Id;
                    CDIncomeFiles.add(CDLink);
                     system.debug('New CD Link' + CDLink);
                }  
                for(ContentDocument incomeFiles : uploadedw9List){   
                    ContentDocumentLink CDLink=new ContentDocumentLink();
                    CDLink.ContentDocumentId=incomeFiles.Id;
                    CDLink.LinkedEntityId=cse.Id;
                    CDIncomeFiles.add(CDLink);
                     system.debug('New CD Link' + CDLink);
                } 
                for(ContentDocument incomeFiles : uploadedOtherList){   
                    ContentDocumentLink CDLink=new ContentDocumentLink();
                    CDLink.ContentDocumentId=incomeFiles.Id;
                    CDLink.LinkedEntityId=cse.Id;
                    CDIncomeFiles.add(CDLink);
                     system.debug('New CD Link' + CDLink);
                } 
                
                
                insert CDIncomeFiles;
                
                
                //query inserted case to get case number
                Case userCase = [SELECT Id, CaseNumber, Student_Type__c, Degree__c, Scholarship_Application__c FROM Case WHERE Id =: cse.Id limit 1];
               
                
                
               
                
           
                
                return userCase;
           /* }
            catch(Exception ex){
                // Throw an AuraHandledException
                throw new AuraHandledException(ex.getMessage());  
                               }*/
        
        
       
    } 
    
    @AuraEnabled
    public static List<Vendor__c> searchVendors( String searchTerm ) {
        List<Vendor__c> vendors = new List<Vendor__c>();
        if ( String.isNotBlank( searchTerm ) 	&& searchTerm.length() > 1 ) {
            List<List<SObject>> searchResults = [
                FIND :searchTerm
                RETURNING Vendor__c(
                    Id, Name, Physical_Street__c, Physical_City__c, Physical_State__c, Physical_Zip__c
                    ORDER BY Name
                    LIMIT 10
                )
            ];
            vendors = searchResults[0];
        }
        system.debug(vendors);

        return vendors;
    }
    
     // to delete files
    @AuraEnabled
    public static void RemoveFile(List<string> fileIds)   {
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