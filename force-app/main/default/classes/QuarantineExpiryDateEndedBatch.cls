/**********************************
@author: Shams
@date: 1/10/2020
@purpose: Deactivate account if Qurantine end date has Passed
***********************************/
global class QuarantineExpiryDateEndedBatch implements Schedulable,Database.Batchable<sObject>  {
    
    Map<id,id> AIDmap;
    global Database.QueryLocator start(Database.BatchableContext BC)
    {  
        //query creation
        String Query;
        if(test.isRunningTest())    
        	Query='SELECT Contact_or_Case_new__c,Id,Case_Status__c,Quarantine_End_Date_Contact__pc FROM Account WHERE Contact_or_Case_new__c = \'Contact\' AND Case_Status__c=\'Active\' AND Quarantined_End_Date__pc < today  and recordtype.developername=\'ERM_Patient\' limit 20';
        else
           	Query='SELECT Contact_or_Case_new__c,Id,Case_Status__c,Quarantine_End_Date_Contact__pc FROM Account WHERE Contact_or_Case_new__c = \'Contact\' AND Case_Status__c=\'Active\' AND Quarantined_End_Date__pc < today and recordtype.developername=\'ERM_Patient\'';
        //Execute the query and return the results
        return Database.getQueryLocator(query); 
    }
    public void execute(SchedulableContext context){Database.executeBatch(this);}   
    
    global void execute(Database.BatchableContext BC, List<Account> Accounts) {
        Id TaskRecordTypeId = Schema.SObjectType.Task.getRecordTypeInfosByDeveloperName().get('Contact_Tracing').getRecordTypeId();
        //delete all Incomplete tasks
    	List<Task> Tasks = [select id from task where whatid=:Accounts and Status!='Completed' and subject='Daily Followup Task' and recordtypeid=:TaskRecordTypeId];
        if(Tasks.size()>0)
        	Database.delete(Tasks,false);
        List<Account> AcUpdate=new List<Account>();
        //Mark Accounts as Inactive
        for(Account a:Accounts)
        {
            a.Case_Status__c='Inactive';
            AcUpdate.add(a);
        }
        Database.update(AcUpdate,false);
    }
    global void finish(Database.BatchableContext BC) {
    }
}