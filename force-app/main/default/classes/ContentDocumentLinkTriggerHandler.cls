/**********************************
@author: Zeeshan
@date: 9/14/2021
@purpose: set visibility of Files to "AllUsers" submitted by internal users, in order to show files to portal users because by default
visibility is set to "InternalUsers" when files inserted by internal users
***********************************/

public class ContentDocumentLinkTriggerHandler {
    public void handleBeforeInsert(List<ContentDocumentLink> cdl_List){
        List<Case> caseList = new List<Case>();
        Id caRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('CA').getRecordTypeId();
        for(ContentDocumentLink cont : cdl_List)
        { 
            System.debug('---------CaseId :' + cont.LinkedEntityId);
            System.debug('---------CaseId :' + cont.id);
            if(cont.LinkedEntityId != null){
                List<Case> cse = [Select id, RecordTypeId, Status From Case
                                  Where id =:cont.LinkedEntityId Limit 1];
                
                
                System.debug('---------CA RecordTypeId :' + caRecordTypeId);
                
                if(cse.size() > 0){
                    System.debug('---------Get the Case :' + cse[0]);
                    System.debug('---------Case RecordTypeId :' + cse[0].RecordTypeId);
                    if(cse[0].RecordTypeId == caRecordTypeId){
                        System.debug('---------RecordType matched CA');
                        cont.Visibility = 'AllUsers'; 
                        /**if(cse[0].Status == 'UNDER REVIEW'){
                            cse[0].Status = 'In Progress';
                            caseList.add(cse[0]);
                        }     */                
                    }
                }
                
            }
        }
        /**System.debug('---------Case to be updated' + caseList.size());
        if(caseList.size() > 0){
            update caseList;
        } */
        
    }
}