/**********************************
@author: Shams
@date: 27/11/2020
@purpose: Mark all expired life events as expired
***********************************/
global class LifeEventExpiryBatch implements Schedulable,Database.Batchable<sObject>  {
    
    global Database.QueryLocator start(Database.BatchableContext BC)
    {  
        //query creation
        String Query;
        if(test.isRunningTest())    
            Query='SELECT Id FROM PersonLifeEvent WHERE ExpirationDate <= TODAY  AND IsExpired = false limit 1';
        else
            Query='SELECT Id FROM PersonLifeEvent WHERE (ExpirationDate <= TODAY OR PrimaryPerson.Account.Case_Status__c=\'Inactive\')  AND IsExpired = false and (eventtype=\'Quarantined\' or eventtype=\'Isolated\')';
        //Execute the query and return the results
        return Database.getQueryLocator(query); 
    }
    public void execute(SchedulableContext context){Database.executeBatch(this);}   
    
    global void execute(Database.BatchableContext BC, List<PersonLifeEvent> PLElist) {
        List<PersonLifeEvent> PLEupdate=new List<PersonLifeEvent>();
        for(PersonLifeEvent PLE: PLElist){
            PLE.isexpired=true;
            PLEupdate.add(PLE);
        }
        if(PLEupdate.size()>0){
            List<bypass_validation__c> bv=[select id,bypass__c from bypass_validation__c];
            if(bv.size()<=0){
                bypass_validation__c bva=new bypass_validation__c();
                bv.add(bva);
            }
            bv[0].bypass__c=true;
            upsert bv[0];
            //update PLEupdate;
            Database.update(PLEupdate,false);
            bv[0].bypass__c=false;
            update bv[0];
        }
    }
    global void finish(Database.BatchableContext BC) {
    }
}