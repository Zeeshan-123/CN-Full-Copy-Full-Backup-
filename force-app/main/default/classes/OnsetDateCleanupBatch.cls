/**********************************
@author: Shams
@date: 12/17/2020
@purpose: Onset Date cleanup batch on inactive cases
***********************************/
global class OnsetDateCleanupBatch implements Schedulable,Database.Batchable<sObject>  {

    global Database.QueryLocator start(Database.BatchableContext BC)
    {  
        //query creation
        String Query;
        if(test.isRunningTest())    
        	Query='SELECT Id,Date_of_when_symptoms_onset__c FROM Account WHERE Contact_OR_Case__pc = \'Case\' AND Case_Status__c=\'Inactive\' AND Date_of_when_symptoms_onset__c!= null limit 20';
        else
           	Query='SELECT Id,Date_of_when_symptoms_onset__c FROM Account WHERE Contact_OR_Case__pc = \'Case\' AND Case_Status__c=\'Inactive\' AND Date_of_when_symptoms_onset__c!= null';
        //Execute the query and return the results
        return Database.getQueryLocator(query); 
    }
    public void execute(SchedulableContext context){Database.executeBatch(this);}   
    
    global void execute(Database.BatchableContext BC, List<Account> Accounts) {
        //Iterate over inactive accounts to remove onset date
        List<Account> AcUpdate=new List<Account>();
        for(Account a:Accounts)
        {
            a.Date_of_when_symptoms_onset__c=null;
            AcUpdate.add(a);
        }
        List<bypass_validation__c> bv=[select id,bypass__c from bypass_validation__c];
        if(bv.size()<=0){
            bypass_validation__c bva=new bypass_validation__c();
            bv.add(bva);
        }
        bv[0].bypass__c=true;
        upsert bv[0];
        Database.update(AcUpdate,false);
        bv[0].bypass__c=false;
        update bv[0];
    }
    global void finish(Database.BatchableContext BC) {
    }
}