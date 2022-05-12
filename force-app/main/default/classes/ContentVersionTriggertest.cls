/**********************************
@author: Shams
@date: 8/10/2020
@purpose: Test Class for ContentVersionTrigger
***********************************/
@istest
public class ContentVersionTriggertest {
     
    @istest
    public static void runtest(){
        Id recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
        Account TA1=TestDataFactory.createTestPersonAccountRecords('TestAccount1',recordTypeId);
        Account TA2 = [Select PersonContactId From Account Where Id = :TA1.id];
        ContentVersion objCntNote = new ContentVersion();
        objCntNote.Title = 'Test Content Note';
        objCntNote.PathOnClient = objCntNote.Title + '.snote';
        objCntNote.VersionData = Blob.valueOf('This is Test Content Note');
        objCntNote.FirstPublishLocationId = TA2.id;  // ParentId
        insert objCntNote;
        update objCntNote;
    }
}