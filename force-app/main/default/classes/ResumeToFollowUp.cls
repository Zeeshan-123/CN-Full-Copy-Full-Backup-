/**********************************
@author: Shams
@date: 2/24/2020
@purpose: Accounts resumed to be followed up on
***********************************/
public class ResumeToFollowUp {
    //Called from Resume to followup flow
    @InvocableMethod
    public static void ResumeToFollowupUpdate(list<id> Accounts){
        if(Accounts.size()>0)
        {
            id Aid=Accounts[0];
            PersonLifeEvent PLE;
            //get account
            Account A=[select id,PersonContactId,Contact_OR_Case__pc,Lost_to_Follow_up__c,Lost_to_follow_up_date__c,Case_Status__c from account where id=:Aid];
            //Get life event based on Contact or Case
            Map<id,PersonLifeEvent> CasePLEmap=new map<id,PersonLifeEvent>();
            Map<id,PersonLifeEvent> ContactPLEmap=new map<id,PersonLifeEvent>();
            id ContactID=A.PersonContactId;
            //create bypass custom setting record to bypass PersonLifeEvent VRs
            List<bypass_validation__c> bv=[select id,bypass__c from bypass_validation__c];
            if(bv.size()<=0){
                bypass_validation__c bva=new bypass_validation__c();
                bv.add(bva);
            }
            bv[0].bypass__c=true;
            upsert bv[0];
            
            //if account is a case
            if(A.Contact_OR_Case__pc=='Case'){
                List<personlifeevent> CasePLElist=[select id,eventtype,EventDate,Name,ExpirationDate,OwnerId,PrimaryPersonId,IsExpired from personlifeevent where primarypersonid =:ContactID and eventtype='Isolated' order by createddate desc];
                //Create map of life events
                for(personlifeevent plea:CasePLElist){
                    if(CasePLEmap.get(plea.PrimaryPersonId)==null)
                        CasePLEmap.put(plea.PrimaryPersonId,plea);
                }
                if(CasePLEmap.get(A.PersonContactId)!=null){
                    PLE=CasePLEmap.get(A.PersonContactId);
                    PLE.IsExpired=false; 
                    update PLE;
                }
            }
            //if account is a contact
            else{
                List<personlifeevent> ContactPLElist=[select id,eventtype,EventDate,Name,ExpirationDate,OwnerId,PrimaryPersonId,IsExpired from personlifeevent where primarypersonid =:ContactID and eventtype='Quarantined'  order by createddate desc];
                for(personlifeevent plea:ContactPLElist){
                    if(ContactPLEmap.get(plea.PrimaryPersonId)==null)
                        ContactPLEmap.put(plea.PrimaryPersonId,plea);
                }
                if(ContactPLEmap.get(A.PersonContactId)!=null){
                    PLE=ContactPLEmap.get(A.PersonContactId);
                    PLE.IsExpired=false;
                    update PLE;
                }
            }
            
            bv[0].bypass__c=false;
        	update bv[0];
            //update account and mark it as active
            A.Lost_to_Follow_up__c=false;
            A.Lost_to_follow_up_date__c=null;
            A.Case_Status__c='Active';
            update A;
            
        }
    }
}