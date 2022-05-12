public without sharing class Community_CAEditController {
    
        @AuraEnabled 
    public static Case getStudents()
    {
        //get user id
        String UserId=UserInfo.getUserId();
        
        //get contact id against user id
        String contactId=utility.getUserContactId(UserId); 
        
         //get CA Request record type id
        Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('CA').getRecordTypeId();
        
        //query case Clothing Application
        return  [SELECT Id, CaseNumber, Status, (SELECT Id, First_Name__c, Last_Name__c, Citizen_ID__c, Date_of_Birth__c, Grade__c, Sector__c, Withdraw__c, Duplicate__c 
                                                 FROM CA_Household_Members__r WHERE Duplicate__c=true and Withdraw__c=false limit 200) 
                 , (SELECT id, ContentDocumentId, ContentDocument.title, ContentDocument.FileType FROM ContentDocumentLinks limit 200) 
                 FROM Case WHERE ContactId =:contactId and Request_Reason__c = 'CA' and RecordTypeId =: caseRecordTypeId limit 1];
    }
    
    
   @AuraEnabled  
    public static List<ContentDocumentLink> getFiles(String recordId)
    { 
        System.debug('----------Record Id------' + recordId);
        return [SELECT Id, LinkedEntityId, ContentDocumentId, ContentDocument.title,  ContentDocument.FileType
                FROM  ContentDocumentLink WHERE LinkedEntityId =: recordId ];   
        //return [SELECT Id, Title, FileType FROM ContentDocument WHERE Id IN :documentIds];
             
    } 
    
    @AuraEnabled  
    public static void deleteFile(String contentDocumentId)
    { 
        delete [SELECT Id from ContentDocument WHERE Id =: contentDocumentId];       
    }  
    
    @AuraEnabled
    public static String checkDuplicates(List<CA_Household_Member__c> HMlist, String withdrawnCitizens)
    {
        if(withdrawnCitizens != '')
        {
        withdrawnCitizens = withdrawnCitizens.Substring(0,withdrawnCitizens.length()-1);
        List<String> withdrawnCitArr = withdrawnCitizens.split(',');
        List<CA_Household_Member__c> std = [Select Id, Withdraw__c, Citizen_ID__c,Duplicate__c FROM CA_Household_Member__c 
                                                        WHERE Duplicate__c=false and Citizen_ID__c IN:(withdrawnCitArr)];
        
        if(std.size() > 0)
            return 'Already Withdraw';
            
        return '';
        }
        else {
            return '';
        }
    }
    
    @AuraEnabled
    public static String saveCA(List<CA_Household_Member__c> HMlist, List<String> DocIDs, String CaseID)
    {
        try
        {
            List<ContentDocumentLink> cdl = new List<ContentDocumentLink>();
            List<CA_Household_Member__c> studentsWithdraw = new List<CA_Household_Member__c>();
            List<String> citizenIDs = new List<String>();
            List<String> withdrawCitizenIDs = new List<String>();
            List<String> stdIdsArr = new List<String>();
            List<String> caseIds = new List<String>();
            String message = '';
            boolean isWithdraw = false;
            integer counter = 0;
            
            if(HMlist.size() > 0){
                for(CA_Household_Member__c student: HMlist){
                    if(student.Withdraw__c){
                        isWithdraw = true;
                        counter++;
                        withdrawCitizenIDs.add(student.Citizen_ID__c);
                        stdIdsArr.add(student.Id);
                    }
                    citizenIDs.add(student.Citizen_ID__c);
                }
                
                if(counter > 0){
                    List<ContentDocumentLink> docs = [Select Id FROM ContentDocumentLink WHERE LinkedEntityId=:CaseID];
                    List<CA_Household_Member__c> std = [Select Id, Withdraw__c, Citizen_ID__c FROM CA_Household_Member__c 
                                                            WHERE Withdraw__c=false and Citizen_ID__c IN:(citizenIDs)];
                    for(CA_Household_Member__c student: HMlist){
                    if(!student.Withdraw__c && student.Duplicate__c && docs.size() < 1 && DocIDs.size() < 1){
                        
                        if(std.size() > 1){
                        return 'Please upload Guardianship Documentation or withdraw the other duplicate students on your application.';
                        }
                    }
                }
                }
                
            }
            
            
            if(!isWithdraw && DocIDs.size() < 1){
                message = 'Please upload a file or select a student to withdraw.';
                return message;
            }
            
            Case cse = [SELECT Id, CaseNumber, Status, Withdraw__c
                     FROM Case WHERE Id=:CaseID limit 1];
            
            if(DocIDs.size() > 0){
                for(String docID : DocIDs){
                    ContentDocumentLink CDLink=new ContentDocumentLink();
                    CDLink.ContentDocumentId=docID;
                    CDLink.LinkedEntityId=CaseID;
                    cdl.add(CDLink);
                }
                upsert cdl;
            }
            
            if(HMlist.size() > 0){
                for(CA_Household_Member__c student: HMlist){
                    if(student.Withdraw__c){
                        List<CA_Household_Member__c> std = [Select Id, Withdraw__c, Citizen_ID__c, Duplicate__c, Request__r.Id FROM CA_Household_Member__c 
                                                            WHERE Withdraw__c=false and Citizen_ID__c=:student.Citizen_ID__c and Id!=:student.Id];
                        if(std.size() == 1 ){
                            for(CA_Household_Member__c s:std){
                                s.Duplicate__c = false;
                            	caseIds.add(s.Request__r.Id);
                            }
                            update std;
                            List<CA_Household_Member__c> ss = [Select Id, Withdraw__c, Citizen_ID__c, Duplicate__c, Request__r.Id FROM CA_Household_Member__c 
                                                            WHERE Withdraw__c=true and Duplicate__c=true and Citizen_ID__c=:student.Citizen_ID__c];
                            for(CA_Household_Member__c s:ss){
                                s.Duplicate__c = false;
                            	caseIds.add(s.Request__r.Id);
                            }
                            update ss;
                        }
                        if(std.size() <= 1){
                           student.Duplicate__c = false;
                        }
                    }
                }
                update HMlist;
            }
            
            List<CA_Household_Member__c> recipStd = [Select Id FROM CA_Household_Member__c WHERE Request__r.Id IN:caseIds and Duplicate__c=true];
            if(recipStd.size() < 1){
                List<Case> recipRequests = [Select Id,Status FROM Case WHERE Id IN:caseIds and Status='UNDER REVIEW'];
            
                for(Case c:recipRequests){
                    c.Status = 'In Progress';
                }            
                update recipRequests;
            }
            
            
            studentsWithdraw = [Select Id,Withdraw__c FROM CA_Household_Member__c WHERE Request__c=:CaseID and Withdraw__c=false];
            if(studentsWithdraw.size() > 0)
            {
                cse.Status = 'In Progress';
            }
            
            cse.Resubmit__c = true;
            
            if(studentsWithdraw.size() < 1){
                
                    cse.Withdraw__c = true;
                	cse.Status = 'WITHDRAWN';
            }
                    update cse;
            
            return message;
        }
        catch (Exception ex)
        {
			System.debug('------------CA Custody Update---------------' + '\n' + ex.getMessage());
            return ex.getMessage();
        }
    }
}