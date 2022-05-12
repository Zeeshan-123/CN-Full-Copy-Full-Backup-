/**********************************
@author: Shams
@date: 1/10/2020
@purpose: Update Latest Status if monitored status has expired
***********************************/
global class MonitoredStatusUpdateBatch implements Schedulable,Database.Batchable<sObject>  {
    
    Map<id,id> AIDmap;
    global Database.QueryLocator start(Database.BatchableContext BC)
    {  
        //query creation
        String Query;
        if(test.isRunningTest())    
        	Query='SELECT Case_Status__c,Date_of_when_symptoms_onset__c,Id,Latest_Status_Picklist__pc FROM Account WHERE Latest_Status_Picklist__pc = \'Monitored\' limit 20';
        else
           	Query='SELECT Case_Status__c,Date_of_when_symptoms_onset__c,Id,Latest_Status_Picklist__pc FROM Account WHERE Latest_Status_Picklist__pc = \'Monitored\' AND Date_of_when_symptoms_onset__c < LAST_N_DAYS:10';
        //Execute the query and return the results
        return Database.getQueryLocator(query);
    }
    public void execute(SchedulableContext context){Database.executeBatch(this);}   
    
    global void execute(Database.BatchableContext BC, List<Account> Accounts) {
    	Database.update(Accounts,false);
    }
    global void finish(Database.BatchableContext BC) {
    }
}