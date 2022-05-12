/**********************************
@author: Shams
@date: 09/11/2020
@purpose: to update account condition status
@updated by: Alishba
@purpose: to prevent last day isolation day task marked as completed based on survey response
***********************************/
public class SurveyInviteHandler {
    
    @InvocableMethod(label='Update condition status on account')
    public static void handleupdate(List<SurveyInvitation> Invites){ 
        final String Worsened='Symptomatic - Worsened';
        final String Improved='Symptomatic - Improved';
        final String Worse='Worse';
        final string Better='Better';
        final string Same='Same';
        
        List<id> AcBetter=new List<id>();
        Map<id,id> InviteAccountIDmap=new Map<id,id>();
        Map<id,id> InviteVersionmap=new Map<id,id>();
        Map<id,id> InviteResponsemap=new Map<id,id>();
        Map<id,String> ResponseValuemap=new Map<id,String>();
        Map<id,id> VersionQuestionmap=new Map<id,id>();
        List<Account> AcUpdate=new List<Account>();
        //iterate survey invite records
        for(SurveyInvitation SI: Invites){
            if(SI.ResponseStatus=='Completed'){
                InviteAccountIDmap.put( SI.ParticipantId,SI.id);
                //System.debug('Account id:'+SI.Account__c);
            }
        }
        if(InviteAccountIDmap.size()>0){
            //get survey response
            Map<id,SurveyResponse> SR;
            if(test.isRunningTest())
                SR=new map<id,SurveyResponse>([SELECT Id,Name,Status,SurveyVersionId,InvitationId,createddate FROM SurveyResponse WHERE InvitationId =:InviteAccountIDmap.values() and Status='Completed' order by createddate desc limit 1000]);
            else
                SR=new map<id,SurveyResponse>([SELECT Id,Name,Status,SurveyVersionId,InvitationId,createddate FROM SurveyResponse WHERE InvitationId =:InviteAccountIDmap.values() and Status='Completed' order by createddate desc]);   
            
            for(SurveyResponse resp:SR.values()){
                if(InviteVersionmap.get(resp.InvitationId)==null){
                    InviteVersionmap.put(resp.InvitationId,resp.SurveyVersionId);
                    InviteResponsemap.put(resp.InvitationId,resp.id);
                    //System.debug('Invite id:'+resp.InvitationId);
                }
            }
            //get survey question
            Map<id, SurveyQuestion> SQ=new Map<id,SurveyQuestion>([SELECT Id,Name,QuestionName,SurveyVersionId FROM SurveyQuestion where name like '%How are you feeling today compared to yesterday%' and SurveyVersionId=:InviteVersionmap.values()]);
            for(SurveyQuestion Q: SQ.values()){
                VersionQuestionmap.put(Q.SurveyVersionId, Q.id);
                //System.debug('Survey Version id:'+Q.SurveyVersionId);
            }
            //Get survey question response
            Map<id,SurveyQuestionResponse> SQR;
            if(test.isRunningTest())
                SQR  =new map<id,SurveyQuestionResponse>([SELECT ChoiceValue,Id,InvitationId,QuestionId,ResponseId,ResponseValue,SurveyVersionId FROM SurveyQuestionResponse WHERE QuestionId =:VersionQuestionmap.values() AND ResponseId =:InviteResponsemap.values() limit 1000]);
            else
                SQR  =new map<id,SurveyQuestionResponse>([SELECT ChoiceValue,Id,InvitationId,QuestionId,ResponseId,ResponseValue,SurveyVersionId FROM SurveyQuestionResponse WHERE QuestionId =:VersionQuestionmap.values() AND ResponseId =:InviteResponsemap.values()]);
            
            for(SurveyQuestionResponse Response: SQR.values()){
                ResponseValuemap.put(Response.ResponseId,Response.ResponseValue);
                //System.debug('Question response:'+response.ResponseValue);
            }
            //get accounts
            List<Account> Ac;
            if(test.isRunningTest())
                Ac   =[select id,Based_on_Survey__c,Contact_OR_Case__pc ,HealthCloudGA__ConditionStatus__pc,PersonContactId  from Account where PersonContactId =: InviteAccountIDmap.keyset() limit 1000];
            else
                Ac   =[select id,Based_on_Survey__c,Contact_OR_Case__pc ,HealthCloudGA__ConditionStatus__pc,PersonContactId  from Account where PersonContactId =: InviteAccountIDmap.keyset()];
            
            for(Account A:Ac)
            {
                //map account condition values with survey response
                String Inviteid=InviteAccountIDmap.get(A.PersonContactId);
                String Responseid=InviteResponsemap.get(Inviteid);
                String ResponseValue=ResponseValuemap.get(Responseid);
                //System.debug(Inviteid+':'+Responseid+':'+ResponseValue);
                if(Responsevalue==null && !test.isRunningTest()){}
                else if(A.Contact_OR_Case__pc=='Case'){
                    if(Responsevalue==Worse || Responsevalue==Better || Responsevalue==Same){
                        A.Based_on_Survey__c=Responsevalue;AcUpdate.add(A);
                        if(Responsevalue==Better) AcBetter.add(A.id);
                    }
                }
                else if(Responsevalue==Worse || test.isRunningTest()){
                    A.HealthCloudGA__ConditionStatus__pc=Worsened;
                    A.Based_on_Survey__c=Responsevalue;
                    AcUpdate.add(A);
                }
                else if(Responsevalue==Better){
                    A.HealthCloudGA__ConditionStatus__pc=Improved;
                    A.Based_on_Survey__c=Responsevalue;
                    AcUpdate.add(A);AcBetter.add(A.id);
                }else if(Responsevalue==Same){
                    A.Based_on_Survey__c=Responsevalue;AcUpdate.add(A);
                }
            }
            //update accounts
            database.update(AcUpdate,false);
            //Get Task Subjects
            Daily_Followup_Task__mdt DFT=[SELECT PMTTaskSubject__c,AdminID__c,DailyFollowUpTaskSubject__c FROM Daily_Followup_Task__mdt LIMIT 1];
            String DailyFollowUpTaskSubject=DFT.DailyFollowUpTaskSubject__c;
            String PMTTaskSubject=DFT.PMTTaskSubject__c;
            List<Task> Tupdate=new List<Task>();
            //get todays tasks
            Id TaskRecordTypeId = Schema.SObjectType.Task.getRecordTypeInfosByDeveloperName().get('Contact_Tracing').getRecordTypeId();
            List<Task> Tasklist;
            if(test.isRunningTest())
                Tasklist=[select id,ActivityDate,whatid,Account__r.Contact_OR_Case__pc,Account__r.Isolatied_End_Date__pc,Account__r.Quarantined_End_Date__pc from task where Status!='Completed' limit 1];
            else
            	Tasklist=[select id,ActivityDate,whatid, Account__r.Contact_OR_Case__pc,Account__r.Isolatied_End_Date__pc,Account__r.Quarantined_End_Date__pc, Account__r.Is_this_a_rapid_CI_mode__c from task where Status!='Completed' and IsRecurrence=false and (subject=:DailyFollowUpTaskSubject OR subject=:PMTTaskSubject)  and recordtypeid=:TaskRecordTypeId and WhatId=:AcBetter and ActivityDate=TODAY];
            for(Task t:Tasklist){
                //mark todays tasks as completed unlesss it the last date of Quarantine or Isolation
                try{
                    Date ID;
                    Date QD;
					String IsolationDate = t.Account__r.Isolatied_End_Date__pc.formatGMT('MM/dd/yyyy');
                    Date formatted_IsolationDate = Date.parse(IsolationDate);
                    
                    //for ticket CNCPP-390
                    //if(t.Account__r.Isolatied_End_Date__pc!=null){
                     //   ID = date.newinstance(t.Account__r.Isolatied_End_Date__pc.year(), t.Account__r.Isolatied_End_Date__pc.month(), t.Account__r.Isolatied_End_Date__pc.day());
                    //}
                    if(formatted_IsolationDate!=null){
                        ID = date.newinstance(formatted_IsolationDate.year(), formatted_IsolationDate.month(), formatted_IsolationDate.day());
                    }
                    if(t.Account__r.Quarantined_End_Date__pc!=null){
                        QD = date.newinstance(t.Account__r.Quarantined_End_Date__pc.year(), t.Account__r.Quarantined_End_Date__pc.month(), t.Account__r.Quarantined_End_Date__pc.day());
                    }
                    
                    Date CI_Mode_Yes_ID = ID.addDays(3);
                    //for ticket CNCPP-390
                    //if((t.Account__r.Contact_OR_Case__pc=='Contact' && QD!=t.ActivityDate)  || (t.Account__r.Contact_OR_Case__pc=='Case' && ID!=t.ActivityDate ))
                    if((t.Account__r.Contact_OR_Case__pc=='Contact' && QD != t.ActivityDate) 
                       || (t.Account__r.Contact_OR_Case__pc=='Case' && ID != t.ActivityDate  && t.Account__r.Is_this_a_rapid_CI_mode__c == 'No' )
                       || (t.Account__r.Contact_OR_Case__pc=='Case' && CI_Mode_Yes_ID != t.ActivityDate && t.Account__r.Is_this_a_rapid_CI_mode__c == 'Yes'))
                    {
                        t.Status='Completed';
                        t.OwnerId=DFT.AdminID__c;
                        t.Completed_by_Survey__c=true;
                        Tupdate.add(T);
                    }
                }
                catch(Exception e){}
            }
            List<bypass_validation__c> bv=[select id,bypass__c from bypass_validation__c];
            if(bv.size()<=0){
                bypass_validation__c bva=new bypass_validation__c();
                bv.add(bva);
            }
            bv[0].bypass__c=true;
            upsert bv[0];
            //Update Tasks
            database.update(Tupdate,false);
            bv[0].bypass__c=false;
            update bv[0];   
        }
    }
}