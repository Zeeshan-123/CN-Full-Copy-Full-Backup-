/**********************************
@author: Zeeshan
@date: 9/21/2021
@purpose: Test Class for ContentDocumentLinkTrigger
***********************************/
@istest
public class ContentDocumentLinkTriggerTest {
    
    @istest
    public static void runtest(){
        Id recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('CN_Registration').getRecordTypeId();
        Account TA1=  TestDataFactory.createTestPersonAccountRecords('TestAccount1',recordTypeId);
        Account TA2 = [Select PersonContactId From Account Where Id = :TA1.id];
        
        //Create Content Version
        createContentVersion(TA2);
        //Getting ContentDocumentId from ContentVersion
        Id contentDocId = [Select ContentDocumentId From ContentVersion Limit 1].ContentDocumentId;        
        //Creating CA case
        createCACase(TA2);
        
        Case insertedCase = [Select id from Case limit 1];
        
        ContentDocumentLink CDLink = new ContentDocumentLink();
        CDLink.ContentDocumentId = contentDocId;
        CDLink.LinkedEntityId = insertedCase.Id;
        
        insert CDLink;
        //update cVersion;
    }
    
    public static void createContentVersion(Account acnt){
        ContentVersion cVersion = new ContentVersion();
        cVersion.ContentLocation = 'S'; //S-Document is in Salesforce. E-Document is outside of Salesforce. L-Document is on a Social Netork.
        cVersion.PathOnClient = 'tectonic.jpg';//File name with extention
        cVersion.Origin = 'C';//C-Content Origin. H-Chatter Origin.
        //cVersion.OwnerId = attach.OwnerId;//Owner of the file
        cVersion.Title = 'Test Document';//Name of the file
        cVersion.VersionData = Blob.valueOf('This is Test Document'); //File content
        cVersion.FirstPublishLocationId = acnt.id;
        
        insert cVersion;
    }
    
    public static void createCACase(Account acnt){
        Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('CA').getRecordTypeId();
        
        Case cse = new Case();
        cse.RecordTypeId = caseRecordTypeId;
        cse.Status = 'New';
        cse.Origin = 'Portal';
        cse.Priority = 'Medium';
        cse.Request_Reason__c = 'CA';
        cse.AccountId = acnt.Id;
        cse.ContactId = acnt.PersonContactId;
        
        insert cse;
    }
}