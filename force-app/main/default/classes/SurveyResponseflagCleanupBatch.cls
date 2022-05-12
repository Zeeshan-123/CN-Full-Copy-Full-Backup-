/**********************************
@author: Shams
@date: 11/25/2020
@purpose: Survey Response flag cleanup batch
***********************************/
global class SurveyResponseflagCleanupBatch implements Schedulable,Database.Batchable<sObject>  {
    
    Map<id,id> AIDmap;
    global Database.QueryLocator start(Database.BatchableContext BC)
    {  
        //query creation
        String Query;
        if(test.isRunningTest())    
        	Query='SELECT id FROM Account limit 1';
        else
           	Query='SELECT id FROM Account WHERE Based_on_Survey__c != null';
        //Execute the query and return the results
        return Database.getQueryLocator(query); 
    }
    public void execute(SchedulableContext context){Database.executeBatch(this);}   
    
    global void execute(Database.BatchableContext BC, List<Account> Accounts) {
        List<Account> AcUpdate=new List<Account>();
        for(Account a:Accounts)
        {
            a.Based_on_Survey__c='';
            AcUpdate.add(a);
        }
        Database.update(AcUpdate,false);
    }
    global void finish(Database.BatchableContext BC) {
    }
}