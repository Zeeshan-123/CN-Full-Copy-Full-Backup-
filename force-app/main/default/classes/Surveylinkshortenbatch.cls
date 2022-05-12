/**********************************
@author: Shams
@date: 14/10/2020
@purpose: Send Daily Survey Invites link shorten
***********************************/
global class Surveylinkshortenbatch implements Schedulable,Database.Batchable<sObject>,Database.AllowsCallouts  {
    
    Map<id,id> AIDmap;
    global Database.QueryLocator start(Database.BatchableContext BC)
    {  
        //query creation
        String Query;
        if(test.isRunningTest())    
            Query='select id,whatid,Account__c from task where Status!=\'Completed\' and Send_Survey_Invite__c=true and ActivityDate=TODAY limit 20';
        else
            Query='select id,whatid,Account__c from task where Status!=\'Completed\' and Send_Survey_Invite__c=true and ActivityDate=TODAY';
        //Execute the query and return the results
        return Database.getQueryLocator(query);
    }
    public void execute(SchedulableContext context)
    {
        Database.executeBatch(this,50);
    }   
    
    global void execute(Database.BatchableContext BC, List<Task> Tasks) {
        AIDmap=new Map<id,id>();
        for(Task T:Tasks)
        {
            //Create task-account map
            if(AIDmap.get(T.Account__c)==null)
                AIDmap.put(T.id, T.Account__c);
        }
        List<Account> Aup=new List<Account>();
        Map<id,Account> Amap=new Map<id,Account>([select id,survey_link__c,Send_Survey_via_SMS__c,PersonContactId,PersonEmail from account where PersonMobilePhone != null and id=:AIDmap.values()]);
        List<Daily_Followup_Task__mdt> DFT=[select Access_Token__c from Daily_Followup_Task__mdt];
        for(Task T:Tasks){
            Account AC=Amap.get(T.Account__c);
            //IF task has a parent account
            if((AC!=null && !AC.Send_Survey_via_SMS__c && AC.Survey_Link__c!=null)){
                if(AC.survey_link__c.startswith(Label.Survey_Link_Shorten)){
                    String url=AC.survey_link__c;
                    HttpRequest req = new HttpRequest();
                    req.setEndpoint(
                        'callout:Bitly/v3/shorten' +
                        '?access_token='+DFT[0].Access_Token__c.trim()+
                        '&longUrl=' + EncodingUtil.urlEncode( url, 'UTF-8' ) +
                        '&format=txt'
                    );
                    req.setMethod('GET');
                    Http http = new Http();
                    if(!test.isRunningTest())
                    {
                        HttpResponse res = http.send(req);
                        AC.Survey_Link__c=res.getBody();
                    }Aup.add(AC);
                }
            }   
        }
        Update Aup;
    }
    
    global void finish(Database.BatchableContext BC) {
    }
}