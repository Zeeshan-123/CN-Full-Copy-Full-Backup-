/*================================================================
@author: Alishba
@date: Sept/13/2021
@purpose: update count of attachments/files on a custom field on case for CA applications
==================================================================*/
global class UpdateAttachmentCountOnCasesBatch implements Database.Batchable<sObject>
{
   
    //get CA Request record type id
    Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('CA').getRecordTypeId();
    
    
    global Database.QueryLocator start(Database.BatchableContext BC)
    { 
        if(test.isRunningTest()) 
        {
            return Database.getQueryLocator([SELECT Id, CaseNumber FROM Case ]);             
        }
        else
        {
            return Database.getQueryLocator([SELECT Id, CaseNumber, (SELECT Id FROM ContentDocumentLinks ) FROM Case 
                                             WHERE RecordTypeId =: caseRecordTypeId AND IsClosed = false AND
                                             Id IN (SELECT Request__c FROM CA_Household_Member__c WHERE Duplicate_Static__c  =: true)]);
        }
        
    }
    
    global void execute(Database.BatchableContext BC, List<Case> CA_Appliactions)
    {
        List<Case> LstToUpdateCases = new List<Case>();
        List<ContentDocumentLink> lstContentDocumentLink = new List<ContentDocumentLink> ();

        for (Case cse: CA_Appliactions) 
        {
            lstContentDocumentLink  = cse.ContentDocumentLinks;
            cse.Attachment_count__c = lstContentDocumentLink.size(); 
            LstToUpdateCases.add(cse);
        }
        
        if(LstToUpdateCases != null && LstToUpdateCases.size() > 0) 
        { 
            List<Database.SaveResult> lstToCheckComm = Database.update(LstToUpdateCases, false);       
        }
        
    }
    
    global void finish(Database.BatchableContext BC)
    {
        
    }
}