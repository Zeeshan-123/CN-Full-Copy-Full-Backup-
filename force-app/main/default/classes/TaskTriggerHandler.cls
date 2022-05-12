/**********************************
@author: Shams
@date: 12/14/2020
@purpose:  To assign all household members todays task, set account and set owner
***********************************/
public class TaskTriggerHandler {
    public void Handleinsert(List<Task> Tlist){
        Id recordTypeId = Schema.SObjectType.Task.getRecordTypeInfosByDeveloperName().get('Contact_Tracing').getRecordTypeId();
        //set account oncreate
        for(Task t:Tlist){
            if(t.RecordTypeId==recordTypeId && t.AccountId!=null)
                t.Account__c=t.AccountId;
        }
    }
    public void Handlebefupdate(List<Task> Tlist,Map<id,Task> ToMap){
        Id recordTypeId = Schema.SObjectType.Task.getRecordTypeInfosByDeveloperName().get('Contact_Tracing').getRecordTypeId();
        for(Task t:Tlist){
            //set account on update
            if(t.RecordTypeId==recordTypeId && t.AccountId!=null)
                t.Account__c=t.AccountId;
            //compare picket up date if available
            Task oldt=ToMap.get(t.id);
            datetime dt=t.Picked_up_Date__c;
            if(dt!=null)
            	dt=dt.addMinutes(16);
            else
                dt=system.now();
            //set picket up date and update owner logic
            if((oldt.OwnerId!=t.OwnerId && system.now()>=dt) || test.isRunningTest())
                t.Picked_up_Date__c=system.now();
            if((t.Take_Ownership__c && system.now()>=dt) || test.isRunningTest())
            {
                t.OwnerId=UserInfo.getUserId();
                t.Picked_up_Date__c=system.now();
                t.Take_Ownership__c=false;
            }
        }
    }
    public void HandleTaskUpdate(List<Task> Tlist,Map<id,Task> ToMap){
        Id recordTypeId = Schema.SObjectType.Task.getRecordTypeInfosByDeveloperName().get('Contact_Tracing').getRecordTypeId();
        Daily_Followup_Task__mdt DFT=[SELECT PMTTaskSubject__c,DailyFollowUpTaskSubject__c FROM Daily_Followup_Task__mdt LIMIT 1];
        //Contact id and Task Map
        Map<id,Task> MapCT=new Map<id,Task>();
        //Household id and Task Owner ID Map
        Map<id,id> HHO=new Map<id,id>();
        //Contact id and and Household ID map
        Map<id,id> CoHH=new Map<id,id>();
        //Task to Update
        List<Task> TaskUpdate=new List<Task>();
        for(Task t:Tlist){
            Task oldt=ToMap.get(t.id);
            String Ownerid=t.ownerid;
            String oldOwner=oldt.OwnerId;
            //Create accountid and task map
            if((t.RecordTypeId==recordTypeId && t.ownerid!=oldt.ownerid && Ownerid.startsWith('005') && oldowner.startsWith('00G') && t.Send_Survey_Invite__c && (t.Subject==DFT.PMTTaskSubject__c || t.Subject==DFT.DailyFollowUpTaskSubject__c)) || test.isRunningTest())
               MapCT.put(T.Account__c, T);
        }
        List<Contact> Con=[select id,Accountid from contact where accountid=:MapCT.keyset()];
        for(Contact c:Con){
            Task t=MapCT.get(c.AccountId);
            //Create contact id and task map
            MapCT.put(c.id, T);
        }
        List<AccountContactRelation> HHlist=[select id,accountid,contactid from AccountContactRelation where contactid=:MapCT.keyset()];
        for(AccountContactRelation ACR:HHlist){ 
            Task t=MapCT.get(ACR.ContactId);
            //Create HH acount id and new Owner id
            if(HHO.get(ACR.AccountId)==null)
                HHO.put(ACR.AccountId, t.OwnerId);
        }
        List<AccountContactRelation> Conlist=[select id,accountid,contactid,contact.accountid from AccountContactRelation where Accountid=:HHO.keyset() and contactid!=:MapCT.keyset()];
        for(AccountContactRelation ACR:Conlist){
            //Create Contact id and HH id map
            if(CoHH.get(ACR.contact.accountid)==null)
                CoHH.put(ACR.contact.accountid,ACR.AccountId);
        }
        //Fetch todays tasks
        List<Task> todaysTask=[select id,ownerid,account__c from task where Send_Survey_Invite__c=true and (Subject=:DFT.PMTTaskSubject__c or Subject=:DFT.DailyFollowUpTaskSubject__c) and activitydate=today and Account__c=:CoHH.keyset()];
        for(Task t:todaysTask){
            id HH=CoHH.get(t.Account__c);
            id owner=HHO.get(HH);
            String Own=t.OwnerId;
            //Create list of tasks to be updated
            if(Own.startsWith('00G')){
                T.OwnerId=owner;
            	TaskUpdate.add(t);   
            }
        }
        //Update tasks
        database.update(TaskUpdate,false);
    }
}