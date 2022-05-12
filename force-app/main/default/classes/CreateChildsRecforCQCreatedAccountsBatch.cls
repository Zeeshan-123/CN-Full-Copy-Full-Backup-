/**********************************
@author: Alishba
@date: Jan/28/2022
@purpose: Generate Bitly URLs and create EHR Obervations and Cerner Queue Archive Records
***********************************/
global class CreateChildsRecforCQCreatedAccountsBatch implements Database.Batchable<sObject>, Database.Stateful, Database.AllowsCallouts  {
    global Map<String, String> EHRObservationErrorMap = new Map<String, String>();
    global Map<String, String> AccountsFailedtoUpdateErrorMap = new Map<String, String>();
    global Map<String, String> CQ_DeleteErrorMap = new Map<String, String>();
    global Map<String, String> CQ_UpdateErrorMap = new Map<String, String>();
    
    global Database.QueryLocator start(Database.BatchableContext BC){  
        if(test.isRunningTest())    
            return   Database.getQueryLocator ([SELECT Id, Account__c, MRN__c, Applies_Date_Time__c, Test_Site_Type_1st__c, Test_Site_Name__c, Test_Site_1st__c,
                                                First_Name__c, Middle_Name__c, Last_Name__c, Street__c, City__c, State__c, Postal_Code__c, Delete_CQR__c,System_between0_10__c,
                                                Country__c, Date_of_Birth__c, Gender_Code__c, Phone__c, Mobile_Phone__c, Email__c, Batch_Processed__c,System_greater91__c
                                                FROM Cerner_Queue__c WHERE Account__c != '' limit 50]);
        else
            return   Database.getQueryLocator ([SELECT Id, Account__c, MRN__c, Applies_Date_Time__c, Test_Site_Type_1st__c, Test_Site_Name__c, Test_Site_1st__c,
                                                First_Name__c, Middle_Name__c, Last_Name__c, Street__c, City__c, State__c, Postal_Code__c, Delete_CQR__c,System_between0_10__c,
                                                Country__c, Date_of_Birth__c, Gender_Code__c, Phone__c, Mobile_Phone__c, Email__c, Batch_Processed__c,System_greater91__c
                                                FROM Cerner_Queue__c WHERE Batch_Processed__c =: false AND Duplicate__c =: false AND Account__c != '']);
    }
    
    global void execute(Database.BatchableContext BC, List<Cerner_Queue__c> CQList) {
        List<Daily_Followup_Task__mdt> getAccessToken=[select Access_Token__c from Daily_Followup_Task__mdt];        
        Id ERM_RECORDTYPEID = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
        Id CA_RECORDTYPEID = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('Cerner_Account').getRecordTypeId();
        List<HealthCloudGA__EhrObservation__c> EHRObservationToInsert = new List<HealthCloudGA__EhrObservation__c>();
        List<HealthCloudGA__EhrObservation__c> EHRObservationToInsertDup = new List<HealthCloudGA__EhrObservation__c>();
        List<Cerner_Queue_Archive__c> CernerQueueArchiveToInsert = new List<Cerner_Queue_Archive__c>();
        Map<String,Cerner_Queue__c> CQ_UniqueMRNRecSet = new Map<String,Cerner_Queue__c>();
        List<Cerner_Queue__c> CernerQueueToDelete = new List<Cerner_Queue__c>();
        List<Cerner_Queue__c> CernerQueueToUpdate = new List<Cerner_Queue__c>();
        List<Account> accountsToUpdate=  new List<Account>(); 
        List<String> CQ_ERM_MRNList = new List<String>();
        List<String> CQ_CA_MRNList = new List<String>();
        
        for(Cerner_Queue__c CQ : CQList){
            CQ_UniqueMRNRecSet.put(CQ.MRN__c, CQ);
        }
        
        for(Cerner_Queue__c CQ : CQ_UniqueMRNRecSet.values()){
            Account accnt = new Account();
            accnt.Id = CQ.Account__c;
            //generate bitly URL against ERM and Cerner Accounts
            String url = System.Label.CN_HealthBaseURL+'/s/test-results?Id='+EncodingUtil.base64Encode(Blob.valueOf(accnt.Id));
            HttpRequest req = 	new HttpRequest();
            req.setEndpoint(
                'callout:Bitly/v3/shorten' +
                '?access_token='+getAccessToken[0].Access_Token__c.trim()+
                '&longUrl=' + EncodingUtil.urlEncode( url, 'UTF-8' ) +
                '&format=txt'
            );
            
            req.setMethod('GET');
            Http http = new Http();
            if(!test.isRunningTest()){ HttpResponse res = http.send(req);
                                      accnt.Test_Result_Link__c=res.getBody();
                                     }
            accountsToUpdate.add(accnt);
            
            if(!CQ.Batch_Processed__c && !CQ.Delete_CQR__c){
                //mark batch processed flag for those cerner queue record  who has cerner account created against them
                Cerner_Queue__c CQU =  new Cerner_Queue__c();
                CQU.Id = CQ.Id;
                CQU.Batch_Processed__c = true;
                CernerQueueToUpdate.add(CQU);                
            }
            system.debug('CQ.System_between0_10__c::'+CQ.System_between0_10__c);
            
            // If Delete_CQR__c is set to true indicates an ERM Account against this Cerner Queue record
            if(CQ.Delete_CQR__c){
                // create EHR Observation
                HealthCloudGA__EhrObservation__c EHR= new HealthCloudGA__EhrObservation__c();
                EHR.Account__c=CQ.Account__c;
                EHR.HealthCloudGA__AppliesDateTime__c=CQ.Applies_Date_Time__c;
                EHR.Test_Site_Type_1st__c=CQ.Test_Site_Type_1st__c;
                EHR.Test_Site_1st__c=CQ.Test_Site_Name__c;
                EHR.Testing_Status__c='Positive';
                EHRObservationToInsert.add(EHR);
                EHRObservationToInsertDup.add(EHR);
                
                
                // create Cerner Queue Archive
                Cerner_Queue_Archive__c CQA = new Cerner_Queue_Archive__c();
                CQA.Mapped_Account__c=CQ.Account__c;
                CQA.First_Name__c=CQ.First_Name__c;
                CQA.Middle_Name__c=CQ.Middle_Name__c;
                CQA.Last_Name__c=CQ.Last_Name__c;
                CQA.Street__c=CQ.Street__c;
                CQA.City__c=CQ.City__c;
                CQA.State__c=CQ.State__c;
                CQA.Postal_Code__c=CQ.Postal_Code__c;
                CQA.Country__c=CQ.Country__c;
                CQA.MRN__c=CQ.MRN__c;
                CQA.Date_of_Birth__c=CQ.Date_of_Birth__c;
                CQA.Gender_Code__c=CQ.Gender_Code__c;
                CQA.Phone__c=CQ.Phone__c;
                CQA.Mobile_Phone__c=CQ.Mobile_Phone__c;
                CQA.Email__c=CQ.Email__c;
                CQA.Test_Site_Type_1st__c=CQ.Test_Site_Type_1st__c;
                CQA.Test_Site_1st__c=CQ.Test_Site_Name__c; // translated
                CQA.Test_Site__c=CQ.Test_Site_1st__c; //original
                CQA.Applies_Date_Time__c=CQ.Applies_Date_Time__c;
                CQA.Delete_CQR__c = true;
                CernerQueueArchiveToInsert.add(CQA);
                //add cerner record(who has a ERM account againts it) in the list to get deleted
                CernerQueueToDelete.add(CQ);
            }
        }
        
        if(CernerQueueToUpdate !=null && CernerQueueToUpdate.size()>0){
            database.SaveResult[] updatedCQResults=database.update(CernerQueueToUpdate,false);
            // Error handling for Cerner Queue Update
            for(Database.SaveResult dr : updatedCQResults) {
                if (!dr.isSuccess()) { for(Database.Error err : dr.getErrors()) {
                    String errMsg = 'CERNER QUEUE UPDATE ERROR!! Against Record Id: '+dr.getId()+'. ERROR MESSAGE: '+err.getMessage() +'. STATUS CODE: '+err.getStatusCode();
                    CQ_UpdateErrorMap.put(dr.getId(), errMsg);
                }
                                     }
            }
        }
        if(EHRObservationToInsert !=null && EHRObservationToInsert.size()>0){
            database.SaveResult[] insertedEHRObResults=database.insert(EHRObservationToInsert,false);
            //error handling for EHR Observations Insert
            for(Integer i=0; i < insertedEHRObResults.size(); i++) {
                if(!insertedEHRObResults[i].isSuccess()){ for(Database.Error err : insertedEHRObResults[i].getErrors()){
                    String errMsg = 'EHR OBSERVATION INSERTION ERROR!! Against Account Id: '+EHRObservationToInsertDup[i].Account__c+'. ERROR MESSAGE: '+err.getMessage() +'. STATUS CODE: '+err.getStatusCode();
                    String ParentAccountId = EHRObservationToInsertDup[i].Account__c;
                    EHRObservationErrorMap.put(ParentAccountId , errMsg); 
                }     
                                                        }
            } 
            if(test.isRunningTest())
                EHRObservationErrorMap.put('TEST', 'Testing Error Message');
            
            // remove corresponding Account, Cerner Queue and Cerner Queue Archive records from lists where EHR Observation records failed
            if(EHRObservationErrorMap.size()>0 && EHRObservationErrorMap != null && !EHRObservationErrorMap.isEmpty()){
                for(String acntId  : EHRObservationErrorMap.keySet()){
                    //remove Account records from list
                    for(Integer i = 0; i < accountsToUpdate.size(); i++) {
                        if(!test.isRunningTest() && accountsToUpdate[i].Id == acntId ) { accountsToUpdate.remove(i); }
                    }
                    //remove Cerner Queue Archive records from list
                    for(Integer j = 0; j < CernerQueueArchiveToInsert.size(); j++) {
                        if(!test.isRunningTest() && CernerQueueArchiveToInsert[j].Mapped_Account__c == acntId ){ CernerQueueArchiveToInsert.remove(j); }
                    }
                    //remove Cerner Queue records from list
                    for(Integer k = 0; k < CernerQueueToDelete.size(); k++) {
                        if(!test.isRunningTest() && CernerQueueToDelete[k].Account__c == acntId ){ CernerQueueToDelete.remove(k); }
                    }
                }
            }
            
            database.SaveResult[] insertedCQAResults=database.insert(CernerQueueArchiveToInsert,false);
            database.DeleteResult[] deletedCQResults=database.delete(CernerQueueToDelete,false);
            
            // Error handling for Cerner Queue Delete
            for(Database.DeleteResult dr : deletedCQResults) {
                if (!dr.isSuccess()) { for(Database.Error err : dr.getErrors()) {
                    String errMsg = 'CERNER QUEUE DELETION ERROR!! Against Record Id: '+dr.getId()+'. ERROR MESSAGE: '+err.getMessage() +'. STATUS CODE: '+err.getStatusCode();
                    CQ_DeleteErrorMap.put(dr.getId(), errMsg);
                }
                                     }
            }
        }    
        system.debug('accountsToUpdate::'+ accountsToUpdate);
        //update ERM/Cerner Accounts
        database.SaveResult[] updatedAccountResults=database.update(accountsToUpdate,false);
        // Error handling for Accounts Update
        for(Database.SaveResult dr : updatedAccountResults) {
            if (!dr.isSuccess()) { for(Database.Error err : dr.getErrors()) {
                String errMsg = 'ACCOUNT UPDATE ERROR!! Against Account Id: '+dr.getId()+'. ERROR MESSAGE: '+err.getMessage() +'. STATUS CODE: '+err.getStatusCode();
                AccountsFailedtoUpdateErrorMap.put(dr.getId(), errMsg);
            }
                                 }
        }
    }
    global void finish(Database.BatchableContext BC) {
        if(test.isRunningTest())
            EHRObservationErrorMap.put('TEST', 'Testing Error Message');
        
        if((EHRObservationErrorMap.size()>0 && EHRObservationErrorMap != null && !EHRObservationErrorMap.isEmpty()) || (CQ_DeleteErrorMap.size()>0 && CQ_DeleteErrorMap != null && !CQ_DeleteErrorMap.isEmpty()) || (CQ_UpdateErrorMap.size()>0 && CQ_UpdateErrorMap != null && !CQ_UpdateErrorMap.isEmpty())){
            
            AsyncApexJob a = [SELECT Id, Status, NumberOfErrors, JobItemsProcessed,
                              TotalJobItems, CreatedBy.Email FROM AsyncApexJob WHERE Id = :bc.getJobId()];
            
            String body = 'The child records creation against accounts and delete/update on CQ records job has completed. \n'
                + 'Error found for EHR Observation Records to be inserted are '
                +  EHRObservationErrorMap.size() + '. \n'
                + 'Error found for Cerner Queue Records to be updated are '
                +  CQ_UpdateErrorMap.size()+ '. \n'
                + 'Error found for Cerner Queue Records to be deleted are '
                +  CQ_DeleteErrorMap.size()+ '. \n'
                + 'Error found for ERM/Cerner Account Records to be updated are '
                +  AccountsFailedtoUpdateErrorMap.size();
            
            //creating Account Id and Error msg csv file for EHR Observation Records failed to INSERT
            String finalstr = 'AccountId,Error \n';
            String attName = 'EHR_Observation_Record_Insert_Errors File.csv';
            for(String acntId  : EHRObservationErrorMap.keySet()){
                string err = EHRObservationErrorMap.get(acntId);
                string recordString = '"'+acntId+'","'+err+'"\n';
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
            
            //creating CQ Id and Error msg csv file for Cerner Queue Records failed to DELETE
            String finalstr3 = 'CernerQueueId,Error \n';
            String attName3 = 'CQ_Record_Delete_Errors File.csv';
            for(String CQId  : CQ_DeleteErrorMap.keySet()){
                string err3 = CQ_DeleteErrorMap.get(CQId);
                string recordString3 = '"'+CQId+'","'+err3+'"\n';
                finalstr3 = finalstr3 +recordString3;
            }  //  end  
            //creating attachment for email
            Messaging.EmailFileAttachment    efa3 = new Messaging.EmailFileAttachment();
            efa3.setFileName(attName3);
            efa3.setBody(Blob.valueOf(finalstr3));
            
            //creating Account Id and Error msg csv file for ERM/Cerner Records failed to UPDATE
            String finalstr4 = 'AccountId,Error \n';
            String attName4 = 'ERM_Cerner_Account_Record_Update_Errors File.csv';
            for(String acntId  : AccountsFailedtoUpdateErrorMap.keySet()){
                string err = AccountsFailedtoUpdateErrorMap.get(acntId);
                string recordString4 = '"'+acntId+'","'+err+'"\n';
                finalstr4 = finalstr4 +recordString4;
            }  // csv file end  
            //creating attachment for email
            Messaging.EmailFileAttachment    efa4 = new Messaging.EmailFileAttachment();
            efa4.setFileName(attName4);
            efa4.setBody(Blob.valueOf(finalstr4));
            
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage(); 
            // parameter setting for email
            email.setSubject('Cerner Created Accounts Childs Records Creation Batch Status: ' + a.Status);
            String toEmailAddress1 = System.Label.EC_Ac_Creation_Fail_Error_Recipient;
            String toEmailAddress2 = System.Label.EC_Ac_Creation_Fail_Error_Recipient2;
            String toEmailAddress3 = System.Label.EC_Ac_Creation_Fail_Error_Recipient3;
            String toEmailAddress4='sami.haroon@gettectonic.com';
            String[] toAddresses = new String[]{toEmailAddress1, toEmailAddress2, toEmailAddress3,toEmailAddress4};
                //  String[] toAddresses = new String[]{toEmailAddress4};     
                email.setToAddresses(toAddresses);
            email.setPlainTextBody( body );
            email.setUseSignature(false);
            email.setFileAttachments(new Messaging.EmailFileAttachment[] {efa, efa2, efa3, efa4}); // attach files in email
            if(!Test.isRunningTest()) Messaging.SendEmailResult [] r =  Messaging.sendEmail(new Messaging.SingleEmailMessage[] {email});  
        }
    }
}