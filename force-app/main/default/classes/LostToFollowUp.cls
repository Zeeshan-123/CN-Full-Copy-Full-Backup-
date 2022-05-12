/**********************************
@author: Shams
@date: 2/16/2020
@purpose: Accounts lost to be followed up on
***********************************/
public class LostToFollowUp {
    //Called from lodt to followup flow
	@InvocableMethod
    public static void LostToFollowupUpdate(list<id> Accounts){
        if(Accounts.size()>0)
        {
            List<Task> TasktoDel=new List<Task>();
            List<Task> TasktoUpdate=new List<Task>();
            id Aid=Accounts[0];
            //get account
            Account A=[select id,Lost_to_Follow_up__c,Lost_to_follow_up_date__c,Case_Status__c from account where id=:Aid];
            //get open rasks
            Id TaskRecordTypeId = Schema.SObjectType.Task.getRecordTypeInfosByDeveloperName().get('Contact_Tracing').getRecordTypeId();
        	List<Task> Tasklist=[select id,whatid,ActivityDate,Status from task where Status!='Completed' and recordtypeid=:TaskRecordTypeId and WhatId=:Aid];
            //iterate over all accounts
            for(Task t:Tasklist){
                //mark todays task as completed
                if(t.ActivityDate==system.today()){
                    t.Status='Completed';
                    t.Unreachable__c=true;
                    TaskToUpdate.add(t);
                }
                //Delete remaining open tasks
                else
                    TasktoDel.add(t);
            }
            update TasktoUpdate;
            delete TasktoDel;
            
            A.Lost_to_Follow_up__c=true;
            A.Lost_to_follow_up_date__c=system.now();
            A.Case_Status__c='Inactive';
            
            update A;
            
        }
    }
}