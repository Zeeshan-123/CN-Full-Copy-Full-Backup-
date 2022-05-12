/**********************************
@author: Shams
@date: 21/08/2020
@purpose: Send Daily Survey Invites
***********************************/
global class SendDailyAssessmentSurveybatch implements Schedulable,Database.Batchable<sObject>  {
    
    Map<id,id> AIDmap;
    global Database.QueryLocator start(Database.BatchableContext BC)
    {  
        //query creation
        String Query;
        if(test.isRunningTest())    
            Query='select id,whatid from task where Status!=\'Completed\' and Send_Survey_Invite__c=true and ActivityDate=TODAY limit 20';
        else
            Query='select id,whatid from task where Status!=\'Completed\' and Send_Survey_Invite__c=true and ActivityDate=TODAY';
        //Execute the query and return the results
        return Database.getQueryLocator(query);
    }
    public void execute(SchedulableContext context)
    {
        Database.executeBatch(this);
    }   
    
    global void execute(Database.BatchableContext BC, List<Task> Tasks) {
        User CIT=[select id from user where name='Cherokee IT'];
        //Get Survey Community ID 
        ID communityId = [select Id from Network where Name = 'Gadugi Portal'].Id;
        //Get Survey ID
        ID SurveyId = [Select Id from Survey where Name = 'Daily Assessment'].Id;
        ID CaseSurveyId = [Select Id from Survey where Name = 'Case Daily Assessment'].Id;
        List<SurveyInvitation> SInvList = New List<SurveyInvitation>();
        List<SurveySubject> SSList = new List<SurveySubject>();
        List<task> tinsert=new List<task>();
        AIDmap=new Map<id,id>();
        for(Task T:Tasks)
        {
            //Create task-account map
            if(AIDmap.get(T.whatid)==null)
                AIDmap.put(T.id, T.whatid);
        }
        Map<id,Account> Amap=new Map<id,Account>([select id,Priority__c,ownerid,Contact_OR_Case__pc,Send_Survey_via_SMS__c,Opt_out_from_the_survey_invites__c,PersonContactId,PersonEmail,name from account where id=:AIDmap.values()]);
        for(Task T:Tasks){
            Account AC=Amap.get(T.whatid);
            //IF task has a parent account
            if(AC!=null && (AC.Opt_out_from_the_survey_invites__c==false || AC.Send_Survey_via_SMS__c==false)){
                //System.debug(AC.name+':CommID='+communityId+':'+'SurveyID='+SurveyID);
                //Generate Survey Invite Record
                SurveyInvitation SInv = New SurveyInvitation();
                if(AC.Opt_out_from_the_survey_invites__c==false)
                    SInv.Email__c = AC.PersonEmail;
                Sinv.CommunityId = communityId;
                SInv.Account_Name__c=AC.Name;
                SInv.ParticipantId=AC.PersonContactId;
                SInv.InviteExpiryDateTime=System.today()+1;
                SInv.Name = 'Daily Assessment Survey invite - ' + String.valueOf(System.today()).removeEnd(' 00:00:00');
                SInv.OptionsCollectAnonymousResponse = false;
                SInv.OptionsAllowGuestUserResponse = true;
                if(AC.Contact_OR_Case__pc=='Case')
                    SInv.SurveyId = CaseSurveyId;
                else
                    SInv.SurveyId = SurveyId;
                SInv.Account__c=AC.id;                
                SInvList.add(SInv);
                
                
                Task newTask=new Task();
                //Get Contact Tracing Record type id for task dynamically
                Id recordTypeId = Schema.SObjectType.Task.getRecordTypeInfosByDeveloperName().get('Contact_Tracing').getRecordTypeId();
                newTask.RecordTypeId=recordTypeId;
                newTask.Subject='Daily Assessment Survey Invite Sent';
                newTask.OwnerId=CIT.id;
                newTask.Priority='Normal';
                newTask.Status='Completed';
                newTask.WhatId=AC.id;
                newTask.ActivityDate=system.today();
                tinsert.add(newTask);
            }
        }
        List<id> SurveyInvitationID=new List<id>();
        //Insert SUrvey Invitation record
        if(SInvList.size()>0){
            Database.SaveResult[] srList = Database.insert(SInvList,false);
        }
        if(tinsert.size()>0){
            Database.insert(tinsert,false);
            //insert tinsert;
        }
        //Generate Survey Subject Record which relate the invite to the Person Account record
        for(SurveyInvitation SInv:SInvList)
        {
            if(SInv.id!=null){
                //Create Survey Subject Record
                SurveySubject SS = new SurveySubject();
                SS.SubjectId = SInv.Account__c;
                SS.ParentId = SInv.Id;
                SS.Name = 'Daily Assessment';
                SSList.add(SS);
            }
        }
        //Insert SUrvey Subject
        if(SSList.size()>0){
            Database.insert(SSList,false);
        }
    }
    global void finish(Database.BatchableContext BC) {
        //database.executeBatch(new Surveylinkshortenbatch(),100);
    }
}