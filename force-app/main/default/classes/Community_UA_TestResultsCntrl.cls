/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba Asif
@Date: Aug/24/2020
@Purpose: This class is used as controller for Community_UA_TestResults aura component.
---------------------------------------------------------------------------------------------------------------*/


public without sharing  class Community_UA_TestResultsCntrl {
    public class TR_Exception extends Exception 
    {}
    
    // update attempt count(max 3) on account
    @AuraEnabled
    public static Account updateAttemptCount(String userId){ 
        Id CernerAccRecordType =  Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('Cerner_Account').getRecordTypeId();
        Id ERMAccRecordType =  Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
        Blob  decodedId =  EncodingUtil.base64Decode(userId);
        String uId = decodedId.toString();
        Account CQRecAcc = [Select Id, Attempts_Counter__c, RecordType.DeveloperName,Isolatied_End_Date__pc, Bypass_Cerner_Queue__c,CA_Creatd_4_Cmnty_User__c,Initial_test_date__c,Updated_by_Cerner__c,System_Num_Days__c From Account WHERE Id =: uId and (RecordTypeId =: CernerAccRecordType OR RecordTypeId =: ERMAccRecordType) LIMIT 1];
        CQRecAcc.Attempts_Counter__c = 3;
        update CQRecAcc;
        return CQRecAcc;
    }
    
    //validate user input and show test results
    @AuraEnabled
    public static Object getUserInfo(String userId, Date Dob){ 
        try{
            if(!String.IsBlank(userId) && Dob != null){
                Blob  decodedId =  EncodingUtil.base64Decode(userId);
                String uId = decodedId.toString();
                Account CQRecAcc = [Select Id, Date_of_Birth__c, Attempts_Counter__c From Account WHERE Id =: uId LIMIT 1];
                Account acc = [Select Id, Name, Test_Date__c, Date_of_Birth__c From Account WHERE Id =: uId  LIMIT 1];
                
                //Check otp and return the result
                if(CQRecAcc.Attempts_Counter__c > 0 && CQRecAcc.Date_of_Birth__c == Dob){
                    CQRecAcc.Test_Result_Viewed__c  = true;
                    update CQRecAcc;
                    return acc;
                }
                else if(CQRecAcc.Attempts_Counter__c > 1){
                    CQRecAcc.Attempts_Counter__c    =   CQRecAcc.Attempts_Counter__c - 1;
                    update CQRecAcc;
                    return 'Failed';
                }
                else{   
                    return 'MaxAttemptsReached';
                } 
            }
        }
        catch(AuraHandledException ex){
            // Throw an AuraHandledException 
            if(!Test.isRunningTest()){
                throw new AuraHandledException(ex.getMessage());  
            }
        }
        return  null;
    } 
    
    //not in use as of 20/Jan/2022
    @AuraEnabled
    public static void udpdateAccountEmail(String acntId, String email){
        Account Accnt = [SELECT Id, PersonEmail  FROM ACCOUNT WHERE Id =: acntId limit 1];
        Accnt.PersonEmail = email;
        update Accnt;
    }
    
    //not in use as of 20/Jan/2022
    // send isolation note email to user along with attachment
    @AuraEnabled
    public static void sendIsolationNote(String acntId, String email){
        Account acnt = [SELECT Id, PersonEmail, PersonContactId  FROM ACCOUNT WHERE Id =: acntId limit 1]; 
        system.debug(acnt);
        system.debug(acnt.PersonContactId);
        /* Get the page definition */
       
       /* Site site = [select Id from Site where Name = 'Cherokee_Nation_Health_Services'];
        SiteDetail siteUrl = [select SecureURL from SiteDetail where DurableId =: site.Id];
        system.debug('AK '+siteUrl);
        String url = 'https://cherokeenation--cnfullcopy--c.visualforce.com/apex/CNPH_IsolationNote'; */ 
        //String url = 'https://cherokeenation--cnfullcopy--c.visualforce.com/apex/SFDC_Test'; 
        /*PageReference pdfPage = new PageReference(url); */
        PageReference pdfPage = Page.CNPH_IsolationNote;
        //PageReference pdfPage = Page.CNPH_IsolationNote;
        //PageReference pdfPage = new PageReference('https://cherokeenation--cnfullcopy--c.visualforce.com/apex/CNPH_IsolationNote');
        //PageReference pdfPage = new PageReference('/lightning/n/CNPH_IsolationNote');
        pdfPage.getParameters().put('id', acnt.PersonContactId);
        /* generate the pdf blob */
        Blob pdfBlob;
        if(Test.isRunningTest()) { 
            pdfBlob = blob.valueOf('Unit.Test');
        } else {
            pdfBlob = pdfPage.getContentAsPDF();
        }
        /* create the attachment against the offer */
        Attachment a = new Attachment(parentId = acnt.PersonContactId, name='Isolation Note '+Datetime.now().format() + '.pdf', body = pdfBlob);
        sendemail('Isolation_Note',a, acnt);
    }
    
    //not in use as of 20/Jan/2022
    public static void sendemail(String template,Attachment file, Account acnt){
        Messaging.EmailFileAttachment efa = new Messaging.EmailFileAttachment();
        efa.setFileName(file.Name);
        efa.setBody(file.Body);
        efa.setContentType(file.ContentType);
        Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
        message.setTargetObjectId(acnt.PersonContactId); 
        message.setBccSender(false); 
        OrgWideEmailAddress OWE=[SELECT Id FROM OrgWideEmailAddress WHERE DisplayName = 'No Reply - Cherokee Public Health'];
        message.setOrgWideEmailAddressId(OWE.id);
        message.setUseSignature(false);
        message.setFileAttachments(new Messaging.EmailFileAttachment[] {efa});
        message.bccaddresses= new String[] { UserInfo.getUserEmail()};
            //message.ccaddresses= new String[] { UserInfo.getUserEmail()};
            message.setReplyTo(UserInfo.getUserEmail());
        message.setSaveAsActivity(true); 
        EmailTemplate emailTemplate = [Select Id,Subject,Description,HtmlValue,DeveloperName,Body from EmailTemplate where DeveloperName =:template];
        message.setTemplateID(emailTemplate.Id); 
        message.setWhatId(acnt.Id); //This is important for the merge fields in template to work
        message.toAddresses =  new String[] { acnt.PersonEmail};
            Messaging.SingleEmailMessage[] messages = new List<Messaging.SingleEmailMessage> {message};
                if(!test.isRunningTest())
                Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);
        
    }
    
    //get account info
    @AuraEnabled
    public static Account getAccountData(String accId){
        Id ERMAccRecordType =  Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
        Blob  decodedId =  EncodingUtil.base64Decode(accId);
        String uId = decodedId.toString();
        return [Select Id, Name, Isolatied_End_Date__pc From Account WHERE Id =: uId AND  RecordTypeId =: ERMAccRecordType LIMIT 1];
   
    }
    
    //Update account and create clinical assessment record
      @AuraEnabled
    public static TestResult_Wrapper insertCAssUpdateAccnt(String acntId,HealthCloudGA__Clinical_Assessment_Response__c CA, Account accoutToBeUpdate){
        TestResult_Wrapper wrp = new TestResult_Wrapper();
        wrp.clincalAssessment =  createClinicalAssessment(acntId, CA);
        Account accnt  = new Account(Id = acntId , Place_of_Employment__c = accoutToBeUpdate.Place_of_Employment__c, Other_Place_of_Employment__c = accoutToBeUpdate.Other_Place_of_Employment__c,
                                    PersonDepartment = accoutToBeUpdate.PersonDepartment, Is_a_Healthcare_Worker__c = accoutToBeUpdate.Is_a_Healthcare_Worker__c,
                                     Do_you_attend_in_person_school_Daycare__c = accoutToBeUpdate.Do_you_attend_in_person_school_Daycare__c, NameofEducationCenter__c = accoutToBeUpdate.NameofEducationCenter__c,
                                    Date_of_when_symptoms_onset__c = accoutToBeUpdate.Date_of_when_symptoms_onset__c, CA_Creatd_4_Cmnty_User__c = true, HealthCloudGA__ConditionStatus__pc =  accoutToBeUpdate.HealthCloudGA__ConditionStatus__pc, 
                                     Create_Patient_Task__c = true, Skip_Quarantine__c = false, Stage__c = 'Case - CI Completed', Is_this_a_rapid_CI_mode__c = 'No');
        if(accoutToBeUpdate.Place_of_Employment__c == 'CN Government')
            accnt.Priority__c = 'High';
        if(accoutToBeUpdate.Place_of_Employment__c == 'CN Government' && accoutToBeUpdate.Is_a_Healthcare_Worker__c)
            accnt.Priority__c = 'Highest';            
        
        try{
            update accnt;
            if(!test.isRunningTest())   {
                Task taskToMarkCompleted = [SELECT Id, Status FROM Task WHERE AccountId =: acntId AND Subject =: 'Take case ownership for the First followup' limit 1];
                taskToMarkCompleted.Status = 'Completed';
                update taskToMarkCompleted;
            }
        }
        catch(AuraHandledException ex){
            // Throw an AuraHandledException 
            if(!Test.isRunningTest()){
                throw new AuraHandledException(ex.getMessage());  
            }
        }
        wrp.IsolationEndDate =  [SELECT Isolatied_End_Date__pc FROM ACCOUNT WHERE Id =: acntId].Isolatied_End_Date__pc; 
        return wrp;
    }
    
    // create Clinical Assessment record for provided account Id
    public static HealthCloudGA__Clinical_Assessment_Response__c createClinicalAssessment(String acntId,HealthCloudGA__Clinical_Assessment_Response__c CA){       
        HealthCloudGA__Clinical_Assessment_Response__c ClinicalAss = new   HealthCloudGA__Clinical_Assessment_Response__c( HealthCloudGA__Patient__c = acntId ,HealthCloudGA__SubjectiveFever__c = CA.HealthCloudGA__SubjectiveFever__c,
                             HealthCloudGA__Chills__c =  CA.HealthCloudGA__Chills__c , HealthCloudGA__Cough__c = CA.HealthCloudGA__Cough__c, HealthCloudGA__ShortnessOfBreath__c = CA.HealthCloudGA__ShortnessOfBreath__c,
                             Fatigue__c = CA.Fatigue__c, HealthCloudGA__MuscleAches__c = CA.HealthCloudGA__MuscleAches__c, HealthCloudGA__Headache__c = CA.HealthCloudGA__Headache__c,
                             New_Lost_of_Taste_Smell__c = CA.New_Lost_of_Taste_Smell__c, HealthCloudGA__SoreThroat__c = CA.HealthCloudGA__SoreThroat__c, HealthCloudGA__RunnyNose__c = CA.HealthCloudGA__RunnyNose__c,
                             HealthCloudGA__NauseaOrVomiting__c = CA.HealthCloudGA__NauseaOrVomiting__c, HealthCloudGA__Diarrhoea__c = CA.HealthCloudGA__Diarrhoea__c,
                             HealthCloudGA__OtherSymptoms__c = CA.HealthCloudGA__OtherSymptoms__c);
        try{
                 insert ClinicalAss;
        }
        catch(AuraHandledException ex){
            // Throw an AuraHandledException 
            if(!Test.isRunningTest()){
                throw new AuraHandledException(ex.getMessage());  
            }
        }
        return [SELECT Id FROM HealthCloudGA__Clinical_Assessment_Response__c WHERE Id =: ClinicalAss.Id]; 
    }
    
    //update both account and create clinical assessment records
       @AuraEnabled
    public static void updateData(String acntId,HealthCloudGA__Clinical_Assessment_Response__c CA, Boolean IsOptInOptOut){
        HealthCloudGA__Clinical_Assessment_Response__c ClinicalAssessment = new   HealthCloudGA__Clinical_Assessment_Response__c( Id = CA.Id,
                                                                            Previously_diagnosed_with_COVID_19__c = CA.Previously_diagnosed_with_COVID_19__c, 
                                                                            How_long_ago_did_you_have_COVID_19__c = CA.How_long_ago_did_you_have_COVID_19__c,
                                                                            Recieved_COVID19_vaccination__c = CA.Recieved_COVID19_vaccination__c,
                                                                            COVID19_vaccination_type__c = CA.COVID19_vaccination_type__c, 
                                                                            How_many_doses_recieved__c = CA.How_many_doses_recieved__c,
                                                                            Last_COVID_19_Vaccination_Date__c = CA.Last_COVID_19_Vaccination_Date__c);
        update ClinicalAssessment;
        if(IsOptInOptOut){
            Account acc = new Account(Id = acntId , Send_Survey_via_SMS__c = false);
            update acc;
        }
    }
    
    public class TestResult_Wrapper{
        @AuraEnabled public HealthCloudGA__Clinical_Assessment_Response__c clincalAssessment;
        @AuraEnabled public DateTime IsolationEndDate {get;set;}
    }
}