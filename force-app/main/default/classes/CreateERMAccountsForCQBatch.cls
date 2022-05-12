/**********************************************************************************
@author: Sami
@date: Jan/28/2022
@purpose: Create ERM Account and Cerner Account records against Cerner Queue Record
**********************************************************************************/
global class CreateERMAccountsForCQBatch implements Schedulable,Database.Batchable<sObject>, Database.Stateful  {
    
    global Map<String, String> MRNErrorMap = new Map<String, String>();
    global Map<String, String> CQ_UpdateErrorMap = new Map<String, String>();
    global Map<String,Cerner_Queue__c> CQ_TotalUniqueRecMap = new Map<String,Cerner_Queue__c>();
    global Integer totalAccountRecords = 0;
    global Database.QueryLocator start(Database.BatchableContext BC){  
        if(test.isRunningTest())    
            return   Database.getQueryLocator ([SELECT Id, MRN__c, Applies_Date_Time__c,System_between0_10__c,System_Between11_91__c,System_greater91__c,
                                                Test_Site_Type_1st__c, Test_Site_Name__c, Test_Site_1st__c,Account__c,System_Num_Days__c,
                                                First_Name__c, Middle_Name__c, Last_Name__c, Street__c, City__c, State__c, Postal_Code__c, Delete_CQR__c,
                                                Country__c, Date_of_Birth__c, Gender_Code__c, Phone__c, Mobile_Phone__c, Email__c, Batch_Processed__c
                                                FROM Cerner_Queue__c limit 50]);
        else
            return   Database.getQueryLocator ([SELECT Id, MRN__c, Applies_Date_Time__c,System_between0_10__c,System_Between11_91__c,System_greater91__c,
                                                Test_Site_Type_1st__c, Test_Site_Name__c, Test_Site_1st__c,Account__c,System_Num_Days__c,
                                                First_Name__c, Middle_Name__c, Last_Name__c, Street__c, City__c, State__c, Postal_Code__c, Delete_CQR__c,
                                                Country__c, Date_of_Birth__c, Gender_Code__c, Phone__c, Mobile_Phone__c, Email__c, Batch_Processed__c
                                                FROM Cerner_Queue__c WHERE Batch_Processed__c =: false AND Duplicate__c =: false]);
    }
    
    global void execute(SchedulableContext context){
        Database.executeBatch(this, 50);
    }   
    
    global void execute(Database.BatchableContext BC, List<Cerner_Queue__c> CQList) {
        Id CA_RECORDTYPEID = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('Cerner_Account').getRecordTypeId();
        Id ERM_RECORDTYPEID = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
        List<Account> ERM_AccountsToInsert = new List<Account>();
        List<Account> Cerner_AccountsToUpsert = new List<Account>();
        List<Account> ERM_AccountsToInsertDup = new List<Account>();
        List<Account> Cerner_AccountsToUpsertDup = new List<Account>();
        Map<String, Id> insertedAccountIdsList = new Map<String, Id>();
        List<Cerner_Queue__c> CernerQueueListToUpdate = new List<Cerner_Queue__c>();
        Map<String,Cerner_Queue__c> CQ_UniqueMRNRecMap = new Map<String,Cerner_Queue__c>();
        List<Cerner_Queue__c> CQ_DuplicateMRNList = new List<Cerner_Queue__c>();
        List<Cerner_Queue__c> CQ_DeleteMRNList = new List<Cerner_Queue__c>();
        for(Cerner_Queue__c CQ : CQList){
            if(CQ_UniqueMRNRecMap.get(CQ.MRN__c) == null && CQ_TotalUniqueRecMap.get(CQ.MRN__c) == null){
                CQ_UniqueMRNRecMap.put(CQ.MRN__c, CQ);
                CQ_TotalUniqueRecMap.put(CQ.MRN__c, CQ);
            }
            else{
                CQ_DuplicateMRNList.add(CQ);
            }
        }
        
        for(Cerner_Queue__c CQ : CQ_UniqueMRNRecMap.values()){
            if(CQ.Delete_CQR__c){
                system.debug('Delete_CQR__c==true');
                if(CQ.System_greater91__c){
                    system.debug('CQ.System_greater91__c:: '+CQ.System_greater91__c);
                    
                    String fName=CQ.First_Name__c;
                    if(CQ.Middle_Name__c!=null)
                        fName=fName+' '+CQ.Middle_Name__c; 
                    
                    // Update an ERM Account
                    Account a = new Account();
                    a.id = CQ.Account__c;
                    a.firstName = fName;
                    a.LastName = CQ.Last_Name__c;
                    a.MRN__c=CQ.MRN__c;
                    a.Date_of_Birth__c=CQ.Date_of_Birth__c;
                    a.HealthCloudGA__Gender__pc=CQ.Gender_Code__c;
                    a.Phone=CQ.Phone__c;
                    a.PersonMobilePhone=CQ.Mobile_Phone__c;
                    a.Cerner_Email__c=CQ.Email__c;
                    a.Bypass_Cerner_Queue__c= true;
                    a.Updated_by_Cerner__c=true;
                    a.Test_Result_Viewed__c = false;
                    a.SMS_Sent__c  = false;
                    a.Test_Date__c = CQ.Applies_Date_Time__c;
                    a.Case_Status__c= 'Active';
                    a.Contact_or_Case_new__c='Case';
                    a.Converted_Date__c = system.now();
                    a.HealthCloudGA__StatusGroup__pc='PositiveTest';
                    a.Stage__c= 'Case - In CI Queue';
                    a.HealthCloudGA__Testing_Status__pc='Positive';
                    a.System_Num_Days__c=CQ.System_Num_Days__c;
                    Cerner_AccountsToUpsert.add(a);
                    Cerner_AccountsToUpsertDup.add(a);
                    
                } 
                else if(CQ.System_between0_10__c){
                    // Update an ERM Account
                    system.debug('CQ.System_between0_10__c:: '+CQ.System_between0_10__c);
                    Account a = new Account();
                    a.id = CQ.Account__c;
                    a.MRN__c=CQ.MRN__c;
                    a.HealthCloudGA__Testing_Status__pc='Positive';
                    a.Updated_by_Cerner__c=true;
                    a.Test_Result_Viewed__c = false;
                    a.SMS_Sent__c  = false;
                    a.System_Num_Days__c=CQ.System_Num_Days__c;
                    Cerner_AccountsToUpsert.add(a);
                    Cerner_AccountsToUpsertDup.add(a);
                    
                }
                else{         
                    String fName=CQ.First_Name__c;
                    if(CQ.Middle_Name__c!=null)
                        fName=fName+' '+CQ.Middle_Name__c; 
                    
                    // create an ERM Account
                    Account a = new Account();
                    a.RecordTypeId = ERM_RECORDTYPEID;
                    a.firstName = fName;
                    a.LastName = CQ.Last_Name__c;
                    a.Date_of_Birth__c=CQ.Date_of_Birth__c;
                    a.HealthCloudGA__Gender__pc=CQ.Gender_Code__c;
                    a.Phone=CQ.Phone__c;
                    a.PersonMobilePhone=CQ.Mobile_Phone__c;
                    a.Cerner_Email__c=CQ.Email__c;
                    a.MRN__c=CQ.MRN__c;
                    a.Bypass_Cerner_Queue__c= true;
                    a.Created_by_Cerner__c=true;
                    a.Test_Result_Viewed__c = false;
                    a.SMS_Sent__c  = false;
                    a.Test_Date__c = CQ.Applies_Date_Time__c;
                    a.Case_Status__c= 'Active';
                    a.Contact_or_Case_new__c='Case';
                    a.Converted_Date__c = system.now();
                    a.HealthCloudGA__StatusGroup__pc='PositiveTest';
                    a.Stage__c= 'Case - In CI Queue';
                    a.HealthCloudGA__Testing_Status__pc='Positive';
                    ERM_AccountsToInsert.add(a);
                    ERM_AccountsToInsertDup.add(a);         
                }
            }
            else{
                
                String fName=CQ.First_Name__c;
                if(CQ.Middle_Name__c!=null)
                    fName=fName+' '+CQ.Middle_Name__c; 
                
                // create a Cerner Account
                Account a = new Account();
                a.RecordTypeId = CA_RECORDTYPEID;// Cerner Account RecordType id
                a.firstName = fName;
                a.LastName = CQ.Last_Name__c;
                a.Date_of_Birth__c=CQ.Date_of_Birth__c;
                a.HealthCloudGA__Gender__pc=CQ.Gender_Code__c;
                a.Phone=CQ.Phone__c;
                a.PersonMobilePhone=CQ.Mobile_Phone__c;
                a.Cerner_Email__c=CQ.Email__c;
                a.MRN__c=CQ.MRN__c+'_Cerner';
                a.HealthCloudGA__Testing_Status__pc='Positive';
                a.Test_Date__c = CQ.Applies_Date_Time__c;
                a.Created_by_Cerner__c=true;
                a.Test_Result_Viewed__c = false;
                a.SMS_Sent__c  = false;
                a.System_Num_Days__c=CQ.System_Num_Days__c;
                Cerner_AccountsToUpsert.add(a);
                Cerner_AccountsToUpsertDup.add(a);
                
                
            }
        }
        
        totalAccountRecords = totalAccountRecords+ ERM_AccountsToInsert.size() + Cerner_AccountsToUpsert.size();
        database.SaveResult[] insertedERMAccontsResults=database.insert(ERM_AccountsToInsert,false);
        database.UpsertResult[] insertedCernerAccountsResults=database.upsert(Cerner_AccountsToUpsert, Account.MRN__c , false);
        
        // Error handling for ERM Accounts Insert
        for(Integer i=0; i < insertedERMAccontsResults.size(); i++) {
            if(!insertedERMAccontsResults[i].isSuccess()){
                for(Database.Error err : insertedERMAccontsResults[i].getErrors()){
                    String errMsg = 'ERM ACCOUNT INSERTION ERROR!! Against MRN: '+ERM_AccountsToInsertDup[i].MRN__c+'. ERROR MESSAGE: '+err.getMessage() +'. STATUS CODE: '+err.getStatusCode();
                    String MRN = ERM_AccountsToInsertDup[i].MRN__c;
                    MRNErrorMap.put(MRN , errMsg); 
                }     
            }
            else{
                insertedAccountIdsList.put(ERM_AccountsToInsertDup[i].MRN__c, insertedERMAccontsResults[i].getId());
            }
        }
        
        // Error handling for Cerner Accounts Upsert
        for(Integer i=0; i < insertedCernerAccountsResults.size(); i++) {
            if(!insertedCernerAccountsResults[i].isSuccess()){
                for(Database.Error err : insertedCernerAccountsResults[i].getErrors()){
                    String errMsg = 'CERNER ACCOUNT INSERTION ERROR!! Against MRN: '+Cerner_AccountsToUpsertDup[i].MRN__c+'. ERROR MESSAGE: '+err.getMessage() +'. STATUS CODE: '+err.getStatusCode();
                    String MRN = Cerner_AccountsToUpsertDup[i].MRN__c;
                    MRNErrorMap.put(MRN , errMsg); 
                }     
            }
            else{
                insertedAccountIdsList.put(Cerner_AccountsToUpsertDup[i].MRN__c.replace('_Cerner',''), insertedCernerAccountsResults[i].getId());
            }
        }
        
        //update inserted accounts as look up on respective CQ records
        for(Cerner_Queue__c CQ : CQ_UniqueMRNRecMap.values()){
            for(String MRNumber  : insertedAccountIdsList.keySet()){
                if(MRNumber == CQ.MRN__c){
                    Cerner_Queue__c CQToUpdate =  new Cerner_Queue__c();
                    CQToUpdate.Id = CQ.Id;
                    CQToUpdate.Account__c = insertedAccountIdsList.get(MRNumber);
                    CernerQueueListToUpdate.add(CQToUpdate);
                }
            }
        }        
        
        for(Cerner_Queue__c CQDup : CQ_DuplicateMRNList){
            Cerner_Queue__c CQToUpdate =  new Cerner_Queue__c();
            CQToUpdate.Id = CQDup.Id;
            CQToUpdate.Duplicate__c = true;
            CernerQueueListToUpdate.add(CQToUpdate);
        }
        
        database.SaveResult[] updatedCQResults=database.update(CernerQueueListToUpdate, false);
        
        // Error handling for Cerner Queue Update
        for(Database.SaveResult dr : updatedCQResults) {
            if (!dr.isSuccess()) {
                for(Database.Error err : dr.getErrors()) {
                    String errMsg = 'CERNER QUEUE UPDATE ERROR!! Against Record Id: '+dr.getId()+'. ERROR MESSAGE: '+err.getMessage() +'. STATUS CODE: '+err.getStatusCode();
                    CQ_UpdateErrorMap.put(dr.getId(), errMsg);
                }
            }
        }
    }
    global void finish(Database.BatchableContext BC) {
        if(test.isRunningTest())
            MRNErrorMap.put('TEST', 'Testing Error Message');
        
        if(MRNErrorMap.size()>0 && MRNErrorMap != null && !MRNErrorMap.isEmpty()){
            AsyncApexJob a = [SELECT Id, Status, NumberOfErrors, JobItemsProcessed,
                              TotalJobItems, CreatedBy.Email FROM AsyncApexJob WHERE Id = :bc.getJobId()];
            
            String body = 'The account creation job against cerner queue records has completed. \n'
                + 'Total number of accounts processed ' + totalAccountRecords + '. \n'
                + 'with '
                +  MRNErrorMap.size() 
                + ' errors. \n'
                + 'Error found for Cerner Queue Records to be updated are '
                +  CQ_UpdateErrorMap.size()+ '.';
            //creating csv file
            String finalstr = 'MRNumber,Error \n';
            String attName = 'Accounts_Error File.csv';
            for(String MRNumber  : MRNErrorMap.keySet()){
                string err = MRNErrorMap.get(MRNumber);
                string recordString = '"'+MRNumber+'","'+err+'"\n';
                finalstr = finalstr +recordString;
            }  // csv file end 
            //creating attachment for email
            Messaging.EmailFileAttachment    efa = new Messaging.EmailFileAttachment();
            efa.setFileName(attName);
            efa.setBody(Blob.valueOf(finalstr));
            
            //creating CQ Id and Error msg csv file for Cerner Queue Records failed to UPDATE
            String finalstr2 = 'CernerQueueId,Error \n';
            String attName2 = 'CQ_Record_Update_Errors File.csv';
            for(String CQId  : CQ_UpdateErrorMap.keySet()){
                string err2 = CQ_UpdateErrorMap.get(CQId);
                string recordString2 = '"'+CQId+'","'+err2+'"\n';
                finalstr2 = finalstr2 +recordString2;
            }  //  end  
            //creating attachment for email
            Messaging.EmailFileAttachment    efa2 = new Messaging.EmailFileAttachment();
            efa2.setFileName(attName2);
            efa2.setBody(Blob.valueOf(finalstr2));
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage(); 
            // parameter setting for email
            email.setSubject('Accounts Creating Against Cerner Queue Records Batch Status: ' + a.Status);
            String toEmailAddress1 = System.Label.EC_Ac_Creation_Fail_Error_Recipient;
            String toEmailAddress2 = System.Label.EC_Ac_Creation_Fail_Error_Recipient2;
            String toEmailAddress3 = System.Label.EC_Ac_Creation_Fail_Error_Recipient3;
            String toEmailAddress4='sami.haroon@gettectonic.com';
            String[] toAddresses = new String[]{toEmailAddress1, toEmailAddress2, toEmailAddress3,toEmailAddress4};
                // String[] toAddresses = new String[]{toEmailAddress4};     
                email.setToAddresses(toAddresses);
            email.setPlainTextBody( body );
            email.setUseSignature(false);
            email.setFileAttachments(new Messaging.EmailFileAttachment[] {efa, efa2}); // attach file in email
            if(!Test.isRunningTest()){
                //email sending
                Messaging.SendEmailResult [] r =  Messaging.sendEmail(new Messaging.SingleEmailMessage[] {email});  
            }        
        }
        Database.executeBatch(new CreateChildsRecforCQCreatedAccountsBatch(),50);
    }
}