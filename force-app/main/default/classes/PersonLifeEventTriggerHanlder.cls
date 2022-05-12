/**********************************
@author: Shams
@date: 2/10/2020
@purpose: Update Accounts on create, update, and Delete
***********************************/

public class PersonLifeEventTriggerHanlder {
    final string isolated='Isolated';
    final string quarantined='Quarantined';
    Datetime now = Datetime.now();
    Integer offset = UserInfo.getTimezone().getOffset(now);
    //Update name on life event insert and update parent contact
    public void handleinsert(List<PersonLifeEvent> PLEs){
        Set<id> Cid=new Set<id>();
        for(PersonLifeEvent PLE:PLEs){
            if(PLE.EventType!=isolated && PLE.EventType!=quarantined)
                Cid.add(PLE.PrimaryPersonId);
            PLE.Name=PLE.EventType;
            if(PLE.ExpirationDate!=null){
                DateTime dt = PLE.ExpirationDate;//.addSeconds(offset/1000);
                Integer day = dt.Day();
                Integer month = dt.Month();
                PLE.Name+=' - E:'+Month+'/'+Day;
            }
        }
        if(Cid.size()>0)
            updateContactonInsert(Cid);
    }
    //Update name on life event update and update parent contact
    public void handleUpdate(List<PersonLifeEvent> PLEs,Map<id,PersonLifeEvent> oldPLEs){
        Datetime now = Datetime.now();
        Integer offset = UserInfo.getTimezone().getOffset(now);
        Set<id> Cid=new Set<id>();
        for(PersonLifeEvent PLE:PLEs){
            if(PLE.EventType!=isolated && PLE.EventType!=quarantined)
                Cid.add(PLE.PrimaryPersonId);
            PersonLifeEvent oldPLE=oldPLEs.get(PLE.id);
            PLE.Name=PLE.EventType;
            if(PLE.ExpirationDate!=null){
                DateTime dt = PLE.ExpirationDate;//.addSeconds(offset/1000);
                Integer day = dt.Day();
                Integer month = dt.Month();
                PLE.Name+=' - E:'+Month+'/'+Day;
            }
        }
        if(Cid.size()>0)
            updateContactonUpdate(Cid);
    }
    //Update parent contact on delete
    public void handledelete(List<PersonLifeEvent> PLEs){
        Set<id> Cid=new Set<id>();
        for(PersonLifeEvent PLE:PLEs){
                Cid.add(PLE.PrimaryPersonId);
        }
        if(Cid.size()>0)
            updateContactonDel(Cid);
    }
    
    @future
    public static void updateContactonDel(Set<id> Cid){
        ID recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
        List<Account> Cop=new List<Account>();
        List<Account> Co=[select id,RecordTypeId,Skip_Quarantine__c,Deceased_Date_Contact__pc,Recovered_Date_Contact__pc,Case_Status__c from Account where PersonContactId=:Cid];
        for(Account A:Co)
        {
            if(A.RecordTypeId==RecordTypeId && !A.Skip_Quarantine__c){
                if(A.Deceased_Date_Contact__pc==null && A.Recovered_Date_Contact__pc==null){
                    A.Case_Status__c='Active';
                    Cop.add(A);
                }
            }
        }
        Database.update(Cop,false);
    }
    @future
    public static void updateContactonInsert(Set<id> Cid){
        ID recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
        List<Account> Cop=new List<Account>();
        List<Account> Cop2=new List<Account>();
        List<Account> Co=[select id,RecordTypeId,Deceased_Date_Contact__pc,Recovered_Date_Contact__pc,Case_Status__c from Account where PersonContactId=:Cid];
        for(Account A:Co)
        {
            if(A.RecordTypeId==RecordTypeId){
                if(a.Deceased_Date_Contact__pc!=null || a.Recovered_Date_Contact__pc!=null){
                    A.Case_Status__c='Inactive';
                    A.Person_Life_Event_Last_Modified_Date__c=system.now();
                    A.Latest_Last_Modified_Date__c=system.now();
                    Cop.add(A);
                }else
                {
                    A.Person_Life_Event_Last_Modified_Date__c=system.now();
                    A.Latest_Last_Modified_Date__c=system.now();
                    Cop2.add(A);
                }
            }
        }
        Id TaskRecordTypeId = Schema.SObjectType.Task.getRecordTypeInfosByDeveloperName().get('Contact_Tracing').getRecordTypeId();
        List<Task> Tasks = [select id from task where whatid=:Cop and Status!='Completed' and subject='Daily Followup Task' and recordtypeid=:TaskRecordTypeId];
        if(Tasks.size()>0)
            Database.delete(Tasks,false);
        Database.update(Cop,false);
        Database.update(Cop2,false);
    } 
    @future
    public static void updateContactonUpdate(Set<id> Cid){
        ID recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
        List<Account> Cop=new List<Account>();
        List<Account> Cop2=new List<Account>();
        List<Account> Co=[select id,RecordTypeId,Deceased_Date_Contact__pc,Recovered_Date_Contact__pc,Case_Status__c from Account where PersonContactId=:Cid];
        for(Account A:Co)
        {
            if(A.Deceased_Date_Contact__pc!=null || A.Recovered_Date_Contact__pc!=null){
                Cop2.add(A);
            }
        }
        Id TaskRecordTypeId = Schema.SObjectType.Task.getRecordTypeInfosByDeveloperName().get('Contact_Tracing').getRecordTypeId();
        List<Task> Tasks = [select id from task where whatid=:Cop2 and Status!='Completed' and subject='Daily Followup Task' and recordtypeid=:TaskRecordTypeId];
        if(Tasks.size()>0)
            Database.delete(Tasks,false);
        for(Account A:Co)
        {
            if(A.RecordTypeId==RecordTypeId){
                if(A.Deceased_Date_Contact__pc==null && A.Recovered_Date_Contact__pc==null){
                    A.Case_Status__c='Active';
                    A.Person_Life_Event_Last_Modified_Date__c=system.now();
                    A.Latest_Last_Modified_Date__c=system.now();
                    Cop.add(A);
                }
                else if(A.Deceased_Date_Contact__pc!=null || A.Recovered_Date_Contact__pc!=null){
                    A.Case_Status__c='Inactive';
                    A.Person_Life_Event_Last_Modified_Date__c=system.now();
                    A.Latest_Last_Modified_Date__c=system.now();
                    Cop.add(A);
                }
                else{
                    A.Person_Life_Event_Last_Modified_Date__c=system.now();
                    A.Latest_Last_Modified_Date__c=system.now();
                    Cop.add(A);
                }
            }
        }
        Database.update(Cop,false);
    }
}