/*================================================================
@author: Alishba
@date: Feb/24/2022
@purpose: this batch is only for testing purposes to delete cerner queue and cerner queue archive records
==================================================================*/
global class forTesting_DeleteAllCQandCQARecordsBatch implements Schedulable,Database.Batchable<sObject>{
    
    global Database.QueryLocator start(Database.BatchableContext BC){ 
        if(test.isRunningTest()) 
            return Database.getQueryLocator([SELECT Id, Name, Delete_CQR__c  FROM Cerner_Queue__c  limit 200]);             
        else
            return Database.getQueryLocator([SELECT Id, Name, Delete_CQR__c  FROM Cerner_Queue__c]);
    }
    public void execute(SchedulableContext context){
        Database.executeBatch(this);
    }   
    global void execute(Database.BatchableContext BC, List<Cerner_Queue__C> CQList){            
        database.DeleteResult[] deletedCQResults=database.delete(CQList,false);       
        List<Cerner_Queue_Archive__c>CQAList=[SELECT Id, Name, Delete_CQR__c  FROM Cerner_Queue_Archive__c];
        database.DeleteResult[] deletedCQAResults=database.delete(CQAList,false);       
    }
    
    global void finish(Database.BatchableContext BC){}
}