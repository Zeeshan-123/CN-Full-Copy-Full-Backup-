/**********************************
@author: Shams
@date: 2/3/2021
@purpose: Deactivate account if Isolation end date has Passed and no active task
***********************************/
global class IsolationExpiryDateEndedBatch implements Schedulable,Database.Batchable<sObject>  {
    
    Map<id,id> AIDmap;

    global Database.QueryLocator start(Database.BatchableContext BC)
    {  
        //query creation
        String Query;
        if(test.isRunningTest())    
        	Query='SELECT Contact_or_Case_new__c,Id,Case_Status__c,Isolatied_End_Date__pc FROM Account WHERE Contact_or_Case_new__c = \'Case\' AND Case_Status__c=\'Active\' AND Isolatied_End_Date__pc < today  and recordtype.developername=\'ERM_Patient\' limit 20';
        else
          Query='SELECT Contact_or_Case_new__c,Id,Case_Status__c,Isolatied_End_Date__pc FROM Account WHERE Contact_or_Case_new__c = \'Case\' AND Case_Status__c=\'Active\' AND Isolatied_End_Date__pc < today  and recordtype.developername=\'ERM_Patient\' ';
        //Execute the query and return the results
        return Database.getQueryLocator(query); 
    }
    public void execute(SchedulableContext context){Database.executeBatch(this);}   
    
    global void execute(Database.BatchableContext BC, List<Account> Accounts) {

        Map<id,boolean> Taskexists=new Map<id,boolean>();
        //Id TaskRecordTypeId = Schema.SObjectType.Task.getRecordTypeInfosByDeveloperName().get('Contact_Tracing').getRecordTypeId();
        //find all Incomplete tasks
        //CNHPHOMS-65: SL Jonathan Munguia: ActivityDate < TODAY added to the query.
    	List<Task> Tasks = [select id,Account__c from task where whatid=:Accounts and Status!='Completed' AND ActivityDate < TODAY];
        if(Tasks.size()>0){
            for(Task t:Tasks){
                if(Taskexists.get(t.Account__c)==null)
                    Taskexists.put(t.Account__c,true);
            }
        }

        Map<Id,Date> mapIsolationEndDates  = new Map<Id,Date>();
        List<Account> AcUpdate=new List<Account>();
        //Mark Accounts as Inactive
        for(Account a:Accounts)
        {
          if(Taskexists.get(a.id)==null){
            a.Case_Status__c='Inactive';
            //CNHPHOMS-65: SL Jonathan Munguia: restore default values (owner is )
            mapIsolationEndDates.put(a.Id, Date.valueOf(a.Isolatied_End_Date__pc));
            a.Opt_out_from_the_survey_invites__c  = true;
            a.Send_Survey_via_SMS__c  = true;
            a.When_do_you_think_you_were_exposed__c = null;
            a.Where_do_you_think_you_were_exposed__c  = null;
            a.Date_of_when_symptoms_onset__c  = null;
            a.Date_Contacted__c = null;
            //a.OwnerId = userId;
            AcUpdate.add(a);
          }
        }

        if(!AcUpdate.isEmpty()){
          //There's a condition that avoids updating an account to Inactive if it has pending task so delete the task first.
          if(!mapIsolationEndDates.isEmpty()){
            //fetch all task in the future to delete CNHPHOMS-65: SL Jonathan Munguia
            List<Task> lstTaskToDelete = new List<Task>();
            for(Task tk : [SELECT Id, ActivityDate, WhatId FROM Task WHERE WhatId IN (SELECT Id FROM Account 
                            WHERE Id IN :mapIsolationEndDates.keySet() ) AND Status !='Completed']){

              if(mapIsolationEndDates.containsKey(tk.WhatId) && tk.ActivityDate > mapIsolationEndDates.get(tk.WhatId)){
                lstTaskToDelete.add(tk);
              }
            }   

            IF(!lstTaskToDelete.isEmpty()) DELETE lstTaskToDelete;
          }

          //update custom setting to bypass the validation CNHPHOMS-65: SL Jonathan Munguia
          List<bypass_validation__c> bv=[select id,bypass__c from bypass_validation__c];
          if(bv.size()<=0){
              bypass_validation__c bva=new bypass_validation__c();
              bv.add(bva);
          }
          bv[0].bypass__c = TRUE;
          UPSERT bv[0];

          Database.update(AcUpdate,false);

          bv[0].bypass__c = FALSE;
          UPDATE bv[0];

          
        }

    }

    global void finish(Database.BatchableContext BC) {
    }
}