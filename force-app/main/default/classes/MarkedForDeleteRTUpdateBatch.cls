/**********************************
@author: Shams
@date: 1/4/2021
@purpose: Change record type on Account records which were marked for deletion
***********************************/
global class MarkedForDeleteRTUpdateBatch implements Schedulable,Database.Batchable<sObject>  {

    global Database.QueryLocator start(Database.BatchableContext BC)
    {  
        String QueryFields='';
        SObjectType accountType = Schema.getGlobalDescribe().get('Account');
        Map<String,Schema.SObjectField> mfields = accountType.getDescribe().fields.getMap();
        boolean isId=true;
        //get all fields to query
        for(Schema.SObjectField field:mfields.values()){
            QueryFields=QueryFields+field+',';
        }
        QueryFields=QueryFields.left(QueryFields.length()-1);
        //query creation
        String Query;
        if(test.isRunningTest())    
        	Query='SELECT id,recordtypeid,OwnerId,Contact_Tracer__c FROM Account WHERE marked_for_delete__c=\'Yes\' and recordtype.developername=\'ERM_Patient\' limit 20';
        else
           	Query='SELECT id,recordtypeid,OwnerId,Contact_Tracer__c FROM Account WHERE marked_for_delete__c=\'Yes\' and recordtype.developername=\'ERM_Patient\' ';
        //Execute the query and return the results
        return Database.getQueryLocator(query); 
    }
    public void execute(SchedulableContext context){Database.executeBatch(this);}   
    
    global void execute(Database.BatchableContext BC, List<Account> Accounts) {
        Daily_Followup_Task__mdt DFT=[SELECT AdminID__c FROM Daily_Followup_Task__mdt LIMIT 1];
        //delete all Incomplete tasks
        Id TaskRecordTypeId = Schema.SObjectType.Task.getRecordTypeInfosByDeveloperName().get('Contact_Tracing').getRecordTypeId();
    	List<Task> Tasks = [select id from task where whatid=:Accounts and Status!='Completed' and recordtypeid=:TaskRecordTypeId];//and subject='Daily Followup Task' 
        if(Tasks.size()>0)
        	Database.delete(Tasks,false);
        //update RT and change Owner
        List<Account> Aupdate=new list<Account>();
        Id recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('Marked_for_Deletion').getRecordTypeId();
        for(Account a:Accounts){
            a.RecordTypeId=recordTypeId;
            a.Contact_Tracer__c=a.OwnerId;
            a.OwnerId=DFT.AdminID__c;
            Aupdate.add(a);
        }
        //update
        database.update(Aupdate,false);
    }
    global void finish(Database.BatchableContext BC) {
    }
}