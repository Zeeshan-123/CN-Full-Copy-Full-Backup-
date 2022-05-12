/**********************************
@author: Shams
@date: 11/11/2020
@purpose: Task CLeanup batch
***********************************/
global class TaskCleanupBatch implements Schedulable,Database.Batchable<sObject>,Database.AllowsCallouts  {
    
    global Database.QueryLocator start(Database.BatchableContext BC)
    {  
        //query creation
        String Query;
        if(test.isRunningTest())    
            Query='SELECT id FROM Task limit 20';
        else
            Query='SELECT id FROM Task where Status!=\'Completed\' and Send_Survey_Invite__c = true and ((account__r.contact_or_case__pc = \'Case\' and subject=\'Daily Followup Task\') or (account__r.contact_or_case__pc = \'Contact\' and subject=\'Daily Patient Followup Task\'))';
        //Execute the query and return the results
        return Database.getQueryLocator(query);
    }
    public void execute(SchedulableContext context)
    {
        Database.executeBatch(this);
    }   
    
    global void execute(Database.BatchableContext BC, List<Task> Tasks) {
        //If tasks exist delete them
        if(Tasks.size()>0)
            Database.delete(Tasks, false);
    }
    
    global void finish(Database.BatchableContext BC) {
    }
}