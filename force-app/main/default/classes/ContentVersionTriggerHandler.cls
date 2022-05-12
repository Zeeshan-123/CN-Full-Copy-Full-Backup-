/**********************************
@author: Shams
@date: 7/10/2020
@purpose: update Accounts on SNOTE create and update
***********************************/

public class ContentVersionTriggerHandler {
    public void handleinsertUpdate(List<ContentVersion> Notes){
        List<id> CD=new List<id>();
        ID recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
        //Check if the Content Version is a SNOTE
        for(ContentVersion N:Notes){
            if(N.FileType!=null){
                if(N.FileType=='SNOTE'){
                    CD.add(N.ContentDocumentId);
                }}
        }
        if(CD.size()>0){
            //Get Content Dcoument Link records
            list<ContentDocumentLink> cdL=[SELECT ContentDocumentId,Id,LinkedEntityId FROM ContentDocumentLink WHERE ContentDocumentId=:CD];
            Map<id,id> AccountID=new Map<id,id>();
            for(ContentDocumentLink link:cdL){
                String ID=link.LinkedEntityId;
                //Proceed only if its linked to an account
                if(ID.startswith('001')){
                    if(!AccountID.containsKey(link.LinkedEntityId)){
                        AccountID.put(link.LinkedEntityId,link.LinkedEntityId);
                    }
                }
            }
            //Fetch all linked accounts
            List<Account> AcUp=new List<Account>();
            List<Account> Ac=[select id,RecordTypeId,Note_Last_Modified_Date__c from Account where id=:AccountID.keyset()];
            for(Account A:Ac){
                if(A.RecordTypeId==recordTypeId){
                    A.Note_Last_Modified_Date__c=system.now();
                    A.Latest_Last_Modified_Date__c=system.now();
                    AcUp.add(A);
                }
            }
            //Update Accounts
            Database.update(AcUp,false);
        }
    }
    public void handleAfterInsert(List<ContentVersion> cdlList){
      /*  try{
        String tempParentId;
        Set<Id> setParentId = new Set<Id>();
        List<Case> CAreq = new List<Case>();
        List<Case> CAreqUpdate = new List<Case>();
        
        for (ContentVersion cdl : cdlList ) {
            tempParentId = cdl.FirstPublishLocationId;

            if (tempParentId.left(3) =='500') {
                setParentId.add(cdl.FirstPublishLocationId);
            }
        }
        CAreq = [select Id , Attachment_count__c from Case where Id IN :setParentId and recordtype.developername='CA'];
        
        For(Case c : CAreq)
        {
            if(c.Attachment_count__c==null)
            {c.Attachment_count__c=1;}
            else
            {c.Attachment_count__c=c.Attachment_count__c+1;}
            CAreqUpdate.add(c);
        }
        database.update(CAreqUpdate,false);  
        }catch(Exception e){}
    }
    
    
    public void handleAfterUpdate(List<ContentVersion> cdlList){
        try{
        String tempParentId;
        Set<Id> setParentId = new Set<Id>();
        List<Case> CAreq = new List<Case>();
        List<Case> CAreqUpdate = new List<Case>();
        
        for (ContentVersion cdl : cdlList ) {
            tempParentId = cdl.FirstPublishLocationId;

            if (tempParentId.left(3) =='500') {
                setParentId.add(cdl.FirstPublishLocationId);
            }
        }
        CAreq = [select Id , Attachment_count__c from Case where Id IN :setParentId and recordtype.developername='CA'];
        
        For(Case c : CAreq)
        {
            if(c.Attachment_count__c==null)
            {c.Attachment_count__c=1;}
            else
            {c.Attachment_count__c=c.Attachment_count__c+1;}
            CAreqUpdate.add(c);
        }
        database.update(CAreqUpdate,false);  
        }catch(Exception e){}
    }*/
}
}