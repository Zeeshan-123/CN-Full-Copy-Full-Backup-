/*============================================================================================
@author: Alishba
@date: Feb/03/2022
@purpose: this batch is only to be used for cleaning test account data created in last 3 hours
==============================================================================================*/
global class forTestingDeleteAcntCreatedTodayBatch implements Schedulable,Database.Batchable<sObject>{
    
    global Id ERM_RECORDTYPEID = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
    global Id CA_RECORDTYPEID = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('Cerner_Account').getRecordTypeId();
    global Database.QueryLocator start(Database.BatchableContext BC){ 
        if(test.isRunningTest()) {
            return Database.getQueryLocator([SELECT Id, Name  FROM Account  limit 200]);             
        }
        else{
            return Database.getQueryLocator([SELECT Id, Name  FROM Account WHERE (RecordTypeId =: ERM_RECORDTYPEID AND lastModifiedDate = TODAY AND HOUR_IN_DAY(LastModifiedDate) > 3) OR (RecordTypeId =: CA_RECORDTYPEID AND lastModifiedDate = TODAY AND HOUR_IN_DAY(LastModifiedDate) > 3)]);
          // return Database.getQueryLocator([SELECT Id, Name  FROM Account WHERE (RecordTypeId =: ERM_RECORDTYPEID AND CreatedDate  = LAST_N_DAYS:4) OR (RecordTypeId =: CA_RECORDTYPEID AND lastmodifieddate  = LAST_N_DAYS:4)]);
         //   return Database.getQueryLocator([SELECT Id, Name  FROM Account WHERE RecordTypeId =: ERM_RECORDTYPEID AND lastmodifieddate  = TODAY]);
        }
    }
     public void execute(SchedulableContext context){
        Database.executeBatch(this);
    }   
    global void execute(Database.BatchableContext BC, List<Account> AccountList){    
        database.DeleteResult[] deletedCQResults=database.delete(AccountList,false);        
    }
    
    global void finish(Database.BatchableContext BC){}
}