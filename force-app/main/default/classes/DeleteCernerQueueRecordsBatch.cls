/*================================================================
@author: Alishba
@date: Jan/18/2022
@purpose: delete cerner queue record where duplicate flag is true
==================================================================*/
global class DeleteCernerQueueRecordsBatch implements Schedulable,Database.Batchable<sObject>{
    
    global Database.QueryLocator start(Database.BatchableContext BC){ 
        if(test.isRunningTest()) 
            return Database.getQueryLocator([SELECT Id, Name, Delete_CQR__c  FROM Cerner_Queue__c  limit 200]);             
        else
            return Database.getQueryLocator([SELECT Id, Name, Delete_CQR__c  FROM Cerner_Queue__c WHERE Duplicate__c = true]);
    }
    public void execute(SchedulableContext context){
        Database.executeBatch(this);
    }   
    global void execute(Database.BatchableContext BC, List<Cerner_Queue__C> CQList){            
        database.DeleteResult[] deletedCQResults=database.delete(CQList,false);       
    }
    
    global void finish(Database.BatchableContext BC){}
}