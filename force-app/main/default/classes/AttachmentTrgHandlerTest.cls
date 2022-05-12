/*--------------------------------------------------------------------------------------------------------------
@Author: Zeeshan Haider
@Date:Aug/05/2021
@Purpose: This class is used as a test class for AttachmentTrgHandler class.
---------------------------------------------------------------------------------------------------------------*/

@isTest
private class AttachmentTrgHandlerTest {
   @isTest
   static void newAttachment(){
       //get Hunt Request record type id
       Id caseHuntRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Hunt_Request').getRecordTypeId();

        Case caseT1 = new Case();
        caseT1.RecordTypeId 						=		caseHuntRecordTypeId;
        caseT1.Status								=		'New';
        caseT1.Origin								=		'Portal';
        caseT1.Priority							    =		'Medium';
        insert caseT1;

        String caseId = [Select Id From Case Where RecordTypeId = :caseHuntRecordTypeId Limit 1].Id;

        Attachment oAttachment = new Attachment();
        oAttachment.parentId = caseId;
        
        oAttachment.Body = EncodingUtil.base64Decode('Unit Test Attachment Body');
        oAttachment.Name = 'TestAttachment';
        oAttachment.ContentType = 'application/pdf';
        
        insert oAttachment;        
   }

}